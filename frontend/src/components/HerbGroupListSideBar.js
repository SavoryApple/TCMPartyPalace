import React from "react";

// Updated COLORS for main site palette
const COLORS = {
  backgroundGold: "#F9E8C2",
  accentGold: "#D4AF37",
  accentBlue: "#2176AE",
  accentCrimson: "#C0392B",
  accentBlack: "#44210A",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
};

const SIDEBAR_WIDTH = 300;

export default function HerbGroupListSideBar({
  groups,
  activeCategory,
  handleCategoryScroll,
  sidebarRef,
  isSidebarHovered,
  setIsSidebarHovered,
  sidebarTop // dynamically passed prop for offset
}) {
  return (
    <aside
      ref={sidebarRef}
      className="sidebar hidden md:flex flex-col"
      style={{
        position: "fixed",
        top: `${sidebarTop}px`,
        left: 0,
        width: SIDEBAR_WIDTH,
        height: `calc(100vh - ${sidebarTop}px)`,
        overflowY: "auto",
        background: `linear-gradient(160deg, ${COLORS.backgroundGold} 80%, ${COLORS.accentIvory} 100%)`,
        borderRadius: "2em",
        border: `2.5px solid ${COLORS.accentGold}`,
        boxShadow: `0 0 24px -8px ${COLORS.accentGold}44`,
        zIndex: 20,
        marginTop: "0.5em",
        marginBottom: "0.5em",
        paddingTop: "0",
        scrollbarWidth: "thin",
        scrollbarColor: `${COLORS.accentGold} ${COLORS.backgroundGold}`,
        transition: "box-shadow 0.2s, top 0.2s, height 0.2s",
      }}
      onMouseEnter={() => setIsSidebarHovered(true)}
      onMouseLeave={() => setIsSidebarHovered(false)}
    >
      <nav className="py-8 px-2">
        <h2
          className="text-lg font-bold mb-4 pl-2"
          style={{
            color: COLORS.accentGold,
            letterSpacing: "-.01em",
            textShadow: `0 1px 0 ${COLORS.accentIvory}`,
            borderLeft: `6px solid ${COLORS.accentGold}`,
            paddingLeft: "0.5em",
          }}
        >
          Groups
        </h2>
        <ul className="space-y-2">
          {groups.map((group, idx) => (
            <li key={group.category + "-" + idx}>
              <button
                data-category={group.category}
                onClick={() => handleCategoryScroll(group.category)}
                className={[
                  "w-full text-left px-3 py-2 rounded transition-colors font-semibold hover:bg-accentGold/20",
                  activeCategory === group.category
                    ? "bg-accentGold/30 text-accentBlue font-extrabold shadow"
                    : "",
                  "focus-visible:ring-2 focus-visible:ring-accentEmerald",
                ].join(" ")}
                style={{
                  color: COLORS.accentBlue,
                  cursor: "pointer",
                  fontWeight: 700,
                  transition: "background 0.2s, transform 0.1s",
                  outline:
                    activeCategory === group.category
                      ? `2px solid ${COLORS.accentEmerald}`
                      : "none",
                  boxShadow:
                    activeCategory === group.category
                      ? `0 0 4px 0 ${COLORS.accentGold}`
                      : "none",
                }}
                tabIndex={0}
              >
                {group.category}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}