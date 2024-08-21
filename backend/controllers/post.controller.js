import Notification from "../models/notification.model.js";
import Post from "../models/post.model.js";
import User from "../models/user.model.js";

import { v2 as cloudinary } from 'cloudinary';

export const createPost = async (req, res) => {
    try {
        const { text } = req.body;
        let { img } = req.body;
        const userId = req.user._id.toString();

        //check user
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: "User not found" })

        //check post
        if (!text && !img) return res.status(400).json({ message: "Post must have text or image!" });

        //upload img
        if (img) {
            const uploadedImg = await cloudinary.uploader.upload(img);
            img = uploadedImg.secure_url;
        }



        //create post
        const newPost = new Post({
            user: userId,
            text,
            img,
        })

        await newPost.save();
        res.status(200).json(newPost);


    } catch (error) {
        console.log("Error in createPost: ", error.message)
        res.status(500).json({ error: error.message });
    }
};

export const likeUnlikePost = async (req, res) => {
    try {
        const { id: postId } = await req.params;
        const userId = await req.user._id;

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found!" });

        //Check user has liked the post or not
        const userLikePost = post.likes.includes(userId);

        if (userLikePost) {
            //Unlike
            await Post.updateOne({ _id: postId }, { $pull: { likes: userId } });
            await User.updateOne({ _id: userId }, { $pull: { likedPosts: postId } });

            res.status(200).json({ message: "Post unlike successfully" });
        } else {
            //Like
            post.likes.push(userId);
            await post.save();

            await User.updateOne({ _id: userId }, { $push: { likedPosts: postId } });

            const notification = new Notification({
                from: userId,
                to: post.user,
                type: "like"
            })
            await notification.save();
            res.status(200).json({ message: "Post like successfully" });
        }
    } catch (error) {
        console.log("Error in like unlike post: ", error.message)
        res.status(500).json({ error: error.message });
    }
};

export const commentOnPost = async (req, res) => {
    try {
        const { text } = await req.body;
        const postId = await req.params.id;
        const userId = await req.user._id.toString();

        if (!text) return res.status(400).json({ error: "Text field is required!" });

        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ error: "Post not found!" });

        const comment = { user: userId, text };
        post.comments.push(comment);

        await post.save();
        res.status(200).json(post)
    } catch (error) {
        console.log("Error in comment: ", error.message)
        res.status(500).json({ error: error.message });
    }
};

export const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: "Post not found" })
        }

        if (post.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "You are not authorized to delete this post!" })
        }

        //delete img 
        if (post.img) {
            const imgId = post.img.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(imgId);
        }

        //Delete post
        await Post.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Post deleted successfully" })
    } catch (error) {
        console.log("Error in delete Post: ", error.message)
        res.status(500).json({ error: error.message });
    }
};

export const getAllPost = async (req, res) => {
    try {
        const posts = await Post.find().sort({ createAt: -1 }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        if (posts.length == 0) {
            return res.status(200).json([])
        }

        res.status(200).json(posts);

    } catch (error) {
        console.log("Error in get all Post: ", error.message)
        res.status(500).json({ error: error.message });
    }
}

export const getLikedPost = async (req, res) => {
    const userId = await req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const likedPosts = await Post.find({ _id: { $in: user.likedPosts } }).populate({
            path: "user",
            select: "-password"
        }).populate({
            path: "comments.user",
            select: "-password"
        })

        res.status(200).json({ likedPosts })

    } catch (error) {
        console.log("Error in get liked Post: ", error.message)
        res.status(500).json({ error: error.message });
    }
}

export const getFollowingPost = async (req, res) => {
    try {
        const userId = await req.user._id;
        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: "User not found" });

        const following = user.following;
        const feedPosts = await Post.find({ user: { $in: following } })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(feedPosts);

    } catch (error) {
        console.log("Error in get posts following: ", error.message)
        res.status(500).json({ error: error.message });
    }
}

export const getUserPost = async (req, res) => {
    try {
        const { username } = req.params;

        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: "User not found!" });

        const posts = await Post.find({ user: user._id })
            .sort({ createdAt: -1 })
            .populate({
                path: "user",
                select: "-password",
            })
            .populate({
                path: "comments.user",
                select: "-password",
            });

        res.status(200).json(posts)
    } catch (error) {
        console.log("Error in get user posts: ", error.message)
        res.status(500).json({ error: error.message });
    }
}