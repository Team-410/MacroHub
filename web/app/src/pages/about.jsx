import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';

const about = () => {
  return (
    <Container>
      <Box mt={4}>
        <Typography variant="h4" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1">
          Welcome to our website. We are dedicated to providing the best services and experiences for our users.
        </Typography>
        <Typography variant="body1">
          Our mission is to continuously innovate and improve, bringing you the best of technology and customer service.
        </Typography>
      </Box>
      <Button variant="contained">Contained</Button>
    </Container>
  );
};

export default about;
