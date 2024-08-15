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
    
}