import React, { useState, useEffect } from "react";
import { Container, Typography, Box, Button, Grid, Modal } from "@mui/material";
import headerImage from "../images/macrohub-header1.png";
import mobileHeader from "../images/mobileHeader.png";
import Footer from "../components/footer";

import { useTheme } from '@mui/material/styles';

const About = () => {
    const [backgroundImage, setBackgroundImage] = useState(headerImage);
    const [open, setOpen] = useState(false);
    const theme = useTheme();

    useEffect(() => {
        const handleResize = () => {
            setBackgroundImage(window.innerWidth < 520 ? mobileHeader : headerImage);
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    return (
        <Container sx={{ mt: 10 }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            padding: 5,
                            height: { xs: 300, sm: 500 },
                            backgroundImage: `url(${backgroundImage})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            borderRadius: 2,
                        }}
                    />
                </Grid>

                <Grid item xs={12} md={6}>
                    <Box textAlign="left">
                        <Typography variant="h3" fontWeight="bold" gutterBottom>
                            ABOUT
                        </Typography>
                        <Typography variant="h5" gutterBottom>
                            Welcome to MacroHub
                        </Typography>
                        <Typography variant="body1" paragraph>
                            We provide a platform for users to share and
                            discover macros for their favorite games. Our goal
                            is to create a community where users can easily find
                            and share macros for their favorite games and also
                            other softwares.
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Join us on our journey to create something
                            extraordinary. We are excited to have you with us!
                        </Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            sx={{ mt: 2 }}
                            onClick={handleOpen}
                        >
                            Learn More
                        </Button>
                    </Box>
                </Grid>
            </Grid>

            <Modal open={open} onClose={handleClose} aria-labelledby="modal-title">
                <Box
                    sx={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: { xs: 300, sm: 400 },
                        bgcolor: theme.palette.background.default,
                        boxShadow: "0px 2px 30px rgba(189, 179, 179, 0.6)",
                        p: { xs: 4, sm: 10 },
                        borderRadius: 2,
                    }}
                >
                    <Typography id="modal-title" variant="h6" component="h2">
                        How does it work?
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        1. Download the client to your computer <br />
                        2. Create account at the website <br />
                        3. Choose macros you want to use inside the website <br />
                        4. Log in to the client and start using macros <br />
                    </Typography>
                    <Button
                        variant="contained"
                        color="secondary"
                        sx={{ mt: 3 }}
                        onClick={handleClose}
                    >
                        Close
                    </Button>
                </Box>
            </Modal>

            <Footer />
        </Container>
    );
};

export default About;
