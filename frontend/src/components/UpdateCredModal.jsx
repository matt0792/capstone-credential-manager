// modal to update a division's credentials

import "./UpdateCredModal.css";
import axios from "axios";
import { useState } from "react";

const API_URL = "http://localhost:3000/api/division/credentials";

const UpdateCredModal = ({
  setShowUpdateModal,
  selectedDivisionId,
  credDetails,
  refreshPage,
}) => {
  const [siteName, setSiteName] = useState(credDetails.siteName);
  const [username, setUsername] = useState(credDetails.username);
  const [password, setPassword] = useState(credDetails.password);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hideModal = () => {
    setShowUpdateModal(false);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const deleteCred = async (selectedDivisionId) => {
    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(
        "http://localhost:3000/api/division/credentials/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            divisionId: selectedDivisionId,
            credentialId: credDetails.credentialId,
          },
        }
      );

      console.log("Credential deleted:", response.data);
      setError("Credential deleted successfully!");
      hideModal();
    } catch (err) {
      console.error("Error deleting credential:", err.message);
      setError(err.message);
    } finally {
      setLoading(false);
      refreshPage();
    }
  };

  const updateDivisionCredential = async (selectedDivisionId) => {
    if (!siteName || !username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        API_URL,
        {
          divisionId: selectedDivisionId,
          credentialId: credDetails.credentialId,
          siteName,
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Credential updated:", response.data);
      hideModal();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      refreshPage();
    }
  };

  return (
    <div className="update-cred-modal" onClick={hideModal}>
      <div className="modal-body" onClick={stopPropagation}>
        <div className="modal-title">Update Credential</div>

        {error && <p className="error-message">{error}</p>}

        <label>Site Name</label>
        <input
          type="text"
          className="login-form-input"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          placeholder="Enter site name"
        />

        <label>Username</label>
        <input
          type="text"
          className="login-form-input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />

        <label>Password</label>
        <input
          type="password"
          className="login-form-input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />

        <div className="modal-buttons">
          <button
            onClick={() => updateDivisionCredential(selectedDivisionId)}
            disabled={loading}
            className="login-button"
          >
            {loading ? "Updating..." : "Update Credential"}
          </button>
          <button
            onClick={() => deleteCred(selectedDivisionId)}
            disabled={loading}
            className="login-button"
          >
            {loading ? "Deleting..." : "Delete Credential"}
          </button>
          <button onClick={hideModal} className="login-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default UpdateCredModal;
