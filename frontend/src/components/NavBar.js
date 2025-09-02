import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";

const COLORS = {
  backgroundRed: "#9A2D1F",
  accentGold: "#D4AF37",
  accentBlack: "#44210A",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
  accentDarkGold: "#B38E3F",
  shadowStrong: "#B38E3FCC",
};

export default function NavBar({
  showReportError = false,
  showAbout = false,
  showAdminButtons = false,
  showBackToHome = false,
  showLogo = true,
  fixed = false,
  backToHomeOutsideMenu = false,
}) {
  const navigate = useNavigate();
  const isAdmin =
    localStorage.getItem("role") === "admin" &&
    localStorage.getItem("token");

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  const navBarHeight = windowWidth <= 700 ? 74 : 84;
  const isMobile = windowWidth < 600;

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const handleHamburgerClick = (e) => {
    e.stopPropagation();
    setMenuOpen((open) => !open);
  };

  useEffect(() => {
    if (!menuOpen) return;
    function handleClick(e) {
      if (
        document.getElementById("nav-hamburger-btn") &&
        document.getElementById("nav-hamburger-btn").contains(e.target)
      ) {
        return;
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }, [menuOpen, isMobile]);

  // Helper to use absolute navigation for menu buttons
  const goTo = (path) => {
    setMenuOpen(false);
    // Use absolute path for top-level navigation
    if (path.startsWith("/")) {
      navigate(path);
    } else {
      navigate("/" + path);
    }
  };

  return (
    <header
      className="navbar-header shadow-lg animate-fadeInScaleUp"
      style={{
        background: "rgba(166,44,26,0.92)",
        borderBottom: `5px double ${COLORS.accentGold}`,
        position: fixed ? "fixed" : "relative",
        top: fixed ? 0 : undefined,
        left: fixed ? 0 : undefined,
        zIndex: 100,
        width: "100vw",
        minWidth: "100vw",
        maxWidth: "100vw",
        boxSizing: "border-box",
        height: `${navBarHeight}px`,
        minHeight: `${navBarHeight}px`,
        maxHeight: `${navBarHeight}px`,
        overflow: "hidden",
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        padding: isMobile ? "0 0.5em" : "0 2em",
      }}
    >
      {/* Logo section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          height: "100%",
          maxHeight: "100%",
        }}
      >
        {showLogo && (
          <Logo
            size={isMobile ? 40 : 60}
            showBeta={true}
            style={{
              marginRight: isMobile ? 0 : "1em",
              marginBottom: isMobile ? "0.5em" : 0,
              filter: "drop-shadow(0 2px 7px #C9A052)",
              maxHeight: `${navBarHeight - 10}px`,
              height: "auto",
            }}
          />
        )}
      </div>
      {/* Back to Home always outside hamburger menu if requested */}
      {showBackToHome && backToHomeOutsideMenu && (
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105"
          style={{
            background: COLORS.accentGold,
            color: COLORS.backgroundRed,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            border: "none",
            fontWeight: 700,
            fontSize: "1em",
            boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
            minWidth: "110px",
            height: "38px",
            display: "inline-block",
            textAlign: "center",
            zIndex: 102,
            marginLeft: isMobile ? "0.1em" : "2em",
          }}
        >
          Back to Home
        </Link>
      )}
      {/* Hamburger icon for mobile */}
      {isMobile ? (
        <div style={{ height: "100%", display: "flex", alignItems: "center", position: "relative" }}>
          <button
            id="nav-hamburger-btn"
            aria-label={menuOpen ? "Close navigation" : "Open navigation"}
            onClick={handleHamburgerClick}
            style={{
              background: "none",
              border: "none",
              fontSize: "2em",
              color: COLORS.accentGold,
              cursor: "pointer",
              padding: "0 0.3em",
              lineHeight: 1,
              zIndex: 102,
            }}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
          {/* Slide-down menu */}
          {menuOpen && (
            <div
              ref={menuRef}
              style={{
                position: "fixed",
                top: navBarHeight,
                left: 0,
                width: "100vw",
                background: COLORS.backgroundRed,
                boxShadow: `0 4px 16px -6px ${COLORS.shadowStrong}`,
                zIndex: 101,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                padding: "0.5em 1em",
                gap: "0.7em",
                maxHeight: "calc(100vh - 74px)",
                overflowY: "auto",
              }}
            >
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: 0,
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.7em",
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  width: "100%",
                }}
              >
                {/* Only include Back to Home in hamburger menu if NOT outside */}
                {showBackToHome && !backToHomeOutsideMenu && (
                  <li>
                    <Link
                      to="/"
                      className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105"
                      style={{
                        background: COLORS.accentGold,
                        color: COLORS.backgroundRed,
                        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                        border: "none",
                        fontWeight: 700,
                        fontSize: "1em",
                        boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                        width: "100%",
                        display: "inline-block",
                        textAlign: "center",
                        marginBottom: "0.5em",
                      }}
                      onClick={() => setMenuOpen(false)}
                    >
                      Back to Home
                    </Link>
                  </li>
                )}
                {showReportError && (
                  <li>
                    <button
                      style={{
                        color: COLORS.accentGold,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        font: "inherit",
                        padding: 0,
                        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                        fontSize: "1.1em",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onClick={() => goTo("report")}
                    >
                      Report an Error
                    </button>
                  </li>
                )}
                {showAbout && (
                  <li>
                    <button
                      style={{
                        color: COLORS.accentGold,
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        font: "inherit",
                        padding: 0,
                        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                        fontSize: "1.1em",
                        width: "100%",
                        textAlign: "left",
                      }}
                      onClick={() => goTo("about")}
                    >
                      About
                    </button>
                  </li>
                )}
                {showAdminButtons && (
                  !isAdmin ? (
                    <>
                      <li>
                        <button
                          style={{
                            background: COLORS.accentGold,
                            color: COLORS.backgroundRed,
                            border: "none",
                            borderRadius: "1.3em",
                            fontWeight: 700,
                            fontSize: "1em",
                            padding: "8px 26px",
                            cursor: "pointer",
                            boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                            width: "100%",
                            marginBottom: "0.5em",
                            textAlign: "left",
                          }}
                          className="hover:bg-accentDarkGold"
                          onClick={() => goTo("login")}
                        >
                          Admin Login
                        </button>
                      </li>
                      <li>
                        <button
                          style={{
                            background: COLORS.accentBlack,
                            color: COLORS.accentGold,
                            border: "none",
                            borderRadius: "1.3em",
                            fontWeight: 700,
                            fontSize: "1em",
                            padding: "8px 26px",
                            cursor: "pointer",
                            boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                            width: "100%",
                            marginBottom: "0.5em",
                            textAlign: "left",
                          }}
                          className="hover:bg-backgroundRed"
                          onClick={() => goTo("register")}
                        >
                          Register Admin
                        </button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <button
                        style={{
                          background: COLORS.accentEmerald,
                          color: COLORS.accentIvory,
                          border: "none",
                          borderRadius: "1.3em",
                          fontWeight: 700,
                          fontSize: "1em",
                          padding: "8px 26px",
                          cursor: "pointer",
                          boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                          width: "100%",
                          marginBottom: "0.5em",
                          textAlign: "left",
                        }}
                        className="hover:bg-backgroundRed"
                        onClick={() => goTo("admin")}
                      >
                        Admin Dashboard
                      </button>
                    </li>
                  )
                )}
              </ul>
            </div>
          )}
        </div>
      ) : (
        // Desktop nav layout
        <nav
          style={{
            display: "flex",
            alignItems: "center",
            height: "100%",
            maxHeight: "100%",
            overflow: "hidden",
            flexWrap: "wrap",
            gap: "1em",
          }}
        >
          <ul
            className="flex font-semibold"
            style={{
              margin: 0,
              padding: 0,
              flexDirection: "row",
              flexWrap: "wrap",
              fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
              display: showReportError || showAbout ? "flex" : "none",
              gap: "2em",
              alignItems: "center",
            }}
          >
            {showReportError && (
              <li>
                <button
                  style={{
                    color: COLORS.accentGold,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    padding: 0,
                    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                    height: "38px",
                  }}
                  onClick={() => goTo("report")}
                >
                  Report an Error
                </button>
              </li>
            )}
            {showAbout && (
              <li>
                <button
                  style={{
                    color: COLORS.accentGold,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    font: "inherit",
                    padding: 0,
                    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                    height: "38px",
                  }}
                  onClick={() => goTo("about")}
                >
                  About
                </button>
              </li>
            )}
          </ul>
          <div style={{
            display: "flex",
            flexDirection: "row",
            gap: "1em",
            alignItems: "center",
            whiteSpace: "nowrap",
          }}>
            {showAdminButtons && (
              !isAdmin ? (
                <>
                  <button
                    style={{
                      background: COLORS.accentGold,
                      color: COLORS.backgroundRed,
                      border: "none",
                      borderRadius: "1.3em",
                      fontWeight: 700,
                      fontSize: "1em",
                      padding: "8px 26px",
                      cursor: "pointer",
                      boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                      height: "38px",
                      minWidth: "110px",
                    }}
                    className="hover:bg-accentDarkGold"
                    onClick={() => goTo("login")}
                  >
                    Admin Login
                  </button>
                  <button
                    style={{
                      background: COLORS.accentBlack,
                      color: COLORS.accentGold,
                      border: "none",
                      borderRadius: "1.3em",
                      fontWeight: 700,
                      fontSize: "1em",
                      padding: "8px 26px",
                      cursor: "pointer",
                      boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                      height: "38px",
                      minWidth: "110px",
                    }}
                    className="hover:bg-backgroundRed"
                    onClick={() => goTo("register")}
                  >
                    Register Admin
                  </button>
                </>
              ) : (
                <button
                  style={{
                    background: COLORS.accentEmerald,
                    color: COLORS.accentIvory,
                    border: "none",
                    borderRadius: "1.3em",
                    fontWeight: 700,
                    fontSize: "1em",
                    padding: "8px 26px",
                    cursor: "pointer",
                    boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                    height: "38px",
                    minWidth: "110px",
                  }}
                  className="hover:bg-backgroundRed"
                  onClick={() => goTo("admin")}
                >
                  Admin Dashboard
                </button>
              )
            )}
            {showBackToHome && backToHomeOutsideMenu && (
              <Link
                to="/"
                className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105"
                style={{
                  background: COLORS.accentGold,
                  color: COLORS.backgroundRed,
                  fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                  border: "none",
                  fontWeight: 700,
                  fontSize: "1em",
                  boxShadow: `0 3px 8px -2px ${COLORS.shadowStrong}`,
                  minWidth: "110px",
                  height: "38px",
                  display: "inline-block",
                  textAlign: "center",
                  marginLeft: "2em",
                }}
              >
                Back to Home
              </Link>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}