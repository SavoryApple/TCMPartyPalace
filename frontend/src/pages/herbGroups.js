import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import HerbGroupListSideBar from "../components/HerbGroupListSideBar";
import FooterCard from "../components/FooterCard";
import NavBar from "../components/NavBar";
import HerbsByGroups from "../components/HerbsByGroups";
import HerbCart from "../components/HerbCart";
import BackToTopButton from "../components/BackToTopButton";
import Badge from "../components/Badge";
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
};

const SIDEBAR_WIDTH = 300;
const FILTER_BAR_HEIGHT = 56;
const NAVBAR_HEIGHT = 72;
const CARD_MAX_WIDTH = 980;

const herbGroupsListEndpoint = "/data/herbGroupsList.json";
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
    .replace(/\(.*?\)/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getHerbBadge(herb) {
  if (herb && typeof herb === "object") {
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
  }
  return null;
}

function getHerbDisplayName(herb) {
  if (typeof herb === "string") return herb.replace(/\(.*?\)/, "").trim();
  if (herb.pinyinName) return herb.pinyinName;
  if (herb.name) return herb.name;
  if (herb.englishNames) {
    if (Array.isArray(herb.englishNames)) return herb.englishNames[0];
    return herb.englishNames;
  }
  if (herb.pharmaceuticalName) return herb.pharmaceuticalName;
  if (herb.pharmaceutical) return herb.pharmaceutical;
  return "Unknown";
}

// --- GLOBAL ANIMATIONS (updated for mobile card content overflow fix) ---
const GlobalAnimations = () => (
  <style>
    {`
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.accentGold}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.accentGold}33; }
      }
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
          box-sizing: border-box !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          word-break: break-word !important;
          white-space: normal !important;
        }
        .herb-card-content, .herb-group-card-content {
          word-break: break-word !important;
          white-space: normal !important;
          max-width: 100vw !important;
          overflow-wrap: break-word !important;
        }
        .filter-bar {
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
          box-sizing: border-box !important;
          width: 100% !important;
          min-width: 0 !important;
          max-width: 100% !important;
          overflow-x: auto !important;
          word-break: break-word !important;
          white-space: normal !important;
        }
        .herb-card-content, .herb-group-card-content {
          word-break: break-word !important;
          white-space: normal !important;
          max-width: 100vw !important;
          overflow-wrap: break-word !important;
        }
        .back-to-home-btn {
          right: 2px !important;
        }
        .filter-bar {
          font-size: 0.92rem !important;
          padding: 0.2em 0.1em !important;
        }
        .main-scroll,
        .custom-scrollbar-main {
          padding-right: 0 !important;
          width: 100vw !important;
          max-width: 100vw !important;
          margin: 0 !important;
        }
      }
    `}
  </style>
);

// --- FilterBar (copied/adapted from HerbCategoryList.js) ---
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

// --- everything else in your file is unchanged below ---

function useScrollSync(groups, categoryRefs, sidebarTop, setActiveCategory, scrollSyncEnabled) {
  useEffect(() => {
    if (!groups.length || !scrollSyncEnabled) return;
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const compareTop = scrollY + sidebarTop;
      let lastAbove = null;
      groups.forEach((group) => {
        const ref = categoryRefs.current[group.category];
        if (ref) {
          const sectionTop = ref.getBoundingClientRect().top + scrollY;
          if (sectionTop <= compareTop) {
            lastAbove = group.category;
          }
        }
      });
      if (lastAbove) {
        setActiveCategory(lastAbove);
      } else if (groups.length) {
        setActiveCategory(groups[0].category);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [groups, categoryRefs, sidebarTop, setActiveCategory, scrollSyncEnabled]);
}

function MobileGroupNav({ groups, activeCategory, handleCategoryScroll }) {
  return (
    <nav className="mobile-category-nav w-full px-2 py-2 mb-4 bg-white/90 rounded-xl shadow-md flex flex-wrap justify-center gap-2"
      style={{
        position: "static",
        marginTop: "1.2em",
        zIndex: 1,
      }}
    >
      {groups.map((group) => (
        <button
          key={group.category}
          data-category={group.category}
          onClick={() => handleCategoryScroll(group.category)}
          className={[
            "px-3 py-2 rounded font-semibold transition-colors hover:bg-accentGold/20 focus-visible:ring-2 focus-visible:ring-accentEmerald",
            activeCategory === group.category
              ? "bg-accentGold/30 text-accentEmerald font-extrabold shadow"
              : "text-accentBlack"
          ].join(" ")}
          style={{
            color: COLORS.accentBlack,
            cursor: "pointer",
            fontWeight: activeCategory === group.category ? 800 : 600,
            border: activeCategory === group.category ? `2px solid ${COLORS.accentEmerald}` : "none",
            boxShadow: activeCategory === group.category ? `0 0 4px 0 ${COLORS.accentGold}` : "none"
          }}
          tabIndex={0}
        >
          {group.category}
        </button>
      ))}
    </nav>
  );
}

// --- PATCH: keyActions lookup ---
function buildKeyActionsLookup(categoryData) {
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
  const flatCats = Array.isArray(categoryData)
    ? flattenCategories(categoryData)
    : Array.isArray(categoryData?.categories)
      ? flattenCategories(categoryData.categories)
      : [];
  const map = {};
  flatCats.forEach(cat => {
    (cat.subcategories || []).forEach(subcat => {
      (subcat.herbs || []).forEach(herb => {
        const norm = normalize(herb.pinyinName || herb.name || "");
        if (herb.keyActions) {
          map[norm] = herb.keyActions;
        }
      });
    });
  });
  return map;
}

export default function HerbGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showCale, setShowCale] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);

  const [activeCategory, setActiveCategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);
  const [isFilterFixed, setIsFilterFixed] = useState(false);

  const filterBarRef = useRef();
  const navBarRef = useRef();
  const sidebarRef = useRef();
  const scrollContainerRef = useRef();
  const categoryRefs = useRef({});
  const herbsSectionRef = useRef();

  const [sidebarTop, setSidebarTop] = useState(NAVBAR_HEIGHT + FILTER_BAR_HEIGHT);

  const [scrollSyncEnabled, setScrollSyncEnabled] = useState(true);
  const lastClickedCategoryRef = useRef(null);

  const navigate = useNavigate();
  const { cart, addHerb } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const [allHerbs, setAllHerbs] = useState([]);
  const [keyActionsMap, setKeyActionsMap] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(herbGroupsListEndpoint).then((r) => r.json()),
      ...herbApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
      fetch(herbCategoryListEndpoint).then((r) => r.json())
    ]).then(([groupsData, caleNccaomList, caleList, extraList, nccaomList, categoryData]) => {
      setGroups(groupsData);

      setKeyActionsMap(buildKeyActionsLookup(categoryData));

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

      setAllHerbs([...caleNccaom, ...cale, ...nccaom, ...extra]);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

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
    const container = scrollContainerRef.current;
    if (container) {
      container.style.overflowY = isSidebarHovered ? "hidden" : "scroll";
    }
  }, [isSidebarHovered, scrollContainerRef]);

  useScrollSync(groups, categoryRefs, sidebarTop, setActiveCategory, scrollSyncEnabled);

  useEffect(() => {
    if (scrollSyncEnabled) return;
    const handleManualScroll = () => setScrollSyncEnabled(true);
    window.addEventListener("scroll", handleManualScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleManualScroll);
  }, [scrollSyncEnabled]);

  useEffect(() => {
    if (!sidebarRef.current || lastClickedCategoryRef.current) return;
    const sidebar = sidebarRef.current;
    const activeBtn = sidebar.querySelector(`[data-category="${activeCategory}"]`);
    if (!activeBtn) return;

    const sidebarRect = sidebar.getBoundingClientRect();
    const btnRect = activeBtn.getBoundingClientRect();

    const margin = 12;
    if (btnRect.top < sidebarRect.top + margin) {
      sidebar.scrollTop += btnRect.top - sidebarRect.top - margin;
    } else if (btnRect.bottom > sidebarRect.bottom - margin) {
      sidebar.scrollTop += btnRect.bottom - sidebarRect.bottom + margin;
    }
  }, [activeCategory]);

  function handleCategoryScroll(category) {
    lastClickedCategoryRef.current = category;
    setScrollSyncEnabled(false);
    setActiveCategory(category);
    setTimeout(() => {
      const sidebar = sidebarRef.current;
      if (sidebar) {
        const activeBtn = sidebar.querySelector(`[data-category="${category}"]`);
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 100);
    const ref = categoryRefs.current[category];
    if (ref && ref.getBoundingClientRect) {
      const rect = ref.getBoundingClientRect();
      const sectionTop = rect.top + window.scrollY;
      window.scrollTo({
        top: sectionTop - FILTER_BAR_HEIGHT,
        behavior: "smooth"
      });
      lastClickedCategoryRef.current = null;
    }
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

  // Filtering logic for herbs in groups
  function getHerbObjFromAll(name) {
    const norm = normalize(name);
    let allowedTypes = [];
    if (showCaleNccaom) allowedTypes.push("caleNccaom");
    if (showCale) allowedTypes.push("cale");
    if (showNccaom) allowedTypes.push("nccaom");
    if (showExtra) allowedTypes.push("extra");
    return allHerbs.find(
      (h) =>
        allowedTypes.includes(h._type) &&
        (
          normalize(h.pinyinName || "") === norm ||
          normalize(h.name || "") === norm ||
          h._normPinyin === norm
        )
    );
  }

  // Filter herbs in each group according to filter checkboxes
  const filteredGroups = groups.map((group) => ({
    ...group,
    herbs: (group.herbs || []).filter((herb) => {
      // Try to get MongoDB herb object for filtering, fallback to string
      const displayName = typeof herb === "string"
        ? herb.replace(/\(.*?\)/, "").trim()
        : getHerbDisplayName(herb);
      const herbObj = getHerbObjFromAll(displayName);
      return !!herbObj;
    })
  }));

  // Cart to FormulaBuilder navigation
  function handleAddToFormula() {
    if (cart.length === 0) return;
    navigate("/formulabuilder", { state: { herbCart: cart } });
  }

  // Back to Home button (same logic as HerbCategoryList.js)
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
  if (!Array.isArray(groups) || groups.length === 0) {
    return <div>No herb groups found. Check your data file structure.</div>;
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 900;
  const backgroundGradient = `linear-gradient(135deg, ${COLORS.backgroundGold} 0%, ${COLORS.accentEmerald} 35%, ${COLORS.accentGold} 100%)`;
  // Dynamic spacer for filter bar height when fixed
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
        {/* Dynamic spacer for filter bar height when fixed */}
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
            <HerbGroupListSideBar
              groups={groups}
              activeCategory={activeCategory}
              handleCategoryScroll={handleCategoryScroll}
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
              <MobileGroupNav
                groups={groups}
                activeCategory={activeCategory}
                handleCategoryScroll={handleCategoryScroll}
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
              <HerbsByGroups
                groups={filteredGroups}
                categoryRefs={categoryRefs}
                getAnyHerbMatchByName={getAnyHerbMatchByName}
                getHerbObjFromAll={getHerbObjFromAll}
                getHerbDisplayName={getHerbDisplayName}
                handleHerbClick={handleHerbClick}
                CARD_MAX_WIDTH={CARD_MAX_WIDTH}
                activeCategory={activeCategory}
                ref={herbsSectionRef}
                keyActionsMap={keyActionsMap}
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