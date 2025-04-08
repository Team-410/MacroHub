import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const register = () => {
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_BASE_API_URL;

    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullname: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`${API_URL}/api/adduser`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200 || response.status === 201) {
                alert("User registered succesfully");
                navigate("/login");
            }
            else if (response.status === 400) {
                alert(response.message)
            }
        } catch (error) {
            console.error("Error during registration:", error);

            if (error.response && error.response.data && error.response.data.error) {
                alert(error.response.data.error);
            } else {
                alert(error.message);
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
                    Register
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
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="fullname"
                        label="username"
                        type="fullname"
                        id="fullname"
                        onChange={handleChange}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Register
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
};

export default register;
