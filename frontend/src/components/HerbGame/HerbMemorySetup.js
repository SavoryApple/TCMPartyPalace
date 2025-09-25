import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  generateNameKeyActionsPairs,
  generateNameCategoryPairs,
  generateNameGroupPairs,
} from "./herbGameUtils";
import NavBar from "../NavBar";
import FooterCard from "../FooterCard";
import BackToTopButton from "../BackToTopButton";

// Match modes
const MATCH_MODES = [
  { label: "Herb Name ↔ Key Actions", value: "name-keyActions" },
  { label: "Herb Name ↔ Category", value: "name-category" },
  { label: "Herb Group → Category", value: "group-category" }, // changed label for clarity
];

const NAVBAR_HEIGHT = 84;

function ReturnToHomeButton() {
  return (
    <div
      className="back-to-home-btn"
      style={{
        position: "fixed",
        top: `${NAVBAR_HEIGHT + 12}px`,
        right: 32,
        zIndex: 101,
        display: "flex",
        justifyContent: "flex-end",
      }}
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-accentEmerald"
        style={{
          background: "#D4AF37",
          color: "#9A2D1F",
          border: "2px solid #44210A",
          textShadow: "0 1px 0 #F9E8C2",
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );
}

function StepBadge({ number }) {
  return (
    <span
      style={{
        display: "inline-block",
        background: "#D4AF37",
        color: "#9A2D1F",
        fontWeight: 900,
        fontSize: "1.12em",
        width: 28,
        height: 28,
        borderRadius: "50%",
        textAlign: "center",
        lineHeight: "28px",
        marginRight: 10,
        boxShadow: "0 2px 8px #B38E3F44",
        letterSpacing: "-0.01em",
        border: "2px solid #B38E3F",
      }}
    >
      {number}
    </span>
  );
}

function flattenCategories(arr, path = "") {
  let flat = [];
  if (!Array.isArray(arr)) return flat;
  arr.forEach((item, idx) => {
    if (!item) return;
    if (Array.isArray(item.categories)) {
      flat = flat.concat(flattenCategories(item.categories, path + idx + "."));
    } else if (item.name || item.category) {
      flat.push({ ...item, _flattenKey: (item.name || item.category) + "_" + path + idx });
    }
  });
  return flat;
}

const selectButtonStyles = (color) => ({
  background: "#fffbe4",
  color,
  border: `2px solid ${color}`,
  borderRadius: "1em",
  padding: "4px 18px",
  fontWeight: 700,
  fontSize: "0.97em",
  cursor: "pointer",
  marginLeft: "10px",
  letterSpacing: "-0.01em",
  boxShadow: `0 2px 8px ${color}22`,
  display: "inline-flex",
  alignItems: "center"
});

export default function HerbMemorySetup() {
  const navigate = useNavigate();

  const [herbCategoryList, setHerbCategoryList] = useState([]);
  const [herbGroupsList, setHerbGroupsList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedMatchMode, setSelectedMatchMode] = useState(MATCH_MODES[0].value);

  const [catSelectAll, setCatSelectAll] = useState(false);
  const [subcatSelectAll, setSubcatSelectAll] = useState(false);
  const [globalSelectAll, setGlobalSelectAll] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/herbCategoryListObject.json").then((r) => r.json()),
      fetch("/data/herbGroupsList.json").then((r) => r.json()),
    ])
      .then(([catList, groupList]) => {
        let arr = [];
        if (Array.isArray(catList.categories)) {
          arr = catList.categories;
        } else if (Array.isArray(catList)) {
          arr = catList;
        }
        const cats = flattenCategories(arr);
        const groups = Array.isArray(groupList) ? groupList : (groupList.groups || []);
        setHerbCategoryList(cats);
        setHerbGroupsList(groups);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const availableSubcategories = useMemo(() => {
    if (!herbCategoryList.length || !selectedCategories.length) return [];
    const subs = [];
    herbCategoryList
      .filter((cat) => selectedCategories.includes(cat.name || cat.category))
      .forEach((cat) => {
        (cat.subcategories || []).forEach((sub) => {
          subs.push(sub.name || sub.title);
        });
      });
    return [...new Set(subs)];
  }, [herbCategoryList, selectedCategories]);

  // For group-category mode, pairs are generated from all groups (no selection).
  const availablePairs = useMemo(() => {
    if (loading) return [];
    if (selectedMatchMode === "name-keyActions") {
      if (!selectedCategories.length || !selectedSubcategories.length) return [];
      const cats = herbCategoryList.filter((cat) =>
        selectedCategories.includes(cat.name || cat.category)
      );
      const filteredCats = cats.map((cat) => ({
        ...cat,
        subcategories: (cat.subcategories || []).filter((sub) =>
          selectedSubcategories.includes(sub.name || sub.title)
        ),
      }));
      return generateNameKeyActionsPairs(filteredCats);
    } else if (selectedMatchMode === "name-category") {
      if (!selectedCategories.length || !selectedSubcategories.length) return [];
      const cats = herbCategoryList.filter((cat) =>
        selectedCategories.includes(cat.name || cat.category)
      );
      const filteredCats = cats.map((cat) => ({
        ...cat,
        subcategories: (cat.subcategories || []).filter((sub) =>
          selectedSubcategories.includes(sub.name || sub.title)
        ),
      }));
      return generateNameCategoryPairs(filteredCats);
    } else if (selectedMatchMode === "group-category") {
      // Use all groups, generate group-to-category pairs
      return generateNameGroupPairs(herbGroupsList, herbCategoryList);
    }
    return [];
  }, [
    selectedMatchMode,
    selectedCategories,
    selectedSubcategories,
    herbCategoryList,
    herbGroupsList,
    loading,
  ]);

  function handleSectionSelectAll(type, checked) {
    if (type === "category") {
      setCatSelectAll(checked);
      const allCats = checked ? herbCategoryList.map(c => c.name || c.category) : [];
      setSelectedCategories(allCats);
      const allSubs = checked
        ? herbCategoryList
            .filter(cat => allCats.includes(cat.name || cat.category))
            .flatMap(cat => (cat.subcategories || []).map(sub => sub.name || sub.title))
        : [];
      setSelectedSubcategories(allSubs);
    }
    else if (type === "subcategory") {
      setSubcatSelectAll(checked);
      const allSubs = checked ? availableSubcategories : [];
      setSelectedSubcategories(allSubs);
    }
    else if (type === "global") {
      setGlobalSelectAll(checked);
      setCatSelectAll(checked);
      setSubcatSelectAll(checked);
      const allCats = checked ? herbCategoryList.map(c => c.name || c.category) : [];
      setSelectedCategories(allCats);
      const allSubs = checked
        ? herbCategoryList
            .filter(cat => allCats.includes(cat.name || cat.category))
            .flatMap(cat => (cat.subcategories || []).map(sub => sub.name || sub.title))
        : [];
      setSelectedSubcategories(allSubs);
    }
  }
  function handleSectionDeselectAll(type) {
    if (type === "category") {
      setCatSelectAll(false);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
    }
    else if (type === "subcategory") {
      setSubcatSelectAll(false);
      setSelectedSubcategories([]);
    }
    else if (type === "global") {
      setGlobalSelectAll(false);
      setCatSelectAll(false);
      setSubcatSelectAll(false);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
    }
  }
  useEffect(() => {
    setCatSelectAll(selectedCategories.length === herbCategoryList.length && herbCategoryList.length > 0);
  }, [selectedCategories, herbCategoryList]);
  useEffect(() => {
    setSubcatSelectAll(selectedSubcategories.length === availableSubcategories.length && availableSubcategories.length > 0);
  }, [selectedSubcategories, availableSubcategories]);

  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    let updated = checked
      ? [...selectedCategories, value]
      : selectedCategories.filter((cat) => cat !== value);
    // Remove subcategories that no longer belong to any selected category
    const allowedSubs = [];
    herbCategoryList
      .filter((cat) => updated.includes(cat.name || cat.category))
      .forEach((cat) =>
        (cat.subcategories || []).forEach((sub) =>
          allowedSubs.push(sub.name || sub.title)
        )
      );
    setSelectedSubcategories((subs) => subs.filter((s) => allowedSubs.includes(s)));
    setSelectedCategories(updated);
  }
  function handleSubcategoryChange(e) {
    const { value, checked } = e.target;
    setSelectedSubcategories((prev) =>
      checked ? [...prev, value] : prev.filter((s) => s !== value)
    );
  }
  function handleMatchModeChange(e) {
    setSelectedMatchMode(e.target.value);
    setSelectedCategories([]);
    setSelectedSubcategories([]);
  }
  function handleStartGame() {
    let state = { matchMode: selectedMatchMode };
    if (selectedMatchMode === "group-category") {
      // For group-category, no categories/subcategories selection
    } else {
      state.categories = selectedCategories;
      state.subcategories = selectedSubcategories;
    }
    navigate("/game/herbs/play", { state });
  }

  const stepDisabled = {
    matchMode: false,
    categories: selectedMatchMode === "group-category",
    subcategories: selectedMatchMode === "group-category" || !selectedCategories.length,
    start:
      (selectedMatchMode === "group-category"
        ? availablePairs.length < 4
        : !selectedCategories.length || !selectedSubcategories.length ||
          availablePairs.length < 4),
  };

  // Order: 1. Matching Mode, 2. Categories, 3. Subcategories, 4. Start
  const isMobile = window.innerWidth < 700;
  const setupPanelStyles = isMobile
    ? {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        alignItems: "stretch",
      }
    : {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "18px",
        width: "100%",
        alignItems: "flex-start",
      };
  const cardBase = {
    background: "#F9E8C2",
    border: "2px solid #D4AF37",
    borderRadius: "13px",
    padding: isMobile ? "10px 7px" : "14px 10px",
    boxSizing: "border-box",
    boxShadow: "0 2px 8px #D4AF37aa",
    minWidth: 0,
    maxWidth: "100%",
    width: "100%",
    marginBottom: 0,
    overflow: "visible",
  };
  const catStyles = {
    ...cardBase,
    background: "#E9F9E2",
    border: "2px solid #B38E3F",
    boxShadow: "0 2px 8px #B38E3F44",
  };
  // UPDATED: subcategory panel disables and grays out for group-category
  const subcatPanelDisabled = selectedMatchMode === "group-category" || !selectedCategories.length;
  const subcatStyles = {
    ...cardBase,
    background: "#fffbe4",
    border: "2px solid #2176AE",
    boxShadow: "0 2px 8px #2176AE44",
    opacity: subcatPanelDisabled ? 0.45 : 1,
    pointerEvents: subcatPanelDisabled ? "none" : "auto"
  };
  const matchModeStyles = {
    ...cardBase,
    background: "#e7f1fd",
    border: "2px solid #438C3B",
    boxShadow: "0 2px 8px #438C3B44",
  };
  const startButtonStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: isMobile ? "92px" : "120px",
    marginTop: isMobile ? "0px" : "8px",
    boxSizing: "border-box",
    width: "100%",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(110deg,#F9E8C2 68%, #fef6e3 100%)",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        position: "relative",
        paddingBottom: 0,
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
      />
      <div style={{ height: NAVBAR_HEIGHT }} />
      <ReturnToHomeButton />
      <BackToTopButton right={75} />
      <div
        style={{
          flex: "1 1 auto",
          maxWidth: isMobile ? "100vw" : 1300,
          marginLeft: "auto",
          marginRight: "auto",
          paddingTop: isMobile ? "6px" : "14px",
          paddingLeft: isMobile ? "3px" : "16px",
          paddingRight: isMobile ? "3px" : "16px",
          width: "100%",
          minHeight: "80vh",
          boxSizing: "border-box",
        }}
      >
        <h1
          style={{
            textAlign: "center",
            fontWeight: 900,
            fontSize: isMobile ? "1.23em" : "2.2em",
            color: "#9A2D1F",
            marginTop: "0.10em",
            marginBottom: "0.08em",
            letterSpacing: "-0.01em",
            textShadow: `0 2px 12px #D4AF37, 0 1px 0 #F9E8C2`,
            paddingLeft: isMobile ? 2 : 0,
            paddingRight: isMobile ? 2 : 0,
          }}
        >
          Herb Memory Game
        </h1>
        <p
          style={{
            fontSize: isMobile ? "0.99em" : "1.08em",
            textAlign: "center",
            color: "#44210A",
            marginTop: "0.13em",
            marginBottom: isMobile ? "0.3em" : "0.8em",
            fontWeight: 500,
            maxWidth: isMobile ? "98vw" : 700,
            marginLeft: "auto",
            marginRight: "auto",
            background: "#fffbe4",
            padding: isMobile ? "4px 5px" : "8px 18px",
            borderRadius: "1em",
            boxShadow: "0 2px 16px -8px #D4AF37aa",
          }}
        >
          <StepBadge number={1} />Matching Mode,&nbsp;
          <StepBadge number={2} />Categories,&nbsp;
          <StepBadge number={3} />Subcategories,&nbsp;
          <StepBadge number={4} />Start Game!
          <br />
          <span style={{ color: "#2176AE" }}>
            Match herb names to their key actions or category, or play the group→category challenge!
          </span>
        </p>
        {loading ? (
          <div
            style={{
              margin: "2em auto",
              textAlign: "center",
              color: "#C0392B",
              fontWeight: 700,
              fontSize: "1.2em",
              background: "#fffbe4",
              borderRadius: "1em",
              padding: "1.3em",
            }}
          >
            Loading herb data...
          </div>
        ) : (
          <div
            style={{
              margin: "0 auto",
              width: "100%",
              maxWidth: isMobile ? "99vw" : 1300,
              paddingTop: isMobile ? "4px" : "8px",
              paddingBottom: isMobile ? "7px" : "14px",
              paddingLeft: isMobile ? "1px" : "10px",
              paddingRight: isMobile ? "1px" : "10px",
              marginTop: "0",
              marginBottom: isMobile ? "8px" : "18px",
            }}
          >
            <div style={{ width: "100%", textAlign: "left", marginBottom: 7 }}>
              <label style={{
                fontWeight: 900,
                color: "#B38E3F",
                fontSize: isMobile ? "0.97em" : "1.09em",
                cursor: "pointer",
                letterSpacing: "-.01em"
              }}>
                <input
                  type="checkbox"
                  checked={catSelectAll && subcatSelectAll}
                  onChange={e => handleSectionSelectAll("global", e.target.checked)}
                  style={{ marginRight: 7, transform: "scale(1.1)" }}
                />
                Select All (Categories & Subcategories)
              </label>
              {/* Removed the Deselect All button next to Select All */}
            </div>
            <div style={setupPanelStyles}>
              {/* 1. Matching Mode */}
              <div style={matchModeStyles}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <StepBadge number={1} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: isMobile ? "0.96em" : "1.08em",
                      color: "#2176AE",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Matching Mode
                  </span>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {MATCH_MODES.map((m, idx) => (
                    <label key={m.value + "_" + idx} style={{ marginBottom: 6, fontWeight: 500, fontSize: isMobile ? "0.95em" : "1em" }}>
                      <input
                        type="radio"
                        name="matchingMode"
                        value={m.value}
                        checked={selectedMatchMode === m.value}
                        onChange={handleMatchModeChange}
                        style={{ marginRight: 7, transform: "scale(1.07)" }}
                      />
                      {m.label}
                    </label>
                  ))}
                </div>
              </div>
              {/* 2. Categories */}
              <div style={catStyles}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <StepBadge number={2} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: isMobile ? "0.96em" : "1.08em",
                      color: "#438C3B",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Categories
                  </span>
                </div>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 10,
                  opacity: stepDisabled.categories ? 0.45 : 1,
                  pointerEvents: stepDisabled.categories ? "none" : "auto"
                }}>
                  <label style={{
                    fontWeight: 700, color: "#2176AE", display: "flex",
                    alignItems: "center"
                  }}>
                    <input
                      type="checkbox"
                      checked={catSelectAll}
                      onChange={e => handleSectionSelectAll("category", e.target.checked)}
                      disabled={stepDisabled.categories}
                      style={{ marginRight: 7, transform: "scale(1.07)" }}
                    />
                    Select All Categories
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSectionDeselectAll("category")}
                    style={{
                      ...selectButtonStyles("#2176AE"),
                      opacity: stepDisabled.categories ? 0.45 : 1,
                      pointerEvents: stepDisabled.categories ? "none" : "auto"
                    }}
                    tabIndex={0}
                    disabled={stepDisabled.categories}
                  >
                    Deselect All
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {herbCategoryList.map((cat) => (
                    <label
                      key={cat._flattenKey}
                      style={{
                        marginBottom: 2,
                        fontWeight: 500,
                        whiteSpace: "normal",
                        display: "flex",
                        alignItems: "center",
                        fontSize: isMobile ? "0.95em" : "1em",
                        opacity: stepDisabled.categories ? 0.4 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        value={cat.name || cat.category}
                        checked={selectedCategories.includes(cat.name || cat.category)}
                        onChange={handleCategoryChange}
                        disabled={stepDisabled.categories}
                        style={{ marginRight: 7, transform: "scale(1.06)" }}
                      />
                      {cat.name || cat.category}
                    </label>
                  ))}
                </div>
              </div>
              {/* 3. Subcategories */}
              <div style={subcatStyles}>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                  <StepBadge number={3} />
                  <span
                    style={{
                      fontWeight: 700,
                      fontSize: isMobile ? "0.96em" : "1.08em",
                      color: "#B38E3F",
                      letterSpacing: "-0.01em",
                    }}
                  >
                    Subcategories
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 10 }}>
                  <label style={{
                    fontWeight: 700, color: "#438C3B", display: "flex",
                    alignItems: "center"
                  }}>
                    <input
                      type="checkbox"
                      checked={subcatSelectAll}
                      onChange={e => handleSectionSelectAll("subcategory", e.target.checked)}
                      disabled={stepDisabled.subcategories}
                      style={{ marginRight: 7, transform: "scale(1.07)" }}
                    />
                    Select All Subcategories
                  </label>
                  <button
                    type="button"
                    onClick={() => handleSectionDeselectAll("subcategory")}
                    style={selectButtonStyles("#438C3B")}
                    tabIndex={0}
                    disabled={stepDisabled.subcategories}
                  >
                    Deselect All
                  </button>
                </div>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {availableSubcategories.map((sub, idx) => (
                    <label
                      key={sub + "_" + idx}
                      style={{
                        marginBottom: 2,
                        fontWeight: 500,
                        whiteSpace: "normal",
                        display: "flex",
                        alignItems: "center",
                        fontSize: isMobile ? "0.95em" : "1em",
                        opacity: stepDisabled.subcategories ? 0.4 : 1,
                      }}
                    >
                      <input
                        type="checkbox"
                        value={sub}
                        checked={selectedSubcategories.includes(sub)}
                        onChange={handleSubcategoryChange}
                        disabled={stepDisabled.subcategories}
                        style={{ marginRight: 7, transform: "scale(1.06)" }}
                      />
                      {sub}
                    </label>
                  ))}
                </div>
              </div>
              {/* 4. Start */}
              <div style={startButtonStyles}>
                <button
                  style={{
                    background: "#2176AE",
                    color: "#FCF5E5",
                    fontWeight: 900,
                    fontSize: isMobile ? "0.97em" : "1.17em",
                    border: "none",
                    borderRadius: "2em",
                    padding: isMobile ? "10px 18px" : "18px 44px",
                    boxShadow: "0 2px 8px #B38E3FCC",
                    marginRight: isMobile ? "5px" : "auto",
                    marginLeft: "8px",
                    opacity: stepDisabled.start ? 0.45 : 1,
                    letterSpacing: "-0.01em",
                    transition: "opacity 0.2s, transform 0.2s",
                    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
                    display: "flex",
                    alignItems: "center",
                  }}
                  disabled={stepDisabled.start}
                  onClick={handleStartGame}
                >
                  <StepBadge number={4} />
                  <span style={{ marginLeft: 6 }}>
                    <span role="img" aria-label="Play">
                      ▶️
                    </span>{" "}
                    Start Game
                  </span>
                </button>
              </div>
            </div>
            <div
              style={{
                fontWeight: 700,
                color: "#C0392B",
                fontSize: "1.07em",
                marginTop: "2.2em",
                textAlign: "center",
              }}
            >
              Number of available pairs: {availablePairs.length}
              {availablePairs.length < 4 && (
                <div style={{ color: "#A52439", fontWeight: 700, marginTop: 10 }}>
                  Not enough pairs for this selection! Try another selection.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <FooterCard />
    </div>
  );
}