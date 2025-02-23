import "./RegisterPage.css";
import { useState, useEffect } from "react";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    role: "normal",
    organizationalUnits: [{ ouId: "", divisionId: "" }],
  });

  const [ous, setOUs] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

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
        setOUs(data.organizationalUnits); // Ensure to access the `organizationalUnits` array
      } catch (error) {
        setError(error.message);
      }
    };

    getOUsAndDivisions();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleOUChange = (index, e) => {
    const { name, value } = e.target;
    const updatedOUs = [...formData.organizationalUnits];
    updatedOUs[index][name] = value;

    // Reset the divisionId when OU changes to ensure consistency
    if (name === "ouId") {
      updatedOUs[index].divisionId = ""; // Reset divisionId
    }

    setFormData({ ...formData, organizationalUnits: updatedOUs });
  };

  const addOU = () => {
    setFormData({
      ...formData,
      organizationalUnits: [
        ...formData.organizationalUnits,
        { ouId: "", divisionId: "" },
      ],
    });
  };

  const removeOU = (index) => {
    const updatedOUs = formData.organizationalUnits.filter(
      (_, i) => i !== index
    );
    setFormData({ ...formData, organizationalUnits: updatedOUs });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch(
        "http://localhost:3000/api/employee/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      setSuccess("Employee registered successfully!");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="register-header">Register Employee</div>
        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            className="register-input"
            name="name"
            placeholder="Full Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            className="register-input"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            className="register-input"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <select
            className="register-input"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="normal">Normal</option>
            <option value="management">Management</option>
            <option value="admin">Admin</option>
          </select>

          <div className="register-header ou-reg-header">
            Organizational Units
          </div>
          <div className="add-ou-container">
            {formData.organizationalUnits.map((unit, index) => (
              <div key={index} className="ou-group">
                <select
                  className="register-input"
                  name="ouId"
                  value={unit.ouId}
                  onChange={(e) => handleOUChange(index, e)}
                  required
                >
                  <option value="">Select OU</option>
                  {ous.map((ou) => (
                    <option key={ou.ouId} value={ou.ouId}>
                      {ou.ouName}
                    </option>
                  ))}
                </select>

                <select
                  className="register-input"
                  name="divisionId"
                  value={unit.divisionId}
                  onChange={(e) => handleOUChange(index, e)}
                  required
                >
                  <option value="">Select Division</option>
                  {ous
                    .find((ou) => ou.ouId === unit.ouId)
                    ?.divisions.map((division) => (
                      <option
                        key={division.divisionId}
                        value={division.divisionId}
                      >
                        {division.divisionName}
                      </option>
                    )) || []}
                </select>

                {/* Remove button for OU */}
                {formData.organizationalUnits.length > 1 && (
                  <button
                    type="button"
                    className="gen-button"
                    onClick={() => removeOU(index)}
                  >
                    Remove OU
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Add new ou and division pair */}
          <button type="button" className="register-btn" onClick={addOU}>
            Add Organizational Unit
          </button>

          <button type="submit" className="register-btn">
            Register
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
