import { Link } from 'react-router-dom';

function nav() {
  return (
    <nav>
      <Link to="/">Home</Link> | 
      <Link to="/about"> About</Link> | 
      <Link to="/login"> Login</Link> |
      <Link to="/register"> Register</Link>
    </nav>
  );
}

export default nav;
