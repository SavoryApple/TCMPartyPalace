import React, { useState } from "react";

// Color scheme for notification & card
const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  green: "#2ecc40",
  red: "#A52439",
  editBg: "#FFF8C6",
  editBorder: "#ffe066"
};

function getHerbDisplayName(herb) {
  if (herb.pinyinName) {
    return Array.isArray(herb.pinyinName)
      ? herb.pinyinName[0]
      : herb.pinyinName;
  }
  if (herb.name) {
    return Array.isArray(herb.name) ? herb.name[0] : herb.name;
  }
  if (herb.englishNames) {
    return Array.isArray(herb.englishNames)
      ? herb.englishNames[0]
      : herb.englishNames;
  }
  if (herb.pharmaceuticalName) {
    return herb.pharmaceuticalName;
  }
  return "Unknown";
}

// Helper to extract grams and pieces from a dosage string
function parseDosage(dosage) {
  let gramRanges = [];
  let pieces = [];

  if (!dosage) return { gramRanges, pieces };

  // Match grams: e.g. "6g", "8-10g", "6-12g"
  const gramRegex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*[gG]\b/gi;
  let gramMatch;
  while ((gramMatch = gramRegex.exec(dosage)) !== null) {
    if (gramMatch[2]) {
      gramRanges.push([parseFloat(gramMatch[1]), parseFloat(gramMatch[2])]);
    } else {
      gramRanges.push([parseFloat(gramMatch[1]), parseFloat(gramMatch[1])]);
    }
  }

  // Match pieces: e.g. "2 pieces", "5 pieces"
  const piecesRegex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*pieces?\b/gi;
  let piecesMatch;
  while ((piecesMatch = piecesRegex.exec(dosage)) !== null) {
    if (piecesMatch[2]) {
      pieces.push({ min: parseFloat(piecesMatch[1]), max: parseFloat(piecesMatch[2]) });
    } else {
      pieces.push({ min: parseFloat(piecesMatch[1]), max: parseFloat(piecesMatch[1]) });
    }
  }
  return { gramRanges, pieces };
}

// Auto-correct common misspellings of "pieces"
function correctPiecesSpelling(str) {
  if (!str) return str;
  // Lowercase for matching
  let out = str;
  // Common misspellings (add more as needed)
  const misspellings = [
    /peices/gi,
    /piecse/gi,
    /pisces/gi,
    /piecec/gi,
    /pece/gi,
    /pieses/gi,
    /pices/gi,
    /picese/gi,
    /peices/gi,
    /peaces/gi,
    /peicse/gi,
    /piaces/gi,
    /peise/gi
  ];
  misspellings.forEach(ms => {
    out = out.replace(ms, "pieces");
  });
  // Also fix "peice" singular
  out = out.replace(/peice/gi, "piece");
  return out;
}

// Validate and fix dosage format
function fixDosageFormat(input) {
  if (!input) return "";

  let val = input.trim();

  val = correctPiecesSpelling(val);

  // Allow "6g", "6-9g", "2 pieces", "1 piece"
  // If it's just a number or range, add "g"
  const onlyNumberOrRange = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?$/;
  if (onlyNumberOrRange.test(val)) {
    return val + "g";
  }

  // Allow "6g", "6-9g" (g or G at end)
  const gramsPattern = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?\s*[gG]$/;
  if (gramsPattern.test(val)) {
    return val.replace(/\s+/g, '') // Remove spaces before "g"
  }

  // Allow "2 pieces", "6-9 pieces" (case-insensitive, singular/plural)
  const piecesPattern = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?\s*pieces?$/i;
  if (piecesPattern.test(val)) {
    // Normalize to singular/plural based on number
    let [amount, , , rangeEnd] = val.match(/^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?/);
    let isRange = !!rangeEnd;
    let num = parseFloat(amount);
    let word = num === 1 && !isRange ? "piece" : "pieces";
    // Remove trailing spaces and force "piece"/"pieces"
    return val.replace(/pieces?/i, word).replace(/\s+$/, '');
  }

  // If not valid, return empty string (invalid input)
  return "";
}

