import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
  shadowStrong: "#7C5CD399",
};

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

  useEffect(() => {
    const role = localStorage.getItem("role");
    const token = localStorage.getItem("token");
    if (role !== "admin" || !token) {
      navigate("/login");
    }
  }, [navigate]);

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
          { headers: { Authorization: `Bearer ${token}` } }
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
    e.preventDefault(); // Don't reload page
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

  async function handleDelete(id) {
    if (!window.confirm("Delete this item?")) return;
    setError("");
    setMessage("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${API_URL}/api/data/${collection}/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
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

  function handleLogout() {
    localStorage.clear();
    navigate("/login");
  }

  return (
    <div
      className="flex flex-col items-center justify-center min-h-screen"
      style={{
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 50%, ${COLORS.violet} 100%)`,
        padding: "34px 10px 24px 10px",
        position: "relative",
      }}
    >
      {/* Back to Home button */}
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

      <div
        style={{
          background: COLORS.vanilla,
          borderRadius: "1.6em",
          boxShadow: `0 4px 40px -8px ${COLORS.violet}66`,
          padding: "38px 40px",
          minWidth: 320,
          maxWidth: 1200,
          width: "100%",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: COLORS.violet,
            fontWeight: 900,
            fontSize: "2.2em",
            marginBottom: "0.6em",
            letterSpacing: "-.03em",
          }}
        >
          Admin Dashboard
        </h1>
        <div style={{ marginBottom: "1.5em" }}>
          <strong style={{ color: COLORS.claret }}>Admin Email:</strong>
          <div style={{ color: COLORS.violet, wordBreak: "break-all" }}>
            {localStorage.getItem("email")}
          </div>
        </div>
        <button
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            border: "none",
            borderRadius: "1.1em",
            fontWeight: 700,
            fontSize: "1.03em",
            padding: "10px 32px",
            cursor: "pointer",
            boxShadow: `0 2px 10px -2px ${COLORS.violet}44`,
            margin: "10px 0 20px 0",
            transition: "background 0.2s",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>

        {/* Collection Selector */}
        <div style={{ marginBottom: "1em" }}>
          <label htmlFor="collection" style={{ fontWeight: 700, color: COLORS.violet, fontSize: "1.1em" }}>
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
              border: `2px solid ${COLORS.violet}`,
              marginLeft: "1em",
              background: COLORS.vanilla,
              color: COLORS.seal,
              boxShadow: `0 2px 8px -2px ${COLORS.violet}22`,
              outline: "none"
            }}
          >
            {COLLECTIONS.map(c => (
              <option key={c.key} value={c.key}>{c.label}</option>
            ))}
          </select>
        </div>

        {/* Add new item */}
        <div style={{ marginBottom: "2em", textAlign: "left" }}>
          <h3 style={{ color: COLORS.carolina, fontWeight: 700, fontSize: "1.15em", marginBottom: "0.3em" }}>
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
              border: `2px solid ${COLORS.carolina}`,
              padding: "0.7em",
              marginBottom: "0.5em"
            }}
          />
          <button
            onClick={handleAdd}
            style={{
              background: COLORS.carolina,
              color: COLORS.vanilla,
              border: "none",
              borderRadius: "1em",
              fontWeight: 700,
              fontSize: "1.08em",
              padding: "8px 26px",
              boxShadow: `0 2px 10px -2px ${COLORS.carolina}44`,
              cursor: "pointer"
            }}
          >
            Add Item
          </button>
        </div>

        {/* Info messages */}
        {(error || message) && (
          <div style={{
            color: error ? COLORS.claret : COLORS.carolina,
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
            background: "#fff",
            borderRadius: "1.1em",
            boxShadow: `0 2px 10px -2px ${COLORS.violet}22`,
            padding: "1em",
            marginBottom: "2em",
          }}
        >
          {loading ? (
            <div style={{ color: COLORS.claret, fontWeight: 700 }}>Loading...</div>
          ) : items.length === 0 ? (
            <div style={{ color: COLORS.claret, fontWeight: 700 }}>No items found.</div>
          ) : (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: COLORS.vanilla }}>
                  <th style={{ fontWeight: 800, color: COLORS.violet, padding: "0.6em", borderBottom: `2px solid ${COLORS.violet}` }}>
                    ID
                  </th>
                  <th style={{ fontWeight: 800, color: COLORS.violet, padding: "0.6em", borderBottom: `2px solid ${COLORS.violet}` }}>
                    Data (JSON)
                  </th>
                  <th style={{ fontWeight: 800, color: COLORS.violet, padding: "0.6em", borderBottom: `2px solid ${COLORS.violet}` }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item._id} style={{ borderBottom: `1px solid ${COLORS.violet}22` }}>
                    <td style={{ fontWeight: 700, color: COLORS.carolina, padding: "0.7em 0.3em", fontSize: "0.97em", wordBreak: "break-all", minWidth: 70 }}>
                      {item._id}
                    </td>
                    <td style={{ padding: "0.7em 0.3em", minWidth: 250, maxWidth: 480, fontSize: "0.92em" }}>
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
                              border: `2px solid ${COLORS.carolina}`,
                              padding: "0.7em"
                            }}
                          />
                          <div style={{ marginTop: "0.4em" }}>
                            <button
                              type="submit"
                              style={{
                                background: COLORS.carolina,
                                color: COLORS.vanilla,
                                border: "none",
                                borderRadius: "1.1em",
                                fontWeight: 700,
                                fontSize: "1.03em",
                                padding: "7px 18px",
                                marginRight: "0.5em",
                                cursor: "pointer",
                                boxShadow: `0 2px 10px -2px ${COLORS.carolina}44`
                              }}
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCancel}
                              style={{
                                background: COLORS.seal,
                                color: COLORS.vanilla,
                                border: "none",
                                borderRadius: "1.1em",
                                fontWeight: 700,
                                fontSize: "1.03em",
                                padding: "7px 18px",
                                cursor: "pointer",
                                boxShadow: `0 2px 10px -2px ${COLORS.seal}44`
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
                          background: "#f5f5f5",
                          borderRadius: "1em",
                          padding: "0.7em",
                          margin: 0,
                          maxHeight: "240px",
                          overflowY: "auto"
                        }}>
                          {pretty(item)}
                        </pre>
                      )}
                    </td>
                    <td style={{ padding: "0.7em 0.3em", minWidth: 100, textAlign: "center" }}>
                      {editId !== item._id && (
                        <>
                          <button
                            onClick={() => handleEdit(item)}
                            style={{
                              background: COLORS.violet,
                              color: COLORS.vanilla,
                              border: "none",
                              borderRadius: "1.1em",
                              fontWeight: 700,
                              fontSize: "1.03em",
                              padding: "7px 18px",
                              marginRight: "0.5em",
                              cursor: "pointer",
                              boxShadow: `0 2px 10px -2px ${COLORS.violet}44`
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item._id)}
                            style={{
                              background: COLORS.claret,
                              color: COLORS.vanilla,
                              border: "none",
                              borderRadius: "1.1em",
                              fontWeight: 700,
                              fontSize: "1.03em",
                              padding: "7px 18px",
                              cursor: "pointer",
                              boxShadow: `0 2px 10px -2px ${COLORS.claret}44`
                            }}
                          >
                            Delete
                          </button>
                        </>
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
  );
}