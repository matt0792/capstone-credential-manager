// login page 

import { useState } from "react";
import axios from "axios";
import "./LoginPage.css";

const API_URL = "http://localhost:3000/api/employee/login";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(API_URL, { username, password });
      const { token } = response.data;

      // store token
      localStorage.setItem("token", token);

      window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="login-title">Welcome Back</div>
          {error && <div className="login-error">{error}</div>}

          <div className="login-form-group">
            <input
              className="login-form-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          <div className="login-form-group">
            <input
              className="login-form-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
