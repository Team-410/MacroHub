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
} from "@mui/material";

const register = () => {
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
        const response = await axios.post("/api/adduser", formData, {
            headers: {
            "Content-Type": "application/json",
            },
        });
    
        if (response.status === 200 || response.status === 201) {
            console.log("User registered successfully:", response.data);
            alert("Käyttäjä rekisteröity onnistuneesti!");
            navigate('/login');
        }
    } catch (error) {
        console.error("Error during registration:", error);

        // Näytetään palvelimen virheilmoitus, jos sellainen on
        if (error.response && error.response.data && error.response.data.error) {
            alert("Virhe rekisteröinnissä: " + error.response.data.error);
        } else {
            alert("Tuntematon virhe: " + error.message);
        }
    }
};



  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
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
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Login
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default register;
