import React, { useState, useContext, useEffect } from "react";
import { register } from "../api/authApi";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const RegistrationForm = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("user");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const authContext = useContext(AuthContext);
  const navigate = useNavigate();

  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{6,}$/;

  useEffect(() => {
    setError("");
  }, [username, email]);

  useEffect(() => {
    if (authContext?.user) {
      navigate("/dashboard", { replace: true });
    }
  }, [authContext?.user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    if (!email || !password || !username || !confirmPassword || !role) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    if (!passwordRegex.test(password)) {
      setError(
        "Password must be at least 6 characters long and include 1 uppercase letter, 1 number, and 1 special character (!@#$%^&*)",
      );
      setLoading(false);
      return;
    }

    if (confirmPassword !== password) {
      setError("Passwords must match");
      setLoading(false);
      return;
    }

    try {
      const response = await register(email, password, username, role);
      if (!response.data.access_token || !response.data.refresh_token) {
        throw new Error("Invalid tokens received from the server");
      }

      authContext?.login(
        response.data.access_token,
        response.data.refresh_token,
      );
      setSuccessMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error: any) {
      console.error("Registration error:", error);
      if (error.response) {
        setError(error.response.data.message || "Server error");
      } else if (error.request) {
        setError("Server is not responding. Please try again later.");
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[85vh] bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center mb-4">Registration</h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Confirm Password</label>
            <input
              type="password"
              placeholder="Enter password again"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            >
              <option value="user">User</option>
              <option value="organizer">Organizer</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        {successMessage && (
          <p className="text-green-500 text-center mt-4">{successMessage}</p>
        )}
      </div>
    </div>
  );
};

export default RegistrationForm;
