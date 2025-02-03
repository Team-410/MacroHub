import React, { useEffect, useState } from 'react';
import { Box, Typography, CircularProgress, Button, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const Comments = () => {
    const { id } = useParams();
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showComments, setShowComments] = useState(false);
    const [addComment, setAddComment] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const response = await axios.get(`/api/macros/${id}/comments`);
                setComments(response.data.results);
                console.log(response);
            } catch (err) {
                setError(err.response ? err.response.data.message : err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [id]);

    useEffect(() => {
        if (showComments) {
            setTimeout(() => {
                setAnimate(true);
            }, 200);
        } else {
            setAnimate(false);
        }
    }, [showComments]);

    // validating and sending comment to the backend
    const handleAddComment = async () => {
        if (!commentText.trim()) {
            return;
        }
    
        try {
            const token = localStorage.getItem('authToken');
    
            if (!token) {
                alert("No token found, please login.");
                return;
            }
    
            const response = await axios.post(
                `/api/macros/${id}/comments`,
                {
                    fullname: 'Your Name', // Replace this with the actual user's name (e.g., from state or user data)
                    comment: commentText
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
    
            console.log(response.data);

            // Fetch the updated comments list
            const updatedComments = await axios.get(`/api/macros/${id}/comments`);
            setComments(updatedComments.data.results);

            setAddComment(false);
            setCommentText(''); 
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
    

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ mt: 4, }}>
            <Box sx={{ display: 'flex' }}>
                <Button variant="text" sx={{ mt: 5, padding: 1 }} onClick={() => setShowComments((prev) => !prev)}>
                    {showComments ? 'Hide comments' : 'Show comments'}
                </Button>
                <Button variant="text" sx={{ mt: 5, padding: 1 }} onClick={() => setAddComment((prev) => !prev)}>
                    {addComment ? 'Cancel' : 'Add comment'}
                </Button>
            </Box>
            {addComment && (
                <TextField
                    placeholder="Add comment"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    fullWidth
                    sx={{ mt: 2 }}
                />
            )}

            {addComment && (
                <Button variant="contained" onClick={handleAddComment} sx={{ mt: 2, mb: 2 }}>
                    Submit
                </Button>
            )}

            {showComments && comments.length > 0 ? (
                comments.map((comment) => (
                    <Box
                        key={comment.commentid}
                        sx={{
                            mb: 1,
                            p: 1,
                            transform: animate ? 'translateY(0)' : 'translateY(50px)',
                            opacity: animate ? 1 : 0,
                            transition: 'transform 0.8s ease, opacity 0.8s ease',
                        }}
                    >
                        <Typography color="text.secondary" sx={{ fontSize: 12, fontWeight: 600 }}>
                            {comment.fullname}
                        </Typography>
                        <Typography variant="body1">{comment.comment}</Typography>
                    </Box>
                ))
            ) : (
                <Typography variant="p" color="text.secondary" sx={{ display: 'block' }}>
                    {showComments ? 'No comments yet, here is your chance to be the first' : ''}
                </Typography>
            )}
        </Box>
    );
};

export default Comments;
