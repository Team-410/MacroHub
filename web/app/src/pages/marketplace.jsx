import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    TextField,
    Box,
    Card,
    CardContent,
    CircularProgress,
    List,
    ListItem,
} from "@mui/material";
import { Link } from 'react-router-dom';
import Footer from "../components/footer";
import { useTheme } from "@mui/material/styles";

import "../style/home.css";

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState("");
    const [categories, setCategories] = useState([]);
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        axios
            .get(`${API_URL}/api/macros/category`)
            .then((response) => {
                console.log(response);
                setCategories(response.data.categories);
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
            })
            .finally(() => {
                setLoading(false);
            });

        axios
            .get(`${API_URL}/api/macros`)
            .then((response) => {
                setMacros(response.data.macros);
            })
            .catch((error) => {
                console.error("Error fetching macros:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const filteredSuggestions =
        macros?.filter(
            (macro) =>
                macro.macroname
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                macro.macrodescription
                    ?.toLowerCase()
                    .includes(searchTerm.toLowerCase())
        ) || [];

    return (
        <Container sx={{ mt: 12 }}>
            <Typography variant="h3" sx={{ fontWeight: 300 }} gutterBottom>
                Marketplace
            </Typography>

            <Box sx={{ position: "relative" }}>
                <TextField
                    variant="outlined"
                    fullWidth
                    placeholder="Search macros..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    sx={{ mb: 0 }}
                />

                {searchTerm && filteredSuggestions.length > 0 && (
                    <Box
                        sx={{
                            position: "absolute",
                            top: "100%",
                            left: 0,
                            width: "100%",
                            maxHeight: 400,
                            overflow: "auto",
                            border: "1px solid #333",
                            borderBottomLeftRadius: "10px",
                            borderBottomRightRadius: "10px",
                            zIndex: 10,
                            backgroundColor: theme.palette.background.default,
                        }}
                    >
                        <List sx={{ p: 0 }}>
                            {filteredSuggestions.map((macro) => (
                                <ListItem
                                    key={macro.macroid}
                                    sx={{
                                        cursor: "pointer",
                                        padding: "8px 20px",
                                        borderBottom: "1px solid #333",
                                        "&:hover": {
                                            color: "#646cff",
                                        },
                                    }}
                                    onClick={() =>
                                        navigate(`/macro/${macro.macroid}`)
                                    }
                                >
                                    {macro.macroname}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Box>

            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "start",
                        mt: 2,
                        mb: 6,
                    }}
                >
                    {categories.length > 0 ? (
                        categories.map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    padding: "5px 20px",
                                    borderRadius: 4,
                                    cursor: "pointer",
                                    border: "1px solid #333",
                                    transition: "border 0.3s",
                                    "&:hover": {
                                        border: "1px solid #646cff",
                                    },
                                }}
                                onClick={() =>
                                    navigate(
                                        `/marketplace/category/${item.category}`
                                    )
                                }
                            >
                                <Typography variant="body1">
                                    {item.category}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            No categories found.
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ mt: 4 }}>

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
                            className="macrocard"
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
                                        sx={{
                                            mt: 1,
                                            display: "-webkit-box",
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: "vertical",
                                            overflow: "hidden",
                                        }}
                                    >
                                        {macro.macrodescription}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </Box>

                <Footer />
            </Box>
        </Container>
    );
}
