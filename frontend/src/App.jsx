import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "./App.css";
import "bootstrap-icons/font/bootstrap-icons.css";

// Components
import Background from "./components/Background";
import SideBar from "./components/SideBar";
import AuthWrapper from "./components/AuthWrapper";
import AddCredModal from "./components/AddCredModal";
import UpdateCredModal from "./components/UpdateCredModal";

// Pages
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";
import EmployeeList from "./pages/EmployeeList";

const App = () => {
  const [sectionToDisplay, setSectionToDisplay] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [onHome, setOnHome] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDivisionId, setSelectedDivisionId] = useState(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [credDetails, setCredDetails] = useState(null);

  useEffect(() => {
    setOnHome(false);
  }, []);

  const refreshPage = () => {
    window.location.reload();
  };

  return (
    <Router>
      <div className="App">
        <Background />
        <SideBar
          setSectionToDisplay={setSectionToDisplay}
          isAuthenticated={isAuthenticated}
          onHome={onHome}
        />
        {showAddModal && (
          <AddCredModal
            selectedDivisionId={selectedDivisionId}
            setShowAddModal={setShowAddModal}
            showAddModal={showAddModal}
            refreshPage={refreshPage}
          />
        )}
        {showUpdateModal && (
          <UpdateCredModal
            selectedDivisionId={selectedDivisionId}
            setShowUpdateModal={setShowUpdateModal}
            credDetails={credDetails}
            showUpdateModal={showUpdateModal}
            refreshPage={refreshPage}
          />
        )}
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
                    setShowAddModal={setShowAddModal}
                    setSelectedDivisionId={setSelectedDivisionId}
                    setShowUpdateModal={setShowUpdateModal}
                    setCredDetails={setCredDetails}
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
            <Route
              path="/user"
              element={
                <AuthWrapper
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                >
                  <UserPage />
                </AuthWrapper>
              }
            />
            <Route
              path="/admin"
              element={
                <AuthWrapper
                  isAuthenticated={isAuthenticated}
                  setIsAuthenticated={setIsAuthenticated}
                >
                  <EmployeeList refreshPage={refreshPage} />
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
