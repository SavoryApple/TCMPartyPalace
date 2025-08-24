import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
};

// PATCH: Update for Fly.io API endpoint
const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin"); // Default to admin for your use-case
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! You can now log in as admin.");
        setTimeout(() => navigate("/login"), 1500);
      } else {
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen"
      style={{
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`,
        position: "relative",
      }}
    >
      {/* Back to Home button (top right, matching LoginPage and herbCard.js) */}
      <div className="fixed top-8 right-10 z-40">
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            border: `2.5px solid ${COLORS.seal}`,
            boxShadow: `0 6px 40px -8px ${COLORS.violet}66`,
          }}
        >
          Back to Home
        </Link>
      </div>
      <form
        onSubmit={handleSubmit}
        style={{
          background: COLORS.vanilla,
          borderRadius: "1.6em",
          boxShadow: `0 4px 40px -8px ${COLORS.violet}66`,
          padding: "38px 40px",
          minWidth: 320,
          maxWidth: 400,
          width: "100%",
        }}
      >
        <h2
          style={{
            color: COLORS.violet,
            fontWeight: 900,
            fontSize: "2em",
            marginBottom: "0.6em",
            letterSpacing: "-.03em",
            textAlign: "center",
          }}
        >
          Register Admin
        </h2>
        <div style={{ marginBottom: "1em" }}>
          <label
            htmlFor="email"
            style={{
              fontWeight: 700,
              color: COLORS.seal,
              display: "block",
              marginBottom: "0.3em",
            }}
          >
            Admin Email:
          </label>
          <input
            id="email"
            type="email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: "100%",
              padding: "0.7em",
              borderRadius: "1em",
              border: `2px solid ${COLORS.violet}`,
              fontSize: "1em",
              outline: "none",
              marginBottom: "0.2em",
            }}
          />
        </div>
        <div style={{ marginBottom: "1.6em" }}>
          <label
            htmlFor="password"
            style={{
              fontWeight: 700,
              color: COLORS.seal,
              display: "block",
              marginBottom: "0.3em",
            }}
          >
            Password:
          </label>
          <input
            id="password"
            type="password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: "100%",
              padding: "0.7em",
              borderRadius: "1em",
              border: `2px solid ${COLORS.violet}`,
              fontSize: "1em",
              outline: "none",
              marginBottom: "0.2em",
            }}
          />
        </div>
        {/* Hidden role field for admin only */}
        <input type="hidden" value={role} />
        {error && (
          <div
            style={{
              color: COLORS.claret,
              fontWeight: 700,
              marginBottom: "1em",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}
        {success && (
          <div
            style={{
              color: COLORS.carolina,
              fontWeight: 700,
              marginBottom: "1em",
              textAlign: "center",
            }}
          >
            {success}
          </div>
        )}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "0.9em",
            borderRadius: "1.1em",
            border: "none",
            background: COLORS.violet,
            color: COLORS.vanilla,
            fontWeight: 700,
            fontSize: "1.09em",
            boxShadow: `0 2px 10px -2px ${COLORS.violet}44`,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background 0.2s",
          }}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div style={{ textAlign: "center", marginTop: "1em" }}>
          <span style={{ color: COLORS.seal }}>
            Already have an account?{" "}
            <button
              type="button"
              style={{
                background: "none",
                border: "none",
                color: COLORS.violet,
                fontWeight: 700,
                cursor: "pointer",
                textDecoration: "underline",
                fontSize: "1em",
              }}
              onClick={() => navigate("/login")}
            >
              Login here
            </button>
          </span>
        </div>
      </form>
    </div>
  );
}