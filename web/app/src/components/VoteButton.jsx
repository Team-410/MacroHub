import React, { useState, useEffect } from "react";
import axios from "axios";
import "../style/VoteButton.css";
import Upvote from "@mui/icons-material/ArrowUpward"
import Downvote from "@mui/icons-material/ArrowDownward"

import { Button } from "@mui/material";

const VoteButton = ({ macroid }) => {
    const [votes, setVotes] = useState(0);
    const [userVote, setUserVote] = useState(null);
    const [existingVote, setExistingVote] = useState(null);
    const [voteAnimation, setVoteAnimation] = useState(false);

    useEffect(() => {

        setTimeout(() => {
            setVoteAnimation(true);
        }, 300)

        axios.get(`http://localhost:5000/api/macro/${macroid}/votes`)
            .then(response => {

                // timeout for total votes animation
                setTimeout(() => {
                    setVotes(response.data.total);
                }, 300)
            })
            .catch(error => console.error("Error fetching votes:", error));

        const token = localStorage.getItem('authToken');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
    
        axios.get(`http://localhost:5000/api/macro/${macroid}/uservote`, { headers })
            .then(response => {
                setExistingVote(response.data.userVote)
            })
            .catch(error => console.error("Error fetching votes:", error));

    }, [macroid, userVote, existingVote]);
    

    const handleVote = (type) => {

        setVoteAnimation(false);
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
            setUserVote(type);
        })
        .catch(error => {
            console.error("Error voting:", error);
        });
    };

    const handleRemove = () => {

        setVoteAnimation(false);
        const token = localStorage.getItem('authToken');

        if (!token) {
            alert("You need to log in to vote!");
            return;
        }

        axios.delete(
            `http://localhost:5000/api/macro/${macroid}/uservote/remove`,
            {
                headers: {Authorization: `Bearer ${token}`}
            }
        )
        .then(response => {
            setExistingVote(null)
        })
        .catch(error => {
            console.error("Error deleting vote:", error);
        });
    }
    
    

    return (
        <div className="vote-container">
            <button 
                className={`vote-button ${existingVote === 1 ? "active" : ""}`} 
                onClick={() => handleVote("1")}
            >
                <Upvote></Upvote>
            </button>
            <div className={`vote-count ${voteAnimation ? "vote-animate" : ""}`}>{votes}</div>
            <button 
                className={`vote-button ${existingVote === 0 ? "active" : ""}`} 
                onClick={() => handleVote("0")}
            >
                <Downvote className="downvote"></Downvote>
            </button>
            {existingVote != null && <Button sx={{ fontSize: 9 }} onClick={handleRemove} >Remove Vote</Button>}
            
        </div>
    );
};

export default VoteButton;
