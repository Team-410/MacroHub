import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/VoteButton.css";

const VoteButton = ({ postId, userId }) => {
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {
        if (!userId) return;

        axios.get(`http://localhost:5000/api/macro/${postId}/votes`)
            .then(response => {
                setVotes(response.data.votes);
                setUserVote(response.data.userVote); // Whether user has voted
            })
            .catch(error => console.error("Error fetching votes:", error));
    }, [postId, userId]);

    const handleVote = (type) => {
        if (!userId) return alert("You need to log in to vote!");

        axios.post(`http://localhost:5000/api/macro/${postId}/vote`, { voteType: type, userId })
            .then(response => {
                setVotes(response.data.votes);
                setUserVote(type);
            })
            .catch(error => console.error("Error voting:", error));
    };

    return (
        <div className="vote-container">
            <button 
                className={`vote-button ${userVote === "upvote" ? "active" : ""}`} 
                onClick={() => handleVote("upvote")}
            >
                ▲
            </button>
            <div className="vote-count">{votes}</div>
            <button 
                className={`vote-button ${userVote === "downvote" ? "active" : ""}`} 
                onClick={() => handleVote("downvote")}
            >
                ▼
            </button>
        </div>
    );
};

export default VoteButton;
