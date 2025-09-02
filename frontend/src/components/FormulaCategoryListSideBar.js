import React from "react";

// Updated COLORS to match main site palette
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

export default function FormulaCategoryListSideBar({
  categories,
  activeSubcategory,
  handleSubcategoryScroll,
  sidebarRef,
  isSidebarHovered,
  setIsSidebarHovered,
  sidebarTop // <-- dynamically passed prop for offset
}) {
  return (
    <aside
      ref={sidebarRef}
      className="sidebar hidden md:flex flex-col"
      style={{
        position: "fixed",
        top: `${sidebarTop}px`, // <-- use dynamic value from parent
        left: 0,
        width: SIDEBAR_WIDTH,
        height: `calc(100vh - ${sidebarTop}px)`, // <-- always match the offset
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
          Categories
        </h2>
        <ul className="space-y-2">
          {categories.map((category, catIdx) => (
            <React.Fragment key={category.category + catIdx}>
              <li>
                <div
                  style={{
                    color: COLORS.accentCrimson,
                    fontWeight: 800,
                    fontSize: "1.05em",
                    padding: "0.25em 0.7em 0.15em 0.7em",
                    margin: "0.3em 0",
                    borderLeft: `5px solid ${COLORS.accentCrimson}`,
                    background: COLORS.backgroundGold,
                    borderRadius: "0 1.2em 1.2em 0",
                    letterSpacing: "-.01em",
                    boxShadow: `1px 2px 10px -9px ${COLORS.accentCrimson}`,
                  }}
                >
                  {category.category}
                </div>
              </li>
              {(category.subcategories || []).map((subcat, subIdx) => (
                <li key={subcat.title + subIdx}>
                  <button
                    data-subcategory={subcat.title}
                    onClick={() => handleSubcategoryScroll(subcat.title)}
                    className={[
                      "w-full text-left px-3 py-2 rounded transition-colors font-semibold hover:bg-accentGold/20",
                      activeSubcategory === subcat.title
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
                        activeSubcategory === subcat.title
                          ? `2px solid ${COLORS.accentEmerald}`
                          : "none",
                      boxShadow:
                        activeSubcategory === subcat.title
                          ? `0 0 4px 0 ${COLORS.accentGold}`
                          : "none",
                    }}
                    tabIndex={0}
                  >
                    {subcat.title}
                  </button>
                </li>
              ))}
            </React.Fragment>
          ))}
        </ul>
      </nav>
    </aside>
  );
}