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
import Pots from "./pages/Pots";
import Archive from "./pages/Archive";
import ArchiveProject from "./pages/ArchiveProject";
import Astros from "./pages/Astros";
import CollabRISD from "./pages/CollabRISD";
import GuoSweets from "./pages/GuoSweets";
import P5js from "./pages/P5js";
import { ProjectContextProvider } from "./context/ProjectContext";
import ScrollToTop from "./components/general/ScrollToTop";
import Login from "./pages/Login";
import ProtectedRoute from "./components/general/ProtectedRoute";

// full-bleed dark pages without the portfolio navbar and footer
const DARK_PAGES = ["/", "/pots", "/pots/"];

function BackgroundColor({ children }) {
  const location = useLocation();

  // Apply different classes or styles based on the route
  useEffect(() => {
    if (DARK_PAGES.includes(location.pathname)) {
      document.body.className = "bg-[#0B0A0F]";
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
  const isLandingPage = DARK_PAGES.includes(location.pathname);

  return (
    <>
      <ScrollToTop />
      <BackgroundColor />
      {!isLandingPage && <Navbar />}
      <Routes>
        <Route path="/" exact element={<Landing />} />
        <Route path="/pots" element={<Pots />} />
        <Route path="/2026" exact element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route
          path="/mochi-health"
          element={
            <ProtectedRoute>
              <Mochi />
            </ProtectedRoute>
          }
        />
        <Route path="/blooms" element={<Blooms />} />
        <Route path="/archive/a11y-buddy" element={<A11yBuddy />} />
        <Route path="/archive/eat-the-ocean" element={<EatTheOcean />} />
        <Route path="/archive" element={<Archive />} />
        <Route path="/archive/astros" element={<Astros />} />
        <Route path="/archive/collab-risd" element={<CollabRISD />} />
        <Route path="/archive/p5js" element={<P5js />} />
        <Route path="/archive/guo-sweets" element={<GuoSweets />} />
        <Route path="/archive/astrobunny" element={<ArchiveProject />} />
        <Route path="/archive/pair" element={<ArchiveProject />} />
        <Route path="/login" element={<Login />} />
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
