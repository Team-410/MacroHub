import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles"; // MUI:n ThemeProvider
import theme from "./components/theme"; // Teema tiedosto
import GlobalStyle from "./components/GlobalStyle.jsx"; // GlobalStyle tiedosto
import ScrollTop from "./utils/ScrollTop"; // Scrollaus näkymän yläosaan

// Token validaatio
import TokenRefresh from "./utils/TokenRefresh.jsx";

// Sivut
import Nav from "./components/nav";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import About from "./pages/about";
import Macro from "./pages/macro";
import PersonalList from "./pages/personalList";
import Marketplace from "./pages/marketplace";
import MacroApp from "./pages/macroApp";

function App() {
    return (
        <Router>
            <ThemeProvider theme={theme}>
                <ScrollTop />
                <GlobalStyle />
                <Nav />
                <TokenRefresh>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/macro/:id" element={<Macro />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/personalList" element={<PersonalList />} />
                        <Route path="/marketplace" element={<Marketplace />} />
                        <Route path="marketplace/app/:appCategory" element={<MacroApp />} />
                    </Routes>
                </TokenRefresh>
            </ThemeProvider>
        </Router>
    );
}

export default App;
