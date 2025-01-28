import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const BackButton = ({ to = -1, sx, ...props }) => {
    const navigate = useNavigate();
    const [animate, setAnimate] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 400);
        return () => clearTimeout(timer);
    }, []);

    const handleBack = () => {
        if (to === -1) {
            navigate(-1);
        } else {
            navigate(to);
        }
    };

    return (
        <Button
            variant="text"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{
                mb: 2,
                mt: '100px',
                textTransform: 'none',
                background: 'none',
                boxShadow: 'none',
                outline: 'none',
                opacity: animate ? 1 : 0,
                transform: animate ? 'translateX(0)' : 'translateX(-50px)',
                transition: 'all 0.5s ease',
                '&:hover': {
                    background: 'none',
                },
                '&:focus': {
                    outline: 'none',
                    boxShadow: 'none',
                },
                ...sx,
            }}
            {...props}
        >
            Back
        </Button>
    );
};

export default BackButton;
