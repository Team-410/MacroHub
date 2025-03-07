import React from "react";
import { Container, Typography, Box, Button, Grid } from "@mui/material";
import headerImage from "../images/macrohub-header1.png";
import Footer from "../components/footer";

const About = () => {
    return (
        <Container sx={{ mt: 10 }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Box
                        sx={{
                            height: 500,
                            backgroundImage: `url(${headerImage})`,
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
                        >
                            Learn More
                        </Button>
                    </Box>
                </Grid>
            </Grid>
            <Footer></Footer>
        </Container>
    );
};

export default About;
