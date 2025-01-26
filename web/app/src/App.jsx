import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';  // MUI:n ThemeProvider
import theme from './components/theme';  // Teema tiedosto
import GlobalStyle from './components/GlobalStyle.jsx';  // GlobalStyle tiedosto

// Sivut
import Nav from './components/nav';
import Login from './pages/login';
import Register from './pages/register';
import Home from './pages/home';
import About from './pages/about';
import Macro from './pages/macro';

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>  {/* Teema on asetettu */}
        <GlobalStyle />
        <Nav />
        
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/macro/:id" element={<Macro />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
