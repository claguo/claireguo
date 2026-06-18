import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useEffect } from "react";
import "./App.css";
import Navbar from "./components/general/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Footer from "./components/general/Footer";
import Mochi from "./pages/Mochi";
import A11yBuddy from "./pages/A11yBuddy";
import EatTheOcean from "./pages/EatTheOcean";
import Blooms from "./pages/Blooms";
import Landing from "./pages/Landing";
import { ProjectContextProvider } from "./context/ProjectContext";
import ScrollToTop from "./components/general/ScrollToTop";
import Login from "./pages/Login";
import ProtectedRoute from "./components/general/ProtectedRoute";

function BackgroundColor({ children }) {
  const location = useLocation();

  // Apply different classes or styles based on the route
  useEffect(() => {
    if (location.pathname === "/") {
      document.body.className = "bg-black";
    } else if (location.pathname === "/2026" || location.pathname === "/2026/") {
      document.body.className = "bg-bg-gray";
    } else {
      document.body.className = "bg-bg-white";
    }
  }, [location.pathname]);

  return children;
}

function AppContent() {
  const location = useLocation();
  const isLandingPage = location.pathname === "/";

  return (
    <>
      <ScrollToTop />
      <BackgroundColor />
      {!isLandingPage && <Navbar />}
      <Routes>
        <Route path="/" exact element={<Landing />} />
        <Route path="/2026" exact element={<Home />} />
        <Route path="/2026/about" element={<About />} />
        <Route
          path="/2026/mochi-health"
          element={
            <ProtectedRoute>
              <Mochi />
            </ProtectedRoute>
          }
        />
        <Route path="/2026/a11y-buddy" element={<A11yBuddy />} />
        <Route path="/2026/blooms" element={<Blooms />} />
        <Route path="/2026/eat-the-ocean" element={<EatTheOcean />} />
        <Route path="/2026/login" element={<Login />} />
      </Routes>
      {!isLandingPage && <Footer />}
    </>
  );
}

function App() {
  return (
    <ProjectContextProvider>
      <Router>
        <AppContent />
      </Router>
    </ProjectContextProvider>
  );
}

export default App;
