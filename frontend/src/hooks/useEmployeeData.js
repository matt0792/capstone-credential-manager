// fetches specific employee data 

import { useEffect, useState } from "react";

const useEmployeeData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        "http://localhost:3000/api/employee/personal",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const checkAdminPrivileges = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/auth/admin", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to check admin status.");
      }

      const data = await response.json();

      if (data.message === "admin") {
        return true; 
      } else {
        return false; 
      }
    } catch (err) {
      console.error("Error checking admin privileges:", err);
      return false; 
    }
  };

  return { data, loading, error, refresh: fetchData, checkAdminPrivileges };
};

export default useEmployeeData;
