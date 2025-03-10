import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: "#323232",
        },
        secondary: {
            main: "#4b4b4b",
        },
        background: {
            default: "#181818",
            lighter: "#2b2828",
        },
        accent: {
            main: "#f9f9f9",
        },
        surface: {
            main: "#e6e6e6",
        },
        text: {
            primary: "#ffffff",
            secondary: "#656565",
        },
    },

    // components
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    textDecoration: 'none',
                    '&:hover': {
                        color: '#f0f0f0',
                        textDecoration: 'underline',
                    },
                    transition: '0.3s linear',
                },
            },
        },

        MuiButton: {
            styleOverrides: {
                root: {
                    backgroundColor: "#f9f9f9",
                    color: '#757575',
                    '&:focus': {
                        outline: 'none',
                    },
                    '&:hover': {
                        backgroundColor: "#b3b3b3",
                    },
                    transition: '0.3s linear',

                    '&.MuiButton-text': {
                        backgroundColor: 'transparent',

                        '&:hover': {
                            color: "#b3b3b3",
                    },
                    },
                },
            },
        },

        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundColor: '#323232',
                    color: '#ffffff',
                    padding: '16px',
                    borderRadius: '8px',
                    transition: '0.3s linear',
                    '&:hover': {
                        // backgroundColor: '#4b4b4b',
                    },
                },
            },
        },

        MuiTextField: {
            styleOverrides: {
                root: {
                    color: '#ffffff',
                    borderRadius: '8px',
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#757575',
                        },
                        '&:hover fieldset': {
                            borderColor: '#f9f9f9',
                        },
                        '&.Mui-focused fieldset': {
                            borderColor: '#f9f9f9',
                        },
                    },
                    '& .MuiInputLabel-root': {
                        color: '#b0b0b0',
                    },
                    '& .MuiInputLabel-root.Mui-focused': {
                        color: '#ffffff',
                    },
                    transition: '0.3s linear',
                },
            },
        },

        MuiTypography: {
            styleOverrides: {
                h1: {
                    color: '#ffffff',
                    transition: '0.8s linear',
                },
                h2: {
                    color: '#ffffff',
                    transition: '0.8s linear',
                },
                body1: {
                    color: '#ffffff',
                    transition: '0.8s linear',
                },
                p: {
                    color: '#ffffff',
                    transition: '0.8s linear',
                },
            },
        },
    },

    transitions: {
        easing: {
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
        },
        duration: {
            short: 200,
            standard: 300,
            complex: 375,
        },
    },
});

export default theme;
