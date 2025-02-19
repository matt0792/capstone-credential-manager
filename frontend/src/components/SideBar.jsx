import "./SideBar.css";
import { useState } from "react";

const SideBar = ({ setSectionToDisplay, isAuthenticated, onHome }) => {
  const ouList = [
    "News Management",
    "Software Reviews",
    "Hardware Reviews",
    "Opinion Publishing",
  ];

  const divisionsList = [
    "Finance",
    "Human Resources",
    "Development",
    "Marketing",
    "Sales",
    "Operations",
    "Writing/Content",
    "Customer Support",
    "Legal",
    "Research & Development",
  ];

  const [expandedOUs, setExpandedOUs] = useState({});

  const toggleOU = (ou) => {
    setExpandedOUs((prev) => ({
      [ou]: !prev[ou], // toggle the expanded state
    }));
  };

  const handleClick = (OU, division) => {
    setSectionToDisplay({ OU: OU, division: division });
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-title">Login Manager</div>
        {isAuthenticated && !onHome && (
          <a href="/" className="sidebar-item link">
            Home
          </a>
        )}
        {isAuthenticated && onHome && (
          <div className="ou-container">
            {ouList.map((ou) => (
              <div className="ou-sidebar-container">
                <div
                  key={ou}
                  className="organizational-unit-sidebar"
                  onClick={() => toggleOU(ou)}
                >
                  <div className="OU-sidebar-title sidebar-item">{ou}</div>
                  <div
                    className={`sidebar-divisions-list ${
                      expandedOUs[ou] ? "expanded" : ""
                    }`}
                  >
                    {divisionsList.map((division) => (
                      <div
                        key={division}
                        className={`sidebar-item sidebar-division`}
                        onClick={() => handleClick(ou, division)}
                      >
                        {division}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="sidebar-bottom">
          {isAuthenticated && (
            <a href="/register" className="sidebar-item link">
              Register new Employee
            </a>
          )}
          <a href="/login" className="sidebar-item link">
            Login
          </a>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
