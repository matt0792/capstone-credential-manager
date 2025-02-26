// primarily for use in admin panel 

import { useEffect, useState } from "react";
import axios from "axios";

const useEmployeeList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/employee/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

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

  // Function to update employee role
  const updateEmployeeRole = async (id, newRole) => {
    try {
      await axios.put(`http://localhost:3000/api/employee/${id}/role`, {
        role: newRole,
      });
      setData((prevData) => ({
        ...prevData,
        employees: prevData.employees.map((emp) =>
          emp.username === id ? { ...emp, role: newRole } : emp
        ),
      }));
    } catch (err) {
      console.error("Error updating role:", err);
    } finally {
      window.location.reload();
    }
  };

  const deleteEmployeeDivision = async (employeeId, ouId, divisionId) => {
    try {
      const response = await axios.delete(
        `http://localhost:3000/api/employee/${employeeId}/organizational-unit/${ouId}/division/${divisionId}`
      );
    } catch (error) {
      console.error(
        "Error deleting OU and Division:",
        error.response ? error.response.data : error.message
      );
    } finally {
      window.location.reload();
    }
  };

  const addEmployeeDivision = async (employeeId, ouId, divisionId) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/employee/division",
        {
          employeeId,
          ouId,
          divisionId,
        }
      );
      console.log("Successfully added OU and Division:", response.data);
    } catch (error) {
      console.error(
        "Error adding OU and Division:",
        error.response ? error.response.data : error.message
      );
    } finally {
        window.location.reload();
    }
  };

  return {
    data,
    loading,
    error,
    updateEmployeeRole,
    deleteEmployeeDivision,
    addEmployeeDivision,
  };
};

export default useEmployeeList;
