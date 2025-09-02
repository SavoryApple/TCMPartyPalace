import React from "react";
import Badge from "./Badge";

// --- COLORS ---
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
};

// --- SORT FORMULAS BY BADGE ---
function sortFormulasByBadge(formulas, getAnyFormulaMatchByName) {
  const badgeOrder = {
    "NCCAOM/CALE": 0,
    "NCCAOM": 1,
    "Extra": 2,
  };
  return [...formulas].sort((a, b) => {
    const aObj = getAnyFormulaMatchByName(a.name);
    const bObj = getAnyFormulaMatchByName(b.name);
    const aBadge = aObj?.badge?.label || "";
    const bBadge = bObj?.badge?.label || "";
    return (badgeOrder[aBadge] ?? 99) - (badgeOrder[bBadge] ?? 99);
  });
}

// --- MAIN COMPONENT ---
// Accept ref from parent safely
function FormulasByCategory(
  {
    categories,
    subcategoryRefs,
    getAnyFormulaMatchByName,
    getFormulaMatchByName,
    getDisplayFormulaName,
    handleFormulaClick,
    renderFormulaExtras,
    CARD_MAX_WIDTH = 980,
    activeSubcategory
  },
  ref
) {
  if (!categories || !Array.isArray(categories) || categories.length === 0) {
    return <div>No categories found. Check your data file structure.</div>;
  }

  return (
    <div
      className="space-y-14 w-full flex flex-col items-center formula-card-section"
      style={{
        maxWidth: CARD_MAX_WIDTH,
        width: "100%",
        boxSizing: "border-box",
        marginTop: 0,
        paddingTop: 0,
      }}
      ref={ref}
    >
      {categories.map((category) =>
        (category.subcategories || []).map((subcat, subcatIdx) => {
          const isActive = activeSubcategory === subcat.title;
          return (
            <section
              key={subcat.title}
              ref={sectionRef => {
                if (subcategoryRefs) subcategoryRefs.current[subcat.title] = sectionRef;
              }}
              className={`shadow-2xl rounded-2xl border px-7 py-8 formula-card`}
              style={{
                background: isActive ? COLORS.backgroundGold : COLORS.accentIvory,
                boxShadow: isActive
                  ? `0 0 0 2.5px ${COLORS.accentGold}, 0 8px 40px -14px ${COLORS.accentGold}55, 0 1.5px 0 ${COLORS.backgroundGold}`
                  : `0 8px 40px -14px ${COLORS.accentGold}55, 0 1.5px 0 ${COLORS.backgroundGold}`,
                borderColor: isActive ? COLORS.accentGold : COLORS.accentGold,
                position: "relative",
                overflow: "hidden",
                width: "100%",
                maxWidth: CARD_MAX_WIDTH,
                transition: "background 0.2s, box-shadow 0.2s",
                zIndex: isActive ? 10 : 1,
                marginTop: subcatIdx === 0 ? 0 : "2.5em",
                paddingTop: 0,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  width: "180px",
                  height: "100%",
                  zIndex: 1,
                  background: `linear-gradient(105deg, transparent 60%, ${COLORS.accentEmerald}55 100%)`,
                  pointerEvents: "none",
                  borderRadius: "1.5em",
                }}
              />
              <h3
                className="mb-7 tracking-tight"
                style={{
                  fontSize: "2.1rem",
                  fontWeight: 900,
                  color: COLORS.backgroundRed,
                  borderLeft: `8px solid ${COLORS.accentCrimson}`,
                  background: COLORS.backgroundGold,
                  padding: "0.22em 1.2em",
                  marginLeft: "-1.2em",
                  borderRadius: "0 1.7em 1.7em 0",
                  boxShadow: `1px 2px 12px -7px ${COLORS.accentCrimson}`,
                  textShadow: `0 1px 0 ${COLORS.accentEmerald}`,
                  letterSpacing: "-.02em",
                  fontFamily: "inherit",
                  zIndex: 2,
                  position: "relative",
                  wordBreak: "break-word",
                  borderBottom: isActive ? `4px solid ${COLORS.accentGold}` : undefined,
                  transition: "border-bottom 0.2s",
                  marginTop: 0,
                }}
              >
                {subcat.title}
              </h3>
              <ul className="flex flex-col gap-7">
                {sortFormulasByBadge(subcat.formulas || [], getAnyFormulaMatchByName).map((formula, i) => {
                  const formulaObjAny = getAnyFormulaMatchByName(formula.name);
                  if (!formulaObjAny) {
                    return (
                      <li
                        key={formula.name + i}
                        className="group transition-all duration-200 shadow-lg rounded-xl border border-accentGray opacity-40 grayscale cursor-not-allowed"
                        style={{
                          cursor: "not-allowed",
                          background: COLORS.accentIvory,
                          zIndex: 3,
                          filter: "grayscale(0.85) brightness(0.98)",
                          opacity: 0.4,
                          pointerEvents: "none",
                          transition: "box-shadow .2s, transform .15s"
                        }}
                        tabIndex={-1}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7 p-5">
                          <div className="flex items-center min-w-0 flex-shrink-0 mr-3">
                            <span
                              className="font-extrabold truncate"
                              style={{
                                fontSize: "1.25rem",
                                color: COLORS.backgroundRed,
                                letterSpacing: "-.01em",
                                textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                                fontFamily: "inherit",
                                opacity: 0.7,
                                whiteSpace: "nowrap",
                                maxWidth: 600,
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                transition: "color 0.2s"
                              }}
                            >
                              {getDisplayFormulaName(formula, formulaObjAny)}
                            </span>
                          </div>
                          <span
                            className="italic font-semibold"
                            style={{
                              fontSize: "0.93rem",
                              color: COLORS.accentBlack,
                              marginLeft: "0.85em",
                              minWidth: 70,
                              maxWidth: "none",
                              fontFamily: "serif",
                              letterSpacing: "-.01em",
                              opacity: 0.6,
                              flex: "0 1 auto",
                              whiteSpace: "normal",
                              lineHeight: 1.35,
                              transition: "color 0.2s"
                            }}
                          >
                            {formula.english}
                          </span>
                          {formula.explanation && (
                            <span
                              className="mt-2 sm:mt-0 text-sm"
                              style={{
                                color: COLORS.accentCrimson,
                                background: COLORS.backgroundGold,
                                borderRadius: "0.7em",
                                fontWeight: 500,
                                padding: "0.22em 1.1em",
                                marginLeft: "0.95em",
                                boxShadow: `0px 1px 5px -3px ${COLORS.accentBlack}60`,
                                fontFamily: "inherit",
                                fontSize: "1.01em",
                                opacity: 0.5,
                                transition: "background 0.2s, color 0.2s"
                              }}
                            >
                              {formula.explanation}
                            </span>
                          )}
                        </div>
                      </li>
                    );
                  }
                  const formulaObj = getFormulaMatchByName(formula.name);
                  if (!formulaObj) return null;
                  return (
                    <li
                      key={formula.name + i}
                      className="group transition-all duration-200 shadow-lg rounded-xl border border-accentEmerald bg-accentIvory cursor-pointer hover:border-accentGold hover:scale-[1.025] active:scale-95 focus:ring-2 focus:ring-accentEmerald"
                      style={{
                        background: COLORS.accentIvory,
                        zIndex: 3,
                        transition: "box-shadow .2s, transform .15s"
                      }}
                      onClick={() => handleFormulaClick(formulaObj)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          handleFormulaClick(formulaObj);
                        }
                      }}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:gap-7 p-5">
                        <div className="flex items-center min-w-0 flex-shrink-0 mr-3">
                          <span
                            className="font-extrabold"
                            style={{
                              fontSize: "1.25rem",
                              color: COLORS.backgroundRed,
                              letterSpacing: "-.01em",
                              textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                              fontFamily: "inherit",
                              whiteSpace: "nowrap",
                              maxWidth: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              transition: "color 0.2s"
                            }}
                          >
                            {getDisplayFormulaName(formula, formulaObj)}
                          </span>
                          <span className="ml-2 flex-shrink-0">
                            <Badge badge={formulaObj.badge} />
                          </span>
                        </div>
                        <span
                          className="italic font-semibold"
                          style={{
                            fontSize: "0.93rem",
                            color: COLORS.accentBlack,
                            marginLeft: "0.85em",
                            minWidth: 70,
                            maxWidth: "none",
                            fontFamily: "serif",
                            letterSpacing: "-.01em",
                            flex: "0 1 auto",
                            whiteSpace: "normal",
                            lineHeight: 1.35,
                            transition: "color 0.2s"
                          }}
                        >
                          {formula.english}
                        </span>
                        {formula.explanation && (
                          <span
                            className="mt-2 sm:mt-0 text-sm"
                            style={{
                              color: COLORS.accentCrimson,
                              background: COLORS.backgroundGold,
                              borderRadius: "0.7em",
                              fontWeight: 500,
                              padding: "0.22em 1.1em",
                              marginLeft: "0.95em",
                              boxShadow: `0px 1px 5px -3px ${COLORS.accentBlack}60`,
                              fontFamily: "inherit",
                              fontSize: "1.01em",
                              transition: "background 0.2s, color 0.2s"
                            }}
                          >
                            {formula.explanation}
                          </span>
                        )}
                        {renderFormulaExtras && renderFormulaExtras(formulaObj)}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })
      )}
    </div>
  );
}

// Export using React.forwardRef to make the function component compatible with refs
export default React.forwardRef(FormulasByCategory);