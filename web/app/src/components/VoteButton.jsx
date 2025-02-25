import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/VoteButton.css";
import Upvote from "@mui/icons-material/ArrowUpward";
import Downvote from "@mui/icons-material/ArrowDownward";
import RemoveCircleOutline from "@mui/icons-material/RemoveCircleOutline";

const VoteButton = ({ macroid, userId }) => {
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [message, setMessage] = useState("");

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        axios.get(`http://localhost:5000/api/macro/${macroid}/votes`, { headers })
            .then(response => {
                console.log('Fetched votes:', response.data);
                setVotes(response.data.total);
                setUserVote(response.data.userVote);
            })
            .catch(error => console.error("Error fetching votes:", error));
    }, [macroid]);

    const handleVote = (type) => {
        const token = localStorage.getItem('authToken');
    
        if (!token) {
            alert("You need to log in to vote!");
            return;
        }
    
        if (!macroid) {
            console.error("macroid is undefined!");
            return;
        }

        axios.post(
            `http://localhost:5000/api/macro/${macroid}/vote`,
            { voteType: type },
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        )
        .then(response => {
            console.log("Vote successful:", response.data);
            setVotes(prevVotes => {
                let newVotes = prevVotes;
                if (userVote === null) {
                    newVotes = type === 1 ? prevVotes + 1 : prevVotes - 1;
                } else if (userVote === 1 && type === 0) {
                    newVotes = prevVotes - 2;
                } else if (userVote === 0 && type === 1) {
                    newVotes = prevVotes + 2;
                } else if (type === null) {
                    newVotes = userVote === 1 ? prevVotes - 1 : prevVotes + 1;
                }
                console.log(`Votes changed from ${prevVotes} to ${newVotes}`);
                return newVotes;
            });
            setUserVote(type);
            setMessage("Vote recorded successfully");
        })
        .catch(error => {
            console.error("Error voting:", error);
            setMessage("Error processing vote");
        });
    };

    return (
        <div className="vote-container">
            <button 
                className={`vote-button ${userVote === 1 ? "active" : ""}`} 
                onClick={() => handleVote(1)}
            >
                <Upvote />
            </button>
            <div className="vote-count">{votes}</div>
            <button 
                className={`vote-button ${userVote === 0 ? "active" : ""}`} 
                onClick={() => handleVote(0)}
            >
                <Downvote className="downvote" />
            </button>
            <button 
                className={`vote-button ${userVote === null ? "active" : ""}`} 
                onClick={() => handleVote(null)}
            >
                <RemoveCircleOutline />
            </button>
            <div className="vote-status">
                {userVote === 1 && "You have upvoted"}
                {userVote === 0 && "You have downvoted"}
                {userVote === null && "You have not voted yet"}
            </div>
            {message && <div className="vote-message">{message}</div>}
        </div>
    );
};

export default VoteButton;
