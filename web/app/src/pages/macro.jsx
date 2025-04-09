import {  Container, Box, Typography, CircularProgress, Button } from "@mui/material";
import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { formatTimestamp } from "../utils/formatTimestamp";
import Backbutton from "../components/backbutton";
import VoteButton from "../components/VoteButton";
import SaveButton from "../components/SaveButton";

import Comments from "../components/comments";

function Macro() {
    const API_URL = import.meta.env.VITE_BASE_API_URL;

    const { id } = useParams();
    const [macro, setMacro] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [animation, setAnimation] = useState(false);
    const [showMacro, setShowMacro] = useState(false);
    const [logged, setLogged] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("authToken");
        if (token) {
            setLogged(true);
        }

        axios
            .get(`${API_URL}/api/macros/${id}`)
            .then((response) => {
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
        <Container sx={{ mt: 4, display: "flex", justifyContent: "center" }}>
            <Box sx={{ padding: 1, maxWidth: 500 }}>
                <Backbutton></Backbutton>
                <Typography
                    variant="h4"
                    gutterBottom
                    sx={{
                        opacity: animation ? 1 : 0,
                        transform: animation
                            ? "translateY(0)"
                            : "translateY(-50px)",
                        transition: "all 0.8s ease-out",
                    }}
                >
                    {macro.macroname}
                </Typography>
                <Typography
                    variant="body1"
                    gutterBottom
                    sx={{
                        opacity: animation ? 1 : 0,
                        transform: animation
                            ? "translateY(0)"
                            : "translateY(-50px)",
                        transition: "all 0.8s ease-out",
                    }}
                >
                    {macro.app}
                </Typography>
                <Typography
                    variant="body1"
                    sx={{ mt: 2, color: "text.secondary" }}
                >
                    {macro.macrodescription}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                >
                    Category: {macro.category}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                >
                    Macro type: {macro.macrotype}
                </Typography>
                <Typography
                    variant="body2"
                    sx={{ mt: 1, color: "text.secondary" }}
                >
                    Download date: {formatTimestamp(macro.timestamp)}
                </Typography>
                {logged ? (
                    <>
                        <VoteButton macroid={macro.macroid} />
                        <SaveButton macroid={macro.macroid} />
                    </>
                ) : (
                    <>
                        <Typography color="text.secondary" sx={{ mt: 1 }}>
                            Log in to vote and save macros
                        </Typography>
                    </>
                )}

                <Button
                    sx={{ mt: 5, padding: 1, color: "#fff" }}
                    onClick={() => setShowMacro((show) => !show)}
                >
                    {showMacro ? "Hide macro" : "Show macro"}
                </Button>

                {showMacro && (
                    <Typography
                        variant="body2"
                        sx={{ mt: 2, color: "text.secondary" }}
                    >
                        {macro.macro}
                    </Typography>
                )}
                <Comments></Comments>
            </Box>
        </Container>
    );
}

export default Macro;
