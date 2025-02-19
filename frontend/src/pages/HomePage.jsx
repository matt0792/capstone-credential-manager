import { useEffect, useRef, useState } from "react";
import "./HomePage.css";
import useOrganizationalData from "../hooks/useOrganizationalData";
import EditButton from "../components/EditButton";
import SearchBar from "../components/SearchBar";

const HomePage = ({ sectionToDisplay, setOnHome }) => {
  const { data, loading, error } = useOrganizationalData();
  const sectionRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize refs for scrolling
  if (data) {
    Object.entries(data).forEach(([OU, divisions]) => {
      if (!sectionRefs.current[OU]) {
        sectionRefs.current[OU] = {};
      }
      Object.keys(divisions).forEach((division) => {
        if (!sectionRefs.current[OU][division]) {
          sectionRefs.current[OU][division] = null;
        }
      });
    });
  }

  useEffect(() => {
    if (sectionToDisplay) {
      const { OU, division } = sectionToDisplay;
      const targetRef = sectionRefs.current[OU]?.[division];

      if (targetRef) {
        targetRef.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [sectionToDisplay]);

  useEffect(() => {
    setOnHome(true);
  }, []);

  if (loading)
    return (
      <div className="home-load">
        <div className="home-load-icon">Loading...</div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="home-page">
      <SearchBar onSearch={setSearchQuery} />

      <div className="home-data-container">
        {Object.entries(data).map(([OU, divisions]) => (
          <div key={OU} className="organizational-unit">
            <h3 className="OU-title">{OU}</h3>
            {Object.entries(divisions).map(([division, employees]) => {
              // Filter employees based on search query
              const filteredEmployees = employees.filter((employee) =>
                employee.name.toLowerCase().includes(searchQuery.toLowerCase())
              );

              return (
                <div
                  key={division}
                  ref={(el) => (sectionRefs.current[OU][division] = el)}
                  className="division"
                >
                  <div className="home-division-header">
                    <h4 className="division-title">
                      {OU} <i className="bi bi-caret-right-fill"></i> {division}
                    </h4>
                  </div>

                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee, index) => (
                      <div key={index} className="employee">
                        <div className="employee-name bolder">
                          {employee.name}
                        </div>
                        <div className="employee-username">
                          Username: {employee.username}
                        </div>
                        <div className="employee-credentials">
                          {employee.credentials.map((cred, idx) => (
                            <div key={idx} className="employee-credential">
                              <div className="cred-title bolder">
                                {cred.siteName}
                              </div>
                              <div>Username: {cred.username}</div>
                              <div>Password: {cred.password}</div>
                            </div>
                          ))}
                        </div>
                        <EditButton className="edit-button-home" />
                      </div>
                    ))
                  ) : (
                    <p>No matching employees found</p>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
