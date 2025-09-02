import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import FormulaCategoryListSideBar from "../components/FormulaCategoryListSideBar";
import FooterCard from "../components/FooterCard";
import NavBar from "../components/NavBar";
import FormulasByCategory from "../components/FormulasByCategory";
import Badge from "../components/Badge";
import BackToTopButton from "../components/BackToTopButton";

// --- CONSTANTS ---
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
};

const SIDEBAR_WIDTH = 300;
const FILTER_BAR_HEIGHT = 56;
const NAVBAR_HEIGHT = 72;
const CARD_MAX_WIDTH = 980;

const formulaCategoryListEndpoint = "/data/formulaCategoryListObject.json";
const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";
const formulaApiEndpoints = [
  `${API_URL}/api/data/caleandnccaomformulas`,
  `${API_URL}/api/data/nccaomformulas`,
  `${API_URL}/api/data/extraformulas`,
];

// --- UTILS ---
function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function getFormulaBadge(formula) {
  if (formula.caleAndNccaom === "yes" || formula.origin === "CALE") {
    return { label: "NCCAOM/CALE" };
  }
  if (formula.nccaom === "yes" && formula.caleAndNccaom !== "yes") {
    return { label: "NCCAOM" };
  }
  if (formula.extraFormula === "yes") {
    return { label: "Extra" };
  }
  return null;
}

const KEYACTIONS_EXPLANATION_STYLE = {
  background: "#FCF5E5",
  color: "#C0392B",
  fontWeight: 600,
  fontSize: "1.05em",
  borderRadius: "1em",
  padding: "14px 20px",
  marginTop: "10px",
  marginBottom: "2px",
  textAlign: "center",
  boxShadow: "0 2px 18px -4px #B38E3FCC",
  border: "2px solid #F9E8C2",
  letterSpacing: ".01em",
  maxWidth: "98%",
  alignSelf: "center",
  wordBreak: "break-word",
  lineHeight: "1.4",
};

