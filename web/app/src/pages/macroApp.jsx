import { React, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    Box,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import Backbutton from "../components/backbutton";

export default function AppMacros() {
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { appCategory } = useParams();

    useEffect(() => {
        const API_URL = import.meta.env.VITE_BASE_API_URL;

        if (appCategory) {
            setLoading(true);
            setError(null);
            axios
                .get(`${API_URL}/api/macros/app/${appCategory}`)
                .then((response) => {
                    setMacros(response.data.macros);
                })
                .catch((error) => {
                    console.error("Error fetching macros:", error);
                    setError("Something went wrong. Please try again later.");
                })
                .finally(() => {
                    setLoading(false);
                });
        }
    }, [appCategory]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container>
            <Box sx={{ mt: 4 }}>
                <Backbutton />

                <Typography variant="h4" sx={{ fontWeight: 300 }} gutterBottom>
                    {appCategory}
                </Typography>

                {error && (
                    <Typography variant="h6" color="error" sx={{ mt: 2 }}>
                        {error}
                    </Typography>
                )}

                {macros.length > 0 ? (
                    <Box
                        sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 2,
                            justifyContent: "start",
                        }}
                    >
                        {macros.map((macro) => (
                            <Card
                                key={macro.macroid}
                                sx={{
                                    width: 300,
                                    borderRadius: 4,
                                    border: "1px solid #333",
                                    cursor: "pointer",
                                    transition: "border 0.3s",
                                    "&:hover": {
                                        borderColor: "#646cff",
                                    },
                                }}
                            >
                                <Link
                                    to={`/macro/${macro.macroid}`}
                                    style={{
                                        textDecoration: "none",
                                        color: "inherit",
                                    }}
                                >
                                    <CardContent
                                        sx={{
                                            textAlign: "left",
                                            height: "100%",
                                            padding: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="h6"
                                            component="div"
                                        >
                                            {macro.macroname}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            Category: {macro.category}
                                        </Typography>
                                        <Typography
                                            variant="body2"
                                            color="text.secondary"
                                            sx={{ mt: 1 }}
                                        >
                                            {macro.macrodescription}
                                        </Typography>
                                    </CardContent>
                                </Link>
                            </Card>
                        ))}
                    </Box>
                ) : (
                    <Typography
                        variant="h6"
                        color="text.secondary"
                        sx={{ mt: 2 }}
                    >
                        No macros found.
                    </Typography>
                )}
            </Box>
        </Container>
    );
}
