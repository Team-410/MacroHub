import { Box, Typography, Button, useTheme, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import '../style/nav.css';
import { useState, useEffect } from 'react';

function Nav() {
    const [token, setToken] = useState(localStorage.getItem('authToken'));
    const theme = useTheme();

    const toggleMenu = () => {
        if (window.innerWidth < 600) {
            document.getElementById('links').classList.toggle('open');
        }
    };

    useEffect(() => {
        const storedToken = localStorage.getItem('authToken');
        setToken(storedToken);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('authToken');
        setToken(null);
    };

    return (
        <Box className="nav" sx={{
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
        }}>
            <Typography className='logo' component={Link} to="/" variant="h6" style={{ textDecoration: 'none', color: 'inherit' }}>
                MacroHub
            </Typography>
            <Box id="links" className="links" onClick={() => toggleMenu()}>
                <Button className='navlink' component={Link} to="/" variant="text">
                    Home
                </Button>
                <Button className='navlink' component={Link} to="/about" variant="text">
                    About
                </Button>
                {token && (
                    <>
                        <Button className='navlink' component={Link} to="personalList" variant="text">
                            My macros
                        </Button>
                        <Button className='navlink' onClick={handleLogout} variant="text">
                            Logout
                        </Button>
                    </>
                )}
                {!token && (
                    <>
                        <Button className='navlink' component={Link} to="/login" variant="text">
                            Login
                        </Button>
                        <Button className='navlink' component={Link} to="/register" variant="text">
                            Register
                        </Button>
                    </>
                )}
            </Box>
            <IconButton aria-label='menu' className='menubutton' style={{ color: 'white', padding: '0 20px' }} onClick={() => toggleMenu()}>
                <MenuIcon />
            </IconButton>
        </Box>
    );
}

export default Nav;