function KeyActionsExplanation({ keyActions }) {
  if (!keyActions) return null;
  return (
    <div
      className="formula-keyactions-explanation"
      style={KEYACTIONS_EXPLANATION_STYLE}
    >
      {keyActions}
    </div>
  );
}

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.accentGold}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
      }
      .animate-pulseGlow { animation: pulseGlow 2s infinite; }
      body { background: ${COLORS.backgroundGold}; }
      @media (max-width: 900px) {
        .sidebar {
          display: none !important;
        }
        .main-scroll,
        .custom-scrollbar-main {
          padding-left: 0 !important;
          margin-left: 0 !important;
          margin-right: 0 !important;
        }
        .formula-card-section {
          padding: 0 2vw !important;
          max-width: 98vw !important;
        }
      }
      @media (max-width: 700px) {
        .formula-card-section {
          padding: 0 0.5vw !important;
          max-width: 100vw !important;
        }
        .formula-card {
          padding: 1em !important;
          font-size: 1em !important;
        }
        .filter-bar,
        .mobile-filter-bar {
          font-size: 0.94rem !important;
          padding: 0.5em 0.4em !important;
        }
        .main-scroll,
        .custom-scrollbar-main {
          padding-right: 0 !important;
        }
      }
      @media (max-width: 500px) {
        .formula-card-section {
          padding: 0 !important;
        }
        .formula-card {
          padding: 0.5em !important;
          font-size: 0.95em !important;
        }
        .back-to-home-btn {
          right: 2px !important;
        }
      }
    `}
  </style>
);

function MobileCategoryNav({ categories, activeSubcategory, handleSubcategoryScroll }) {
  return (
    <nav className="mobile-category-nav w-full px-2 py-2 mb-4 bg-white/90 rounded-xl shadow-md flex flex-wrap justify-center gap-2"
      style={{
        position: "static",
        marginTop: "1.2em",
        zIndex: 1,
      }}
    >
      {categories.map((category) =>
        (category.subcategories || []).map((subcat) => (
          <button
            key={subcat.title}
            data-subcategory={subcat.title}
            onClick={() => handleSubcategoryScroll(subcat.title)}
            className={[
              "px-3 py-2 rounded font-semibold transition-colors hover:bg-accentGold/20 focus-visible:ring-2 focus-visible:ring-accentEmerald",
              activeSubcategory === subcat.title
                ? "bg-accentGold/30 text-accentEmerald font-extrabold shadow"
                : "text-backgroundRed"
            ].join(" ")}
            style={{
              color: COLORS.backgroundRed,
              cursor: "pointer",
              fontWeight: activeSubcategory === subcat.title ? 800 : 600,
              border: activeSubcategory === subcat.title ? `2px solid ${COLORS.accentEmerald}` : "none",
              boxShadow: activeSubcategory === subcat.title ? `0 0 4px 0 ${COLORS.accentGold}` : "none"
            }}
            tabIndex={0}
          >
            {subcat.title}
          </button>
        ))
      )}
    </nav>
  );
}

function FilterBar({
  showCaleNccaom,
  setShowCaleNccaom,
  showNccaom,
  setShowNccaom,
  showExtra,
  setShowExtra,
  isFixed,
  filterBarRef,
}) {
  return (
    <div
      ref={filterBarRef}
      className="filter-bar w-full px-2 py-2 bg-backgroundGold shadow rounded-xl flex flex-col items-center gap-2 sm:flex-row sm:justify-start flex-wrap"
      style={{
        position: isFixed ? "fixed" : "relative",
        top: isFixed ? 0 : undefined,
        left: 0,
        width: "100vw",
        zIndex: 99,
        boxShadow: isFixed
          ? `0 2px 16px -6px ${COLORS.shadowStrong}`
          : "none",
        borderBottom: `2.5px solid ${COLORS.accentGold}`,
        background: COLORS.backgroundGold,
        fontWeight: 600,
        fontSize: "1.05rem",
        flexWrap: "wrap",
        justifyContent: "flex-start",
        minHeight: FILTER_BAR_HEIGHT,
        marginTop: isFixed ? 0 : undefined,
      }}
    >
      <span className="mr-6 font-extrabold text-backgroundRed text-lg tracking-tight" style={{textShadow:`0 1px 0 ${COLORS.backgroundGold}`}}>
        Show formulas:
      </span>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showCaleNccaom}
          onChange={() => setShowCaleNccaom((v) => !v)}
          className="accent-accentEmerald w-4 h-4"
        />
        <Badge badge={{ label: "NCCAOM/CALE" }} style={{ marginLeft: 0 }} />
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showNccaom}
          onChange={() => setShowNccaom((v) => !v)}
          className="accent-accentBlue w-4 h-4"
        />
        <Badge badge={{ label: "NCCAOM" }} style={{ marginLeft: 0 }} />
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input
          type="checkbox"
          checked={showExtra}
          onChange={() => setShowExtra((v) => !v)}
          className="accent-accentGray w-4 h-4"
        />
        <Badge badge={{ label: "Extra" }} style={{ marginLeft: 0 }} />
      </label>
    </div>
  );
}

// --- Scroll Sync ---
function useScrollSync(categories, subcategoryRefs, sidebarTop, setActiveSubcategory, scrollSyncEnabled) {
  useEffect(() => {
    if (!categories.length || !scrollSyncEnabled) return;
    const handleScroll = () => {
      let bestSubcat = null;
      let bestDistance = Infinity;

      categories.forEach((category) => {
        (category.subcategories || []).forEach((subcat) => {
          const ref = subcategoryRefs.current[subcat.title];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const distance = Math.abs(rect.top - sidebarTop - NAVBAR_HEIGHT);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestSubcat = subcat.title;
            }
          }
        });
      });

      if (bestSubcat) {
        setActiveSubcategory(bestSubcat);
      } else if (categories.length && categories[0].subcategories?.length) {
        setActiveSubcategory(categories[0].subcategories[0].title);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, sidebarTop, setActiveSubcategory, subcategoryRefs, scrollSyncEnabled]);
}

export default function FormulaCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);

  const [isFilterFixed, setIsFilterFixed] = useState(false);
  const filterBarRef = useRef();
  const navBarRef = useRef();

  const navigate = useNavigate();

  const subcategoryRefs = useRef({});
  const sidebarRef = useRef();
  const scrollContainerRef = useRef();
  const formulasSectionRef = useRef();

  const [formulasByType, setFormulasByType] = useState({
    caleNccaom: [],
    nccaom: [],
    extra: []
  });
  const [allFormulas, setAllFormulas] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [sidebarTop, setSidebarTop] = useState(NAVBAR_HEIGHT + FILTER_BAR_HEIGHT);

  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const lastClickedSubcategoryRef = useRef(null);

  // REMOVED: const getFixedTop = () => filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT;
  // REMOVED: const [backToHomeFixed, setBackToHomeFixed] = useState(false);

  useEffect(() => {
    function updateSidebarTop() {
      const filterBarHeight = filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT;
      const navBarHeight = navBarRef.current?.offsetHeight || NAVBAR_HEIGHT;
      let top = isFilterFixed ? filterBarHeight : navBarHeight + filterBarHeight;
      setSidebarTop(top);
    }
    updateSidebarTop();
    window.addEventListener("scroll", updateSidebarTop, { passive: true });
    window.addEventListener("resize", updateSidebarTop);
    return () => {
      window.removeEventListener("scroll", updateSidebarTop);
      window.removeEventListener("resize", updateSidebarTop);
    };
  }, [isFilterFixed, filterBarRef, navBarRef]);

  useEffect(() => {
    function onScroll() {
      const navBarHeight = navBarRef.current?.offsetHeight || NAVBAR_HEIGHT;
      setIsFilterFixed(window.scrollY >= navBarHeight);
      // REMOVED: setBackToHomeFixed(window.scrollY > navBarHeight);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [navBarRef]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(formulaCategoryListEndpoint).then((r) => r.json()),
      ...formulaApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
    ])
      .then(([catData, caleNccaomList, nccaomList, extraList]) => {
        setCategories(catData);

        const mapFormulaList = (list, type) =>
          (list || [])
            .flat()
            .map((f) =>
              f && typeof f === "object"
                ? {
                    ...f,
                    _normPinyin: Array.isArray(f.pinyinName)
                      ? normalize(f.pinyinName[0])
                      : normalize(f.pinyinName || f.name || ""),
                    badge: getFormulaBadge(f),
                    _type: type
                  }
                : null
            )
            .filter(Boolean);

        const caleNccaom = mapFormulaList(caleNccaomList, "caleNccaom");
        const nccaom = mapFormulaList(nccaomList, "nccaom");
        const extra = mapFormulaList(extraList, "extra");

        setFormulasByType({ caleNccaom, nccaom, extra });
        setAllFormulas([...caleNccaom, ...nccaom, ...extra]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (scrollSyncEnabled) return;
    const handleManualScroll = () => setScrollSyncEnabled(true);
    window.addEventListener("scroll", handleManualScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleManualScroll);
  }, [scrollSyncEnabled]);

  useScrollSync(
    categories,
    subcategoryRefs,
    sidebarTop,
    setActiveSubcategory,
    scrollSyncEnabled
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.overflowY = isSidebarHovered ? "hidden" : "scroll";
    }
  }, [isSidebarHovered, scrollContainerRef]);

  useEffect(() => {
    if (
      lastClickedSubcategoryRef.current !== null &&
      subcategoryRefs.current[lastClickedSubcategoryRef.current]
    ) {
      setTimeout(() => {
        const ref = subcategoryRefs.current[lastClickedSubcategoryRef.current];
        if (ref && ref.getBoundingClientRect) {
          const rect = ref.getBoundingClientRect();
          const sectionTop = rect.top + window.scrollY;
          window.scrollTo({
            top: sectionTop - (isFilterFixed ? FILTER_BAR_HEIGHT : NAVBAR_HEIGHT + FILTER_BAR_HEIGHT),
            behavior: "smooth"
          });
          lastClickedSubcategoryRef.current = null;
        }
      }, 150);
    }
  }, [activeSubcategory, subcategoryRefs, isFilterFixed]);

  useEffect(() => {
    if (!sidebarRef.current || lastClickedSubcategoryRef.current) return;
    const sidebar = sidebarRef.current;
    const activeBtn = sidebar.querySelector(`[data-subcategory="${activeSubcategory}"]`);
    if (!activeBtn) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const margin = 12;
    if (btnRect.top < sidebarRect.top + margin) {
      sidebar.scrollTop += btnRect.top - sidebarRect.top - margin;
    } else if (btnRect.bottom > sidebarRect.bottom - margin) {
      sidebar.scrollTop += btnRect.bottom - sidebarRect.bottom + margin;
    }
  }, [activeSubcategory, sidebarRef, lastClickedSubcategoryRef]);

  function handleSubcategoryScroll(title) {
    lastClickedSubcategoryRef.current = title;
    setScrollSyncEnabled(false);
    setActiveSubcategory(title);
    setTimeout(() => {
      const ref = subcategoryRefs.current[title];
      if (ref && ref.getBoundingClientRect) {
        const rect = ref.getBoundingClientRect();
        const sectionTop = rect.top + window.scrollY;
        window.scrollTo({
          top: sectionTop - (isFilterFixed ? FILTER_BAR_HEIGHT : NAVBAR_HEIGHT + FILTER_BAR_HEIGHT),
          behavior: "smooth"
        });
        lastClickedSubcategoryRef.current = null;
      }
    }, 150);
  }

  function handleFormulaClick(formulaObj) {
    if (formulaObj && formulaObj.pinyinName) {
      navigate(
        `/formulabuilder?formula=${encodeURIComponent(formulaObj.pinyinName)}`
      );
    }
  }

  function getAnyFormulaMatchByName(name) {
    const norm = normalize(name);
    return allFormulas.find((f) => f._normPinyin === norm);
  }
  function getFormulaMatchByName(name) {
    const norm = normalize(name);
    let formulaList = [];
    if (showCaleNccaom) formulaList = formulaList.concat(formulasByType.caleNccaom);
    if (showNccaom) formulaList = formulaList.concat(formulasByType.nccaom);
    if (showExtra) formulaList = formulaList.concat(formulasByType.extra);
    return formulaList.find((f) => f._normPinyin === norm);
  }

  function getDisplayFormulaName(formula, formulaObj) {
    if (
      formula.name &&
      formula.english &&
      formula.name.trim().toLowerCase() === formula.english.trim().toLowerCase()
    ) {
      if (formulaObj && formulaObj.pinyinName) return formulaObj.pinyinName;
      if (formula.pinyinName) return formula.pinyinName;
    }
    return formula.name;
  }

  function renderFormulaExtras(formulaObj, formula) {
    const keyActionsValue =
      (formula && formula.keyActions) ||
      (formula && formula.explanation) ||
      formulaObj.keyActions ||
      formulaObj.explanation ||
      undefined;

    const explanationBlock = keyActionsValue ? (
      <KeyActionsExplanation keyActions={keyActionsValue} />
    ) : null;

    const { yoSanCarries, formats } = formulaObj;
    return (
      <div
        className="flex flex-col gap-1 items-start"
        style={{
          minWidth: 120,
          maxWidth: "100vw",
          justifyContent: "center",
          marginTop: explanationBlock ? "18px" : "6px",
          marginLeft: "1.2em"
        }}
      >
        {explanationBlock}
        {yoSanCarries !== undefined && (
          <div>
            <strong style={{ color: COLORS.backgroundRed }}>Yo San Carries:</strong>{" "}
            <span style={{ color: yoSanCarries ? COLORS.accentEmerald : COLORS.accentCrimson, fontWeight: 600 }}>
              {yoSanCarries === true ? "Yes" : yoSanCarries === false ? "No" : ""}
            </span>
          </div>
        )}
        {formats && Array.isArray(formats) && formats.length > 0 && (
          <div>
            <strong style={{ color: COLORS.backgroundRed }}>Format:</strong>{" "}
            <span style={{ color: COLORS.accentBlack }}>
              {formats.join(", ")}
            </span>
          </div>
        )}
      </div>
    );
  }

  const backToHomeButton = (
    <div
      style={{
        position: isFilterFixed ? "fixed" : "relative",
        top: isFilterFixed ? (filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT) : undefined,
        right: 32,
        marginTop: isFilterFixed ? 8 : 16,
        zIndex: 120,
        display: "flex",
        justifyContent: "flex-end",
        pointerEvents: "auto"
      }}
      className="back-to-home-btn"
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-accentEmerald"
        style={{
          background: COLORS.accentGold,
          color: COLORS.backgroundRed,
          border: `2px solid ${COLORS.accentBlack}`,
          textShadow: `0 1px 0 ${COLORS.backgroundGold}`,
        }}
        tabIndex={0}
      >
        Back to Home
      </Link>
    </div>
  );

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>No categories found. Check your data file structure.</div>;
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
  const backgroundGradient = `linear-gradient(135deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 35%, ${COLORS.accentGold} 100%)`;

  const filterSpacerHeight = isFilterFixed
    ? filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT
    : 0;

  return (
    <>
      <div
        style={{
          minHeight: "100vh",
          width: "100vw",
          background: backgroundGradient,
          fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
          position: "relative",
          overflow: "hidden",
        }}
      >
        <GlobalAnimations />
        <div ref={navBarRef}>
          <NavBar
            showReportError={true}
            showAbout={true}
            showAdminButtons={true}
            showLogo={true}
            fixed={false}
          />
        </div>
        <FilterBar
          showCaleNccaom={showCaleNccaom}
          setShowCaleNccaom={setShowCaleNccaom}
          showNccaom={showNccaom}
          setShowNccaom={setShowNccaom}
          showExtra={showExtra}
          setShowExtra={setShowExtra}
          isFixed={isFilterFixed}
          filterBarRef={filterBarRef}
        />
        {backToHomeButton}
        {isFilterFixed && (
          <div
            style={{
              height: filterSpacerHeight,
              width: "100vw"
            }}
          />
        )}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            width: "100vw",
            minHeight: "70vh",
            position: "relative",
          }}
        >
          {!isMobile && (
            <FormulaCategoryListSideBar
              categories={categories}
              activeSubcategory={activeSubcategory}
              handleSubcategoryScroll={handleSubcategoryScroll}
              sidebarRef={sidebarRef}
              isSidebarHovered={isSidebarHovered}
              setIsSidebarHovered={setIsSidebarHovered}
              sidebarTop={sidebarTop}
            />
          )}
          <div
            className="main-scroll custom-scrollbar-main"
            style={{
              marginLeft: !isMobile ? SIDEBAR_WIDTH : 0,
              width: !isMobile ? `calc(100vw - ${SIDEBAR_WIDTH}px)` : "100vw",
              minHeight: "100vh",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              transition: "margin-left 0.2s, width 0.2s",
              background: "none",
              boxSizing: "border-box",
            }}
            ref={scrollContainerRef}
          >
            {isMobile && (
              <MobileCategoryNav
                categories={categories}
                activeSubcategory={activeSubcategory}
                handleSubcategoryScroll={handleSubcategoryScroll}
              />
            )}
            <div
              className="formula-card-section"
              style={{
                width: "100%",
                maxWidth: CARD_MAX_WIDTH,
                marginLeft: "auto",
                marginRight: "auto",
                background: "none",
                padding: isMobile ? "0 2vw" : "0",
                boxSizing: "border-box"
              }}
            >
              <FormulasByCategory
                categories={categories}
                subcategoryRefs={subcategoryRefs}
                getAnyFormulaMatchByName={getAnyFormulaMatchByName}
                getFormulaMatchByName={getFormulaMatchByName}
                getDisplayFormulaName={getDisplayFormulaName}
                handleFormulaClick={handleFormulaClick}
                renderFormulaExtras={renderFormulaExtras}
                CARD_MAX_WIDTH={CARD_MAX_WIDTH}
                activeSubcategory={activeSubcategory}
                ref={formulasSectionRef}
              />
            </div>
          </div>
        </div>
        <div
          style={{
            width: "100vw",
            marginTop: 32,
            marginBottom: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            zIndex: 1,
          }}
        >
          <FooterCard />
        </div>
        <BackToTopButton right={75} />
      </div>
    </>
  );
}