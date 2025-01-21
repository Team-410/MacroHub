import React from 'react';
import { Typography, Box } from '@mui/material';

function HomePage() {
    return (
        <Box sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h1" component="h1" gutterBottom>
                MacroHub
            </Typography>
            <Typography variant="h6" component="p" sx={{ opacity: 0.7 }}>
                Macro library for your usecase
            </Typography>
        </Box>
    );
}

export default HomePage;
