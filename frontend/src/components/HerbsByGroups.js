import React from "react";
import Badge from "./Badge";

// --- COLORS (matching formulas badges) ---
const COLORS = {
  backgroundGold: "#F9E8C2",
  accentGold: "#D4AF37",
  accentDarkGold: "#B38E3F",
  accentBlack: "#44210A",
  accentCrimson: "#C0392B",
  accentIvory: "#FCF5E5",
  accentEmerald: "#438C3B",
  accentBlue: "#2176AE",
  accentGray: "#D9C8B4",
  accentGreen: "#217a39"
};

const EXPLANATION_STYLE = {
  background: "#FCF5E5",
  color: "#C0392B",
  fontWeight: 600,
  fontSize: "1.05em",
  borderRadius: "1em",
  padding: "14px 20px",
  textAlign: "center",
  boxShadow: "0 4px 16px -6px #D4AF3788",
  border: "2px solid #F9E8C2",
  letterSpacing: ".01em",
  maxWidth: "440px",
  minWidth: "220px",
  alignSelf: "center",
  wordBreak: "break-word",
  lineHeight: "1.4",
  display: "inline-block",
  verticalAlign: "middle",
  whiteSpace: "normal",
  overflowWrap: "break-word"
};

function KeyActionsExplanation({ keyActions }) {
  if (!keyActions) return null;
  return (
    <span
      className="herb-keyactions-explanation"
      style={EXPLANATION_STYLE}
    >
      {keyActions}
    </span>
  );
}

// --- BADGE LOGIC ---
function getHerbBadge(herb) {
  if (!herb || typeof herb !== "object") return null;
  if (herb.nccaomAndCale === "yes" || herb.nccaomAndCaleOnly === "yes") {
    return {
      label: "NCCAOM/CALE",
      color: "#a8f5c9",
      textColor: "#217a39",
      borderColor: "#52c97a"
    };
  }
  if (herb.caleOnly === "yes") {
    return {
      label: "CALE",
      color: "#D4AF37",
      textColor: "#44210A",
      borderColor: "#B38E3F"
    };
  }
  if (herb.nccaomOnly === "yes") {
    return {
      label: "NCCAOM",
      color: "#c7deff",
      textColor: "#2176ae",
      borderColor: "#2176ae"
    };
  }
  if (herb.extraHerb === "yes") {
    return {
      label: "Extra",
      color: "#e6e6e6",
      textColor: "#7a6c46",
      borderColor: "#b38e3f"
    };
  }
  return null;
}

