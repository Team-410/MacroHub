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
import "../style/home.css";

export default function CategoryMacros() {
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { Category } = useParams();

    useEffect(() => {
        const API_URL = import.meta.env.VITE_BASE_API_URL;

        if (Category) {
            setLoading(true);
            setError(null);
            axios
                .get(`${API_URL}/api/macros/category/${Category}`)
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
    }, [Category]);

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container sx={{ mt: 12 }}>
            <Backbutton />

            <Typography variant="h4" sx={{ fontWeight: 300 }} gutterBottom>
                {Category}
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
                        width: "100%",
                    }}
                >
                    {macros.map((macro) => (
                        <Card key={macro.macroid} className="macrocard">
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
                                    <Typography variant="h6" component="div">
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
                <Typography variant="h6" color="text.secondary" sx={{ mt: 2 }}>
                    No macros found.
                </Typography>
            )}
        </Container>
    );
}
