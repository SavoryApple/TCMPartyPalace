import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";
import useAutoLogout from "../hooks/useAutoLogout";

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

const COLLECTIONS = [
  { key: "caleherbs", label: "Herbs - CALE" },
  { key: "extraherbs", label: "Herbs - Extra" },
  { key: "nccaomherbs", label: "Herbs - NCCAOM" },
  { key: "caleandnccaomherbs", label: "Herbs - CALE+NCCAOM" },
  { key: "extraformulas", label: "Formulas - Extra" },
  { key: "nccaomformulas", label: "Formulas - NCCAOM" },
  { key: "caleandnccaomformulas", label: "Formulas - CALE+NCCAOM" },
  { key: "herbcategorylist", label: "Herb Category List" },
  { key: "formulacategorylist", label: "Formula Category List" },
  { key: "herbGroupsList", label: "Herb Groups List" },
];

const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";

function pretty(obj) {
  try {
    return JSON.stringify(obj, null, 2);
  } catch {
    return "";
  }
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [collection, setCollection] = useState(COLLECTIONS[0].key);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editJson, setEditJson] = useState("");
  const [addJson, setAddJson] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [refreshFlag, setRefreshFlag] = useState(0);

  // For delete confirmation modal/timer
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [deleteCountdown, setDeleteCountdown] = useState(0);
  const deleteTimerRef = useRef();

  // NavBar height for responsive button positioning
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

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role !== "admin" || !token) {
      navigate("/login");
    }
  }, [navigate]);

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  useAutoLogout(handleLogout);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError("");
      setMessage("");
      setItems([]);
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(
          `${API_URL}/api/data/${collection}`,
          {
            headers: { Authorization: `Bearer ${token}` },
            credentials: "include"
          }
        );
        if (!res.ok) throw new Error("Failed to fetch data");
        const data = await res.json();
        setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError("Error loading data: " + err.message);
      }
      setLoading(false);
    }
    fetchData();
  }, [collection, refreshFlag]);

  function handleEdit(item) {
    setEditId(item._id);
    setEditJson(pretty(item));
    setMessage("");
    setError("");
  }

  async function handleEditSave(e) {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const obj = JSON.parse(editJson);
      const res = await fetch(
        `${API_URL}/api/data/${collection}/${editId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj),
          credentials: "include"
        }
      );
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        throw new Error(data.error || "Failed to update");
      }
      setMessage("✅ Data updated successfully!");
      setEditId(null);
      setEditJson("");
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      setError("Error saving: " + err.message);
    }
  }

  function handleEditCancel() {
    setEditId(null);
    setEditJson("");
    setError("");
    setMessage("");
  }

  function handlePendingDelete(id) {
    setPendingDeleteId(id);
    setDeleteCountdown(3);
    deleteTimerRef.current = setInterval(() => {
      setDeleteCountdown((c) => {
        if (c <= 1) {
          clearInterval(deleteTimerRef.current);
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  }

  function handleCancelPendingDelete() {
    clearInterval(deleteTimerRef.current);
    setPendingDeleteId(null);
    setDeleteCountdown(0);
  }

  async function handleConfirmDelete(id) {
    clearInterval(deleteTimerRef.current);
    setPendingDeleteId(null);
    setDeleteCountdown(0);
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/data/${collection}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
          credentials: "include"
        }
      );
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        throw new Error(data.error || "Failed to delete");
      }
      setMessage("Deleted!");
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      setError("Error deleting: " + err.message);
    }
  }

  async function handleAdd() {
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const obj = JSON.parse(addJson);
      const res = await fetch(
        `${API_URL}/api/data/${collection}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(obj),
          credentials: "include"
        }
      );
      if (!res.ok) {
        let data;
        try {
          data = await res.json();
        } catch {
          data = {};
        }
        throw new Error(data.error || "Failed to add");
      }
      setMessage("Added!");
      setAddJson("");
      setRefreshFlag((f) => f + 1);
    } catch (err) {
      setError("Error adding: " + err.message);
    }
  }

  // Back to Home button styled and positioned below nav bar
  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: navBarHeight + 12,
        right: 16,
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
          fontSize: "1.06em",
          minWidth: 120,
          textAlign: "center"
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );

  // Delete confirmation modal
  const deleteModal = pendingDeleteId ? (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        background: "rgba(0,0,0,0.25)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}
      onClick={handleCancelPendingDelete}
    >
      <div
        style={{
          background: COLORS.backgroundGold,
          borderRadius: "1.2em",
          boxShadow: `0 8px 32px -10px ${COLORS.shadowStrong}`,
          border: `2px solid ${COLORS.accentGold}`,
          padding: "36px 22px 22px 22px",
          maxWidth: 380,
          width: "95vw",
          position: "relative",
          textAlign: "center"
        }}
        onClick={e => e.stopPropagation()}
      >
        <span style={{ fontSize: "2em", color: COLORS.accentCrimson }}>⚠️</span>
        <h2 style={{
          color: COLORS.backgroundRed,
          fontWeight: 900,
          fontSize: "1.23em",
          marginBottom: "0.7em",
          letterSpacing: "-.01em",
        }}>
          Delete Confirmation
        </h2>
        <div style={{ color: COLORS.accentBlack, fontWeight: 600, marginBottom: "0.8em", fontSize: "1.02em" }}>
          Are you sure you want to permanently delete this item?
          <br />
          <span style={{ color: COLORS.accentCrimson, fontWeight: 700 }}>
            This action cannot be undone.
          </span>
        </div>
        <div style={{ marginTop: "1em", marginBottom: "1em", fontWeight: 700, color: COLORS.accentCrimson }}>
          Please wait {deleteCountdown} seconds before confirming.
        </div>
        <button
          onClick={handleCancelPendingDelete}
          style={{
            background: COLORS.accentBlack,
            color: COLORS.backgroundGold,
            border: `2px solid ${COLORS.accentBlack}`,
            borderRadius: "1.1em",
            fontWeight: 700,
            fontSize: "1.05em",
            padding: "8px 24px",
            marginRight: "0.6em",
            cursor: "pointer",
            marginBottom: "2px"
          }}
        >
          Cancel
        </button>
        <button
          onClick={() => handleConfirmDelete(pendingDeleteId)}
          disabled={deleteCountdown > 0}
          style={{
            background: deleteCountdown === 0 ? COLORS.accentCrimson : COLORS.accentGray,
            color: COLORS.backgroundGold,
            border: `2px solid ${COLORS.accentCrimson}`,
            borderRadius: "1.1em",
            fontWeight: 700,
            fontSize: "1.05em",
            padding: "8px 24px",
            cursor: deleteCountdown === 0 ? "pointer" : "not-allowed"
          }}
        >
          {deleteCountdown === 0 ? "Delete" : "Delete (wait)"}
        </button>
      </div>
    </div>
  ) : null;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: `linear-gradient(120deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 65%, ${COLORS.accentGold} 100%)`,
        position: "relative",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column"
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
      {deleteModal}
      {/* Main content area */}
      <div
        style={{
          flex: 1,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "flex-start",
        }}
      >
        <div
          style={{
            background: COLORS.backgroundGold,
            borderRadius: "1.6em",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            padding: "34px 18px",
            minWidth: 280,
            maxWidth: 1200,
            width: "100%",
            textAlign: "center",
            border: `2.5px solid ${COLORS.accentGold}`,
            marginTop: "22px",
            marginBottom: "22px",
            boxSizing: "border-box",
          }}
        >
          <h1
            style={{
              color: COLORS.backgroundRed,
              fontWeight: 900,
              fontSize: "2.2em",
              marginBottom: "0.6em",
              letterSpacing: "-.03em",
              textShadow: `0 2px 14px ${COLORS.accentGold}`,
            }}
          >
            Admin Dashboard
          </h1>
          <div style={{ marginBottom: "1.5em" }}>
            <strong style={{ color: COLORS.accentCrimson }}>Admin Email:</strong>
            <div style={{ color: COLORS.backgroundRed, wordBreak: "break-all", fontSize: "1.07em" }}>
              {localStorage.getItem("email")}
            </div>
          </div>
          <button
            style={{
              background: COLORS.accentGold,
              color: COLORS.backgroundRed,
              border: `2px solid ${COLORS.accentGold}`,
              borderRadius: "1.1em",
              fontWeight: 700,
              fontSize: "1.03em",
              padding: "10px 32px",
              cursor: "pointer",
              boxShadow: `0 2px 10px -2px ${COLORS.accentGold}44`,
              margin: "10px 0 20px 0",
              transition: "background 0.2s",
              width: "100%",
              maxWidth: 300,
            }}
            onClick={handleLogout}
          >
            Logout
          </button>

          {/* Collection Selector */}
          <div style={{ marginBottom: "1em", textAlign: "left" }}>
            <label htmlFor="collection" style={{ fontWeight: 700, color: COLORS.backgroundRed, fontSize: "1.1em" }}>
              Select data type:{" "}
            </label>
            <select
              id="collection"
              value={collection}
              onChange={e => setCollection(e.target.value)}
              style={{
                fontWeight: 700,
                fontSize: "1.1em",
                padding: "0.3em 1.3em",
                borderRadius: "1em",
                border: `2px solid ${COLORS.accentGold}`,
                marginLeft: "1em",
                background: COLORS.accentIvory,
                color: COLORS.backgroundRed,
                boxShadow: `0 2px 8px -2px ${COLORS.accentGold}22`,
                outline: "none",
                minWidth: 180
              }}
            >
              {COLLECTIONS.map(c => (
                <option key={c.key} value={c.key}>{c.label}</option>
              ))}
            </select>
          </div>

          {/* Add new item */}
          <div style={{ marginBottom: "2em", textAlign: "left" }}>
            <h3 style={{ color: COLORS.accentEmerald, fontWeight: 700, fontSize: "1.15em", marginBottom: "0.3em" }}>
              Add new item (raw JSON):
            </h3>
            <textarea
              value={addJson}
              onChange={e => setAddJson(e.target.value)}
              rows={4}
              placeholder='Paste or type valid JSON object here'
              style={{
                width: "100%",
                fontFamily: "monospace",
                fontSize: "1em",
                borderRadius: "1em",
                border: `2px solid ${COLORS.accentEmerald}`,
                padding: "0.7em",
                marginBottom: "0.5em",
                boxSizing: "border-box"
              }}
            />
            <button
              onClick={handleAdd}
              style={{
                background: COLORS.accentEmerald,
                color: COLORS.backgroundGold,
                border: "none",
                borderRadius: "1em",
                fontWeight: 700,
                fontSize: "1.08em",
                padding: "8px 26px",
                boxShadow: `0 2px 10px -2px ${COLORS.accentEmerald}44`,
                cursor: "pointer",
                width: "100%",
                maxWidth: 220
              }}
            >
              Add Item
            </button>
          </div>

          {/* Info messages */}
          {(error || message) && (
            <div style={{
              color: error ? COLORS.accentCrimson : COLORS.accentEmerald,
              fontWeight: 700,
              marginBottom: "1em",
              textAlign: "center"
            }}>
              {error || message}
            </div>
          )}

          {/* Data Table */}
          <div
            style={{
              textAlign: "left",
              overflowX: "auto",
              background: COLORS.accentIvory,
              borderRadius: "1.1em",
              boxShadow: `0 2px 10px -2px ${COLORS.accentGold}22`,
              padding: "1em",
              marginBottom: "2em",
              border: `2px solid ${COLORS.accentGold}`,
              fontSize: "0.98em",
              boxSizing: "border-box"
            }}
          >
            {loading ? (
              <div style={{ color: COLORS.accentCrimson, fontWeight: 700 }}>Loading...</div>
            ) : items.length === 0 ? (
              <div style={{ color: COLORS.accentCrimson, fontWeight: 700 }}>No items found.</div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.98em" }}>
                <thead>
                  <tr style={{ background: COLORS.accentIvory }}>
                    <th style={{ fontWeight: 800, color: COLORS.backgroundRed, padding: "0.6em", borderBottom: `2px solid ${COLORS.accentGold}`, fontSize: "0.97em" }}>
                      ID
                    </th>
                    <th style={{ fontWeight: 800, color: COLORS.backgroundRed, padding: "0.6em", borderBottom: `2px solid ${COLORS.accentGold}`, fontSize: "0.97em" }}>
                      Data (JSON)
                    </th>
                    <th style={{ fontWeight: 800, color: COLORS.backgroundRed, padding: "0.6em", borderBottom: `2px solid ${COLORS.accentGold}`, fontSize: "0.97em" }}>
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map(item => (
                    <tr key={item._id} style={{ borderBottom: `1px solid ${COLORS.accentGold}22` }}>
                      <td style={{ fontWeight: 700, color: COLORS.accentEmerald, padding: "0.7em 0.3em", fontSize: "0.97em", wordBreak: "break-all", minWidth: 70 }}>
                        {item._id}
                      </td>
                      <td style={{ padding: "0.7em 0.3em", minWidth: 170, maxWidth: 380, fontSize: "0.93em" }}>
                        {editId === item._id ? (
                          <form
                            onSubmit={handleEditSave}
                            style={{ width: "100%" }}
                          >
                            <textarea
                              value={editJson}
                              onChange={e => setEditJson(e.target.value)}
                              rows={8}
                              style={{
                                width: "100%",
                                fontFamily: "monospace",
                                fontSize: "1em",
                                borderRadius: "1em",
                                border: `2px solid ${COLORS.accentEmerald}`,
                                padding: "0.7em",
                                boxSizing: "border-box"
                              }}
                            />
                            <div style={{ marginTop: "0.4em", display: "flex", gap: 8 }}>
                              <button
                                type="submit"
                                style={{
                                  background: COLORS.accentEmerald,
                                  color: COLORS.backgroundGold,
                                  border: "none",
                                  borderRadius: "1.1em",
                                  fontWeight: 700,
                                  fontSize: "1.03em",
                                  padding: "7px 18px",
                                  marginRight: "0.5em",
                                  cursor: "pointer",
                                  boxShadow: `0 2px 10px -2px ${COLORS.accentEmerald}44`,
                                  width: "100%"
                                }}
                              >
                                Save
                              </button>
                              <button
                                type="button"
                                onClick={handleEditCancel}
                                style={{
                                  background: COLORS.accentBlack,
                                  color: COLORS.backgroundGold,
                                  border: "none",
                                  borderRadius: "1.1em",
                                  fontWeight: 700,
                                  fontSize: "1.03em",
                                  padding: "7px 18px",
                                  cursor: "pointer",
                                  boxShadow: `0 2px 10px -2px ${COLORS.accentBlack}44`,
                                  width: "100%"
                                }}
                              >
                                Cancel
                              </button>
                            </div>
                          </form>
                        ) : (
                          <pre style={{
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-word",
                            background: COLORS.backgroundGold,
                            borderRadius: "1em",
                            padding: "0.7em",
                            margin: 0,
                            maxHeight: "180px",
                            overflowY: "auto"
                          }}>
                            {pretty(item)}
                          </pre>
                        )}
                      </td>
                      <td style={{ padding: "0.7em 0.3em", minWidth: 90, textAlign: "center" }}>
                        {editId !== item._id && (
                          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                            <button
                              onClick={() => handleEdit(item)}
                              style={{
                                background: COLORS.accentGold,
                                color: COLORS.backgroundRed,
                                border: `2px solid ${COLORS.accentGold}`,
                                borderRadius: "1.1em",
                                fontWeight: 700,
                                fontSize: "1.03em",
                                padding: "7px 18px",
                                marginBottom: "3px",
                                cursor: "pointer",
                                boxShadow: `0 2px 10px -2px ${COLORS.accentGold}44`,
                                width: "100%"
                              }}
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handlePendingDelete(item._id)}
                              style={{
                                background: COLORS.accentCrimson,
                                color: COLORS.backgroundGold,
                                border: `2px solid ${COLORS.accentCrimson}`,
                                borderRadius: "1.1em",
                                fontWeight: 700,
                                fontSize: "1.03em",
                                padding: "7px 18px",
                                cursor: "pointer",
                                boxShadow: `0 2px 10px -2px ${COLORS.accentCrimson}44`,
                                width: "100%"
                              }}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      {/* Footer always at bottom */}
      <div
        style={{
          width: "100vw",
          marginTop: "auto",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <FooterCard />
      </div>
      {/* Responsive styles */}
      <style>
        {`
        @media (max-width: 900px) {
          .back-to-home-btn { right: 8px !important; }
          form, textarea, select, input, table, th, td { font-size: 0.95em !important;}
        }
        @media (max-width: 600px) {
          .back-to-home-btn { right: 2px !important; }
          div[style*="padding: 34px 18px"] {
            padding: 18px 2vw !important;
            min-width: 98vw !important;
            max-width: 99vw !important;
          }
          .card-shadow { min-width: 99vw !important; }
          table { font-size: 0.93em !important;}
        }
        @media (max-width: 420px) {
          div[style*="padding: 34px 18px"] {
            padding: 11px 0.5vw !important;
          }
        }
        `}
      </style>
    </div>
  );
}