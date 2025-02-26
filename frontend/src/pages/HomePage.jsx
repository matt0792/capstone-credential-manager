// Main page that shows credentials for division 

import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./HomePage.css";
import useOrganizationalData from "../hooks/useOrganizationalData";
import SearchBar from "../components/SearchBar";

const HomePage = ({
  sectionToDisplay,
  setOnHome,
  setShowAddModal,
  setShowUpdateModal,
  setSelectedDivisionId,
  setCredDetails,
  showAddModal,
  showUpdateModal,
}) => {
  const { data, loading, error, refresh } = useOrganizationalData();
  const sectionRefs = useRef({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const toggleAddModal = (divisionId) => {
    setSelectedDivisionId(divisionId);
    setShowAddModal((prev) => !prev);
    if (!showAddModal) refresh();
  };

  const toggleUpdateModal = (divisionId, cred) => {
    setCredDetails(cred);
    setSelectedDivisionId(divisionId);
    setShowUpdateModal((prev) => !prev);
    if (!showUpdateModal) refresh();
  };

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

  // filter by site name
  const filteredData = data
    .map((division) => ({
      ...division,
      credentials: division.credentials.filter((cred) =>
        cred.siteName.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    }))
    .filter(
      (division) => division.credentials.length > 0 || searchQuery === ""
    );

  return (
    <div className="home-page">
      <SearchBar onSearch={setSearchQuery} />

      <div className="home-data-container">
        {filteredData.length === 0 ? (
          <p className="no-results">No matching credentials found.</p>
        ) : (
          filteredData.map((division, index) => (
            <div key={index} className="division-container">
              <div className="division-header">
                {division.organizationalUnit}{" "}
                <i className="bi bi-caret-right-fill"></i>{" "}
                {division.divisionName}
              </div>
              <div>
                {division.credentials.length === 0 ? (
                  <div className="division-credential-container">
                    No credentials available
                  </div>
                ) : (
                  division.credentials.map((cred, credIndex) => (
                    <div
                      key={credIndex}
                      className="division-credential-container"
                    >
                      <div className="cred-item">
                        <div className="cred">
                          <strong className="cred-label">Service:</strong>{" "}
                          <div className="monospace">{cred.siteName}</div>
                        </div>
                        <div className="cred">
                          <strong className="cred-label">Username:</strong>{" "}
                          <div className="monospace">{cred.username}</div>
                        </div>
                        <div className="cred">
                          <strong className="cred-label">
                            Password (Hover to reveal):
                          </strong>{" "}
                          <div
                            className="password-cred"
                            data-password={cred.password}
                          ></div>
                        </div>
                      </div>
                      <div
                        className="cred-edit-button"
                        onClick={() =>
                          toggleUpdateModal(division.divisionId, cred)
                        }
                      >
                        Edit <i class="bi bi-pencil-square"></i>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div
                className="add-credential-button"
                onClick={() => toggleAddModal(division.divisionId)}
              >
                Add a new credential
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomePage;