export default function HerbListCopyToClipboard({ herbs, onRemoveHerb, onResetHerbs }) {
  // Local editable dosages state
  const [editableDosages, setEditableDosages] = useState(
    herbs.map(h => h.dosage || "")
  );
  const [editingIdx, setEditingIdx] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [dosageErrorIdx, setDosageErrorIdx] = useState(null);

  // If herbs prop changes (e.g. reset), resync local editable dosages
  React.useEffect(() => {
    setEditableDosages(herbs.map(h => h.dosage || ""));
    setEditingIdx(null);
    setDosageErrorIdx(null);
  }, [herbs]);

  const handleCopy = () => {
    const list = herbs
      .map((h, idx) => `${getHerbDisplayName(h)} ${editableDosages[idx] || ""}`.trim())
      .join("\n");
    navigator.clipboard.writeText(list);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1800);
  };

  function renderPropertyBubble(value, key = "") {
    if (!value) return null;
    return (
      <span
        key={key}
        className="property-bubble"
        style={{
          display: "inline-block",
          background: "#F6EAF9",
          color: COLORS.violet,
          borderRadius: "999px",
          padding: "6px 14px",
          fontSize: "0.96em",
          fontWeight: 500,
          margin: "2px 4px 2px 0",
          verticalAlign: "middle",
          maxWidth: 120,
          textAlign: "center",
          overflowWrap: "break-word",
          wordBreak: "break-word",
          whiteSpace: "normal",
        }}
      >
        {value}
      </span>
    );
  }

  function renderYoSanCarriesAndFormats(herb) {
    let yoSanCarries;
    if (herb.yoSanCarries === true) {
      yoSanCarries = "Yes";
    } else if (herb.yoSanCarries === false || herb.yoSanCarries === undefined || herb.yoSanCarries === null) {
      yoSanCarries = "No";
    } else {
      yoSanCarries = String(herb.yoSanCarries);
    }

    const formats =
      Array.isArray(herb.formats) && herb.formats.length > 0
        ? herb.formats.join(", ")
        : typeof herb.formats === "string" && herb.formats
        ? herb.formats
        : null;

    return (
      <div
        className="flex flex-row gap-2 items-center"
        style={{
          fontSize: "0.97em",
          fontWeight: 500,
          color: COLORS.violet,
          marginTop: "3px",
        }}
      >
        <span
          style={{
            display: "inline-block",
            background: "#E7FEF1",
            color: yoSanCarries === "Yes" ? COLORS.green : COLORS.red,
            borderRadius: "999px",
            padding: "4px 12px",
            marginRight: 6,
            fontWeight: 600,
            fontSize: "0.95em",
            minWidth: 70,
            textAlign: "center",
            boxShadow: "0 0 1px #bbb",
          }}
        >
          Yo San: {yoSanCarries}
        </span>
        {formats && (
          <span
            style={{
              display: "inline-block",
              background: "#F6F3FF",
              color: COLORS.violet,
              borderRadius: "999px",
              padding: "4px 12px",
              fontWeight: 500,
              fontSize: "0.95em",
              minWidth: 70,
              textAlign: "center",
              boxShadow: "0 0 1px #bbb",
            }}
          >
            Format: {formats}
          </span>
        )}
      </div>
    );
  }

  function renderDosageSum(herbs, dosagesArr) {
    let minGrams = 0;
    let maxGrams = 0;
    let hasRange = false;
    let piecesByHerb = {};

    herbs.forEach((h, idx) => {
      const { gramRanges, pieces } = parseDosage(dosagesArr[idx]);
      gramRanges.forEach(([min, max]) => {
        minGrams += min;
        maxGrams += max;
        if (min !== max) hasRange = true;
      });
      if (pieces.length) {
        const herbName = getHerbDisplayName(h);
        if (!piecesByHerb[herbName]) piecesByHerb[herbName] = { min: 0, max: 0 };
        pieces.forEach(piece => {
          piecesByHerb[herbName].min += piece.min;
          piecesByHerb[herbName].max += piece.max;
        });
      }
    });

    let gramsStr = "";
    if (minGrams === maxGrams) {
      gramsStr = minGrams ? `${minGrams}g` : "";
    } else {
      gramsStr = `${minGrams}-${maxGrams}g`;
    }

    let piecesStr = "";
    const piecesList = Object.entries(piecesByHerb)
      .map(([herbName, { min, max }]) => {
        if (min === max) {
          return `${min} pieces (${herbName})`;
        } else {
          return `${min}-${max} pieces (${herbName})`;
        }
      });
    if (piecesList.length > 0) {
      piecesStr = piecesList.join(" + ");
    }

    let sumStr = "";
    if (gramsStr && piecesStr) {
      sumStr = `Total: ${gramsStr} + ${piecesStr}`;
    } else if (gramsStr) {
      sumStr = `Total: ${gramsStr}`;
    } else if (piecesStr) {
      sumStr = `Total: ${piecesStr}`;
    } else {
      return null;
    }

    return (
      <div
        style={{
          marginTop: "1em",
          fontWeight: 700,
          fontSize: "1.05em",
          color: COLORS.seal,
          background: "#F6F3FF",
          padding: "8px 18px",
          borderRadius: "1.1em",
          boxShadow: "0 1px 8px -4px #b6b6d4",
        }}
      >
        <span style={{ color: COLORS.violet, fontWeight: 800, marginRight: 8 }}>
          {sumStr}
        </span>
      </div>
    );
  }

  function handleEditClick(idx) {
    setEditingIdx(idx);
    setDosageErrorIdx(null);
  }
  function handleDosageChange(idx, value) {
    setEditableDosages(prev =>
      prev.map((d, i) => (i === idx ? value : d))
    );
    setDosageErrorIdx(null);
  }
  function handleDosageBlur(idx) {
    let fixed = fixDosageFormat(editableDosages[idx]);
    if (!fixed && editableDosages[idx]) {
      setDosageErrorIdx(idx);
      // Don't close editing!
      return;
    }
    setEditableDosages(prev =>
      prev.map((d, i) => (i === idx ? fixed : d))
    );
    setEditingIdx(null);
    setDosageErrorIdx(null);
  }
  function handleDosageKeyDown(e, idx) {
    if (e.key === "Enter" || e.key === "Escape") {
      handleDosageBlur(idx);
    }
  }

  return (
    <div
      className="w-full flex flex-col items-center my-8 animate-fadeIn"
      style={{ minWidth: 320, maxWidth: 480 }}
    >
      <div
        className="rounded-2xl shadow-xl border-2 transition-all duration-300 relative"
        style={{
          background: COLORS.vanilla,
          borderColor: COLORS.violet,
          width: "100%",
          maxWidth: 430,
          overflow: "hidden",
        }}
      >
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{
            borderBottom: herbs.length > 0 ? `1.5px solid ${COLORS.violet}` : "none",
            background: COLORS.vanilla,
          }}
        >
          <span
            className="font-bold text-lg"
            style={{
              color: COLORS.claret,
              letterSpacing: "0.02em",
            }}
          >
            Custom Formula Herb List ({herbs.length})
          </span>
          {herbs.length > 0 && !!onResetHerbs && (
            <button
              className="ml-4 px-3 py-1 bg-[#A52439] text-[#FFF7E3] rounded-full text-sm font-bold shadow hover:scale-110 transition-all"
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
              }}
              onClick={onResetHerbs}
              title="Reset all herbs"
            >
              Reset
            </button>
          )}
        </div>
        <div
          style={{
            padding: herbs.length > 0 ? "20px 28px 24px 28px" : "0 28px",
            background: COLORS.vanilla,
          }}
        >
          {herbs.length === 0 ? (
            <div className="text-center text-seal py-4" style={{ fontStyle: "italic", fontSize: 16 }}>
              Add herbs to your formula using the search bar. Once a formula is created, press <b>Copy Herbs To Clipboard</b> to paste them all into your chart.
            </div>
          ) : (
            <>
              <button
                className="px-5 py-2 font-bold rounded-full shadow-xl mb-4 hover:scale-105 hover:shadow-2xl transition-all duration-200"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.violet}, ${COLORS.carolina}, ${COLORS.claret})`,
                  color: COLORS.vanilla,
                  fontSize: 16,
                }}
                onClick={handleCopy}
              >
                Copy Herbs To Clipboard
              </button>
              {showCopied && (
                <div
                  className="mb-3 rounded-full px-6 py-2 w-fit text-center shadow-lg text-md font-bold transition animate-bounceIn"
                  style={{
                    background: "#C7F8CE",
                    color: COLORS.green,
                  }}
                >
                  Herb list copied!
                </div>
              )}
              <div className="text-seal text-sm text-center w-full mb-2">
                <strong>Copy preview:</strong>
              </div>
              <div className="mb-2 text-center text-[0.97em]" style={{ color: COLORS.carolina }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45em",
                    background: COLORS.editBg,
                    color: COLORS.seal,
                    borderRadius: "0.9em",
                    border: `1.7px dashed ${COLORS.editBorder}`,
                    padding: "0.38em 1.12em",
                    fontWeight: 600,
                    fontSize: "0.98em",
                    boxShadow: "0 1px 6px -4px #ffe06699",
                  }}
                >
                  <span role="img" aria-label="edit" style={{ fontSize: "1.13em" }}>✏️</span>
                  <span>Click any dosage below to edit</span>
                </span>
              </div>
              <div>
                {herbs.map((h, idx) => (
                  <div
                    key={h.pinyinName || h.name || idx}
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "flex-start",
                      marginBottom: 10,
                      background: "#fff",
                      borderRadius: 8,
                      boxShadow: "0 0 2px #bbb",
                      padding: "8px 10px",
                      marginTop: 8,
                      position: "relative",
                      flexWrap: "wrap",
                      minHeight: 40,
                    }}
                  >
                    <div style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      flex: "1 1 180px",
                      minWidth: 0
                    }}>
                      <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: `linear-gradient(135deg, ${COLORS.carolina}, ${COLORS.vanilla}, ${COLORS.violet})`,
                            color: COLORS.claret,
                            borderRadius: "50%",
                            width: "1.3em",
                            height: "1.3em",
                            minWidth: "1.3em",
                            minHeight: "1.3em",
                            maxWidth: "1.3em",
                            maxHeight: "1.3em",
                            textAlign: "center",
                            fontSize: "0.95em",
                            fontWeight: 700,
                            marginRight: "0.7em",
                            border: `1.3px solid ${COLORS.violet}`,
                            boxSizing: "border-box",
                            boxShadow: `0 0 6px 0 ${COLORS.carolina}22`,
                            flexShrink: 0,
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span
                          style={{
                            whiteSpace: "nowrap",
                            overflow: "visible",
                            textOverflow: "clip",
                            minWidth: 0,
                            fontSize: 15,
                            color: COLORS.seal,
                            fontWeight: 500,
                            flexGrow: 1,
                            marginRight: "0.65em",
                          }}
                        >
                          {getHerbDisplayName(h)}
                        </span>
                        {/* Editable Dosage Input */}
                        {editingIdx === idx ? (
                          <>
                            <input
                              type="text"
                              value={editableDosages[idx]}
                              autoFocus
                              onChange={e => handleDosageChange(idx, e.target.value)}
                              onBlur={() => handleDosageBlur(idx)}
                              onKeyDown={e => handleDosageKeyDown(e, idx)}
                              style={{
                                fontSize: 15,
                                padding: "2px 8px",
                                borderRadius: "6px",
                                border: `2px solid ${dosageErrorIdx === idx ? COLORS.red : COLORS.editBorder}`,
                                marginRight: 8,
                                minWidth: 85,
                                fontWeight: 500,
                                color: COLORS.seal,
                                background: dosageErrorIdx === idx ? "#FFD6D6" : COLORS.editBg,
                                boxShadow: "0 1px 6px -3px #ffe06699",
                                outline: "none",
                                transition: "border 0.18s, background 0.18s",
                              }}
                            />
                            {dosageErrorIdx === idx && (
                              <span style={{ color: COLORS.red, fontWeight: 600, fontSize: "0.97em", marginLeft: 2 }}>
                                Invalid
                              </span>
                            )}
                          </>
                        ) : (
                          <span
                            style={{
                              fontSize: 15,
                              color: COLORS.seal,
                              fontWeight: 500,
                              marginRight: 8,
                              cursor: "pointer",
                              borderBottom: `1.5px dashed ${COLORS.editBorder}`,
                              padding: "1px 6px",
                              background: COLORS.editBg,
                              borderRadius: "6px",
                              transition: "background 0.18s, border 0.18s",
                              boxShadow: "0 1px 4px -3px #ffe06699",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "0.3em"
                            }}
                            title="Click to edit dosage"
                            onClick={() => handleEditClick(idx)}
                          >
                            <span style={{ color: COLORS.violet, fontSize: "1.04em", marginRight: "2px" }}>✏️</span>
                            {editableDosages[idx] || <span style={{ color: COLORS.red, fontWeight: 400 }}>Set dosage</span>}
                          </span>
                        )}
                        {onRemoveHerb && (
                          <button
                            className="ml-2 px-2 py-0.5"
                            style={{
                              background: COLORS.red,
                              color: COLORS.vanilla,
                              borderRadius: "6px",
                              fontWeight: "bold",
                              fontSize: "1.1em",
                              border: "none",
                              minWidth: "1.5em",
                              height: "1.5em",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 6,
                              transition: "background 0.15s, scale 0.15s",
                              boxShadow: "0 1px 5px 0 #a5243944",
                              cursor: "pointer",
                            }}
                            onClick={() => onRemoveHerb(h.pinyinName || h.name)}
                            title={`Remove ${getHerbDisplayName(h)}`}
                          >
                            ×
                          </button>
                        )}
                      </div>
                      {/* Properties, YoSan, Formats */}
                      <div style={{ display: "flex", flexWrap: "wrap", marginLeft: "2.1em", gap: 2, marginTop: 4 }}>
                        {Array.isArray(h.temperature) && h.temperature.map((prop, i) => renderPropertyBubble(prop, `temp-${i}`))}
                        {typeof h.temperature === "string" && renderPropertyBubble(h.temperature, "temp")}
                        {Array.isArray(h.taste) && h.taste.map((prop, i) => renderPropertyBubble(prop, `taste-${i}`))}
                        {typeof h.taste === "string" && renderPropertyBubble(h.taste, "taste")}
                        {Array.isArray(h.channels) && h.channels.map((prop, i) => renderPropertyBubble(prop, `ch-${i}`))}
                        {typeof h.channels === "string" && renderPropertyBubble(h.channels, "ch")}
                      </div>
                      <div style={{ marginLeft: "2.1em", marginTop: "2px" }}>
                        {renderYoSanCarriesAndFormats(h)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {renderDosageSum(herbs, editableDosages)}
            </>
          )}
        </div>
      </div>
    </div>
  );
}