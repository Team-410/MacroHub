import { Link } from 'react-router-dom';
import { Button, Box } from '@mui/material';

function Nav() {
  return (
    <Box sx={{ display: 'flex',
        justifyContent: 'center', 
        alignItems: 'center', 
        gap: 2, 
        position: 'fixed', 
        top: 0, 
        left: 0,
        padding: '20px', 
        width: '100%'
    }}>
      <Button component={Link} to="/" variant="text">
        Home
      </Button>
      <Button component={Link} to="/about" variant="text">
        About
      </Button>
      <Button component={Link} to="/login" variant="text">
        Login
      </Button>
      <Button component={Link} to="/register" variant="text">
        Register
      </Button>
    </Box>
  );
}

export default Nav;
