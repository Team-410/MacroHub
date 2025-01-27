import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Typography, Box, Button, Card, CardContent } from '@mui/material';
import axios from 'axios';

import '../style/home.css';

function HomePage() {
    const [showText, setShowText] = useState(false);
    const [macros, setMacros] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setShowText(true);

        // Haetaan makrot API:sta
        axios.get('/api/macros')
            .then(response => {
                setMacros(response.data.macros);
                console.log(response);
            })
            .catch(error => {
                console.error("Error fetching macros:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    return (
        <Box sx={{ textAlign: 'center', mt: 4, padding: 1 }}>
            <Typography
                variant="h1"
                component="h1"
                className='homeh1'
                sx={{
                    opacity: showText ? 1 : 0,
                    transform: showText ? 'translateX(0)' : 'translateX(-150px)',
                    transition: 'all 0.8s ease-out',
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
                    transform: showText ? 'translateX(0)' : 'translateX(-150px)',
                    transition: 'all 0.8s ease-out',
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
                    transform: showText ? 'translateX(0)' : 'translateX(-150px)',
                    transition: 'all 0.8s ease-out',
                    opacity: 0.7,
                }}
            >
                Download client to your computer <br /> and log in to start using macros
            </Typography>
            <Button
                variant="contained"
                sx={{
                    opacity: showText ? 1 : 0,
                    transform: showText ? 'translateX(0)' : 'translateX(-150px)',
                    transition: 'all 0.8s cubic-bezier(0.25, 1.5, 0.5, 1)',
                    mt: '30px',
                    padding: '15px 30px'
                }}
            >
                Download
            </Button>

            <Box className="line"></Box>

            <Typography className="heading">Popular macros</Typography>

            {loading ? (
                <Typography variant="h6">Loading macros...</Typography>
            ) : (
                <Box sx={{ mt: 4, display: 'flex', flexWrap: 'wrap', gap: 2, justifyContent: 'center' }}>
                    {macros.map((macro) => (
                        <Card key={macro.macroid} className="macrocard">
                            <Link 
                                to={`/macro/${macro.macroid}`}
                                style={{ textDecoration: 'none', color: 'inherit' }}
                            >
                                <CardContent sx={{ textAlign: 'left', overflow: 'auto', height: '100%' }}>
                                    <Typography variant="h6" component="div">
                                        {macro.macroname}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        Category: {macro.category}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {macro.macrodescription}
                                    </Typography>
                                </CardContent>
                            </Link>
                        </Card>
                    ))}
                </Box>
            )}
        </Box>
    );
}

export default HomePage;
