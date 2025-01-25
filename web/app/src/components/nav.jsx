
import { Box, Typography, Button, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import '../style/nav.css';

function Nav() {
    const theme = useTheme();

    return (
        <Box className="nav" sx={{
            borderBottom: `1px solid ${theme.palette.secondary.main}`,
        }}>
            <Typography className='logo' component={Link} to="/" variant="h6" style={{ textDecoration: 'none', color: 'inherit' }}>
                MacroHub
            </Typography>
            <Box className="links">
                <Button className='navlink' component={Link} to="/" variant="text">
                    Home
                </Button>
                <Button className='navlink' component={Link} to="/about" variant="text">
                    About
                </Button>
                <Button className='navlink' component={Link} to="/login" variant="text">
                    Login
                </Button>
                <Button className='navlink' component={Link} to="/register" variant="text">
                    Register
                </Button>
            </Box>
        </Box>
    );
}

export default Nav;
