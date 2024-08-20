import bcrypt from "bcryptjs"
import { v2 as cloudinary } from 'cloudinary';

import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";

export const getUserProfile = async (req, res) => {
    //get username
    const { username } = req.params;

    try {
        //get user
        const user = await User.findOne({ username }).select("-password");
        if (!user) {
            return res.status(404).json({ error: "User not found" })
        }
        res.status(200).json(user);
    } catch (error) {
        console.log("Error in getUserProfileL: ", error.message)
        res.status(500).json({ error: error.message });

    }
}

export const followUnfollowUser = async (req, res) => {
    const { id } = req.params;

    try {
        const userToModify = await User.findById(id);
        const currentUser = await User.findById(req.user._id);

        //check user
        if (!userToModify || !currentUser) {
            return res.status(400).json({ error: "User not found" });
        }

        //check fl yourself
        if (id == req.user._id.toString()) {
            return res.status(400).json({ error: "You can't follow yourself" });
        }

        //check is following
        const isFollowing = currentUser.following.includes(id)
        if (isFollowing) {
            //Unfollow
            await User.findByIdAndUpdate(id, { $pull: { followers: req.user._id } });
            await User.findByIdAndUpdate(req.user._id, { $pull: { following: id } });
            res.status(200).json({ message: "User unfollowed successfully" });
        } else {
            //follow
            await User.findByIdAndUpdate(id, { $push: { followers: req.user._id } }); //Add 1 follower
            await User.findByIdAndUpdate(req.user._id, { $push: { following: id } }); // Add 1 following

            //send notification to the user
            const newNotification = new Notification({
                type: "follow",
                from: req.user._id,
                to: userToModify._id
            })
            await newNotification.save()

            res.status(200).json({ message: "User followed successfully" });
        }

    } catch (error) {
        console.log("Error in followUnfollowUser: ", error.message)
        res.status(500).json({ error: error.message });
    }
}

export const getSuggestedUser = async (req, res) => {
    try {
        const userId = req.user._id;
        const usersFollowedByMe = await User.findById(userId).select("following");

        const users = await User.aggregate([
            { //Filter users with IDs different from userId
                $match: {
                    _id: { $ne: userId }
                }
            },
            //Select 10 userId
            { $sample: { size: 10 } }
        ])

        //Filter users with IDs different from usersFollowedByMe
        const filteredUsers = users.filter((user) => !usersFollowedByMe.following.includes(user._id))
        //Select 4 userId
        const suggestedUsers = filteredUsers.slice(0, 4)

        suggestedUsers.forEach((user) => (user.password = null))

        res.status(200).json(suggestedUsers)
    } catch (error) {
        console.log("Error in suggestedUsers: ", error.message)
        res.status(500).json({ error: error.message });
    }

}

export const updateUser = async (req, res) => {
    const { fullName, email, username, currentPassword, newPassword, bio, link } = req.body;
    let { profileImg, coverImg } = req.body;
    const userId = req.user._id;

    try {
        //check user exists
        let user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }

        //check password
        if ((!currentPassword && newPassword) || (currentPassword && !newPassword)) {
            return res.status(400).json({ error: "Please provide both current password and new password" })
        }

        //Update password
        if (currentPassword && newPassword) {
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) return res.status(400).json({ error: "Current password is incorrect" });
            if (newPassword.length < 6) {
                return res.status(400).json({ error: "Password must be at least 6 characters long" });
            }

            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(newPassword, salt);
        }

        // Update profileImg
        if (profileImg) {
            //delete old profileImg
            if (user.profileImg) {
                await cloudinary.uploader.destroy(user.profileImg.split("/").pop().split(".")[0]);
            }

            //upload profileImg
            const uploadedImg = await cloudinary.uploader.upload(profileImg);
            profileImg = uploadedImg.secure_url;
            user.profileImg = profileImg || user.profileImg;
        }

        //Update coverImg
        if (coverImg) {
            //delete old coverImg
            if (user.coverImg) {
                await cloudinary.uploader.destroy(user.coverImg.split("/").pop().split(".")[0]);
            }

            //upload coverImg
            const uploadedImg = await cloudinary.uploader.upload(coverImg);
            coverImg = uploadedImg.secure_url;
            user.coverImg = coverImg || user.coverImg;
        }

        //update remaining fields
        user.fullName = fullName || user.fullName;
        user.email = email || user.email;
        user.username = username || user.username;
        user.bio = bio || user.bio;
        user.link = link || user.link;

        user = await user.save();

        // password should be null in response
        user.password = null;
        return res.status(200).json(user);

    } catch (error) {
        console.log("Error in update user: ", error.message)
        res.status(500).json({ error: error.message });
    }
}