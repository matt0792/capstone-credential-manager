// Modal to add a new credential to division 

import "./AddCredModal.css";
import axios from "axios";
import { useState } from "react";

const API_URL = "http://localhost:3000/api/division/credentials";

const AddCredModal = ({ setShowAddModal, selectedDivisionId, refreshPage }) => {
  const [siteName, setSiteName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const hideModal = () => {
    setShowAddModal(false);
  };

  // prevent modal from closing when clicking inside
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  const addDivisionCredential = async (selectedDivisionId) => {
    const token = localStorage.getItem("token");

    if (!siteName || !username || !password) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        API_URL,
        {
          divisionId: selectedDivisionId,
          siteName,
          username,
          password,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Credential added:", response.data);
      hideModal();
    } catch (err) {
      setError("Failed to add credential. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
      refreshPage()
    }
  };

  return (
    <div className="add-cred-modal" onClick={hideModal}>
      <div className="modal-body" onClick={stopPropagation}>
        <div className="modal-title">Add Credential</div>

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
            onClick={() => addDivisionCredential(selectedDivisionId)}
            disabled={loading}
            className="login-button"
          >
            {loading ? "Adding..." : "Add Credential"}
          </button>
          <button onClick={hideModal} className="login-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCredModal;
