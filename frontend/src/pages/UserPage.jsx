// user personal info page

import useEmployeeData from "../hooks/useEmployeeData";
import "./UserPage.css";

const UserPage = () => {
  const { data, loading, error } = useEmployeeData();

  if (loading)
    return (
      <div className="home-load">
        <div className="home-load-icon">Loading...</div>
      </div>
    );
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="user-page">
      <div className="user-page-content">
        <div className="info-title">Personal Info: </div>
        <div className="user-info-item">
          <strong>Name:</strong> {data.user.name}
        </div>
        <div className="user-info-item">
          <strong>Username:</strong> {data.user.username}
        </div>
        <div className="user-info-item">
          <strong>Role:</strong> {data.user.role}
        </div>
        <div className="info-title">Organizational Units: </div>
        {data.user.organizationalUnits.map((ou, index) => (
          <div key={index} className="user-info-item">
            <div className="info-sub-item">
              {ou.ouName}
              <i className="bi bi-caret-right-fill"></i>
              {ou.divisionName}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserPage;
