import React, { useState, useEffect } from "react";

// Unified color scheme
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
  editBg: "#FFF8C6",
  editBorder: "#D4AF37",
  editBubble: "#FFF7E3",
  sectionHeader: "#FFF3D6",
  dosageBg: "#F9E8C2",
  dosageBubble: "#FFE066",
  dosageBubbleText: "#9A2D1F",
  dosageBubbleBorder: "#B38E3F",
  green: "#2ecc40",
  red: "#C0392B",
  propertyBubble: "#438C3B",
  propertyBubbleText: "#FCF5E5",
  channelBubble: "#E6F4FF",
  channelBubbleText: "#2176AE",
  errorBubble: "#FCF5E5",
  violet: "#7C5CD3",
  claret: "#A52439",
  seal: "#3B4461",
  yoSanBubble: "#2E3551",        // Dark blue/dark navy
  yoSanBubbleText: "#F9E8C2",   // Light gold
  formatsBubble: "#B38E3F",     // Dark gold brown
  formatsBubbleText: "#FCF5E5", // Off-white
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 700);
  useEffect(() => {
    function onResize() {
      setIsMobile(window.innerWidth < 700);
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);
  return isMobile;
}

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

function getPropertiesArr(herb) {
  let val = herb.properties;
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(/[,;/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function getChannelsArr(herb) {
  let val = herb.channelsEntered;
  if (!val) return [];
  if (Array.isArray(val)) return val.filter(Boolean);
  if (typeof val === "string") {
    return val
      .split(/[,;/]+/)
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

function safeArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

function PropertyBubble({ value, uniqueKey, isMobile }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block rounded-full text-xs font-bold mr-1 mb-1 max-w-[80px] text-center whitespace-nowrap align-middle"
      style={{
        background: COLORS.propertyBubble,
        color: COLORS.propertyBubbleText,
        lineHeight: "1.4",
        verticalAlign: "middle",
        fontWeight: 700,
        letterSpacing: "0.01em",
        fontSize: isMobile ? "0.74em" : "0.8em",
        padding: isMobile ? "2px 8px" : "2.5px 10px",
        minWidth: isMobile ? 38 : 50,
        boxShadow: `0 1px 6px -3px ${COLORS.accentGold}44`,
        border: `1.1px solid ${COLORS.accentGold}`,
      }}
    >
      {value}
    </span>
  );
}

function ChannelBubble({ value, uniqueKey, isMobile }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block rounded-full text-xs font-bold mr-1 mb-1 max-w-[120px] text-center whitespace-nowrap align-middle"
      style={{
        background: COLORS.channelBubble,
        color: COLORS.channelBubbleText,
        fontWeight: 700,
        fontSize: isMobile ? "0.74em" : "0.8em",
        padding: isMobile ? "2px 8px" : "2.5px 10px",
        minWidth: isMobile ? 38 : 50,
        boxShadow: `0 1px 6px -3px ${COLORS.accentBlue}33`,
        border: `1.1px solid ${COLORS.accentBlue}`,
        letterSpacing: "0.01em",
      }}
    >
      {value}
    </span>
  );
}

// Updated YoSan/Formats Bubble
function YoSanCarriesAndFormatsBubble({ herb, isMobile }) {
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

  const bubbleSize = isMobile
    ? { fontSize: "0.63em", padding: "1px 6px", minWidth: 25, marginRight: 2 }
    : { fontSize: "0.7em", padding: "1.5px 8px", minWidth: 32, marginRight: 5 };

  return (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "row",
        gap: isMobile ? "0.2em" : "0.4em",
        alignItems: "center",
        marginTop: 0,
        marginBottom: 0,
        fontWeight: 600,
      }}
    >
      <span
        style={{
          ...bubbleSize,
          background: COLORS.yoSanBubble,
          color: COLORS.yoSanBubbleText,
          borderRadius: "999px",
          textAlign: "center",
          boxShadow: `0 1px 5px -2px ${COLORS.yoSanBubble}55`,
          border: `1px solid ${COLORS.accentGold}`,
          letterSpacing: "0.01em",
        }}
      >
        Yo San: {yoSanCarries}
      </span>
      {formats && (
        <span
          style={{
            ...bubbleSize,
            background: COLORS.formatsBubble,
            color: COLORS.formatsBubbleText,
            borderRadius: "999px",
            textAlign: "center",
            boxShadow: `0 1px 5px -2px ${COLORS.formatsBubble}55`,
            border: `1px solid ${COLORS.accentGold}`,
            letterSpacing: "0.01em",
          }}
        >
          Formats: {formats}
        </span>
      )}
    </span>
  );
}

// ...rest of your component code unchanged...

function parseDosage(dosage) {
  let gramRanges = [];
  let pieces = [];
  if (!dosage) return { gramRanges, pieces };
  const gramRegex = /(\d+(?:\.\d+)?)(?:-(\d+(?:\.\d+)?))?\s*[gG]\b/gi;
  let gramMatch;
  while ((gramMatch = gramRegex.exec(dosage)) !== null) {
    if (gramMatch[2]) {
      gramRanges.push([parseFloat(gramMatch[1]), parseFloat(gramMatch[2])]);
    } else {
      gramRanges.push([parseFloat(gramMatch[1]), parseFloat(gramMatch[1])]);
    }
  }
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

function correctPiecesSpelling(str) {
  if (!str) return str;
  let out = str;
  const misspellings = [
    /peices/gi, /piecse/gi, /pisces/gi, /piecec/gi, /pece/gi, /pieses/gi,
    /pices/gi, /picese/gi, /peices/gi, /peaces/gi, /peicse/gi, /piaces/gi, /peise/gi
  ];
  misspellings.forEach(ms => {
    out = out.replace(ms, "pieces");
  });
  out = out.replace(/peice/gi, "piece");
  return out;
}

function fixDosageFormat(input) {
  if (!input) return "";
  let val = input.trim();
  val = correctPiecesSpelling(val);
  const onlyNumberOrRange = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?$/;
  if (onlyNumberOrRange.test(val)) return val + "g";
  const gramsPattern = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?\s*[gG]$/;
  if (gramsPattern.test(val)) return val.replace(/\s+/g, '');
  const piecesPattern = /^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?\s*pieces?$/i;
  if (piecesPattern.test(val)) {
    let [amount, , , rangeEnd] = val.match(/^(\d+(\.\d+)?)(-(\d+(\.\d+)?))?/);
    let isRange = !!rangeEnd;
    let num = parseFloat(amount);
    let word = num === 1 && !isRange ? "piece" : "pieces";
    return val.replace(/pieces?/i, word).replace(/\s+$/, '');
  }
  return "";
}

function getHerbKey(herb) {
  return herb.pinyinName || herb.name || herb.id || "";
}

function HerbImageModal({ url, alt }) {
  if (!url) return null;
  return (
    <div
      style={{
        padding: 0,
        margin: "0 auto 1em auto",
        textAlign: "center",
        width: "100%",
      }}
    >
      <img
        src={url}
        alt={alt || "Herb"}
        style={{
          maxWidth: "80vw",
          maxHeight: "34vh",
          borderRadius: "1em",
          boxShadow: `0 4px 18px -3px ${COLORS.shadowStrong}`,
          border: `2px solid ${COLORS.violet}`,
          background: COLORS.backgroundGold,
          objectFit: "contain",
          margin: "0 auto",
        }}
      />
    </div>
  );
}

export default function HerbListCopyToClipboard({ herbs, onRemoveHerb, onResetHerbs }) {
  const [editableDosages, setEditableDosages] = useState(() => {
    const map = {};
    herbs.forEach(h => { map[getHerbKey(h)] = h.dosage || ""; });
    return map;
  });
  const [editingIdx, setEditingIdx] = useState(null);
  const [showCopied, setShowCopied] = useState(false);
  const [dosageErrorIdx, setDosageErrorIdx] = useState(null);
  const [infoOpenIdx, setInfoOpenIdx] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    setEditableDosages(prev => {
      const map = {};
      herbs.forEach((h) => {
        const key = getHerbKey(h);
        map[key] = prev[key] !== undefined ? prev[key] : h.dosage || "";
      });
      return map;
    });
    setEditingIdx(null);
    setDosageErrorIdx(null);
    setInfoOpenIdx(null);
  }, [herbs]);

  const handleCopy = () => {
    const list = herbs
      .map((h) => `${getHerbDisplayName(h)} ${editableDosages[getHerbKey(h)] || ""}`.trim())
      .join("\n");
    navigator.clipboard.writeText(list);
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1800);
  };

  function renderHerbInfoModal(herb, idx) {
    if (infoOpenIdx !== idx) return null;

    const imgUrl =
      herb.herbImageURL
        ? (herb.herbImageURL.startsWith("http")
            ? herb.herbImageURL
            : process.env.PUBLIC_URL + "/" + herb.herbImageURL)
        : undefined;

    const propertiesArr = getPropertiesArr(herb);
    const channelsArr = getChannelsArr(herb);

    const textStyle = {
      color: COLORS.accentBlack,
      fontFamily: 'Inter, "Noto Sans", Arial, Helvetica, sans-serif',
      fontWeight: 500,
      fontSize: "1.07em",
      wordBreak: "break-word",
      lineHeight: 1.7,
      letterSpacing: "0.01em",
    };

    const headingStyle = {
      color: COLORS.backgroundRed,
      fontWeight: 900,
      fontFamily: 'Inter, "Noto Sans", Arial, Helvetica, sans-serif',
      fontSize: "1.23em",
      marginBottom: "0.3em",
      letterSpacing: "-.01em",
      textAlign: "left",
      wordBreak: "break-word",
      lineHeight: 1.15,
    };

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 9999,
          width: "100vw",
          height: "100vh",
          background: "rgba(0,0,0,0.32)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onClick={() => setInfoOpenIdx(null)}
      >
        <div
          style={{
            minWidth: "min(280px, 98vw)",
            maxWidth: "390px",
            width: "96vw",
            background: `linear-gradient(120deg, #fff, ${COLORS.backgroundGold} 70%, ${COLORS.accentGold} 100%)`,
            borderRadius: "1.3em",
            boxShadow: `0 8px 32px -10px ${COLORS.shadowStrong}`,
            border: `2px solid ${COLORS.accentGold}`,
            padding: "18px 12px 18px 12px",
            position: "relative",
            textAlign: "left",
            color: COLORS.accentBlack,
            overflowY: "auto",
            maxHeight: "92vh",
            fontFamily: textStyle.fontFamily,
            fontSize: textStyle.fontSize,
            lineHeight: textStyle.lineHeight,
          }}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={() => setInfoOpenIdx(null)}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: COLORS.accentCrimson,
              color: COLORS.backgroundGold,
              border: "none",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "1.10em",
              width: 28,
              height: 28,
              cursor: "pointer",
              boxShadow: `0 2px 10px -2px ${COLORS.accentCrimson}44`,
              zIndex: 2,
            }}
            title="Close"
          >×</button>
          <div style={{ padding: 0, margin: "0 auto 1em auto", textAlign: "center", width: "100%" }}>
            {imgUrl && <HerbImageModal url={imgUrl} alt={getHerbDisplayName(herb)} />}
          </div>
          <h2 style={headingStyle}>
            {getHerbDisplayName(herb)}
            {herb.chineseCharacters && (
              <span style={{ color: COLORS.violet, fontWeight: 700, fontSize: "1.02em", marginLeft: 8 }}>
                {herb.chineseCharacters}
              </span>
            )}
          </h2>
          <div style={{
            ...textStyle,
            marginBottom: "0.7em",
          }}>
            <span style={{
              background: COLORS.accentIvory,
              borderRadius: "0.9em",
              padding: "6px 15px",
              fontWeight: 700,
              border: `1.5px solid ${COLORS.accentGold}`,
              boxShadow: `0 1px 6px -3px ${COLORS.accentGold}44`,
              color: COLORS.accentGold,
              fontSize: "0.97em",
            }}>
              Dosage: <span style={{ color: COLORS.backgroundRed }}>{herb.dosage || <span style={{ color: COLORS.accentCrimson }}>Set dosage</span>}</span>
            </span>
          </div>
          <div style={{ ...textStyle, marginBottom: "0.5em" }}>
            <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Category:</span> {herb.category}
          </div>
          <div style={{ ...textStyle, marginBottom: "0.5em" }}>
            <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Pharmaceutical Name:</span>{" "}
            {herb.pharmaceuticalName}
          </div>
          <div style={{ ...textStyle, marginBottom: "0.5em" }}>
            <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>English Name(s):</span>{" "}
            {safeArr(herb.englishNames).join(", ")}
          </div>
          <div style={{ ...textStyle, marginBottom: "0.5em" }}>
            <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Properties:</span>{" "}
            {propertiesArr.length > 0 ? propertiesArr.map((val, i) =>
              <PropertyBubble
                value={val}
                uniqueKey={`property-modal-${herb.pinyinName || herb.name || idx}-${val}-${i}`}
                key={`property-modal-${herb.pinyinName || herb.name || idx}-${val}-${i}`}
                isMobile={isMobile}
              />
            ) : (herb.properties || "")}
          </div>
          <div style={{ ...textStyle, marginBottom: "0.5em" }}>
            <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Channels Entered:</span>{" "}
            {channelsArr.length > 0
              ? channelsArr.map((val, i) =>
                  <ChannelBubble
                    value={val}
                    uniqueKey={`channel-modal-${herb.pinyinName || herb.name || idx}-${val}-${i}`}
                    key={`channel-modal-${herb.pinyinName || herb.name || idx}-${val}-${i}`}
                    isMobile={isMobile}
                  />
                )
              : (herb.channelsEntered || "")}
          </div>
          {herb.keywords && (
            <div style={{ ...textStyle, marginBottom: "0.5em", color: COLORS.seal }}>
              <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Keywords:</span>{" "}
              {safeArr(herb.keywords).join(", ")}
            </div>
          )}
          {herb.cautionsAndContraindications && (
            <div style={{ ...textStyle, marginBottom: "0.5em", color: COLORS.seal }}>
              <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Cautions/Contraindications:</span>{" "}
              {safeArr(herb.cautionsAndContraindications).join("; ")}
            </div>
          )}
          {herb.notes && (
            <div style={{ ...textStyle, marginBottom: "0.5em", color: COLORS.seal }}>
              <span style={{ fontWeight: 700, color: COLORS.accentBlack }}>Notes:</span>{" "}
              {safeArr(herb.notes).join("; ")}
            </div>
          )}
          <div style={{ marginTop: "1.1em", marginBottom: "2px", ...textStyle }}>
            <YoSanCarriesAndFormatsBubble herb={herb} isMobile={isMobile} />
          </div>
        </div>
      </div>
    );
  }

  function renderDosageSum(herbs, dosagesArr) {
    let minGrams = 0;
    let maxGrams = 0;
    let piecesByHerb = {};

    herbs.forEach((h, idx) => {
      const { gramRanges, pieces } = parseDosage(dosagesArr[idx]);
      gramRanges.forEach(([min, max]) => {
        minGrams += min;
        maxGrams += max;
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
          fontSize: "1.08em",
          color: COLORS.accentBlack,
          background: COLORS.dosageBubble,
          padding: "14px 28px",
          borderRadius: "1.1em",
          boxShadow: `0 2px 14px -6px ${COLORS.dosageBubbleBorder}`,
          border: `3px solid ${COLORS.dosageBubbleBorder}`,
          textAlign: "center",
          letterSpacing: "0.02em"
        }}
      >
        <span style={{
          color: COLORS.dosageBubbleText,
          fontWeight: 900,
          fontSize: "1.13em"
        }}>
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
    const key = getHerbKey(herbs[idx]);
    setEditableDosages(prev => ({ ...prev, [key]: value }));
    setDosageErrorIdx(null);
  }
  function handleDosageBlur(idx) {
    const key = getHerbKey(herbs[idx]);
    let fixed = fixDosageFormat(editableDosages[key]);
    if (!fixed && editableDosages[key]) {
      setDosageErrorIdx(idx);
      return;
    }
    setEditableDosages(prev => ({ ...prev, [key]: fixed }));
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
          background: COLORS.sectionHeader,
          borderColor: COLORS.accentGold,
          width: "100%",
          maxWidth: 430,
          overflow: "hidden",
        }}
      >
        <div
          className="flex justify-between items-center px-6 py-4"
          style={{
            borderBottom: herbs.length > 0 ? `2px solid ${COLORS.accentGold}` : "none",
            background: COLORS.sectionHeader,
          }}
        >
          <span
            className="font-bold text-lg"
            style={{
              color: COLORS.backgroundRed,
              letterSpacing: "0.02em",
            }}
          >
            Custom Formula Herb List ({herbs.length})
          </span>
          {herbs.length > 0 && !!onResetHerbs && (
            <button
              className="ml-4 px-3 py-1 rounded-full text-sm font-bold shadow hover:scale-110 transition-all"
              style={{
                border: "none",
                outline: "none",
                cursor: "pointer",
                background: COLORS.accentCrimson,
                color: COLORS.backgroundGold,
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
            background: COLORS.accentIvory,
          }}
        >
          {herbs.length === 0 ? (
            <div className="text-center text-accentBlack py-4" style={{ fontStyle: "italic", fontSize: 16, color: COLORS.accentBlack }}>
              Add herbs to your formula using the search bar. Once a formula is created, press <b>Copy Herbs To Clipboard</b> to paste them all into your chart.
            </div>
          ) : (
            <>
              <button
                className="px-5 py-2 font-bold rounded-full shadow-xl mb-4 hover:scale-105 hover:shadow-2xl transition-all duration-200"
                style={{
                  background: `linear-gradient(90deg, ${COLORS.accentGold}, ${COLORS.accentEmerald}, ${COLORS.backgroundRed})`,
                  color: COLORS.accentIvory,
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
                    background: COLORS.accentEmerald,
                    color: COLORS.backgroundGold,
                  }}
                >
                  Herb list copied!
                </div>
              )}
              <div className="text-accentBlack text-sm text-center w-full mb-2" style={{ color: COLORS.accentBlack }}>
                <strong>Copy preview:</strong>
              </div>
              <div className="mb-2 text-center text-[0.97em]" style={{
                color: COLORS.backgroundRed,
                padding: "10px 0",
                background: COLORS.dosageBubble,
                borderRadius: "1.2em",
                border: `3px solid ${COLORS.dosageBubbleBorder}`,
                boxShadow: `0 2px 14px -6px ${COLORS.dosageBubbleBorder}`,
                marginBottom: "1.2em",
                fontWeight: 700,
                fontSize: "1.06em",
                letterSpacing: "0.02em"
              }}>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "0.45em",
                    color: COLORS.backgroundRed,
                    fontWeight: 700,
                    fontSize: "1.08em",
                  }}
                >
                  <span role="img" aria-label="edit" style={{ fontSize: "1.13em" }}>✏️</span>
                  <span>Click any dosage below to edit</span>
                </span>
              </div>
              <div>
                {herbs.map((h, idx) => {
                  const key = getHerbKey(h);
                  const propertiesArr = getPropertiesArr(h);
                  return (
                    <div
                      key={key}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        marginBottom: 15,
                        background: COLORS.dosageBg,
                        borderRadius: 12,
                        boxShadow: `0 0 2px ${COLORS.shadowStrong}`,
                        padding: "12px 10px",
                        marginTop: 8,
                        position: "relative",
                        flexWrap: "wrap",
                        minHeight: 44,
                        border: `2px solid ${COLORS.accentGold}`,
                        transition: "background 0.18s, border 0.18s",
                      }}
                    >
                      {/* Herb info modal */}
                      {renderHerbInfoModal(h, idx)}
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
                              background: `linear-gradient(135deg, ${COLORS.accentEmerald}, ${COLORS.accentIvory}, ${COLORS.accentGold})`,
                              color: COLORS.backgroundRed,
                              borderRadius: "50%",
                              width: isMobile ? "1em" : "1.3em",
                              height: isMobile ? "1em" : "1.3em",
                              minWidth: isMobile ? "1em" : "1.3em",
                              minHeight: isMobile ? "1em" : "1.3em",
                              maxWidth: isMobile ? "1em" : "1.3em",
                              maxHeight: isMobile ? "1em" : "1.3em",
                              textAlign: "center",
                              fontSize: isMobile ? "0.82em" : "0.95em",
                              fontWeight: 700,
                              marginRight: "0.7em",
                              border: `1.3px solid ${COLORS.accentGold}`,
                              boxSizing: "border-box",
                              boxShadow: `0 0 6px 0 ${COLORS.accentEmerald}22`,
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
                              fontSize: isMobile ? "1em" : "1.12em",
                              color: COLORS.backgroundRed,
                              fontWeight: 900,
                              textShadow: "0 1px 0 #F9E8C2, 0 2px 6px #B38E3F22",
                              flexGrow: 1,
                              marginRight: "0.65em",
                              letterSpacing: "0.01em",
                            }}
                          >
                            {getHerbDisplayName(h)}
                          </span>
                          <button
                            className="ml-2 px-2 py-0.5"
                            style={{
                              background: COLORS.accentBlue,
                              color: COLORS.accentIvory,
                              borderRadius: "6px",
                              fontWeight: "bold",
                              fontSize: isMobile ? "0.85em" : "1em",
                              border: "none",
                              minWidth: isMobile ? "1.3em" : "1.8em",
                              height: isMobile ? "1.3em" : "1.8em",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginLeft: 6,
                              transition: "background 0.15s, scale 0.15s",
                              boxShadow: `0 1px 5px 0 ${COLORS.accentBlue}44`,
                              cursor: "pointer",
                            }}
                            title="Show herb info"
                            onClick={() => setInfoOpenIdx(idx)}
                          >
                            <span style={{ fontWeight: 700, fontSize: isMobile ? "1em" : "1.12em" }}>i</span>
                          </button>
                          {editingIdx === idx ? (
                            <>
                              <input
                                type="text"
                                value={editableDosages[key]}
                                autoFocus
                                onChange={e => handleDosageChange(idx, e.target.value)}
                                onBlur={() => handleDosageBlur(idx)}
                                onKeyDown={e => handleDosageKeyDown(e, idx)}
                                style={{
                                  fontSize: isMobile ? 13 : 15,
                                  padding: "2px 8px",
                                  borderRadius: "6px",
                                  border: `2px solid ${dosageErrorIdx === idx ? COLORS.accentCrimson : COLORS.editBorder}`,
                                  marginRight: 8,
                                  minWidth: isMobile ? 65 : 85,
                                  fontWeight: 500,
                                  color: COLORS.accentBlack,
                                  background: dosageErrorIdx === idx ? "#FFD6D6" : COLORS.editBg,
                                  boxShadow: `0 1px 6px -3px ${COLORS.editBorder}99`,
                                  outline: "none",
                                  transition: "border 0.18s, background 0.18s",
                                }}
                              />
                              {dosageErrorIdx === idx && (
                                <span style={{ color: COLORS.accentCrimson, fontWeight: 600, fontSize: "0.97em", marginLeft: 2 }}>
                                  Invalid
                                </span>
                              )}
                            </>
                          ) : (
                            <span
                              style={{
                                fontSize: isMobile ? 13 : 15,
                                color: COLORS.dosageBubbleText,
                                fontWeight: 700,
                                marginRight: 8,
                                cursor: "pointer",
                                borderBottom: `2px solid ${COLORS.dosageBubbleBorder}`,
                                padding: isMobile ? "2px 7px" : "3px 10px",
                                background: COLORS.dosageBubble,
                                borderRadius: "10px",
                                transition: "background 0.18s, border 0.18s",
                                boxShadow: `0 2px 12px -4px ${COLORS.dosageBubbleBorder}`,
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "0.3em",
                                letterSpacing: "0.02em"
                              }}
                              title="Click to edit dosage"
                              onClick={() => handleEditClick(idx)}
                            >
                              <span style={{ color: COLORS.accentGold, fontSize: "1.04em", marginRight: "2px" }}>✏️</span>
                              {editableDosages[key] || <span style={{ color: COLORS.accentCrimson, fontWeight: 400 }}>Set dosage</span>}
                            </span>
                          )}
                          {onRemoveHerb && (
                            <button
                              className="ml-2 px-2 py-0.5"
                              style={{
                                background: COLORS.accentCrimson,
                                color: COLORS.backgroundGold,
                                borderRadius: "6px",
                                fontWeight: "bold",
                                fontSize: isMobile ? "0.9em" : "1.1em",
                                border: "none",
                                minWidth: isMobile ? "1.1em" : "1.5em",
                                height: isMobile ? "1.1em" : "1.5em",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                marginLeft: 6,
                                transition: "background 0.15s, scale 0.15s",
                                boxShadow: `0 1px 5px 0 ${COLORS.accentCrimson}44`,
                                cursor: "pointer",
                              }}
                              onClick={() => onRemoveHerb(h.pinyinName || h.name)}
                              title={`Remove ${getHerbDisplayName(h)}`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                        {/* Categories, YoSanCarries, Formats */}
                        <div style={{ marginTop: "2px", marginLeft: isMobile ? "1.1em" : "2.0em" }}>
                          <YoSanCarriesAndFormatsBubble herb={h} isMobile={isMobile} />
                        </div>
                        {/* Properties bubbles */}
                        {propertiesArr.length > 0 && (
                          <div style={{ marginTop: "3px", marginLeft: isMobile ? "1.1em" : "2.0em", display: "flex", flexWrap: "wrap", gap: 2 }}>
                            {propertiesArr.map((val, i) =>
                              <PropertyBubble
                                value={val}
                                uniqueKey={`property-card-${h.pinyinName || h.name || idx}-${val}-${i}`}
                                key={`property-card-${h.pinyinName || h.name || idx}-${val}-${i}`}
                                isMobile={isMobile}
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              {renderDosageSum(herbs, herbs.map(h => editableDosages[getHerbKey(h)]))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}