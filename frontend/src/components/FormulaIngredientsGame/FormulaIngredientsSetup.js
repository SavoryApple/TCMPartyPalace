import React, { useEffect, useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import NavBar from "../NavBar";
import FooterCard from "../FooterCard";
import BackToTopButton from "../BackToTopButton";

// Helper: Stable mobile check
function useIsMobile(breakpoint = 700) {
  const [isMobile, setIsMobile] = useState(window.innerWidth < breakpoint);
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [breakpoint]);
  return isMobile;
}

const FILTERS = [
  { label: "NCCAOM", value: "nccaom" },
  { label: "CALE+NCCAOM", value: "cale+nccaom" },
  { label: "Extra", value: "extra" },
];
// EDIT: Change label for match mode
const MATCH_MODES = [
  { label: "Actions ↔ Name", value: "actions" },
  { label: "Ingredients ↔ Name", value: "ingredients" },
  { label: "Name ↔ Category", value: "category" }, // EDITED: now shows Name ↔ Category
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

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
    `}
  </style>
);

function mergeCategoryLists(localList, mongoList) {
  const all = [...localList, ...mongoList];
  const seen = {};
  const merged = [];
  all.forEach(cat => {
    if (!seen[cat.category]) {
      seen[cat.category] = true;
      merged.push(cat);
    }
  });
  return merged;
}

function normalize(str) {
  if (!str) return '';
  return str.toString().trim().toLowerCase().replace(/[^\w\s]/g, '');
}

function getMongoMatch(localFormula, mongoCollections) {
  if (!localFormula) return null;
  const pinyinCandidates = []
    .concat(localFormula.pinyinName || [])
    .concat(localFormula.name ? [localFormula.name] : []);
  const englishCandidates = []
    .concat(localFormula.english || [])
    .concat(localFormula.englishName || []);

  for (const [index, collection] of mongoCollections.entries()) {
    let found = collection.find(m =>
      m.pinyinName &&
      (
        (Array.isArray(m.pinyinName) && m.pinyinName.some(p =>
          pinyinCandidates.some(pc => normalize(p) === normalize(pc))
        )) ||
        pinyinCandidates.some(pc => normalize(m.pinyinName) === normalize(pc))
      )
    );
    if (!found && localFormula.name) {
      found = collection.find(m =>
        m.name && normalize(m.name) === normalize(localFormula.name)
      );
    }
    if (!found && englishCandidates.length) {
      found = collection.find(m =>
        (m.english && englishCandidates.some(ec => normalize(m.english) === normalize(ec))) ||
        (m.englishName && englishCandidates.some(ec => normalize(m.englishName) === normalize(ec)))
      );
    }
    if (found) {
      return found;
    }
  }
  return null;
}

function getAvailableFilters(categoryList, mongoCollections, selectedCategories, selectedSubcategories) {
  let selectedLocalFormulas = [];
  selectedCategories.forEach(catName => {
    const catObj = categoryList.find(c => c.category === catName);
    if (catObj && catObj.subcategories) {
      catObj.subcategories.forEach(subcat => {
        if (selectedSubcategories.includes(subcat.title)) {
          selectedLocalFormulas.push(...subcat.formulas);
        }
      });
    }
  });

  const filtersSet = new Set();
  selectedLocalFormulas.forEach(localFormula => {
    const mongoMatch = getMongoMatch(localFormula, mongoCollections);
    if (!mongoMatch) {
      return;
    }
    if (mongoMatch.nccaom === "yes" || mongoMatch.nccaom === true) {
      filtersSet.add("nccaom");
    }
    if (
      mongoMatch.caleNccaom === true ||
      mongoMatch.caleAndNccaom === true ||
      mongoMatch.caleNCCAOM === true ||
      mongoMatch.cale_and_nccaom === true ||
      mongoMatch.caleNccaom === "yes" ||
      mongoMatch.caleAndNccaom === "yes" ||
      mongoMatch.caleNCCAOM === "yes" ||
      mongoMatch.cale_and_nccaom === "yes" ||
      (mongoMatch.origin && mongoMatch.origin === "CALE") ||
      (mongoMatch.source && (
        mongoMatch.source === "CALE+NCCAOM" ||
        mongoMatch.source === "cale+nccaom"
      ))
    ) {
      filtersSet.add("cale+nccaom");
    }
    if (
      mongoMatch.extra === true ||
      mongoMatch.extra === "yes" ||
      mongoMatch.extraFormula === "yes" ||
      (mongoMatch.source && (
        mongoMatch.source === "Extra" ||
        mongoMatch.source === "extra"
      ))
    ) {
      filtersSet.add("extra");
    }
    if (Array.isArray(mongoMatch.sources)) {
      mongoMatch.sources.forEach(src => {
        if (FILTERS.some(f => f.value === src.toLowerCase())) {
          filtersSet.add(src.toLowerCase());
        }
      });
    }
  });

  const result = FILTERS.filter(f => filtersSet.has(f.value));
  return result;
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

export default function FormulaIngredientsSetup() {
  const navigate = useNavigate();
  const isMobile = useIsMobile(700);

  const [categoryList, setCategoryList] = useState([]);
  const [NCCAOMFormulasObject, setNCCAOMFormulasObject] = useState([]);
  const [caleAndNCCAOMFormulasObject, setCaleAndNCCAOMFormulasObject] = useState([]);
  const [extraFormulasObject, setExtraFormulasObject] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [selectedMatchMode, setSelectedMatchMode] = useState(MATCH_MODES[0].value);
  const [globalSelectAll, setGlobalSelectAll] = useState(false);
  const [catSelectAll, setCatSelectAll] = useState(false);
  const [subcatSelectAll, setSubcatSelectAll] = useState(false);
  const [filterSelectAll, setFilterSelectAll] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch("/data/formulaCategoryListObject.json").then(res => res.json()),
      fetch("/api/data/formulaCategories").then(res => res.json()).catch(() => []),
      fetch('https://thetcmatlas.fly.dev/api/data/nccaomformulas').then(r => r.json()),
      fetch('https://thetcmatlas.fly.dev/api/data/caleandnccaomformulas').then(r => r.json()),
      fetch('https://thetcmatlas.fly.dev/api/data/extraformulas').then(r => r.json())
    ])
      .then(([localData, mongoData, nccaom, cale, extra]) => {
        const merged = mergeCategoryLists(
          localData.filter(cat => cat.category !== "Yo San stock Topical Patents for External Use"),
          mongoData.filter(cat => cat.category !== "Yo San stock Topical Patents for External Use")
        );
        setCategoryList(merged);
        setNCCAOMFormulasObject(nccaom);
        setCaleAndNCCAOMFormulasObject(cale);
        setExtraFormulasObject(extra);
        setLoading(false);
      })
      .catch((e) => {
        setLoading(false);
        console.error('[useEffect] Error loading data:', e);
      });
  }, []);

  const subcategories = useMemo(() => {
    let subcatSet = new Set();
    selectedCategories.forEach((cat) => {
      const found = categoryList.find((c) => c.category === cat);
      found?.subcategories?.forEach(sub => subcatSet.add(sub.title));
    });
    const arr = Array.from(subcatSet);
    return arr;
  }, [categoryList, selectedCategories]);

  const availableFilters = useMemo(() => {
    const result = getAvailableFilters(
      categoryList,
      [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
      selectedCategories,
      selectedSubcategories
    );
    return result;
  }, [
    categoryList,
    NCCAOMFormulasObject,
    caleAndNCCAOMFormulasObject,
    extraFormulasObject,
    selectedCategories,
    selectedSubcategories
  ]);

  function handleSectionSelectAll(type, checked) {
    if (type === "category") {
      setCatSelectAll(checked);
      const allCats = checked ? categoryList.map(c => c.category) : [];
      setSelectedCategories(allCats);
      const allSubs = checked
        ? categoryList.flatMap(c =>
            (c.subcategories || []).map(sub => sub.title)
          )
        : [];
      setSelectedSubcategories(allSubs);
      const allFilters = checked ? getAvailableFilters(categoryList,
        [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
        allCats, allSubs
      ).map(f => f.value) : [];
      setSelectedFilters(allFilters);
    }
    else if (type === "subcategory") {
      setSubcatSelectAll(checked);
      const allSubs = checked ? subcategories : [];
      setSelectedSubcategories(allSubs);
      const newFilters = checked ? getAvailableFilters(categoryList,
        [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
        selectedCategories, allSubs
      ).map(f => f.value) : [];
      setSelectedFilters(newFilters);
    }
    else if (type === "filter") {
      setFilterSelectAll(checked);
      setSelectedFilters(checked ? availableFilters.map(f => f.value) : []);
    }
  }
  function handleSectionDeselectAll(type) {
    if (type === "category") {
      setCatSelectAll(false);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedFilters([]);
    }
    else if (type === "subcategory") {
      setSubcatSelectAll(false);
      setSelectedSubcategories([]);
      setSelectedFilters([]);
    }
    else if (type === "filter") {
      setFilterSelectAll(false);
      setSelectedFilters([]);
    }
  }
  useEffect(() => {
    if (globalSelectAll) {
      setCatSelectAll(true);
      setSubcatSelectAll(true);
      setFilterSelectAll(true);
      const allCats = categoryList.map(c => c.category);
      setSelectedCategories(allCats);
      const allSubs = categoryList.flatMap(c =>
        (c.subcategories || []).map(sub => sub.title)
      );
      setSelectedSubcategories(allSubs);
      setSelectedFilters(getAvailableFilters(categoryList,
        [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
        allCats, allSubs
      ).map(f => f.value));
    } else {
      setCatSelectAll(false);
      setSubcatSelectAll(false);
      setFilterSelectAll(false);
      setSelectedCategories([]);
      setSelectedSubcategories([]);
      setSelectedFilters([]);
    }
    // eslint-disable-next-line
  }, [globalSelectAll, categoryList, NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject]);

  useEffect(() => {
    setCatSelectAll(selectedCategories.length === categoryList.length && categoryList.length > 0);
  }, [selectedCategories, categoryList]);
  useEffect(() => {
    setSubcatSelectAll(selectedSubcategories.length === subcategories.length && subcategories.length > 0);
  }, [selectedSubcategories, subcategories]);
  useEffect(() => {
    setFilterSelectAll(selectedFilters.length === availableFilters.length && availableFilters.length > 0);
  }, [selectedFilters, availableFilters]);

  function handleCategoryChange(e) {
    const { value, checked } = e.target;
    let updated;
    if (checked) {
      updated = [...selectedCategories, value];
    } else {
      updated = selectedCategories.filter(cat => cat !== value);
      setSelectedSubcategories(selectedSubcategories.filter(sub => {
        return updated.some(catName => {
          const catObj = categoryList.find(c => c.category === catName);
          return catObj?.subcategories?.some(subObj => subObj.title === sub);
        });
      }));
    }
    setSelectedCategories(updated);
    const newAvailableFilters = getAvailableFilters(categoryList,
      [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
      updated, selectedSubcategories
    );
    setSelectedFilters(selectedFilters.filter(f => newAvailableFilters.some(af => af.value === f)));
  }
  function handleSubcategoryChange(e) {
    const { value, checked } = e.target;
    let updated = checked
      ? [...selectedSubcategories, value]
      : selectedSubcategories.filter(sub => sub !== value);
    setSelectedSubcategories(updated);
    const newAvailableFilters = getAvailableFilters(categoryList,
      [NCCAOMFormulasObject, caleAndNCCAOMFormulasObject, extraFormulasObject],
      selectedCategories, updated
    );
    setSelectedFilters(selectedFilters.filter(f => newAvailableFilters.some(af => af.value === f)));
  }
  function handleFilterChange(e) {
    const { value, checked } = e.target;
    let updated = checked
      ? [...selectedFilters, value]
      : selectedFilters.filter(f => f !== value);
    setSelectedFilters(updated);
  }
  function handleMatchModeChange(e) {
    setSelectedMatchMode(e.target.value);
  }
  function handleGlobalSelectAll(e) {
    setGlobalSelectAll(e.target.checked);
  }
  const stepDisabled = {
    subcategory: !selectedCategories.length,
    filter: !selectedCategories.length || !selectedSubcategories.length,
    matchMode: false,
    start: !selectedCategories.length || !selectedSubcategories.length || !selectedFilters.length,
  };
  function handleStartGame() {
    navigate("/game/formula-ingredients/play", {
      state: {
        categories: selectedCategories,
        subcategories: selectedSubcategories,
        filters: selectedFilters,
        matchMode: selectedMatchMode
      }
    });
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
        gridTemplateColumns: "repeat(5, 1fr)",
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
  const matchModeStyles = {
    ...cardBase,
    background: "#fff2ed",
    border: "2px solid #C0392B",
    boxShadow: "0 2px 8px #C0392B44",
  };
  const catStyles = {
    ...cardBase,
    background: "#F9E8C2",
    border: "2px solid #D4AF37",
    boxShadow: "0 2px 8px #D4AF37aa",
  };
  const subcatStyles = {
    ...cardBase,
    background: "#E9F9E2",
    border: "2px solid #B38E3F",
    boxShadow: "0 2px 8px #B38E3F44",
  };
  const filterStyles = {
    ...cardBase,
    background: "#e7f1fd",
    border: "2px solid #2176AE",
    boxShadow: "0 2px 8px #2176AE44",
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

  const renderFilters =
    selectedCategories.length === 0 || selectedSubcategories.length === 0
      ? FILTERS
      : availableFilters;

  // --- REORDER: Matching Mode (1), Categories (2), Subcategories (3), Filter (4) ---
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
        flexDirection: "column"
      }}
    >
      <GlobalAnimations />
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
      />
      <div style={{ height: isMobile ? 61 : NAVBAR_HEIGHT }} />
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
          boxSizing: "border-box"
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
          Formula Ingredients Memory Game
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
          <StepBadge number={4} />Filters/Source,&nbsp;
          <StepBadge number={5} />Start Game!
          <br/>
          <span style={{ color: "#2176AE" }}>
            Match formula names to their actions, ingredients, or category!
          </span>
        </p>
        {loading ? (
          <div style={{
            margin: "2em auto",
            textAlign: "center",
            color: "#C0392B",
            fontWeight: 700,
            fontSize: "1.2em",
            background: "#fffbe4",
            borderRadius: "1em",
            padding: "1.3em"
          }}>
            Loading categories...
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
            marginBottom: isMobile ? "8px" : "18px"
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
                checked={globalSelectAll}
                onChange={handleGlobalSelectAll}
                style={{ marginRight: 7, transform: "scale(1.1)" }}
              />
              Select All (Categories, Subcategories, Filters)
            </label>
          </div>
          <div style={setupPanelStyles}>
            {/* 1. Matching Mode */}
            <div style={matchModeStyles}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <StepBadge number={1} />
                <span style={{ fontWeight: 700, fontSize: isMobile ? "0.96em" : "1.08em", color: "#B38E3F", letterSpacing: "-0.01em" }}>Matching Mode</span>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
              }}>
                {MATCH_MODES.map((m) => (
                  <label key={m.value} style={{ marginBottom: 6, fontWeight: 500, fontSize: isMobile ? "0.95em" : "1em" }}>
                    <input
                      type="radio"
                      name="matchingMode"
                      value={m.value}
                      checked={selectedMatchMode === m.value}
                      onChange={handleMatchModeChange}
                      disabled={stepDisabled.matchMode}
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
                <span style={{ fontWeight: 700, fontSize: isMobile ? "0.96em" : "1.08em", color: "#9A2D1F", letterSpacing: "-0.01em" }}>Categories</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 10 }}>
                <label style={{
                  fontWeight: 700, color: "#2176AE", display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type="checkbox"
                    checked={catSelectAll}
                    onChange={e => handleSectionSelectAll("category", e.target.checked)}
                    style={{ marginRight: 7, transform: "scale(1.07)" }}
                  />
                  Select All Categories
                </label>
                <button
                  type="button"
                  onClick={() => handleSectionDeselectAll("category")}
                  style={selectButtonStyles("#2176AE")}
                  tabIndex={0}
                >
                  Deselect All
                </button>
              </div>
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile ? "1fr" : "1fr",
                gap: "5px",
                boxSizing: "border-box",
                width: "100%",
                paddingTop: "2px",
                paddingBottom: "2px",
              }}>
                {categoryList.map((cat, i) => (
                  <label key={cat.category}
                    style={{
                      fontWeight: 500,
                      whiteSpace: "normal",
                      display: "flex",
                      alignItems: "center",
                      background: i % 2 === 0 ? "#fffbe4" : "#F9E8C2",
                      borderRadius: "5px",
                      padding: "2px 4px",
                      marginBottom: "2px",
                      boxShadow: i % 2 === 0 ? "0 1px 4px #D4AF3722" : "none",
                      fontSize: isMobile ? "0.96em" : "1em",
                    }}>
                    <input
                      type="checkbox"
                      value={cat.category}
                      checked={selectedCategories.includes(cat.category)}
                      onChange={handleCategoryChange}
                      style={{ marginRight: 7, transform: "scale(1.06)" }}
                    />
                    <span style={{
                      fontWeight: 500,
                      color: "#44210A",
                      letterSpacing: "-0.01em"
                    }}>{cat.category}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 3. Subcategories */}
            <div style={subcatStyles}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <StepBadge number={3} />
                <span style={{ fontWeight: 700, fontSize: isMobile ? "0.96em" : "1.08em", color: "#2176AE", letterSpacing: "-0.01em" }}>Subcategories</span>
              </div>
              {/* FIXED: select all and deselect all side by side, like other categories */}
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 10 }}>
                <label style={{
                  fontWeight: 700, color: "#438C3B", display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type="checkbox"
                    checked={subcatSelectAll}
                    onChange={e => handleSectionSelectAll("subcategory", e.target.checked)}
                    disabled={stepDisabled.subcategory}
                    style={{ marginRight: 7, transform: "scale(1.07)" }}
                  />
                  Select All Subcat.
                </label>
                <button
                  type="button"
                  onClick={() => handleSectionDeselectAll("subcategory")}
                  style={selectButtonStyles("#438C3B")}
                  tabIndex={0}
                  disabled={stepDisabled.subcategory}
                >
                  Deselect All
                </button>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
              }}>
                {subcategories.map((sub) => (
                  <label key={sub} style={{
                    marginBottom: 2,
                    fontWeight: 500,
                    whiteSpace: "normal",
                    display: "flex",
                    alignItems: "center",
                    fontSize: isMobile ? "0.95em" : "1em",
                  }}>
                    <input
                      type="checkbox"
                      value={sub}
                      checked={selectedSubcategories.includes(sub)}
                      onChange={handleSubcategoryChange}
                      disabled={stepDisabled.subcategory}
                      style={{ marginRight: 7, transform: "scale(1.06)" }}
                    />
                    <span style={{display: "inline-block", verticalAlign: "middle"}}>{sub}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* 4. Filters/Source */}
            <div style={filterStyles}>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
                <StepBadge number={4} />
                <span style={{ fontWeight: 700, fontSize: isMobile ? "0.96em" : "1.08em", color: "#438C3B", letterSpacing: "-0.01em" }}>Filter/Source</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginBottom: 8, gap: 10 }}>
                <label style={{
                  fontWeight: 700, color: "#2176AE", display: "flex",
                  alignItems: "center"
                }}>
                  <input
                    type="checkbox"
                    checked={filterSelectAll}
                    onChange={e => handleSectionSelectAll("filter", e.target.checked)}
                    disabled={stepDisabled.filter}
                    style={{ marginRight: 7, transform: "scale(1.07)" }}
                  />
                  Select All Filters
                </label>
                <button
                  type="button"
                  onClick={() => handleSectionDeselectAll("filter")}
                  style={selectButtonStyles("#2176AE")}
                  tabIndex={0}
                  disabled={stepDisabled.filter}
                >
                  Deselect All
                </button>
              </div>
              <div style={{
                display: "flex",
                flexDirection: "column",
              }}>
                {renderFilters.map((f) => (
                  <label key={f.value} style={{
                    marginBottom: 2,
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    display: "flex",
                    alignItems: "center",
                    fontSize: isMobile ? "0.95em" : "1em",
                  }}>
                    <input
                      type="checkbox"
                      value={f.value}
                      checked={selectedFilters.includes(f.value)}
                      onChange={handleFilterChange}
                      disabled={stepDisabled.filter}
                      style={{ marginRight: 7, transform: "scale(1.06)" }}
                    />
                    <span style={{display: "inline-block", verticalAlign: "middle"}}>{f.label}</span>
                  </label>
                ))}
                {(selectedCategories.length > 0 && selectedSubcategories.length > 0 && renderFilters.length === 0) && (
                  <div style={{
                    color: "#C0392B",
                    fontWeight: 700,
                    marginTop: 10,
                    fontSize: "0.97em"
                  }}>
                    No filter options available for this selection.
                  </div>
                )}
              </div>
            </div>
            {/* 5. Start Game */}
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
                  display: "flex", alignItems: "center"
                }}
                disabled={stepDisabled.start}
                onClick={handleStartGame}
              >
                <StepBadge number={5} />
                <span style={{marginLeft: 6}}><span role="img" aria-label="Play">▶️</span> Start Game</span>
              </button>
            </div>
          </div>
        </div>
        )}
      </div>
      <FooterCard />
    </div>
  );
}