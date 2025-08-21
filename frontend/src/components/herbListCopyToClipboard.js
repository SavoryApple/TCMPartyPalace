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

/**
 * HerbListCopyToClipboard
 * @param {object} props
 * @param {Array} props.herbs - Array of herb objects
 * @param {function} [props.onRemoveHerb] - Called with key (pinyinName or name) when X is clicked
 * @param {function} [props.onResetHerbs] - Called when reset button is clicked
 */
export default function HerbListCopyToClipboard({ herbs, onRemoveHerb, onResetHerbs }) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopy = () => {
    const list = herbs
      .map((h) => `${getHerbDisplayName(h)} ${h.dosage || ""}`.trim())
      .join("\n");
    navigator.clipboard.writeText(list);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1800);
  };

  // Helper for rendering herb property bubbles
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

  // PATCH: Render Yo San Carries and Formats
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
          marginLeft: 10,
          fontSize: "0.97em",
          fontWeight: 500,
          color: COLORS.violet,
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
          {/* Reset button at top right if herbs exist and onResetHerbs is provided */}
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
              <div className="text-seal text-sm text-center w-full mb-1">
                <strong>Copy preview:</strong>
              </div>
              {herbs.map((h, idx) => (
                <div
                  key={h.pinyinName || h.name || idx}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: 2,
                    background: "#fff",
                    borderRadius: 8,
                    boxShadow: "0 0 2px #bbb",
                    padding: "6px 10px",
                    marginTop: 8,
                    position: "relative",
                    flexWrap: "wrap",
                  }}
                >
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
                    }}
                  >
                    {getHerbDisplayName(h)} {h.dosage || ""}
                  </span>
                  {/* Render property bubbles if they exist */}
                  <div style={{ display: "flex", flexWrap: "wrap", marginLeft: 12, gap: 2 }}>
                    {Array.isArray(h.temperature) && h.temperature.map((prop, i) => renderPropertyBubble(prop, `temp-${i}`))}
                    {typeof h.temperature === "string" && renderPropertyBubble(h.temperature, "temp")}
                    {Array.isArray(h.taste) && h.taste.map((prop, i) => renderPropertyBubble(prop, `taste-${i}`))}
                    {typeof h.taste === "string" && renderPropertyBubble(h.taste, "taste")}
                    {Array.isArray(h.channels) && h.channels.map((prop, i) => renderPropertyBubble(prop, `ch-${i}`))}
                    {typeof h.channels === "string" && renderPropertyBubble(h.channels, "ch")}
                  </div>
                  {/* PATCH: Show Yo San Carries and Formats */}
                  {renderYoSanCarriesAndFormats(h)}
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
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}