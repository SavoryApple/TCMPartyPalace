import React, { useEffect, useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
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
  shadowStrong: "#7C5CD399",
};
const SIDEBAR_WIDTH = 300;
const FILTER_BAR_HEIGHT = 56;
const CARD_MAX_WIDTH = 650 * 1.25;

const API_URL = process.env.REACT_APP_API_URL || "https://thetcmatlas.fly.dev";
const herbApiEndpoints = [
  `${API_URL}/api/data/caleandnccaomherbs`,
  `${API_URL}/api/data/caleherbs`,
  `${API_URL}/api/data/extraherbs`,
  `${API_URL}/api/data/nccaomherbs`,
];
const herbCategoryListEndpoint = `${API_URL}/api/data/herbcategorylist`;

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
        .main-scroll {
          padding-left: 0 !important;
        }
      }
      @media (max-width: 700px) {
        .space-y-14 {
          gap: 2em !important;
        }
        .card-section {
          padding: 0 1vw !important;
          max-width: 99vw !important;
        }
        .card {
          padding: 1em !important;
          font-size: 1em !important;
        }
        .filter-bar {
          font-size: 0.97rem !important;
          padding: 0.7em 0.5em !important;
          flex-wrap: wrap !important;
          justify-content: flex-start !important;
        }
        .filter-checkbox-group {
          flex-wrap: wrap !important;
          gap: 8px !important;
        }
        .filter-bar label {
          margin-bottom: 4px !important;
        }
      }
      @media (max-width: 500px) {
        .card-section {
          padding: 0 !important;
        }
        .card {
          padding: 0.55em !important;
          font-size: 0.95em !important;
        }
        .filter-bar {
          font-size: 0.92rem !important;
          padding: 0.6em 0.3em !important;
        }
      }
    `}
  </style>
);

// --- Scroll Up Button PATCH ---
function ScrollUpButton({ scrollContainerRef }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    const handleScroll = () => setShow(container.scrollTop > 180);
    container.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef]);

  function handleClick() {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <button
      onClick={handleClick}
      style={{
        background: COLORS.violet,
        color: COLORS.vanilla,
        borderRadius: "50%",
        width: 44,
        height: 44,
        border: `2.5px solid ${COLORS.seal}`,
        boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
        fontWeight: 900,
        fontSize: "1.2rem",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        transition: "background 0.2s, scale 0.15s",
        cursor: "pointer",
        outline: "none",
        animation: "pulseGlow 2s infinite",
        marginLeft: "0.6em"
      }}
      aria-label="Scroll to top"
      title="Scroll to top"
      className="animate-fadeInScaleUp"
    >
      ↑
    </button>
  );
}

function getHerbDisplayName(herb) {
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
function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
function flattenCategories(raw) {
  if (!Array.isArray(raw)) return [];
  let out = [];
  for (const item of raw) {
    if (item.name && Array.isArray(item.subcategories)) {
      out.push({
        ...item,
        category: item.name,
      });
    }
    if (item.categories && Array.isArray(item.categories)) {
      out.push(...flattenCategories(item.categories));
    }
  }
  return out;
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
        maxWidth: 220,
        overflow: "visible",
        flexWrap: "wrap",
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
            whiteSpace: "normal",
            overflow: "visible",
            textOverflow: "clip",
            maxWidth: "none",
          }}
        >
          {prop}
        </span>
      ))}
    </div>
  );
}
function HerbExtrasRight({ herbObj }) {
  if (!herbObj) return null;
  const { yoSanCarries, formats } = herbObj;
  if (!yoSanCarries && (!formats || formats.length === 0)) return null;
  return (
    <div
      className="flex flex-col gap-1 items-end"
      style={{
        minWidth: 120,
        maxWidth: 180,
        justifyContent: "flex-end",
        marginTop: "6px",
        marginRight: "0",
        textAlign: "right",
        overflowWrap: "break-word",
        wordBreak: "break-word",
      }}
    >
      {yoSanCarries !== undefined && (
        <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
          <strong style={{ color: COLORS.violet }}>Yo San Carries:</strong>{" "}
          <span style={{ color: yoSanCarries ? COLORS.carolina : COLORS.claret, fontWeight: 600 }}>
            {yoSanCarries === true ? "Yes" : yoSanCarries === false ? "No" : ""}
          </span>
        </div>
      )}
      {formats && Array.isArray(formats) && formats.length > 0 && (
        <div style={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}>
          <strong style={{ color: COLORS.violet }}>Format:</strong>{" "}
          <span style={{ color: COLORS.seal }}>
            {formats.join(", ")}
          </span>
        </div>
      )}
    </div>
  );
}

// --- PATCH: Mobile category nav styled like FormulaCategoryList.js ---
function MobileCategoryNav({ categories, activeSubcategory, handleSubcategoryScroll }) {
  return (
    <nav className="mobile-category-nav w-full px-2 py-2 mb-4 bg-white/90 rounded-xl shadow-md flex flex-wrap justify-center gap-2" style={{ display: "flex" }}>
      {categories.map((category, catIdx) =>
        (category.subcategories || []).map((subcat, subIdx) => (
          <button
            key={subcat.name + "-" + subIdx}
            data-subcategory={subcat.name}
            onClick={() => handleSubcategoryScroll(subcat.name)}
            className={[
              "px-3 py-2 rounded font-semibold transition-colors hover:bg-violet/20 focus-visible:ring-2 focus-visible:ring-carolina",
              activeSubcategory === subcat.name
                ? "bg-violet/30 text-carolina font-extrabold shadow"
                : "text-violet"
            ].join(" ")}
            style={{
              color: COLORS.violet,
              cursor: "pointer",
              fontWeight: activeSubcategory === subcat.name ? 800 : 600,
              border: activeSubcategory === subcat.name ? `2px solid ${COLORS.carolina}` : "none",
              boxShadow: activeSubcategory === subcat.name ? `0 0 4px 0 ${COLORS.violet}` : "none"
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

export default function HerbCategoryListPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showExtra, setShowExtra] = useState(true);
  const [showCaleNccaom, setShowCaleNccaom] = useState(true);
  const [showCale, setShowCale] = useState(true);
  const [showNccaom, setShowNccaom] = useState(true);
  const [allHerbs, setAllHerbs] = useState([]);
  const [herbsByType, setHerbsByType] = useState({
    caleNccaom: [],
    cale: [],
    nccaom: [],
    extra: [],
  });

  const navigate = useNavigate();
  const categoryRefs = useRef({});
  const subcategoryRefs = useRef({});
  const sidebarRef = useRef();
  const scrollContainerRef = useRef();
  const [activeSubcategory, setActiveSubcategory] = useState(null);
  const [isSidebarHovered, setIsSidebarHovered] = useState(false);

  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

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
    const handleScroll = () => {
      if (!scrollContainerRef.current || !categories.length) return;
      const subcatRefs = [];
      categories.forEach(category => {
        (category.subcategories || []).forEach(subcat => {
          if (subcategoryRefs.current[subcat.name]) {
            subcatRefs.push({
              name: subcat.name,
              offset: subcategoryRefs.current[subcat.name].offsetTop,
            });
          }
        });
      });
      const scrollY =
        scrollContainerRef.current.scrollTop +
        (window.innerWidth > 768 ? 0 : FILTER_BAR_HEIGHT);

      let current = subcatRefs[0]?.name || null;
      for (let i = 0; i < subcatRefs.length; i++) {
        if (
          scrollY + 140 >= subcatRefs[i].offset ||
          (i === 0 && scrollY + 50 < subcatRefs[0].offset)
        ) {
          current = subcatRefs[i].name;
        }
      }
      if (current) {
        setActiveSubcategory(current);

        const sidebar = sidebarRef.current;
        if (sidebar) {
          const activeBtn = sidebar.querySelector(
            `[data-subcategory="${current}"]`
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
  }, [categories]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(herbCategoryListEndpoint).then((r) => r.json()),
      ...herbApiEndpoints.map((url) => fetch(url).then((r) => r.json())),
    ])
      .then(([catData, caleNccaomList, caleList, extraList, nccaomList]) => {
        let categoriesArr = [];
        if (catData && Array.isArray(catData.categories))
          categoriesArr = flattenCategories(catData.categories);
        else if (Array.isArray(catData))
          categoriesArr = flattenCategories(catData);
        setCategories(categoriesArr);

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
    const container = scrollContainerRef.current;
    if (container) {
      container.style.overflowY = isSidebarHovered ? "hidden" : "scroll";
    }
  }, [isSidebarHovered]);

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

  function handleSubcategoryScroll(title) {
    const ref = subcategoryRefs.current[title];
    if (ref && ref.scrollIntoView) {
      ref.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setActiveSubcategory(title);
    setTimeout(() => {
      const sidebar = sidebarRef.current;
      if (sidebar) {
        const activeBtn = sidebar.querySelector(
          `[data-subcategory="${title}"]`
        );
        if (activeBtn) {
          activeBtn.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }
    }, 120);
  }

  function handleCreateFormula() {
    if (cart.length > 0) {
      navigate("/formulabuilder", { state: { herbCart: cart } });
    } else {
      navigate("/formulabuilder");
    }
    clearCart();
    setShowCart(false);
  }

  function findFullHerbObj(herb) {
    let norm = normalize(herb.pinyinName || herb.name || "");
    return (
      allHerbs.find(
        (h) =>
          normalize(h.pinyinName || h.name || "") === norm
      ) || herb
    );
  }

  const cartDrawerWidth = 270;
  const cartDrawerTop = FILTER_BAR_HEIGHT + 16 + 54;

  if (loading) return <div>Loading...</div>;
  if (!Array.isArray(categories) || categories.length === 0) {
    return <div>No categories found. Check your data file structure.</div>;
  }

  return (
    <>
      <GlobalAnimations />
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
          Show herbs:
        </span>
        <div className="filter-checkbox-group" style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "8px",
          maxWidth: "100vw",
        }}>
          <label className="mx-4 flex items-center space-x-2 cursor-pointer" style={{ marginBottom: 4 }}>
            <input type="checkbox" checked={!!showCaleNccaom} onChange={() => setShowCaleNccaom((v) => !v)} className="accent-green-700 w-4 h-4" />
            <span className="text-green-700 font-semibold">NCCAOM/CALE</span>
          </label>
          <label className="mx-4 flex items-center space-x-2 cursor-pointer" style={{ marginBottom: 4 }}>
            <input type="checkbox" checked={!!showCale} onChange={() => setShowCale((v) => !v)} className="accent-yellow-800 w-4 h-4" />
            <span className="text-yellow-800 font-semibold">CALE</span>
          </label>
          <label className="mx-4 flex items-center space-x-2 cursor-pointer" style={{ marginBottom: 4 }}>
            <input type="checkbox" checked={!!showNccaom} onChange={() => setShowNccaom((v) => !v)} className="accent-blue-700 w-4 h-4" />
            <span className="text-blue-700 font-semibold">NCCAOM</span>
          </label>
          <label className="mx-4 flex items-center space-x-2 cursor-pointer" style={{ marginBottom: 4 }}>
            <input type="checkbox" checked={!!showExtra} onChange={() => setShowExtra((v) => !v)} className="accent-gray-700 w-4 h-4" />
            <span className="text-gray-700 font-semibold">Extra</span>
          </label>
        </div>
      </div>
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onCreateFormula={handleCreateFormula}
      />
      {/* Floating Cart Button and ScrollUpButton PATCH */}
      <div
        style={{
          position: "fixed",
          right: 18,
          bottom: 28,
          zIndex: 71,
          display: "flex",
          alignItems: "center",
        }}
      >
        <button
          style={{
            background: COLORS.violet,
            color: COLORS.vanilla,
            borderRadius: "50%",
            width: 49,
            height: 49,
            minWidth: 49,
            minHeight: 49,
            boxShadow: "0 2px 12px 0 #7C5CD366",
            fontWeight: 700,
            fontSize: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: `2px solid ${COLORS.vanilla}`,
            transition: "background 0.2s, scale 0.15s",
            outline: "none",
            cursor: "pointer",
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
        <ScrollUpButton scrollContainerRef={scrollContainerRef} />
      </div>
      <div
        className="fixed back-to-home-btn"
        style={{
          top: FILTER_BAR_HEIGHT + 54,
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
        {/* Sidebar as before */}
        <aside
          ref={sidebarRef}
          className="sidebar hidden md:flex flex-col"
          style={{
            position: "fixed",
            top: `${FILTER_BAR_HEIGHT + 52}px`,
            left: 0,
            width: SIDEBAR_WIDTH,
            height: `calc(100vh - ${FILTER_BAR_HEIGHT + 52}px)`,
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
              Categories
            </h2>
            <ul className="space-y-2">
              {categories.map((category, catIdx) => (
                <React.Fragment key={category.category + "-" + catIdx}>
                  <li>
                    <div
                      style={{
                        color: COLORS.claret,
                        fontWeight: 800,
                        fontSize: "1.05em",
                        padding: "0.25em 0.7em 0.15em 0.7em",
                        margin: "0.3em 0",
                        borderLeft: `5px solid ${COLORS.claret}`,
                        background: COLORS.vanilla,
                        borderRadius: "0 1.2em 1.2em 0",
                        letterSpacing: "-.01em",
                        boxShadow: `1px 2px 10px -9px ${COLORS.claret}`,
                      }}
                    >
                      {category.category}
                    </div>
                  </li>
                  {(category.subcategories || []).map((subcat, subIdx) => (
                    <li key={subcat.name + "-" + subIdx}>
                      <button
                        data-subcategory={subcat.name}
                        onClick={() => handleSubcategoryScroll(subcat.name)}
                        className={[
                          "w-full text-left px-3 py-2 rounded transition-colors font-semibold hover:bg-violet/20",
                          activeSubcategory === subcat.name
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
                            activeSubcategory === subcat.name
                              ? `2px solid ${COLORS.carolina}`
                              : "none",
                          boxShadow:
                            activeSubcategory === subcat.name
                              ? `0 0 4px 0 ${COLORS.violet}`
                              : "none",
                        }}
                        tabIndex={0}
                      >
                        {subcat.name}
                      </button>
                    </li>
                  ))}
                </React.Fragment>
              ))}
            </ul>
          </nav>
        </aside>
        {/* Main scroll area */}
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
              maxWidth: CARD_MAX_WIDTH + 120,
              margin: "0 auto",
              paddingRight: 60,
            }}
          >
            {/* Centered animated Logo */}
            <div
              style={{
                width: "100%",
                maxWidth: CARD_MAX_WIDTH,
                margin: "0 auto",
                textAlign: "center",
                marginTop: "0.5em",
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
            {/* Mobile category nav as a card above herb cards, styled same as FormulaCategoryList.js */}
            {isMobile && (
              <MobileCategoryNav
                categories={categories}
                activeSubcategory={activeSubcategory}
                handleSubcategoryScroll={handleSubcategoryScroll}
              />
            )}
            <div
              className="space-y-14 w-full flex flex-col items-center card-section"
              style={{ maxWidth: CARD_MAX_WIDTH }}
            >
              {categories.map((category, catIdx) =>
                (category.subcategories || []).map((subcat, subIdx) => (
                  <section
                    key={subcat.name + "-" + subIdx}
                    ref={(ref) => (subcategoryRefs.current[subcat.name] = ref)}
                    className="shadow-2xl rounded-2xl border border-violet px-7 py-8 card"
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
                      {subcat.name}
                    </h3>
                    <ul className="flex flex-col gap-4">
                      {(subcat.herbs || [])
                        .filter((h) => passesFilter(h.pinyinName || h.name))
                        .map((herb, i) => {
                          const key =
                            (herb.pinyinName || herb.name) +
                            "-" +
                            subcat.name +
                            "-" +
                            i;
                          const herbObj =
                            getHerbObjFromAll(herb.pinyinName || herb.name) ||
                            herb;
                          const badge = herbObj && herbObj.badge;
                          const pinyinDisplay = getHerbDisplayName(herbObj);
                          const keyActions = herbObj.keyActions || herb.keyActions || "";
                          const properties = herbObj.properties || herb.properties || "";
                          const pharmaceuticalName = herbObj.pharmaceuticalName || herbObj.pharmaceutical || "";
                          const { yoSanCarries, formats } = herbObj || {};
                          return (
                            <li
                              key={key}
                              className="group transition-all duration-200 shadow-lg rounded-xl border border-carolina bg-white/95 hover:border-violet hover:scale-[1.025] active:scale-95 focus:ring-2 focus:ring-carolina cursor-pointer card"
                              style={{
                                background: "#fff",
                                zIndex: 3,
                                transition: "box-shadow .2s, transform .15s",
                                overflow: "hidden",
                              }}
                              onClick={(e) => {
                                e.stopPropagation();
                                const fullHerb = findFullHerbObj(herbObj);
                                addHerb(fullHerb);
                                setShowCart(true);
                              }}
                              tabIndex={0}
                            >
                              <div className="flex flex-row flex-wrap items-center w-full p-3"
                                style={{ gap: "16px", justifyContent: "space-between", alignItems: "flex-start" }}>
                                <div style={{ minWidth: 110, maxWidth: 260, flex: "1 1 110px", overflow: "hidden" }}>
                                  <span
                                    className="font-extrabold"
                                    style={{
                                      fontSize: "1.15rem",
                                      color: COLORS.violet,
                                      letterSpacing: "-.01em",
                                      textShadow: `0 1px 0 ${COLORS.highlight}`,
                                      whiteSpace: "nowrap",
                                      maxWidth: 200,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "inline-block",
                                    }}
                                  >
                                    {pinyinDisplay}
                                  </span>
                                  <span className="ml-2">
                                    <Badge badge={badge} />
                                  </span>
                                  <div
                                    className="italic font-semibold"
                                    style={{
                                      fontSize: "0.93rem",
                                      color: COLORS.seal,
                                      marginLeft: "0.15em",
                                      fontFamily: "serif",
                                      letterSpacing: "-.01em",
                                      whiteSpace: "normal",
                                      lineHeight: 1.35,
                                      maxWidth: 185,
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                    }}
                                  >
                                    {pharmaceuticalName}
                                  </div>
                                </div>
                                <div style={{ flex: "2 1 170px", minWidth: 90, maxWidth: 320, overflow: "hidden" }}>
                                  <HighlightedKeyActions text={keyActions || ""} />
                                  {herbObj.explanation && (
                                    <span
                                      className="ml-2 px-3 py-1 rounded-xl text-sm font-medium"
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
                                      {herbObj.explanation}
                                    </span>
                                  )}
                                </div>
                                <div style={{ flex: "1 1 90px", minWidth: 80, maxWidth: 220, textAlign: "right" }}>
                                  <HerbProperties properties={properties} />
                                  {(yoSanCarries !== undefined || (formats && formats.length > 0)) && (
                                    <HerbExtrasRight herbObj={herbObj} />
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                    </ul>
                  </section>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}