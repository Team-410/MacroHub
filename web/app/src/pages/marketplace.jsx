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

export default function Marketplace() {
    const [searchTerm, setSearchTerm] = useState("");
    const [apps, setApps] = useState([]);
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const theme = useTheme();

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        axios
            .get(`${API_URL}/api/macros/apps`)
            .then((response) => {
                setApps(response.data.apps);
            })
            .catch((error) => {
                console.error("Error fetching apps:", error);
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
                    {apps.length > 0 ? (
                        apps.map((appItem, index) => (
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
                                    navigate(`/marketplace/app/${appItem.app}`)
                                }
                            >
                                <Typography variant="body1">
                                    {appItem.app}
                                </Typography>
                            </Box>
                        ))
                    ) : (
                        <Typography
                            variant="h6"
                            color="text.secondary"
                            sx={{ mt: 2 }}
                        >
                            No apps found.
                        </Typography>
                    )}
                </Box>
            )}

            <Box sx={{ mt: 4 }}>
                <Typography variant="h4" sx={{ fontWeight: 300 }} gutterBottom>
                    Recent
                </Typography>

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

                <Footer />
            </Box>
        </Container>
    );
}
