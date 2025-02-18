import { Box, Typography, CircularProgress, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimestamp } from '../utils/formatTimestamp';
import Backbutton from '../components/backbutton';
import VoteButton from "../components/VoteButton";
import SaveButton from "../components/SaveButton";

import Comments from "../components/comments";

function Macro() {
    const { id } = useParams();
    const [macro, setMacro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animation, setAnimation] = useState(false);
    const [showMacro, setShowMacro] = useState(false);
    const [currentUser, setCurrentUser] = useState(null); // Track logged-in user

    useEffect(() => {

        // Load logged-in user from localStorage
        const storedUserId = localStorage.getItem("userId");
        console.log("Stored userId:", storedUserId);
        if (storedUserId) {
            setCurrentUser({ userId: storedUserId });
        }
        
        axios.get(`/api/macros/${id}`)
            .then(response => {
                if (response.data.macro) {
                    setMacro(response.data.macro);
                } else {
                    setError("Macro not found.");
                }
            })
            .catch(() => {
                setError("Unable to fetch macro data.");
            })
            .finally(() => {
                setLoading(false);
                setTimeout(() => setAnimation(true), 20);
            });
    }, [id]);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    if (!macro) {
        return <Typography color="error">Macro data is missing.</Typography>;
    }

    return (
        <Box sx={{ padding: 1, maxWidth: 500, }}>
            <Backbutton></Backbutton>
            <Typography variant="h4" gutterBottom sx={{
                    opacity: animation ? 1 : 0,
                    transform: animation ? 'translateY(0)' : 'translateY(-50px)',
                    transition: 'all 0.8s ease-out',
                }}>
                {macro.macroname}
            </Typography>
            <Typography variant="body1" gutterBottom sx={{
                    opacity: animation ? 1 : 0,
                    transform: animation ? 'translateY(0)' : 'translateY(-50px)',
                    transition: 'all 0.8s ease-out',
                }}>
                {macro.app}
            </Typography>
            <Typography variant="body1" sx={{ mt: 2, color: 'text.secondary' }}>
                {macro.macrodescription}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Category: {macro.category}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Macro type: {macro.macrotype}
            </Typography>
            <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Download date: {formatTimestamp(macro.timestamp)}
            </Typography>
            {currentUser ? (
                <>
                    {console.log(`Rendering VoteButton for Macro ID: ${macro.macroid}, User ID: ${currentUser.userId}`)}
                    <VoteButton macroid={macro.macroid} userId={currentUser.userId} />
                </>
            ) : (
                <Typography color="text.secondary">Log in to vote</Typography>
            )}
            {currentUser ? (
                <>
                  <SaveButton macroid={macro.macroid} />
                </>
            ) : (
                <Typography color="text.secondary">Log in to save macros to mylist</Typography>
            )}
            <Button sx={{ mt: 5, padding: 1, color: '#fff' }} onClick={() => setShowMacro(show => !show)}>
                {showMacro ? "Hide macro" : "Show macro"}
            </Button>

            {showMacro && (
                <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
                    {macro.macro}
                </Typography>
            )}
            <Comments></Comments>
        </Box>
    );
}

export default Macro;
