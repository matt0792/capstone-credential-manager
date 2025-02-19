import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Components
import Background from "./components/Background";
import SideBar from "./components/SideBar";
import AuthWrapper from "./components/AuthWrapper";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";

const App = () => {
  const [sectionToDisplay, setSectionToDisplay] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onHome, setOnHome] = useState(false);

  useEffect(() => {
    setOnHome(false);
  }, []);

  return (
    <Router>
      <div className="App">
        <Background />
        <SideBar
          setSectionToDisplay={setSectionToDisplay}
          isAuthenticated={isAuthenticated}
          onHome={onHome}
        />
        <div className="page-content">
          <div className="spacer-left"></div>
          <Routes>
            {/* public routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* protected routes */}
            <Route
              path="/"
              element={
                <AuthWrapper
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                >
                  <HomePage
                    sectionToDisplay={sectionToDisplay}
                    setOnHome={setOnHome}
                  />
                </AuthWrapper>
              }
            />
            <Route
              path="/register"
              element={
                <AuthWrapper
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                >
                  <RegisterPage sectionToDisplay={sectionToDisplay} />
                </AuthWrapper>
              }
            />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
