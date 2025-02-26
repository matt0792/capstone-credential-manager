// List of all employees 
// Used in admin panel 

import "./EmployeeList.css";
import useEmployeeList from "../hooks/useEmployeeList";
import SearchBar from "../components/SearchBar";
import { useState, useEffect } from "react";

const EmployeeList = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [OUs, setOUs] = useState([]);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedOU, setSelectedOU] = useState(null);
  const [selectedDivision, setSelectedDivision] = useState(null);

  const {
    data,
    loading,
    error,
    updateEmployeeRole,
    deleteEmployeeDivision,
    addEmployeeDivision,
  } = useEmployeeList();

  useEffect(() => {
    const getOUsAndDivisions = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/api/ou/info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error(`Failed to fetch OU data: ${response.status}`);
        }

        const data = await response.json();
        setOUs(data.organizationalUnits);
      } catch (error) {
        console.log(error.message);
      }
    };

    getOUsAndDivisions();
  }, []);

  const filteredData =
    data?.employees?.filter((emp) =>
      emp.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  if (loading)
    return (
      <div className="home-load">
        <div className="home-load-icon">Loading...</div>
      </div>
    );
  if (error) return <p>Unauthorized: {error}</p>;

  return (
    <div className="employee-list">
      <SearchBar onSearch={setSearchQuery} />
      <div className="employee-list-container">
        {filteredData.map((emp, index) => {
          const divisions = selectedOU
            ? OUs.find((ou) => ou.organizationalUnitId === selectedOU)
                ?.divisions || []
            : [];

          return (
            <div className="employee-cont" key={index}>
              {/* Existing employee info */}
              <div className="employee-cont-section">
                <div className="employee-info emp-strong">{emp.name}</div>
              </div>
              <div className="employee-cont-section ">
                <div className="employee-info emp-username">{emp.username}</div>
              </div>
              <div className="employee-cont-section emp-spacer-down">
                <select
                  className="register-input"
                  value={emp.role}
                  onChange={(e) => updateEmployeeRole(emp.id, e.target.value)}
                >
                  <option value="normal">normal</option>
                  <option value="management">management</option>
                  <option value="admin">admin</option>
                </select>
              </div>

              {emp.organizationalUnits.map((ou, ouIndex) => (
                <div key={ouIndex} className="employee-cont-section">
                  <div className="division-list-item">
                    {ou.ouName}
                    <i className="bi bi-caret-right-fill"></i>
                    {ou.divisionName}
                  </div>
                  <button
                    className="gen-button"
                    onClick={() =>
                      deleteEmployeeDivision(emp.id, ou.ouId, ou.divisionId)
                    }
                  >
                    Delete Division
                  </button>
                </div>
              ))}

              {/* Add OU/Division Section */}

              {selectedEmployeeId === emp.id && (
                <div className="ou-division-select">
                  <select
                    className="register-input"
                    value={selectedOU || ""}
                    onChange={(e) => {
                      setSelectedOU(e.target.value);
                      setSelectedDivision(null);
                    }}
                  >
                    <option value="">Select OU</option>
                    {OUs.map((ou) => (
                      <option key={ou.ouId} value={ou.ouId}>
                        {ou.ouName}
                      </option>
                    ))}
                  </select>

                  <select
                    className="register-input"
                    value={selectedDivision || ""}
                    onChange={(e) => setSelectedDivision(e.target.value)}
                    disabled={!selectedOU}
                  >
                    <option value="">Select Division</option>
                    {OUs.find((ou) => ou.ouId === selectedOU)?.divisions.map(
                      (division) => (
                        <option
                          key={division.divisionId}
                          value={division.divisionId}
                        >
                          {division.divisionName}
                        </option>
                      )
                    )}
                  </select>

                  <button
                    className="gen-button"
                    onClick={() => {
                      if (selectedOU && selectedDivision) {
                        addEmployeeDivision(
                          emp.id,
                          selectedOU,
                          selectedDivision
                        );
                        setSelectedEmployeeId(null);
                        setSelectedOU(null);
                        setSelectedDivision(null);
                      }
                    }}
                    disabled={!selectedOU || !selectedDivision}
                  >
                    Confirm
                  </button>

                  <button
                    className="gen-button"
                    onClick={() => {
                      setSelectedEmployeeId(null);
                      setSelectedOU(null);
                      setSelectedDivision(null);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
              <button
                className="gen-button add-ou-button"
                onClick={() => {
                  setSelectedEmployeeId(emp.id);
                  setSelectedOU(null);
                  setSelectedDivision(null);
                }}
              >
                Add new OU and Division
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default EmployeeList;
