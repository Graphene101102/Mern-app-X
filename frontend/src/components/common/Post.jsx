import { useState } from 'react'
import { Link } from "react-router-dom";

// import icons
import { FaTrash } from "react-icons/fa";
import { FaRegComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";

const Post = ({ post }) => {
    const [comment, setComment] = useState('');
    const postOwner = post.user;
    const isLiked = true;
    const isMyPost = true;
    const formattedDate = "1h";

    const handleDeletePost = () => { };
    const handleLikePost = () => { !isLiked };
    const handlePostComment = (e) => { e.preventDefault();};

    return (
        <>
            <div className='flex gap-2 items-start p-4 border-b border-gray-700'>
                <div className='avatar'>
                    <Link to={`/profile/${postOwner.username}`} className='w-8 rounded-full overflow-hidden'>
                        <img src={postOwner.profileImg || "/avatar-placeholder.png"} />
                    </Link>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-2 items-center'>
                        <Link to={`/profile/${postOwner.username}`} className='font-bold'>{postOwner.fullName}</Link>
                        <span className='text-gray-700 flex gap-1 text-sm'>
                            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
                            <span>·</span>
                            <span>{formattedDate}</span>
                        </span>
                        {isMyPost && (
                            <span className='flex flex-1 justify-end'>
                                <FaTrash className='cursor-pointer hover:text-red-500' onClick={handleDeletePost} />
                            </span>
                        )}
                    </div>
                    <div className='flex flex-col gap-3 overflow-hidden'>
                        <span>{post.text}</span>
                        {post.img && (
                            <img
                                src={post.img}
                                alt=''
                                className='h-80 object-contain rounded-lg border border-gray-700'
                            />
                        )}
                    </div>
                    <div className='flex justify-between mt-3 gap-4 items-center w-full'>
                        <div
                            className='flex gap-1 items-center cursor-pointer group'
                            onClick={() => document.getElementById('comments_modal' + post._id).showModal()}
                        >
                            <FaRegComment className='w-4 h-4 text-slate-500 group-hover:text-sky-400' />
                            <span className='text-sm text-slate-500 group-hover:text-sky-500'>
                                {post.comments.length}
                            </span>
                        </div>
                        {/* Using Modal Component from DaisyUI */}
                        <dialog
                            id={`comments_modal${post._id}`}
                            className="modal border-none outline-none"
                        >
                            <div className="modal-box rounded border border-gray-600">
                                <h3 className="text-lg font-bold mb-4">COMMENTS</h3>
                                <div className="flex flex-col gap-3 max-h-60 overflow-auto">
                                    {post.comments.length === 0 && (
                                        <p className="text-sm text-slate-500">
                                            No comments yet 🤔 Be the first one 😉
                                        </p>
                                    )}
                                    {post.comments.map((comment) => (
                                        <div key={comment._id} className="flex items-start gap-2">
                                            <div className="avatar w-8 rounded-full">
                                                <img src={comment.user.profileImg || "/avatar-placeholder.png"} />
                                            </div>
                                            <div className="flex flex-col ">
                                                <div className="flex items-center gap-1">
                                                    <span className="font-bold">{comment.user.fullName}</span>
                                                    <span className="text-sm text-gray-700">@{comment.user.username}</span>
                                                </div>
                                                <div className="text-sm">{comment.text}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <form
                                    className="flex gap-2 items-center mt-4 pt-2 border-t border-gray-600"
                                    onSubmit={handlePostComment}
                                >
                                    <textarea
                                        className="textarea w-full p-1 rounded text-md resize-none focus:outline-none border-gray-800"
                                        placeholder="Add a comment..."
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                    >

                                    </textarea>
                                    <button className="btn btn-sm btn-primary rounded-full text-white px-4">Post</button>
                                </form>
                            </div>
                            <form method="dialog" className="modal-backdrop">
                                <button className='outline-none'>close</button>
                            </form>
                        </dialog>

                        <div className='flex gap-1 items-center cursor-pointer group'>
                            <BiRepost className='w-6 h-6  text-slate-500 group-hover:text-green-500' />
                            <span className='text-sm text-slate-500 group-hover:text-green-500'>0</span>
                        </div>
                        <div className='flex gap-1 items-center cursor-pointer group' onClick={handleLikePost}>
                            {!isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-slate-500 group-hover:text-pink-500' />}
                            {isLiked && <FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500' />}
                            <span className={`text-sm ${isLiked ? 'text-pink-500' : 'text-slate-500'}`}>
                                {post.likes.length}
                            </span>
                        </div>
                        <div className='flex gap-1 items-center cursor-pointer'>
                            <FaRegBookmark className='w-4 h-4 text-slate-500' />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Post;