// --- NORMALIZE ---
function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .replace(/\(.*?\)/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// --- MAIN COMPONENT ---
function HerbsByGroups(
  {
    groups,
    categoryRefs,
    getAnyHerbMatchByName,
    getHerbObjFromAll,
    getHerbDisplayName,
    handleHerbClick,
    CARD_MAX_WIDTH = 980,
    activeCategory,
    keyActionsMap // <-- PATCH: incoming lookup map from parent
  },
  ref
) {
  if (!groups || !Array.isArray(groups) || groups.length === 0) {
    return <div>No groups found. Check your data file structure.</div>;
  }

  // Responsive grid template columns
  function getGridTemplateColumns() {
    if (typeof window !== "undefined" && window.innerWidth < 700) {
      return "1fr";
    }
    return "minmax(180px, 1fr) minmax(220px, 440px) minmax(140px, 200px)";
  }

  // Responsive gap
  function getGridGap() {
    if (typeof window !== "undefined" && window.innerWidth < 700) {
      return "16px";
    }
    return "32px";
  }

  return (
    <div
      className="space-y-14 w-full flex flex-col items-center group-section"
      style={{
        maxWidth: CARD_MAX_WIDTH,
        width: "100%",
        boxSizing: "border-box",
        marginTop: 0,
        paddingTop: 0,
      }}
      ref={ref}
    >
      {groups.map((group, groupIdx) => {
        const isActive = activeCategory === group.category;
        const sectionKey = [
          typeof group.category === "string" ? group.category : "group",
          String(groupIdx)
        ].join("-");
        return (
          <section
            key={sectionKey}
            ref={sectionRef => {
              if (categoryRefs) categoryRefs.current[group.category] = sectionRef;
            }}
            className={`shadow-2xl rounded-2xl border card`}
            style={{
              background: COLORS.backgroundGold,
              boxShadow: isActive
                ? `0 0 0 2.5px ${COLORS.accentGold}, 0 8px 40px -14px ${COLORS.accentGold}55, 0 1.5px 0 ${COLORS.backgroundGold}`
                : `0 8px 40px -14px ${COLORS.accentGold}55, 0 1.5px 0 ${COLORS.backgroundGold}`,
              borderColor: COLORS.accentGold,
              position: "relative",
              overflow: "hidden",
              width: "100%",
              maxWidth: CARD_MAX_WIDTH,
              transition: "background 0.2s, box-shadow 0.2s",
              zIndex: isActive ? 10 : 1,
              marginTop: groupIdx === 0 ? 0 : "2.5em",
              paddingTop: 0,
              marginLeft: "8px",
              marginRight: "8px"
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
                color: COLORS.accentBlack,
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
              {group.category}
            </h3>
            <ul className="flex flex-col gap-7">
              {(group.herbs || []).map((herb, i) => {
                // Try to get a match from MongoDB, otherwise show as plain string
                const display = typeof herb === "string" ? herb.replace(/\(.*?\)/, "").trim() : getHerbDisplayName(herb);
                const key = `${display}--${group.category}--${i}`;
                const herbObj = getHerbObjFromAll(display);
                const badge = herbObj ? getHerbBadge(herbObj) : null;
                const pharmaName = herbObj?.pharmaceuticalName || herbObj?.pharmaceutical || "";

                // PATCH: Get keyActions from keyActionsMap if available
                let keyActionsValue;
                if (herbObj) {
                  const norm = normalize(herbObj.pinyinName || herbObj.name || "");
                  keyActionsValue = keyActionsMap?.[norm] || herbObj.keyActions || herbObj.explanation || undefined;
                }
                const explanationBlock = keyActionsValue ? (
                  <KeyActionsExplanation keyActions={keyActionsValue} />
                ) : null;
                const { yoSanCarries, formats } = herbObj || {};

                return (
                  <li
                    key={key}
                    className={
                      herbObj
                        ? "group transition-all duration-200 shadow-lg rounded-xl border border-accentEmerald bg-accentIvory cursor-pointer hover:border-accentGold hover:scale-[1.025] active:scale-95 focus:ring-2 focus:ring-accentEmerald herb-card-content"
                        : "group transition-all duration-200 shadow-lg rounded-xl border border-accentGray opacity-40 grayscale cursor-not-allowed herb-card-content"
                    }
                    style={{
                      background: COLORS.accentIvory,
                      zIndex: 3,
                      filter: !herbObj ? "grayscale(0.85) brightness(0.98)" : undefined,
                      opacity: !herbObj ? 0.4 : undefined,
                      pointerEvents: herbObj ? "auto" : "none",
                      transition: "box-shadow .2s, transform .15s",
                      marginLeft: "12px",
                      marginRight: "12px",
                      padding: "1.2em",
                      boxSizing: "border-box",
                      maxWidth: "100%",
                      wordBreak: "break-word",
                      overflowWrap: "break-word"
                    }}
                    onClick={() => herbObj && handleHerbClick(herbObj)}
                    tabIndex={herbObj ? 0 : -1}
                    onKeyDown={herbObj ? (e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        handleHerbClick(herbObj);
                      }
                    } : undefined}
                  >
                    <div
                      className="herb-card-grid"
                      style={{
                        display: "grid",
                        gridTemplateColumns: getGridTemplateColumns(),
                        gap: getGridGap(),
                        alignItems: "center",
                        width: "100%",
                        wordBreak: "break-word",
                        overflowWrap: "break-word"
                      }}
                    >
                      {/* Left section: herb name (with badge), pharmaceutical name below */}
                      <div className="flex flex-col min-w-0 flex-shrink-0" style={{
                        wordBreak: "break-word",
                        overflowWrap: "break-word",
                        minWidth: 0,
                        maxWidth: "100%"
                      }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "0.7em",
                            minWidth: 0,
                            maxWidth: "100%"
                          }}
                        >
                          <span
                            className="font-extrabold"
                            style={{
                              fontSize: "1.15rem",
                              color: COLORS.accentBlack,
                              letterSpacing: "-.01em",
                              textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
                              fontFamily: "inherit",
                              whiteSpace: "normal",
                              maxWidth: "100%",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              transition: "color 0.2s",
                              display: "inline",
                              opacity: herbObj ? 1 : 0.7,
                              wordBreak: "break-word",
                              overflowWrap: "break-word"
                            }}
                          >
                            {display}
                          </span>
                          {badge && (
                            <span className="flex-shrink-0" style={{ verticalAlign: 'middle' }}>
                              <Badge badge={badge} />
                            </span>
                          )}
                        </div>
                        {pharmaName && (
                          <span
                            className="italic font-semibold"
                            style={{
                              fontSize: "0.93rem",
                              color: COLORS.accentBlack,
                              fontFamily: "serif",
                              letterSpacing: "-.01em",
                              whiteSpace: "normal",
                              lineHeight: 1.35,
                              transition: "color 0.2s",
                              marginTop: "3px",
                              display: "block",
                              wordBreak: "break-word",
                              overflowWrap: "break-word",
                              maxWidth: "100%"
                            }}
                          >
                            {pharmaName}
                          </span>
                        )}
                      </div>
                      {/* Middle section: keyActions/explanation block */}
                      <div style={{ display: "flex", justifyContent: "center", wordBreak: "break-word", overflowWrap: "break-word", maxWidth: "100vw" }}>
                        {explanationBlock}
                      </div>
                      {/* Right section: Yo San Carries and Format, always beside (never below) keyActions */}
                      <div
                        className="flex flex-col gap-1 items-end"
                        style={{
                          minWidth: 0,
                          maxWidth: "100vw",
                          justifyContent: "center",
                          wordBreak: "break-word",
                          overflowWrap: "break-word"
                        }}
                      >
                        {yoSanCarries !== undefined && (
                          <div>
                            <strong style={{ color: COLORS.accentBlack }}>Yo San Carries:</strong>{" "}
                            <span style={{ color: yoSanCarries ? COLORS.accentEmerald : COLORS.accentCrimson, fontWeight: 600 }}>
                              {yoSanCarries === true ? "Yes" : yoSanCarries === false ? "No" : ""}
                            </span>
                          </div>
                        )}
                        {formats && Array.isArray(formats) && formats.length > 0 && (
                          <div>
                            <strong style={{ color: COLORS.accentBlack }}>Format:</strong>{" "}
                            <span style={{ color: COLORS.accentGold }}>
                              {formats.join(", ")}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

// Export using React.forwardRef to make the function component compatible with refs
export default React.forwardRef(HerbsByGroups);