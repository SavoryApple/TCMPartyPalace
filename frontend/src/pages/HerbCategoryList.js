import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HerbCategoryListSideBar from "../components/HerbCategoryListSideBar";
import FooterCard from "../components/FooterCard";
import NavBar from "../components/NavBar";
import HerbsByCategory from "../components/HerbsByCategory";
import HerbCart from "../components/HerbCart";
import Badge from "../components/Badge";
import BackToTopButton from "../components/BackToTopButton";
import { useHerbCart } from "../context/HerbCartContext";

// --- CONSTANTS ---
const COLORS = {
  backgroundGold: "#FFF7E3",
  accentGold: "#D4AF37",
  accentDarkGold: "#B38E3F",
  accentBlack: "#3B4461",
  accentCrimson: "#A52439",
  accentEmerald: "#68C5E6",
  accentBlue: "#7C5CD3",
  accentGray: "#D9C8B4",
  shadow: "#7C5CD399",
  shadowStrong: "#7C5CD399",
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066"
};

const SIDEBAR_WIDTH = 300;
const FILTER_BAR_HEIGHT = 56;
const NAVBAR_HEIGHT = 72;
const CARD_MAX_WIDTH = 980;

const herbCategoryListEndpoint = "/data/herbCategoryListObject.json";
const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";
const herbApiEndpoints = [
  `${API_URL}/api/data/caleandnccaomherbs`,
  `${API_URL}/api/data/caleherbs`,
  `${API_URL}/api/data/extraherbs`,
  `${API_URL}/api/data/nccaomherbs`,
];

