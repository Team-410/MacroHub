import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Nav from './components/nav';
import Login from './pages/login';
import Register from './pages/register';

function Home() {
  return <h2>Home Page</h2>;
}


function About() {
  return <h2>About Page</h2>;
}

function App() {

  return (
    <Router>
      {/* Käytä Nav-komponenttia */}
      <Nav />

      {/* Määritä reitit */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
