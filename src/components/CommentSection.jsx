import React, { useEffect, useState } from "react";
import {
    fetchComments,
    addComment,
    deleteComment,
} from "../services/services";
import { toast } from "react-toastify";
import { MessageCircle, Send, Trash2, X } from "lucide-react";

const timeAgo = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);

    if (seconds < 60) return "Just now";
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
};

const CommentSection = ({ listingId }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Visibility State
    const [showComments, setShowComments] = useState(false);

    // Delete Modal State
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [commentToDelete, setCommentToDelete] = useState(null);

    const loadComments = async () => {
        try {
            setLoading(true);
            const data = await fetchComments(listingId);
            // Ensure data is array
            setComments(Array.isArray(data) ? data : data.data || []);
        } catch (err) {
            console.error("Failed to load comments", err);
        } finally {
            setLoading(false);
        }
    };

    // Only load comments when section is expanded and ID available
    useEffect(() => {
        if (listingId && showComments) {
            loadComments();
        }
    }, [listingId, showComments]);

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            setIsSubmitting(true);
            await addComment(listingId, { comment: newComment });
            setNewComment("");
            await loadComments();
            toast.success("Comment added");
        } catch (err) {
            console.error("Failed to add comment", err);
            toast.error(err.response?.data?.message || "Failed to add comment");
        } finally {
            setIsSubmitting(false);
        }
    };

    const confirmDelete = async () => {
        if (!commentToDelete) return;
        try {
            await deleteComment(listingId, commentToDelete);
            await loadComments();
            toast.success("Comment deleted");
            setShowDeleteModal(false);
            setCommentToDelete(null);
        } catch (err) {
            console.error("Failed to delete comment", err);
            toast.error("Failed to delete comment");
        }
    };

    const handleDeleteClick = (commentId) => {
        setCommentToDelete(commentId);
        setShowDeleteModal(true);
    };

    return (
        <div className="mt-4 pt-4 border-t border-gray-100">
            {/* Toggle Button */}
            {!showComments ? (
                <button
                    onClick={() => setShowComments(true)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-green-700 transition w-full justify-center py-2 hover:bg-gray-50 rounded-lg group"
                >
                    <MessageCircle size={18} className="text-gray-400 group-hover:text-green-600 transition" />
                    Show Comments
                </button>
            ) : (
                <div className="animate-fade-in-down">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="text-sm font-bold text-gray-800 flex items-center gap-2">
                            <MessageCircle size={16} className="text-green-600" />
                            Comments <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">{comments.length}</span>
                        </h4>
                        <button
                            onClick={() => setShowComments(false)}
                            className="text-xs font-medium text-gray-400 hover:text-gray-600 px-2 py-1 hover:bg-gray-100 rounded transition"
                        >
                            Hide
                        </button>
                    </div>

                    <div className="space-y-4 mb-4 max-h-[300px] overflow-y-auto pr-1 custom-scrollbar">
                        {loading ? (
                            <div className="flex justify-center py-4">
                                <div className="w-5 h-5 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-4">
                                <p className="text-sm text-gray-400 italic">No comments yet.</p>
                                <p className="text-xs text-gray-300 mt-1">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            comments.map((c) => (
                                <div key={c._id || c.id} className="flex gap-3 group">
                                    {/* Avatar Placeholder */}
                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center text-green-700 text-xs font-bold shrink-0 shadow-sm border border-white">
                                        {(c.user?.username || "U")[0].toUpperCase()}
                                    </div>

                                    <div className="flex-1 bg-gray-50 p-3 rounded-2xl rounded-tl-none hover:bg-gray-100 transition relative border border-transparent hover:border-gray-200">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-semibold text-gray-800 text-xs">{c.user?.username || "User"}</span>
                                            <span className="text-[10px] text-gray-400">{timeAgo(c.createdAt)}</span>
                                        </div>
                                        <p className="text-gray-700 text-sm leading-relaxed">{c.comment}</p>

                                        {/* Delete Trigger */}
                                        <button
                                            onClick={() => handleDeleteClick(c._id || c.id)}
                                            className="absolute -right-2 -top-2 bg-white text-red-500 p-1.5 rounded-full shadow-sm border border-gray-100 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110"
                                            title="Delete Comment"
                                        >
                                            <Trash2 size={12} />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Add Comment */}
                    <form onSubmit={handleAddComment} className="relative group">
                        <input
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Write a comment..."
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-full text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 focus:bg-white transition shadow-sm placeholder-gray-400"
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute right-1.5 top-1.5 p-1.5 bg-green-600 text-white rounded-full hover:bg-green-700 disabled:opacity-50 disabled:bg-gray-300 disabled:cursor-not-allowed transition shadow-sm transform active:scale-95"
                        >
                            <Send size={14} />
                        </button>
                    </form>
                </div>
            )}

            {/* Custom Delete Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-[2px] flex items-center justify-center z-50 animate-fade-in cursor-pointer" onClick={() => setShowDeleteModal(false)}>
                    <div
                        className="bg-white p-6 rounded-2xl shadow-2xl w-80 text-center transform transition-all scale-100 animate-scale-up cursor-default border border-gray-100"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="w-12 h-12 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4 ring-4 ring-red-50/50">
                            <Trash2 size={24} />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Comment?</h3>
                        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
                            Are you sure you want to delete this comment?
                            <br />
                            <span className="text-xs text-red-400 font-medium">This action cannot be undone.</span>
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition focus:ring-2 focus:ring-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-medium text-sm transition shadow-lg shadow-red-200 focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CommentSection;
