import "./SideBar.css";
import { useState } from "react";

const SideBar = ({ setSectionToDisplay, isAuthenticated, onHome }) => {
  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-title">Login Manager</div>
        {isAuthenticated && (
          <a href="/" className="sidebar-item link">
            Home
          </a>
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