// --- UTILS ---
function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// --- BADGE LOGIC ---
function getHerbBadge(herb) {
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

function flattenCategories(categories) {
  let flat = [];
  categories.forEach(cat => {
    if (cat.categories && Array.isArray(cat.categories)) {
      flat = flat.concat(flattenCategories(cat.categories));
    } else {
      flat.push(cat);
    }
  });
  return flat;
}

// --- GLOBAL ANIMATIONS ---
const GlobalAnimations = () => (
  <style>
    {`
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.accentGold}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
      }
      @keyframes cartPulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.violet}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
      }
      .animate-pulseGlow { animation: pulseGlow 2s infinite; }
      .animate-cartPulseGlow { animation: cartPulseGlow 2s infinite; }
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
        .herb-card-section {
          padding: 0 2vw !important;
          max-width: 98vw !important;
        }
      }
      @media (max-width: 700px) {
        .herb-card-section {
          padding: 0 0.5vw !important;
          max-width: 100vw !important;
        }
        .card {
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
        .herb-card-section {
          padding: 0 !important;
        }
        .card {
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
            key={subcat.name}
            data-subcategory={subcat.name}
            onClick={() => handleSubcategoryScroll(subcat.name)}
            className={[
              "px-3 py-2 rounded font-semibold transition-colors hover:bg-accentGold/20 focus-visible:ring-2 focus-visible:ring-accentEmerald",
              activeSubcategory === subcat.name
                ? "bg-accentGold/30 text-accentEmerald font-extrabold shadow"
                : "text-accentBlack"
            ].join(" ")}
            style={{
              color: COLORS.accentBlack,
              cursor: "pointer",
              fontWeight: activeSubcategory === subcat.name ? 800 : 600,
              border: activeSubcategory === subcat.name ? `2px solid ${COLORS.accentEmerald}` : "none",
              boxShadow: activeSubcategory === subcat.name ? `0 0 4px 0 ${COLORS.accentGold}` : "none"
            }}
            tabIndex={0}
          >
            {subcat.name}
          </button>
        ))
      )}
    </nav>
  );
}

function FilterBar({
  showCaleNccaom,
  setShowCaleNccaom,
  showCale,
  setShowCale,
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
      <span className="mr-6 font-extrabold text-accentBlack text-lg tracking-tight" style={{ textShadow: `0 1px 0 ${COLORS.backgroundGold}` }}>
        Show herbs:
      </span>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" checked={showCaleNccaom} onChange={() => setShowCaleNccaom(v => !v)} className="accent-accentEmerald w-4 h-4" />
        <Badge badge={getHerbBadge({ nccaomAndCale: "yes" })} />
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" checked={showCale} onChange={() => setShowCale(v => !v)} className="accent-accentGold w-4 h-4" />
        <Badge badge={getHerbBadge({ caleOnly: "yes" })} />
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" checked={showNccaom} onChange={() => setShowNccaom(v => !v)} className="accent-accentBlue w-4 h-4" />
        <Badge badge={getHerbBadge({ nccaomOnly: "yes" })} />
      </label>
      <label className="mx-4 flex items-center space-x-2 cursor-pointer">
        <input type="checkbox" checked={showExtra} onChange={() => setShowExtra(v => !v)} className="accent-accentGray w-4 h-4" />
        <Badge badge={getHerbBadge({ extraHerb: "yes" })} />
      </label>
    </div>
  );
}

// --- Sidebar Scroll Sync ---
function useScrollSync(categories, subcategoryRefs, sidebarTop, setActiveSubcategory, scrollSyncEnabled) {
  useEffect(() => {
    if (!categories.length || !scrollSyncEnabled) return;
    const handleScroll = () => {
      let bestSubcat = null;
      let bestDistance = Infinity;
      categories.forEach((category) => {
        (category.subcategories || []).forEach((subcat) => {
          const ref = subcategoryRefs.current[subcat.name];
          if (ref) {
            const rect = ref.getBoundingClientRect();
            const distance = Math.abs(rect.top - sidebarTop - NAVBAR_HEIGHT);
            if (distance < bestDistance) {
              bestDistance = distance;
              bestSubcat = subcat.name;
            }
          }
        });
      });
      if (bestSubcat) {
        setActiveSubcategory(bestSubcat);
      } else if (categories.length && categories[0].subcategories?.length) {
        setActiveSubcategory(categories[0].subcategories[0].name);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [categories, sidebarTop, setActiveSubcategory, subcategoryRefs, scrollSyncEnabled]);
}

// --- Merge MongoDB info into category structure ---
function mergeHerbsIntoCategories(categories, allHerbs) {
  if (!Array.isArray(categories)) return [];
  const herbLookup = {};
  allHerbs.forEach(h => {
    let key = h.pinyinName || h.name;
    key = normalize(key);
    herbLookup[key] = h;
  });
  return categories.map(cat => ({
    ...cat,
    subcategories: (cat.subcategories || []).map(subcat => ({
      ...subcat,
      herbs: (subcat.herbs || []).map((herb, i) => {
        let key = herb.pinyinName || herb.name;
        key = normalize(key);
        return herbLookup[key]
          ? { ...herbLookup[key], ...herb }
          : { ...herb };
      })
    }))
  }));
}

function getHerbDisplayName(herb, herbObj) {
  if (herb.pinyinName) return herb.pinyinName;
  if (herb.name) return herb.name;
  if (herbObj && herbObj.pinyinName) return herbObj.pinyinName;
  if (herb.englishNames) {
    if (Array.isArray(herb.englishNames)) return herb.englishNames[0];
    return herb.englishNames;
  }
  if (herb.pharmaceuticalName) return herb.pharmaceuticalName;
  if (herb.pharmaceutical) return herb.pharmaceutical;
  return "Unknown";
}

// --- Styled Key Actions Explanation (matches formulas) ---
function KeyActionsExplanation({ keyActions }) {
  if (!keyActions) return null;
  return (
    <div
      className="herb-keyactions-explanation"
      style={{
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
      }}
    >
      {keyActions}
    </div>
  );
}

export default function HerbCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showCale, setShowCale] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);

  const [isFilterFixed, setIsFilterFixed] = useState(false);
  const filterBarRef = useRef();
  const navBarRef = useRef();

  const subcategoryRefs = useRef({});
  const sidebarRef = useRef();
  const scrollContainerRef = useRef();
  const herbsSectionRef = useRef();

  const [allHerbs, setAllHerbs] = useState([]);
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [sidebarTop, setSidebarTop] = useState(NAVBAR_HEIGHT + FILTER_BAR_HEIGHT);

  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const lastClickedSubcategoryRef = useRef(null);

  const navigate = useNavigate();
  const { cart, addHerb } = useHerbCart(); // removed clearCart
  const [showCart, setShowCart] = useState(false);

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
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [navBarRef]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(herbCategoryListEndpoint).then((r) => r.json()),
      ...herbApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
    ])
      .then(([catDataRaw, caleNccaomList, caleList, extraList, nccaomList]) => {
        const catData = Array.isArray(catDataRaw)
          ? flattenCategories(catDataRaw)
          : Array.isArray(catDataRaw.categories)
            ? flattenCategories(catDataRaw.categories)
            : [];
        const mapHerbList = (list, type) =>
          (list || [])
            .flat()
            .map((h) =>
              h && typeof h === "object"
                ? {
                    ...h,
                    _normPinyin: Array.isArray(h.pinyinName)
                      ? normalize(h.pinyinName[0])
                      : normalize(h.pinyinName || h.name || ""),
                    badge: getHerbBadge(h),
                    _type: type,
                  }
                : null
            )
            .filter(Boolean);

        const caleNccaom = mapHerbList(caleNccaomList, "caleNccaom");
        const cale = mapHerbList(caleList, "cale");
        const extra = mapHerbList(extraList, "extra");
        const nccaom = mapHerbList(nccaomList, "nccaom");

        const allMongoHerbs = [...caleNccaom, ...cale, ...nccaom, ...extra];
        setAllHerbs(allMongoHerbs);

        const mergedCategories = mergeHerbsIntoCategories(catData, allMongoHerbs);
        setCategories(mergedCategories);

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
            top: sectionTop - (isFilterFixed ? filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT : NAVBAR_HEIGHT + FILTER_BAR_HEIGHT),
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
          top: sectionTop - (isFilterFixed ? filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT : NAVBAR_HEIGHT + FILTER_BAR_HEIGHT),
          behavior: "smooth"
        });
        lastClickedSubcategoryRef.current = null;
      }
    }, 150);
  }

  function handleHerbClick(herbObj) {
    if (herbObj && herbObj.pinyinName) {
      addHerb(herbObj);
      setShowCart(true);
    }
  }

  function getAnyHerbMatchByName(name) {
    const norm = normalize(name);
    return allHerbs.find((h) => h._normPinyin === norm);
  }
  function getHerbMatchByName(name) {
    const norm = normalize(name);
    let herbList = [];
    if (showCaleNccaom) herbList = herbList.concat(allHerbs.filter(h => h._type === "caleNccaom"));
    if (showCale) herbList = herbList.concat(allHerbs.filter(h => h._type === "cale"));
    if (showNccaom) herbList = herbList.concat(allHerbs.filter(h => h._type === "nccaom"));
    if (showExtra) herbList = herbList.concat(allHerbs.filter(h => h._type === "extra"));
    return herbList.find((h) => h._normPinyin === norm);
  }

  function renderHerbExtras(herbObj, herb) {
    const keyActionsValue =
      (herb && herb.keyActions) ||
      (herb && herb.explanation) ||
      herbObj.keyActions ||
      herbObj.explanation ||
      undefined;

    const explanationBlock = keyActionsValue ? (
      <KeyActionsExplanation keyActions={keyActionsValue} />
    ) : null;

    const { yoSanCarries, formats } = herbObj;
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
    );
  }

  function handleAddToFormula() {
    if (cart.length === 0) return;
    navigate("/formulabuilder", { state: { herbCart: cart } });
  }

  const backToHomeButton = (
    <div
      style={{
        position: isFilterFixed ? "fixed" : "relative",
        top: isFilterFixed ? filterBarRef.current?.offsetHeight || FILTER_BAR_HEIGHT : undefined,
        right: isFilterFixed ? 32 : undefined,
        marginTop: isFilterFixed ? 8 : 16,
        zIndex: 51,
        display: "flex",
        justifyContent: "flex-end",
      }}
      className="back-to-home-btn"
    >
      <Link
        to="/"
        className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-accentEmerald"
        style={{
          background: COLORS.accentGold,
          color: COLORS.accentBlack,
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
          showCale={showCale}
          setShowCale={setShowCale}
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
        <HerbCart
          show={showCart}
          onClose={() => setShowCart(false)}
          onOpen={() => setShowCart(true)}
          sidebarTop={sidebarTop}
          onCreateFormula={handleAddToFormula}
        />
        <BackToTopButton right={75} />
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
            <HerbCategoryListSideBar
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
              className="herb-card-section"
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
              <HerbsByCategory
                categories={categories}
                subcategoryRefs={subcategoryRefs}
                getAnyHerbMatchByName={getAnyHerbMatchByName}
                getHerbMatchByName={getHerbMatchByName}
                getHerbDisplayName={getHerbDisplayName}
                handleHerbClick={handleHerbClick}
                renderHerbExtras={renderHerbExtras}
                CARD_MAX_WIDTH={CARD_MAX_WIDTH}
                activeSubcategory={activeSubcategory}
                ref={herbsSectionRef}
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
      </div>
    </>
  );
}