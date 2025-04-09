import axios from "axios";
import { useState, useEffect } from "react";
import { Link } from 'react-router-dom';

import { Box, Typography, Card, CardContent, Container } from "@mui/material";

function PersonalList() {
    const [list, setList] = useState([]);
    const [, setLoading] = useState(true);
    const [, setError] = useState(null);
    const API_URL = import.meta.env.VITE_BASE_API_URL;

    useEffect(() => {
        const token = localStorage.getItem("authToken");

        if (!token) {
            setError("Authentication token not found.");
            setLoading(false);
            return;
        }

        axios
            .get(`${API_URL}/api/personal_list`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (response.data) {
                    setList(response.data.results);
                } else {
                    setError("List not found.");
                }
            })
            .catch(() => {
                setError("Unable to fetch macro data.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Container sx={{ mt: 12 }}>
            <Typography sx={{ fontSize: '22px', textAlign: 'center' }}>Personal List</Typography>
            <Box
                sx={{
                    mt: 4,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
                    justifyContent: "left",
                }}
            >
                {list.map((item, index) => (
                    <Card key={index} className="macrocard">
                        <Link
                            to={`/macro/${item.macroid}`}
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
                                <Typography variant="h6" component="div">
                                    {item.macroname}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ mt: 1 }}
                                >
                                    Category: {item.category}
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
                                    {item.macrodescription}
                                </Typography>
                            </CardContent>
                        </Link>
                    </Card>
                ))}
            </Box>
        </Container>
    );
}

export default PersonalList;
