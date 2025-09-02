import React, { useState, useRef, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";

// Use the same colors as App.js
const COLORS = {
  backgroundRed: "#9A2D1F",
  backgroundGold: "#F9E8C2",
  accentGold: "#D4AF37",
  accentDarkGold: "#B38E3F",
  accentBlack: "#44210A",
  accentCrimson: "#C0392B",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
  accentBlue: "#2176AE",
  accentGray: "#D9C8B4",
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
};

const NAVBAR_HEIGHT = 84;

const API_URL =
  process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Track actual rendered navbar height for correct button positioning
  const navBarRef = useRef();
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);

  useLayoutEffect(() => {
    function updateHeight() {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight || NAVBAR_HEIGHT);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.user.role || "admin");
        localStorage.setItem("email", data.user.email || email);

        if ((data.user.role || "admin") === "admin") {
          navigate("/admin");
        } else {
          navigate("/");
        }
      } else {
        setError(
          data.message || data.error || "Login failed. Please try again."
        );
      }
    } catch (err) {
      setError("Network error. Please try again.");
    }
    setLoading(false);
  };

  // Back to Home button styled and positioned below nav bar (matches ReportBug.js)
  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: navBarHeight + 12, // 12px below nav bar
        right: 32,
        zIndex: 101,
        display: "flex",
        justifyContent: "flex-end",
      }}
      className="back-to-home-btn"
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-accentEmerald"
        style={{
          background: COLORS.accentGold,
          color: COLORS.backgroundRed,
          border: `2px solid ${COLORS.accentBlack}`,
          textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 65%, ${COLORS.accentGold} 100%)`,
        position: "relative",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        overflowX: "hidden"
      }}
    >
      {/* Navbar */}
      <div
        ref={navBarRef}
        style={{
          width: "100vw",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 100,
          background: COLORS.backgroundRed,
          boxShadow: `0 2px 16px -6px ${COLORS.shadowStrong}`,
          minHeight: NAVBAR_HEIGHT,
        }}
      >
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
      </div>
      {/* Spacer for navbar */}
      <div style={{ height: navBarHeight, width: "100vw", minHeight: navBarHeight }}></div>
      {backToHomeButton}
      {/* Centered login form */}
      <div
        className="flex items-center justify-center"
        style={{
          minHeight: "calc(100vh - 140px)",
          width: "100vw",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: COLORS.backgroundGold,
            borderRadius: "1.6em",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            padding: "40px 38px",
            minWidth: 320,
            maxWidth: 400,
            width: "100%",
            border: `2.5px solid ${COLORS.accentGold}`,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
          }}
        >
          <h2
            style={{
              color: COLORS.backgroundRed,
              fontWeight: 900,
              fontSize: "2em",
              marginBottom: "0.6em",
              letterSpacing: "-.03em",
              textAlign: "center",
              textShadow: `0 2px 14px ${COLORS.accentGold}`,
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            }}
          >
            Admin Login
          </h2>
          <div style={{ marginBottom: "1em" }}>
            <label
              htmlFor="email"
              style={{
                fontWeight: 700,
                color: COLORS.accentBlack,
                display: "block",
                marginBottom: "0.3em",
                fontSize: "1.05em"
              }}
            >
              Email:
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
                border: `2px solid ${COLORS.accentGold}`,
                fontSize: "1em",
                outline: "none",
                marginBottom: "0.2em",
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                background: COLORS.accentIvory,
                color: COLORS.backgroundRed,
                boxShadow: `0 1px 8px -5px ${COLORS.shadowStrong}`
              }}
            />
          </div>
          <div style={{ marginBottom: "1.6em" }}>
            <label
              htmlFor="password"
              style={{
                fontWeight: 700,
                color: COLORS.accentBlack,
                display: "block",
                marginBottom: "0.3em",
                fontSize: "1.05em"
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
                border: `2px solid ${COLORS.accentGold}`,
                fontSize: "1em",
                outline: "none",
                marginBottom: "0.2em",
                fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                background: COLORS.accentIvory,
                color: COLORS.backgroundRed,
                boxShadow: `0 1px 8px -5px ${COLORS.shadowStrong}`
              }}
            />
          </div>
          {error && (
            <div
              style={{
                color: COLORS.accentCrimson,
                fontWeight: 700,
                marginBottom: "1em",
                textAlign: "center",
                background: COLORS.accentIvory,
                borderRadius: "1em",
                border: `2px solid ${COLORS.accentCrimson}`,
                boxShadow: `0 2px 10px -2px ${COLORS.accentCrimson}44`,
                padding: "0.5em 0.7em",
              }}
            >
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.97em",
              borderRadius: "1.1em",
              border: `2px solid ${COLORS.accentGold}`,
              background: COLORS.accentGold,
              color: COLORS.backgroundRed,
              fontWeight: 900,
              fontSize: "1.09em",
              boxShadow: `0 2px 10px -2px ${COLORS.accentGold}44`,
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              letterSpacing: "-.01em",
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
      {/* Footer */}
      <div style={{ marginTop: 64 }}>
        <FooterCard />
      </div>
    </div>
  );
}