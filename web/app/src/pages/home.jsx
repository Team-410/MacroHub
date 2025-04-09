import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Typography,
    Box,
    Button,
    Card,
    CardContent,
    Container,
} from "@mui/material";
import axios from "axios";

import Footer from "../components/footer";

import "../style/home.css";

function HomePage() {
    const [showText, setShowText] = useState(false);
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        setShowText(true);

        axios
            .get(`${API_URL}/api/frontpagemacros`)
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

    return (
        <Container>
            <Box sx={{ textAlign: "center", mt: 2, padding: 1 }}>
                <Typography
                    variant="h1"
                    component="h1"
                    className="homeh1"
                    sx={{
                        opacity: showText ? 1 : 0,
                        transform: showText
                            ? "translateX(0)"
                            : "translateX(-150px)",
                        transition: "all 0.8s ease-out",
                    }}
                >
                    MacroHub
                </Typography>
                <Typography
                    variant="p"
                    component="p"
                    color="text.primary"
                    sx={{
                        opacity: showText ? 1 : 0,
                        transform: showText
                            ? "translateX(0)"
                            : "translateX(-150px)",
                        transition: "all 0.8s ease-out",
                        opacity: 0.7,
                        fontSize: 20,
                        marginBottom: 3,
                    }}
                >
                    Free marketplace for macros
                </Typography>
                <Typography
                    variant="p"
                    component="p"
                    color="text.secondary"
                    sx={{
                        opacity: showText ? 1 : 0,
                        transform: showText
                            ? "translateX(0)"
                            : "translateX(-150px)",
                        transition: "all 0.8s ease-out",
                        opacity: 0.7,
                    }}
                >
                    Download client to your computer <br /> and log in to start
                    using macros
                </Typography>
                <Button
                    variant="contained"
                    sx={{
                        opacity: showText ? 1 : 0,
                        transform: showText
                            ? "translateX(0)"
                            : "translateX(-150px)",
                        transition: "all 0.8s cubic-bezier(0.25, 1.5, 0.5, 1)",
                        mt: "30px",
                        padding: "15px 30px",
                    }}
                    component="a"
                    href="/MacroHubInstaller.exe"
                    download="MacroHubInstaller.exe"
                >
                    Download
                </Button>

                <Box className="line"></Box>

                <Typography className="heading">Latest macros</Typography>

                {loading ? (
                    <Box
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                        minHeight="200px"
                    >
                        <CircularProgress />
                    </Box>
                ) : (
                    <Box
                        sx={{
                            mt: 4,
                            display: "flex",
                            flexWrap: "wrap",
                            gap: '16px',
                            justifyContent: "flex-start",
                            width: "100%",
                            maxWidth: "100%",
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
                                            overflow: "auto",
                                            height: "100%",
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
                )}
                <Footer></Footer>
            </Box>
        </Container>
    );
}


export default HomePage;
