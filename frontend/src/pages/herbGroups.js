import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useHerbCart } from "../context/HerbCartContext";
import HerbCart from "../components/HerbCart";
import Logo from "../components/Logo";

const COLORS = {
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
};

const SIDEBAR_WIDTH = 300;
const CARD_MAX_WIDTH = 650 * 1.25;
const FILTER_BAR_HEIGHT = 56;

const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";
const herbApiEndpoints = [
  `${API_URL}/api/data/caleandnccaomherbs`,
  `${API_URL}/api/data/caleherbs`,
  `${API_URL}/api/data/extraherbs`,
  `${API_URL}/api/data/nccaomherbs`,
];
const herbGroupsEndpoint = `${API_URL}/api/data/herbgroupslist`;

function getHerbDisplayName(herb) {
  if (typeof herb === "string") {
    return herb.replace(/\s*\(.*?\)/, "").trim();
  }
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

function getHerbBadge(herb) {
  if (herb && typeof herb === "object") {
    if (herb.nccaomAndCale === "yes" || herb.nccaomAndCaleOnly === "yes") {
      return { label: "NCCAOM/CALE", color: "bg-green-200 text-green-700" };
    }
    if (herb.caleOnly === "yes") {
      return { label: "CALE", color: "bg-yellow-200 text-yellow-800" };
    }
    if (herb.nccaomOnly === "yes") {
      return { label: "NCCAOM", color: "bg-blue-200 text-blue-700" };
    }
    if (herb.extraHerb === "yes") {
      return { label: "Extra", color: "bg-gray-200 text-gray-700" };
    }
  }
  return null;
}

function Badge({ badge }) {
  if (!badge) return null;
  let className =
    "inline-block px-2 py-1 rounded text-xs font-semibold align-middle transition-all duration-200";
  if (badge.color) className += ` ${badge.color}`;
  return (
    <span
      className={className}
      style={badge.color ? {} : { background: "#e0e0e0", color: "#333", marginRight: "0.5em" }}
    >
      {badge.label}
    </span>
  );
}

function HighlightedKeyActions({ text }) {
  if (!text) return null;
  return (
    <span
      className="ml-2"
      style={{
        background: COLORS.highlight,
        color: COLORS.claret,
        borderRadius: "0.7em",
        fontWeight: 500,
        fontFamily: "inherit",
        padding: "0.22em 1.1em",
        marginLeft: "0.95em",
        boxShadow: `0px 1px 5px -3px ${COLORS.seal}60`,
        fontSize: "1.01em",
        whiteSpace: "normal",
        lineHeight: 1.35,
        verticalAlign: "middle",
        display: "inline-block",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {text}
    </span>
  );
}

function HerbProperties({ properties }) {
  if (!properties) return null;
  let propsArr = Array.isArray(properties) ? properties : [properties];
  return (
    <div
      className="flex flex-wrap gap-2 justify-end items-center"
      style={{
        fontSize: "0.85em",
        color: COLORS.seal,
        fontWeight: 500,
        minWidth: 100,
      }}
    >
      {propsArr.map((prop, idx) => (
        <span
          key={prop + idx}
          className="px-2 py-1 rounded-full bg-carolina text-white"
          style={{
            background: COLORS.carolina,
            color: "#fff",
            fontWeight: 600,
            fontSize: "0.99em",
            boxShadow: "0 1px 3px 0 #68C5E633",
            letterSpacing: ".01em",
          }}
        >
          {prop}
        </span>
      ))}
    </div>
  );
}

function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .replace(/\(.*?\)/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

const GlobalAnimations = () => (
  <style>
    {`
      @keyframes pulseGlow {
        0% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
        50% { box-shadow: 0 0 16px 8px ${COLORS.violet}88; }
        100% { box-shadow: 0 0 0 0 ${COLORS.violet}33; }
      }
      .animate-pulseGlow { animation: pulseGlow 2s infinite; }
      @keyframes fadeInScaleUp {
        0% { opacity: 0; transform: scale(0.97) translateY(14px);}
        50% { opacity: 0.7; transform: scale(1.03) translateY(-6px);}
        100% { opacity: 1; transform: scale(1) translateY(0);}
      }
      .animate-fadeInScaleUp { animation: fadeInScaleUp 0.7s cubic-bezier(.36,1.29,.45,1.01); }
      @keyframes shimmerText {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      .animate-shimmerText {
        background: linear-gradient(90deg, ${COLORS.violet}, ${COLORS.carolina}, ${COLORS.claret}, ${COLORS.vanilla}, ${COLORS.highlight});
        background-size: 400% 400%;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-fill-color: transparent;
        animation: shimmerText 3.2s ease-in-out infinite;
      }
      @media (max-width: 900px) {
        .sidebar {
          display: none !important;
        }
        .main-scroll,
        .custom-scrollbar-main {
          padding-left: 0 !important;
        }
        .herb-group-section {
          padding: 0 2vw !important;
          max-width: 98vw !important;
        }
        .mobile-category-nav {
          position: static !important;
          margin-top: 1.4em !important;
        }
        .logo-mobile-top {
          margin-top: 0.7em !important;
          margin-bottom: 0.2em !important;
        }
      }
      @media (max-width: 700px) {
        .herb-group-section {
          padding: 0 0.5vw !important;
          max-width: 100vw !important;
        }
        .herb-group-card {
          padding: 1em !important;
          font-size: 1em !important;
        }
        .filter-bar {
          font-size: 0.94rem !important;
          padding: 0.5em 0.4em !important;
        }
        .main-scroll,
        .custom-scrollbar-main {
          padding-right: 0 !important;
        }
        .mobile-category-nav {
          position: static !important;
          margin-top: 1.4em !important;
        }
        .logo-mobile-top {
          margin-top: 0.7em !important;
          margin-bottom: 0.2em !important;
        }
      }
      @media (max-width: 500px) {
        .herb-group-section {
          padding: 0 !important;
        }
        .herb-group-card {
          padding: 0.5em !important;
          font-size: 0.95em !important;
        }
        .mobile-category-nav {
          position: static !important;
          margin-top: 1.2em !important;
        }
        .logo-mobile-top {
          margin-top: 0.6em !important;
          margin-bottom: 0.13em !important;
        }
      }
    `}
  </style>
);

function MobileCategoryNav({ groups, activeCategory, handleCategoryScroll }) {
  return (
    <nav className="mobile-category-nav w-full px-2 py-2 mb-4 bg-white/90 rounded-xl shadow-md flex flex-wrap justify-center gap-2"
      style={{
        position: "static",
        marginTop: "1.2em",
        zIndex: 1,
      }}
    >
      {groups.map((group, idx) => (
        <button
          key={group.category + "-" + idx}
          data-category={group.category}
          onClick={() => handleCategoryScroll(group.category)}
          className={[
            "px-3 py-2 rounded font-semibold transition-colors hover:bg-violet/20 focus-visible:ring-2 focus-visible:ring-carolina",
            activeCategory === group.category
              ? "bg-violet/30 text-carolina font-extrabold shadow"
              : "text-violet"
          ].join(" ")}
          style={{
            color: COLORS.violet,
            cursor: "pointer",
            fontWeight: activeCategory === group.category ? 800 : 600,
            border: activeCategory === group.category ? `2px solid ${COLORS.carolina}` : "none",
            boxShadow: activeCategory === group.category ? `0 0 4px 0 ${COLORS.violet}` : "none"
          }}
          tabIndex={0}
        >
          {group.category}
        </button>
      ))}
    </nav>
  );
}

export default function HerbGroupsPage() {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const [allHerbs, setAllHerbs] = useState([]);
  const [herbsByType, setHerbsByType] = useState({
    caleNccaom: [],
    cale: [],
    nccaom: [],
    extra: [],
  });

  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showCale, setShowCale] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);

  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const navigate = useNavigate();

  const sidebarRef = useRef();
  const scrollContainerRef = useRef();
  const categoryRefs = useRef({});
  const [activeCategory, setActiveCategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth < 900
  );
  useEffect(() => {
    function handleResize() {
      setIsMobile(window.innerWidth < 900);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(herbGroupsEndpoint).then((r) => r.json()),
      ...herbApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
    ])
      .then(([groupsData, caleNccaomList, caleList, extraList, nccaomList]) => {
        setGroups(groupsData);

        const mapHerbList = (list, type) =>
          (list || [])
            .flat()
            .map((h) =>
              h && typeof h === "object"
                ? {
                    ...h,
                    _normPinyin: normalize(h.pinyinName || h.name || ""),
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
        setHerbsByType({ caleNccaom, cale, nccaom, extra });
        setAllHerbs([...caleNccaom, ...cale, ...nccaom, ...extra]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current || !groups.length) return;
      const catRefs = groups.map(group => ({
        category: group.category,
        offset: categoryRefs.current[group.category]?.offsetTop ?? 0,
      }));
      const scrollY = scrollContainerRef.current.scrollTop;

      let current = catRefs[0]?.category || null;
      for (let i = 0; i < catRefs.length; i++) {
        if (
          scrollY + 140 >= catRefs[i].offset ||
          (i === 0 && scrollY + 50 < catRefs[0].offset)
        ) {
          current = catRefs[i].category;
        }
      }
      setActiveCategory(current);

      const sidebar = sidebarRef.current;
      if (sidebar) {
        const activeBtn = sidebar.querySelector(
          `[data-category="${current}"]`
        );
        if (activeBtn) {
          const sidebarRect = sidebar.getBoundingClientRect();
          const btnRect = activeBtn.getBoundingClientRect();
          if (
            btnRect.top < sidebarRect.top + 20 ||
            btnRect.bottom > sidebarRect.bottom - 20
          ) {
            activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
          }
        }
      }
    };

    const scrollEl = scrollContainerRef.current;
    if (scrollEl) {
      scrollEl.addEventListener("scroll", handleScroll);
      setTimeout(handleScroll, 100);
    }
    return () => {
      if (scrollEl) scrollEl.removeEventListener("scroll", handleScroll);
    };
  }, [groups, isMobile]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.style.overflowY = isSidebarHovered ? "hidden" : "scroll";
    }
  }, [isSidebarHovered]);

  function passesFilter(key) {
    const norm = normalize(key);
    const herbObj = allHerbs.find(
      (h) => normalize(h.pinyinName) === norm || normalize(h.name) === norm
    );
    if (!herbObj) return true;
    if (herbObj._type === "caleNccaom" && showCaleNccaom) return true;
    if (herbObj._type === "cale" && showCale) return true;
    if (herbObj._type === "nccaom" && showNccaom) return true;
    if (herbObj._type === "extra" && showExtra) return true;
    return false;
  }

  function getHerbObjFromAll(key) {
    const norm = normalize(key);
    let allowedTypes = [];
    if (showCaleNccaom) allowedTypes.push("caleNccaom");
    if (showCale) allowedTypes.push("cale");
    if (showNccaom) allowedTypes.push("nccaom");
    if (showExtra) allowedTypes.push("extra");
    return allHerbs.find(
      (h) =>
        (normalize(h.pinyinName) === norm ||
          normalize(h.name) === norm) &&
        allowedTypes.includes(h._type)
    );
  }

  function handleCategoryScroll(category) {
    const ref = categoryRefs.current[category];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveCategory(category);
    setTimeout(() => {
      const sidebar = sidebarRef.current;
      if (sidebar) {
        const activeBtn = sidebar.querySelector(
          `[data-category="${category}"]`
        );
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 120);
  }

  function handleAddToCart(herbObj) {
    addHerb(herbObj);
    setShowCart(true);
  }

  function handleCreateFormula() {
    if (cart.length > 0) {
      navigate("/formulabuilder", { state: { herbCart: cart } });
      clearCart();
      setShowCart(false);
    }
  }

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(groups) || groups.length === 0) {
    return <div>No herb groups found. Check your data file structure.</div>;
  }

  return (
    <>
      <GlobalAnimations />
      {/* Fixed filter bar (checkboxes) */}
      <div
        className="fixed top-0 left-0 w-full z-50 flex items-center justify-center py-3 px-2 filter-bar"
        style={{
          background: `linear-gradient(90deg, ${COLORS.vanilla} 65%, ${COLORS.carolina} 100%)`,
          borderBottom: `2.5px solid ${COLORS.violet}`,
          boxShadow: `0 4px 16px -6px ${COLORS.violet}22`,
          minHeight: FILTER_BAR_HEIGHT,
          fontWeight: 600,
          fontSize: "1.05rem",
          flexWrap: "wrap",
          justifyContent: "flex-start",
        }}
      >
        <span
          className="mr-6 font-extrabold text-violet text-lg tracking-tight"
          style={{ textShadow: `0 1px 0 ${COLORS.vanilla}` }}
        >
          Herb Groups by Function
        </span>
        <label className="mx-4 flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!showCaleNccaom}
            onChange={() => setShowCaleNccaom((v) => !v)}
            className="accent-green-700 w-4 h-4"
          />
          <span className="text-green-700 font-semibold">NCCAOM/CALE</span>
        </label>
        <label className="mx-4 flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!showCale}
            onChange={() => setShowCale((v) => !v)}
            className="accent-yellow-800 w-4 h-4"
          />
          <span className="text-yellow-800 font-semibold">CALE</span>
        </label>
        <label className="mx-4 flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!showNccaom}
            onChange={() => setShowNccaom((v) => !v)}
            className="accent-blue-700 w-4 h-4"
          />
          <span className="text-blue-700 font-semibold">NCCAOM</span>
        </label>
        <label className="mx-4 flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={!!showExtra}
            onChange={() => setShowExtra((v) => !v)}
            className="accent-gray-700 w-4 h-4"
          />
          <span className="text-gray-700 font-semibold">Extra</span>
        </label>
      </div>
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onCreateFormula={handleCreateFormula}
      />
      <button
        className="fixed"
        style={{
          right: 18,
          bottom: 28,
          background: COLORS.violet,
          color: COLORS.vanilla,
          borderRadius: "50%",
          width: 49,
          height: 49,
          minWidth: 49,
          minHeight: 49,
          boxShadow: "0 2px 12px 0 #7C5CD366",
          zIndex: 70,
          fontWeight: 700,
          fontSize: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: `2px solid ${COLORS.vanilla}`,
          transition: "background 0.2s, scale 0.15s",
        }}
        onClick={() => setShowCart((c) => !c)}
        aria-label="Show Cart"
        title="Show Cart"
      >
        🛒{cart.length > 0 && (
          <span
            style={{
              fontSize: 16,
              marginLeft: 5,
              background: COLORS.claret,
              color: COLORS.vanilla,
              borderRadius: "50%",
              padding: "2px 8px",
              fontWeight: 500,
            }}
          >
            {cart.length}
          </span>
        )}
      </button>
      <div
        className="fixed"
        style={{
          top: FILTER_BAR_HEIGHT + 16,
          right: 32,
          zIndex: 51,
        }}
      >
        <Link
          to="/"
          className="px-5 py-2 rounded-full font-bold shadow-xl transition-all duration-200 hover:scale-105 active:scale-95 focus:ring-2 focus:ring-carolina"
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            border: `2px solid ${COLORS.seal}`,
            textShadow: `0 1px 0 ${COLORS.carolina}`,
          }}
          tabIndex={0}
        >
          Back to Home
        </Link>
      </div>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 0,
          width: "100vw",
          height: "100vh",
          background: `linear-gradient(135deg, ${COLORS.vanilla} 0%, ${COLORS.carolina} 35%, ${COLORS.violet} 100%)`,
        }}
        aria-hidden="true"
      />
      <div
        className="relative w-full"
        style={{
          minHeight: "100vh",
          height: "100vh",
          position: "relative",
          zIndex: 1,
          width: "100vw",
          overflow: "hidden",
        }}
      >
        <aside
          ref={sidebarRef}
          className="sidebar hidden md:flex flex-col"
          style={{
            position: "fixed",
            top: `${FILTER_BAR_HEIGHT}px`,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: `calc(100vh - ${FILTER_BAR_HEIGHT}px)`,
            overflowY: "auto",
            background: `linear-gradient(160deg, ${COLORS.vanilla} 80%, ${COLORS.carolina} 100%)`,
            borderRadius: "2em",
            border: `2.5px solid ${COLORS.violet}`,
            boxShadow: `0 0 24px -8px ${COLORS.violet}44`,
            zIndex: 20,
            marginTop: "0.5em",
            marginBottom: "0.5em",
            paddingTop: "0.75em",
            scrollbarWidth: "thin",
            scrollbarColor: `${COLORS.violet} ${COLORS.vanilla}`,
            transition: "box-shadow 0.2s",
          }}
          onMouseEnter={() => setIsSidebarHovered(true)}
          onMouseLeave={() => setIsSidebarHovered(false)}
        >
          <nav className="py-8 px-2">
            <h2
              className="text-lg font-bold mb-4 pl-2"
              style={{
                color: COLORS.violet,
                letterSpacing: "-.01em",
                textShadow: `0 1px 0 ${COLORS.carolina}`,
                borderLeft: `6px solid ${COLORS.carolina}`,
                paddingLeft: "0.5em",
              }}
            >
              Groups
            </h2>
            <ul className="space-y-2">
              {groups.map((group, idx) => (
                <li key={group.category + "-" + idx}>
                  <button
                    data-category={group.category}
                    onClick={() => handleCategoryScroll(group.category)}
                    className={[
                      "w-full text-left px-3 py-2 rounded transition-colors font-semibold hover:bg-violet/20",
                      activeCategory === group.category
                        ? "bg-violet/30 text-carolina font-extrabold shadow"
                        : "",
                      "focus-visible:ring-2 focus-visible:ring-carolina",
                    ].join(" ")}
                    style={{
                      color: COLORS.violet,
                      cursor: "pointer",
                      fontWeight: 700,
                      transition: "background 0.2s, transform 0.1s",
                      outline:
                        activeCategory === group.category
                          ? `2px solid ${COLORS.carolina}`
                          : "none",
                      boxShadow:
                        activeCategory === group.category
                          ? `0 0 4px 0 ${COLORS.violet}`
                          : "none",
                    }}
                    tabIndex={0}
                  >
                    {group.category}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>
        <div
          ref={scrollContainerRef}
          className="main-scroll custom-scrollbar-main"
          style={{
            position: "fixed",
            top: FILTER_BAR_HEIGHT,
            left: 0,
            width: "100vw",
            height: `calc(100vh - ${FILTER_BAR_HEIGHT}px)`,
            overflowY: "scroll",
            overflowX: "hidden",
            WebkitOverflowScrolling: "touch",
            zIndex: 10,
            paddingLeft: SIDEBAR_WIDTH,
            background: "none",
          }}
        >
          <div
            className="flex flex-col items-center"
            style={{
              width: "100%",
              maxWidth: 900 * 1.25,
              margin: "0 auto",
              paddingRight: 60,
            }}
          >
            {/* PATCH: Show logo at top of mobile, below filter bar and above category nav */}
            {isMobile && (
              <div
                className="logo-mobile-top"
                style={{
                  width: "100%",
                  maxWidth: CARD_MAX_WIDTH,
                  margin: "0 auto",
                  textAlign: "center",
                  marginTop: "0.7em",
                  marginBottom: "0.2em",
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Logo size={38} showBeta={true} />
              </div>
            )}
            {/* PATCH: Mobile category nav -- scrolls with content, not fixed, only one filter bar */}
            {isMobile && (
              <MobileCategoryNav
                groups={groups}
                activeCategory={activeCategory}
                handleCategoryScroll={handleCategoryScroll}
              />
            )}
            {/* Desktop logo position */}
            {!isMobile && (
              <div
                style={{
                  width: "100%",
                  maxWidth: CARD_MAX_WIDTH,
                  margin: "0 auto",
                  textAlign: "center",
                  marginTop: "1.5em",
                  marginBottom: "1.2em",
                  position: "relative",
                  zIndex: 1,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Logo size={56} showBeta={true} />
              </div>
            )}
            <div
              className="space-y-14 w-full flex flex-col items-center herb-group-section"
              style={{ maxWidth: CARD_MAX_WIDTH }}
            >
              {groups.map((group, idx) => (
                <section
                  key={group.category + "-" + idx}
                  ref={(ref) => (categoryRefs.current[group.category] = ref)}
                  className="shadow-2xl rounded-2xl border border-violet px-7 py-8 herb-group-card"
                  style={{
                    background: "#fff",
                    boxShadow: `0 8px 40px -14px ${COLORS.violet}55, 0 1.5px 0 ${COLORS.vanilla}`,
                    borderColor: COLORS.violet,
                    position: "relative",
                    overflow: "hidden",
                    width: "100%",
                    maxWidth: CARD_MAX_WIDTH,
                  }}
                >
                  <h3
                    className="mb-7 tracking-tight"
                    style={{
                      fontSize: "2.1rem",
                      fontWeight: 900,
                      color: COLORS.violet,
                      borderLeft: `8px solid ${COLORS.claret}`,
                      background: COLORS.vanilla,
                      padding: "0.22em 1.2em",
                      marginLeft: "-1.2em",
                      borderRadius: "0 1.7em 1.7em 0",
                      boxShadow: `1px 2px 12px -7px ${COLORS.claret}`,
                      textShadow: `0 1px 0 ${COLORS.carolina}`,
                      letterSpacing: "-.02em",
                      fontFamily: "inherit",
                      zIndex: 2,
                      position: "relative",
                    }}
                  >
                    {group.category}
                  </h3>
                  <ul className="flex flex-col gap-4">
                    {(group.herbs || [])
                      .filter((herb) => passesFilter(getHerbDisplayName(herb)))
                      .map((herb, i) => {
                        const key =
                          getHerbDisplayName(herb) +
                          "-" +
                          group.category +
                          "-" +
                          i;
                        const herbObj =
                          getHerbObjFromAll(getHerbDisplayName(herb)) || herb;
                        const badge = getHerbBadge(herbObj);
                        const pinyinDisplay = getHerbDisplayName(herbObj);
                        const pharmaceuticalName =
                          herbObj.pharmaceuticalName ||
                          herbObj.pharmaceutical ||
                          "";
                        const keyActions =
                          herbObj.keyActions || herbObj.actions || "";
                        const properties = herbObj.properties;
                        const explanation = herbObj.explanation;

                        return (
                          <li
                            key={key}
                            className="group transition-all duration-200 shadow-lg rounded-xl border border-carolina bg-white/95 hover:border-violet hover:scale-[1.025] active:scale-95 focus:ring-2 focus:ring-carolina cursor-pointer"
                            style={{
                              background: "#fff",
                              zIndex: 3,
                              transition: "box-shadow .2s, transform .15s",
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(herbObj);
                            }}
                            tabIndex={0}
                          >
                            <div
                              className="flex flex-col sm:flex-row sm:items-center sm:gap-7 px-5 py-3 w-full min-w-0 items-center"
                              style={{gap:"1.2em"}}
                            >
                              <div className="flex flex-row items-center gap-2">
                                <span
                                  className="font-extrabold text-violet text-[1.1rem] leading-tight whitespace-nowrap"
                                  style={{ letterSpacing: "-.01em" }}
                                  title={pinyinDisplay}
                                >
                                  {pinyinDisplay}
                                </span>
                              </div>
                              <div>
                                <span
                                  className="text-sm text-seal"
                                  style={{
                                    color: COLORS.seal,
                                    fontWeight: 500,
                                    whiteSpace: "normal",
                                  }}
                                  title={pharmaceuticalName}
                                >
                                  {pharmaceuticalName}
                                </span>
                              </div>
                              <div>
                                <Badge badge={badge} />
                              </div>
                              <div
                                className="text-xs font-medium"
                                style={{
                                  opacity: 0.95,
                                  display: "flex",
                                  alignItems: "center",
                                }}
                              >
                                <HighlightedKeyActions text={keyActions} />
                              </div>
                              <div className="flex flex-row justify-end items-center">
                                <HerbProperties properties={properties} />
                              </div>
                            </div>
                            {explanation && (
                              <span
                                className="ml-4 px-3 py-1 rounded-xl text-sm font-medium"
                                style={{
                                  background: COLORS.highlight,
                                  color: COLORS.claret,
                                  fontWeight: 500,
                                  boxShadow: `0px 1px 5px -3px ${COLORS.seal}60`,
                                  fontFamily: "inherit",
                                  opacity: 1,
                                  whiteSpace: "normal",
                                  lineHeight: 1.35,
                                  transition: "background 0.2s, color 0.2s",
                                  display: "inline-block",
                                  marginTop: "7px",
                                }}
                              >
                                {explanation}
                              </span>
                            )}
                          </li>
                        );
                      })}
                  </ul>
                </section>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}