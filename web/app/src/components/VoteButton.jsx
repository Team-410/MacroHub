import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/VoteButton.css";
import Upvote from "@mui/icons-material/ArrowUpward"
import Downvote from "@mui/icons-material/ArrowDownward"

const VoteButton = ({ macroid, userId }) => {
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState(null);

    useEffect(() => {

        axios.get(`http://localhost:5000/api/macro/${macroid}/votes`)
            .then(response => {
                console.log(response);
                setVotes(response.data.total);
                setUserVote(response.data.userVote);
            })
            .catch(error => console.error("Error fetching votes:", error));
    }, [macroid, userVote]);

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
            setVotes(response.data.votes);
            setUserVote(type);
        })
        .catch(error => {
            console.error("Error voting:", error);
        });
    };
    
    

    return (
        <div className="vote-container">
            <button 
                className={`vote-button ${userVote === "upvote" ? "active" : ""}`} 
                onClick={() => handleVote("1")}
            >
                <Upvote></Upvote>
            </button>
            <div className="vote-count">{votes}</div>
            <button 
                className={`vote-button ${userVote === "downvote" ? "active" : ""}`} 
                onClick={() => handleVote("0")}
            >
                <Downvote className="downvote"></Downvote>
            </button>
        </div>
    );
};

export default VoteButton;
