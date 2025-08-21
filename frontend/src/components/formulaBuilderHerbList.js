import React from "react";

// Color scheme (should match your app)
const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
};

// Utility to get display name for a herb
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

function PropertyBubble({ value, uniqueKey }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block bg-[#F6EAF9] text-[#7C5CD3] rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1 max-w-[80px] text-center whitespace-nowrap align-middle"
      style={{
        lineHeight: "1.4",
        verticalAlign: "middle",
      }}
    >
      {value}
    </span>
  );
}

// ChannelBubble: all channels, including "Large Intestine", fully covered by the bubble
function ChannelBubble({ value, uniqueKey }) {
  if (!value) return null;
  return (
    <span
      key={uniqueKey}
      className="inline-block bg-[#E6F6F6] text-[#2196B6] border border-[#2196B6] rounded-full px-2 py-0.5 text-xs font-medium mr-1 mb-1 max-w-[120px] text-center whitespace-nowrap align-middle"
      style={{
        lineHeight: "1.4",
        verticalAlign: "middle",
      }}
    >
      {value}
    </span>
  );
}

function FormulaHerbCard({ herb, onRemove, number }) {
  const displayName = getHerbDisplayName(herb);
  const [exiting, setExiting] = React.useState(false);
  const handleRemove = () => {
    setExiting(true);
    setTimeout(onRemove, 350);
  };

  const propertiesArr = getPropertiesArr(herb);
  const channelsArr = getChannelsArr(herb);

  const propertyBubbles = propertiesArr.map((val, i) => (
    <PropertyBubble
      value={val}
      uniqueKey={`property-${herb.pinyinName || herb.name || number}-${val}-${i}`}
      key={`property-${herb.pinyinName || herb.name || number}-${val}-${i}`}
    />
  ));
  const channelBubbles = channelsArr.map((val, i) => (
    <ChannelBubble
      value={val}
      uniqueKey={`channel-${herb.pinyinName || herb.name || number}-${val}-${i}`}
      key={`channel-${herb.pinyinName || herb.name || number}-${val}-${i}`}
    />
  ));

  if (herb.error) {
    return (
      <div
        className={`border border-red-400 rounded-xl px-3 py-2 mb-3 flex flex-col bg-red-50 w-full max-w-xl mx-auto shadow-lg animate-fadeIn ${
          exiting ? "animate-slideOut" : ""
        }`}
      >
        <div className="flex justify-between items-center w-full">
          <span className="font-bold text-red-700 text-sm">
            Error: Herb not found
          </span>
          <button
            className="ml-2 px-2 py-0.5 bg-red-400 text-white rounded text-xs font-bold transition hover:scale-110"
            onClick={handleRemove}
          >
            Remove
          </button>
        </div>
        <div className="text-xs text-red-700">
          {herb.originalString} <span className="italic">({herb.pinyin})</span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`border-2 rounded-xl px-4 py-3 mb-3 flex flex-col w-full max-w-xl mx-auto shadow-xl transition-all duration-300 bg-gradient-to-tr from-[#68C5E6] via-[#FFF7E3] to-[#7C5CD3] hover:border-[#A52439] hover:scale-[1.05] hover:shadow-2xl backdrop-blur-lg animate-fadeIn ${
        exiting ? "animate-slideOut" : ""
      }`}
    >
      <div className="flex flex-row items-center w-full mb-1">
        <span className="font-bold flex flex-row items-center text-[#A52439] text-[1.2rem]">
          <span
            className="inline-flex items-center justify-center rounded-full w-[1.3em] h-[1.3em] text-center text-[0.85em] font-bold mr-2 border border-[#7C5CD3] shadow"
            style={{
              background: `linear-gradient(135deg, ${COLORS.carolina}, ${COLORS.vanilla}, ${COLORS.violet})`,
              color: COLORS.claret,
              boxShadow: `0 0 6px 0 ${COLORS.carolina}22`,
              minWidth: "1.3em",
              minHeight: "1.3em",
              maxWidth: "1.3em",
              maxHeight: "1.3em",
              borderWidth: "1.4px",
              boxSizing: "border-box",
            }}
          >
            {number}
          </span>
          <span className="whitespace-nowrap overflow-visible text-ellipsis mr-2 min-w-0">
            {displayName}
          </span>
        </span>
        <span className="ml-1 text-xs font-semibold text-[#7C5CD3] whitespace-normal break-words max-w-[40%]">
          {herb.dosage || ""}
        </span>
        <button
          className="ml-2 px-2 py-0.5 bg-[#A52439] text-[#FFF7E3] rounded font-bold text-[0.85rem] transition-all"
          onClick={handleRemove}
        >
          Remove
        </button>
      </div>

      {/* Category above */}
      <div className="flex flex-row items-center justify-between w-full mb-1">
        <span className="text-xs font-semibold text-[#3B4461] text-[0.92rem]">
          <b>Category:</b> {herb.category}
        </span>
      </div>

      {/* Actions above bubbles */}
      <div className="flex flex-row items-center justify-between w-full mt-1 mb-1">
        <span className="text-xs font-semibold text-[#3B4461] text-[0.92rem]">
          <b>Actions:</b> {herb.actions}
        </span>
      </div>

      {/* Bubbles in two tight rows if needed */}
      {(propertyBubbles.length > 0 || channelBubbles.length > 0) && (
        <div className="w-full">
          <div className="flex flex-row flex-wrap gap-1 items-center justify-start mb-0 min-w-0">
            {propertyBubbles}
          </div>
          <div className="flex flex-row flex-wrap gap-1 items-center justify-start mb-1 min-w-0">
            {channelBubbles}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FormulaBuilderHerbList({
  herbs,
  onRemoveHerb,
  onResetHerbs,
  maxHerbs = 25,
}) {
  return (
    <div
      className="flex flex-col rounded-3xl shadow-2xl p-8 transition duration-200 border-2"
      style={{
        background: `linear-gradient(120deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 100%)`,
        borderColor: COLORS.violet,
        minHeight: "450px",
        backdropFilter: "blur(12px)",
      }}
    >
      <div className="flex flex-col items-center mb-6 w-full">
        <span
          style={{ color: COLORS.claret }}
          className="text-2xl font-bold tracking-wide mb-2"
        >
          Herb Info
        </span>
        <span
          style={{ color: COLORS.violet }}
          className="font-semibold text-xl"
        >
          {herbs.length} / {maxHerbs} herbs added
        </span>
        {herbs.length > 0 && !!onResetHerbs && (
          <button
            className="mt-2 px-3 py-1 bg-[#A52439] text-[#FFF7E3] rounded-full text-sm font-bold shadow hover:scale-110 transition-all"
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
      <div className="mb-8 w-full flex flex-col items-center min-h-[120px]">
        {herbs.length === 0 ? (
          <p className="text-[#3B4461] text-lg text-center animate-fadeIn">
            Add herbs to your formula using the search bar. Once a formula is created, press Copy Herbs To Clipboard to be able to paste them all into your chart.
          </p>
        ) : (
          herbs.map((herb, idx) => (
            <FormulaHerbCard
              key={herb.id ?? `${herb.pinyinName || herb.name || ""}-${idx}`}
              herb={herb}
              onRemove={() => onRemoveHerb(herb.pinyinName || herb.name)}
              number={idx + 1}
            />
          ))
        )}
      </div>
    </div>
  );
}