// Sidebar component

import "./SideBar.css";
import { useState, useEffect } from "react";
import useEmployeeData from "../hooks/useEmployeeData";

const SideBar = ({ setSectionToDisplay, isAuthenticated, onHome }) => {
  const { checkAdminPrivileges } = useEmployeeData();
  const [isAdmin, setIsAdmin] = useState(false);

  // check admin privileges on mount
  useEffect(() => {
    const fetchAdminStatus = async () => {
      if (isAuthenticated) {
        const adminStatus = await checkAdminPrivileges();
        setIsAdmin(adminStatus);
      }
    };

    fetchAdminStatus();
  }, [isAuthenticated, checkAdminPrivileges]);

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-title">Login Manager</div>
        {isAuthenticated && (
          <>
            <a href="/" className="sidebar-item link">
              Home
            </a>
            <a href="/user" className="sidebar-item link">
              My Profile
            </a>
            {isAdmin && ( // only render if user is admin
              <a href="/admin" className="sidebar-item link">
                Admin Panel
              </a>
            )}
          </>
        )}
        <div className="sidebar-bottom">
          {isAuthenticated && (
            <a href="/register" className="sidebar-item link">
              Register
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
