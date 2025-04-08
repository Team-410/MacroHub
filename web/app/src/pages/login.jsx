import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import {
    Box,
    TextField,
    Button,
    Typography,
    Container,
    CssBaseline,
    Paper,
} from "@mui/material";

const login = () => {

    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('authToken'));

    const API_URL = import.meta.env.VITE_BASE_API_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/login`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                console.log("Kirjautuminen onnistui:", response);
                alert("Login failed!");

                // Save to JWT localStorage
                localStorage.setItem("authToken", response.data.token);

                //Temporary sollution
                // TODO fix this
                setToken(response.data.token);
                navigate('/');
                window.location.reload();

            } else {
                alert("Login failedi: " + response.statusText);
            }
        } catch (error) {

            console.error("Virhe kirjautumisessa:", error);

            if (error.response && error.response.data && error.response.data.error) {
                alert("Virhe kirjautumisessa: " + error.response.data.error);
            } else {
                alert("Tuntematon virhe: " + error.message);
            }
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <Paper
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    mt: "150px",
                }}
            >
                <Typography component="h1" variant="h5">
                    Login
                </Typography>
                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Login
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default login;
