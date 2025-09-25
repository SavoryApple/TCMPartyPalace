import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link, useLocation } from "react-router-dom";
import { useHerbCart } from "../context/HerbCartContext";
import HerbCart from "../components/HerbCart";
import FormulaCategoryInfo from "../components/FormulaCategoryInfo";
import Logo from "../components/Logo";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";
import BackToTopButton from "../components/BackToTopButton";

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
  vanilla: "#FFF7E3",
  violet: "#7C5CD3",
  carolina: "#68C5E6",
  claret: "#A52439",
  seal: "#3B4461",
  highlight: "#ffe066",
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
  accent: "#fff0f0",
  herbLink: "#2176AE",
  herbLinkHover: "#438C3B",
  herbLinkBg: "#FFF7E3"
};

const NAVBAR_HEIGHT = 84;
const CARD_MAX_WIDTH = 650;

const GlobalAnimations = () => (
  <style>
    {`
      .herb-link-pop {
        animation: popHerb 0.175s cubic-bezier(.36,1.29,.45,1.01);
      }
      .herb-link-hover {
        transition: 
          transform 0.10s cubic-bezier(.36,1.29,.45,1.01),
          box-shadow 0.125s cubic-bezier(.36,1.29,.45,1.01),
          color 0.10s;
      }
      .herb-link-hover:hover, .herb-link-hover:focus {
        transform: scale(1.06) translateY(-1px);
        color: ${COLORS.herbLinkHover};
        background: ${COLORS.herbLinkBg};
        box-shadow: 0 2px 4px 0 ${COLORS.shadowStrong};
        outline: none;
      }
      .herb-link-in-cart {
        background: ${COLORS.accentEmerald};
        color: ${COLORS.accentBlack};
        border-radius: 1em;
        font-weight: bold;
        box-shadow: 0 0 0 2px ${COLORS.accentGold}33;
        padding: 0 0.4em;
        border: 2px solid ${COLORS.accentGold};
      }
      .back-to-home-btn {
        position: fixed;
        top: ${NAVBAR_HEIGHT + 12}px;
        right: 32px;
        z-index: 101;
        display: flex;
        justify-content: flex-end;
      }
      @media (max-width: 500px) {
        .back-to-home-btn {
          right: 2px !important;
        }
      }
    `}
  </style>
);

function highlightText(text, query) {
  if (!text) return "";
  if (!query) return text;
  const safeQuery = query.replace(/[-[\]/{}()*+?.\\^$|]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "gi");
  return String(text).split(regex).map((part, i) =>
    regex.test(part)
      ? <span key={i} style={{ background: COLORS.highlight, color: COLORS.claret, fontWeight: "bold" }}>{part}</span>
      : part
  );
}
function safeArr(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}
const numberCircleStyle = {
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${COLORS.accentGold}, ${COLORS.backgroundGold}, ${COLORS.accentEmerald})`,
  color: COLORS.backgroundRed,
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
  marginRight: "0.5em",
  border: `1.4px solid ${COLORS.accentGold}`,
  boxSizing: "border-box",
  boxShadow: `0 0 6px 0 ${COLORS.accentEmerald}22`
};

function getPinyinFromIngredient(ingredient) {
  let match = ingredient.match(/^([a-zA-Z\s]+?)(?=\(|\d|$)/);
  if (match) {
    return match[1].trim();
  }
  return ingredient.split(" ").slice(0, 2).join(" ").trim();
}

function findHerbObjByName(allHerbs, name) {
  if (!name || !allHerbs?.length) return null;
  const pinyinNorm = name.toLowerCase().replace(/\s+/g, "");
  return allHerbs.find(h => {
    let names = Array.isArray(h.pinyinName)
      ? h.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""))
      : [h.pinyinName ? h.pinyinName.toLowerCase().replace(/\s+/g, "") : ""];
    return names.some(n => n === pinyinNorm);
  });
}

function extractDosageFromIngredient(ingredientStr) {
  const match = ingredientStr.match(/(\d+(\.\d+)?(-\d+(\.\d+)?)?)\s*(g|mg|ml|pieces?)/i);
  if (match) return match[0].trim();
  return "";
}

// Display KeyActions/Explanation block at the bottom
function KeyActionsExplanation({ explanation, keyActions }) {
  if (!explanation && !keyActions) return null;
  return (
    <div
      className="formula-keyactions-explanation"
      style={{
        background: "#FCF5E5",
        color: COLORS.claret,
        fontWeight: 600,
        fontSize: "1.05em",
        borderRadius: "1em",
        padding: "14px 20px",
        marginTop: "10px",
        marginBottom: "10px",
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
      {keyActions && <div><strong>Key Actions:</strong> {keyActions}</div>}
      {explanation && <div><strong>Clinical Summary:</strong> {explanation}</div>}
    </div>
  );
}

// YoSanCarries/Formats block
function ExtraPropsBlock({ yosancarries, formats }) {
  return (
    <div style={{ marginTop: "10px", marginBottom: "10px", fontSize: "1.02em" }}>
      {typeof yosancarries !== "undefined" && (
        <div>
          <strong style={{ color: COLORS.backgroundRed }}>Yo San Carries:</strong>{" "}
          <span style={{ color: yosancarries ? COLORS.accentEmerald : COLORS.accentCrimson, fontWeight: 600 }}>
            {yosancarries === true ? "Yes" : yosancarries === false ? "No" : ""}
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

// --- Helper: Find formula category explanation ---
function getCategoryExplanation(formula, formulaCategoryList) {
  if (!formula || !formulaCategoryList) return undefined;
  // Find category
  for (const cat of formulaCategoryList) {
    for (const subcat of cat.subcategories || []) {
      for (const f of subcat.formulas || []) {
        // Match by name, case-insensitive, ignore spaces
        if (
          f.name &&
          formula.pinyinName &&
          f.name.replace(/\s/g, "").toLowerCase() ===
            (Array.isArray(formula.pinyinName)
              ? formula.pinyinName[0]
              : formula.pinyinName
            ).replace(/\s/g, "").toLowerCase()
        ) {
          return f.explanation;
        }
      }
    }
  }
  return undefined;
}

export default function FormulaCard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const query = params.get("q") || "";
  const { id } = useParams();
  const navigate = useNavigate();

  const { cart, addHerb, removeHerb, clearCart } = useHerbCart();
  const [showCart, setShowCart] = useState(false);

  const [allFormulas, setAllFormulas] = useState([]);
  const [allHerbs, setAllHerbs] = useState([]);
  const [formulaCategoryList, setFormulaCategoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [herbLinkAnimating, setHerbLinkAnimating] = useState({});

  useEffect(() => {
    setLoading(true);
    Promise.all([
      fetch(`https://thetcmatlas.fly.dev/api/data/caleandnccaomformulas`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/nccaomformulas`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/extraformulas`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/caleherbs`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/caleandnccaomherbs`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/nccaomherbs`).then(r => r.json()),
      fetch(`https://thetcmatlas.fly.dev/api/data/extraherbs`).then(r => r.json()),
      fetch(`/data/formulaCategoryListObject.json`).then(r => r.json()),
    ]).then(([caleNccaomFormulasShared, nccaomFormulasOnly, extraFormulas, caleHerbs, caleAndNccaomHerbs, nccaomHerbs, extraHerbs, categoryList]) => {
      setAllFormulas([
        ...caleNccaomFormulasShared,
        ...nccaomFormulasOnly,
        ...extraFormulas,
      ]);
      setAllHerbs([
        ...caleHerbs,
        ...caleAndNccaomHerbs,
        ...nccaomHerbs,
        ...extraHerbs,
      ]);
      setFormulaCategoryList(categoryList);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  let formula = null;

  if (!loading && allFormulas.length > 0) {
    if (id) {
      const decodedId = decodeURIComponent(id).toLowerCase().replace(/\s+/g, "");
      formula = allFormulas.find(f => {
        let names = [];
        if (Array.isArray(f.pinyinName)) {
          names = f.pinyinName.map(n => n.toLowerCase().replace(/\s+/g, ""));
        } else if (f.pinyinName) {
          names = [f.pinyinName.toLowerCase().replace(/\s+/g, "")];
        }
        return names.includes(decodedId);
      });
    } else if (query) {
      formula = allFormulas.find(f =>
        (Array.isArray(f.pinyinName) ? f.pinyinName.join(", ") : f.pinyinName || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.englishName || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.category || "").toLowerCase().includes(query.toLowerCase()) ||
        (f.chineseCharacters || "").toLowerCase().includes(query.toLowerCase())
      );
    }
  }

  function handleAddToFormulaBuilder() {
    if (formula && formula.pinyinName) {
      const formulaName = Array.isArray(formula.pinyinName)
        ? formula.pinyinName[0]
        : formula.pinyinName;
      navigate(`/formulabuilder?formula=${encodeURIComponent(formulaName)}`);
    }
  }

  function handleHerbLinkClick(herbObj, idx) {
    const inCart = isHerbInCart(herbObj);
    setHerbLinkAnimating(prev => ({ ...prev, [idx]: true }));
    setTimeout(() => setHerbLinkAnimating(prev => ({ ...prev, [idx]: false })), 350);
    if (inCart) {
      removeHerb(getHerbKey(herbObj));
    } else {
      addHerb(herbObj);
      setShowCart(true);
    }
  }

  function handleCreateFormula() {
    if (cart.length > 0) {
      navigate("/formulabuilder", { state: { herbCart: cart } });
      clearCart();
      setShowCart(false);
    }
  }

  function getHerbKey(herb) {
    if (herb.pinyinName) return herb.pinyinName;
    if (herb.name) return herb.name;
    return undefined;
  }
  function isHerbInCart(herbObj) {
    const herbKey = getHerbKey(herbObj);
    return cart.some(h => getHerbKey(h) === herbKey);
  }

  const ingredientHerbs = formula
    ? safeArr(formula.ingredientsAndDosages)
        .map((ing) => {
          const pinyin = getPinyinFromIngredient(ing);
          const herbObj = findHerbObjByName(allHerbs, pinyin);
          if (!herbObj) return null;
          const dosage = extractDosageFromIngredient(ing);
          return { ...herbObj, dosage, originalString: ing };
        })
        .filter(Boolean)
    : [];

  const allInCart = ingredientHerbs.length > 0 && ingredientHerbs.every(h => isHerbInCart(h));

  function handleAddOrRemoveAllHerbs() {
    if (allInCart) {
      ingredientHerbs.forEach(h => removeHerb(getHerbKey(h)));
    } else {
      ingredientHerbs.forEach(h => addHerb(h));
      setShowCart(true);
    }
  }

  const backToHomeButton = (
    <div className="back-to-home-btn">
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

  const bgStyle = {
    minHeight: "100vh",
    width: "100vw",
    background: COLORS.backgroundGold,
    position: "relative",
    fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
    overflowX: "hidden",
  };

  function renderModifications(mod, modIdx) {
    const herbNames = allHerbs
      .map(h => Array.isArray(h.pinyinName) ? h.pinyinName[0] : h.pinyinName)
      .filter(Boolean)
      .sort((a, b) => b.length - a.length);

    let parts = [];
    let foundRanges = [];
    let modCopy = mod;

    for (let hName of herbNames) {
      if (!hName) continue;
      const regex = new RegExp(`\\b${hName.replace(/\s+/g, "\\s*")}\\b`, "gi");
      let match;
      while ((match = regex.exec(modCopy)) !== null) {
        foundRanges.push({ start: match.index, end: match.index + match[0].length, text: match[0], hName });
      }
    }
    foundRanges.sort((a, b) => a.start - b.start);

    let currPos = 0;
    foundRanges.forEach((range, idx) => {
      if (currPos < range.start) {
        parts.push(modCopy.substring(currPos, range.start));
      }
      const herbObj = findHerbObjByName(allHerbs, range.hName);
      const inCart = herbObj && isHerbInCart(herbObj);
      parts.push(
        herbObj ? (
          <button
            key={`modherb-${modIdx}-${idx}`}
            className={`herb-link-hover${inCart ? " herb-link-in-cart" : ""}`}
            style={{
              color: COLORS.herbLink,
              background: inCart ? COLORS.accentEmerald : COLORS.herbLinkBg,
              borderRadius: "1em",
              border: inCart ? `2px solid ${COLORS.accentGold}` : "none",
              fontWeight: 700,
              fontSize: "1em",
              margin: "0 2px",
              padding: inCart ? "0 0.4em" : "0 0.22em",
              textDecoration: "underline",
              cursor: "pointer",
              boxShadow: inCart ? `0 0 0 2px ${COLORS.accentGold}33` : "none"
            }}
            onClick={() => handleHerbLinkClick(herbObj, `mod_${modIdx}_${idx}`)}
            title={inCart ? `${herbObj.pinyinName} is already in cart` : `Add ${herbObj.pinyinName} to cart`}
          >
            {range.text}
            {inCart && <span style={{ fontWeight: 700, color: COLORS.backgroundRed, marginLeft: 3 }}>✔</span>}
          </button>
        ) : (
          <span key={`modherb-${modIdx}-${idx}`} style={{ color: COLORS.herbLink }}>{range.text}</span>
        )
      );
      currPos = range.end;
    });
    if (currPos < modCopy.length) {
      parts.push(modCopy.substring(currPos));
    }
    if (parts.length === 0) {
      return highlightText(mod, query);
    }
    return <span>{parts}</span>;
  }

  if (loading) {
    return (
      <div style={bgStyle}>
        <GlobalAnimations />
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
        <div style={{ height: NAVBAR_HEIGHT }} />
        {backToHomeButton}
        <div style={{ margin: "2.5em auto 1.5em auto", textAlign: "center" }}>
          <Logo size={60} showBeta={true} />
        </div>
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp shadow-lg"
          style={{
            background: COLORS.backgroundGold,
            border: `2.5px solid ${COLORS.accentGold}`,
            color: COLORS.accentBlack,
            maxWidth: "500px",
            textAlign: "left",
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            margin: "0 auto"
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Loading...</h2>
          <p className="mb-3">Loading formula data...</p>
        </div>
        <HerbCart
          show={showCart}
          onClose={() => setShowCart(false)}
          onOpen={() => setShowCart(true)}
          onCreateFormula={handleCreateFormula}
          sidebarTop={NAVBAR_HEIGHT}
        />
        <BackToTopButton right={75} />
        <FooterCard />
      </div>
    );
  }

  if (!formula) {
    return (
      <div style={bgStyle}>
        <GlobalAnimations />
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
        <div style={{ height: NAVBAR_HEIGHT }} />
        {backToHomeButton}
        <div style={{ margin: "2.5em auto 1.5em auto", textAlign: "center" }}>
          <Logo size={60} showBeta={true} />
        </div>
        <div
          className="rounded-xl p-8 mb-6 flex flex-col items-start animate-fadeInScaleUp shadow-lg"
          style={{
            background: COLORS.backgroundGold,
            border: `2.5px solid ${COLORS.accentGold}`,
            color: COLORS.accentBlack,
            maxWidth: "500px",
            textAlign: "left",
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            margin: "0 auto"
          }}
        >
          <h2 className="text-3xl font-bold mb-4" style={{ color: COLORS.claret }}>Formula Not Found</h2>
          <p className="mb-3">Sorry, we couldn't find a formula matching your search.</p>
          <button
            onClick={() => navigate('/')}
            className="px-4 py-2 mt-2 rounded-full font-bold shadow-xl transition hover:scale-105 animate-bounceIn"
            style={{
              background: COLORS.violet,
              color: COLORS.backgroundGold,
              border: `2.5px solid ${COLORS.seal}`,
              boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            }}
          >
            Back to Home
          </button>
        </div>
        <HerbCart
          show={showCart}
          onClose={() => setShowCart(false)}
          onOpen={() => setShowCart(true)}
          onCreateFormula={handleCreateFormula}
          sidebarTop={NAVBAR_HEIGHT}
        />
        <BackToTopButton right={75} />
        <FormulaCategoryInfo />
        <FooterCard />
      </div>
    );
  }

  const yosancarries =
    typeof formula.yosancarries !== "undefined"
      ? formula.yosancarries
      : typeof formula.yoSanCarries !== "undefined"
      ? formula.yoSanCarries
      : undefined;

  const formats = formula.formats || [];

  // --- Get explanation from category file ---
  const categoryExplanation = getCategoryExplanation(formula, formulaCategoryList);

  return (
    <div style={bgStyle}>
      <GlobalAnimations />
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
      />
      <div style={{ height: NAVBAR_HEIGHT }} />
      {backToHomeButton}
      <HerbCart
        show={showCart}
        onClose={() => setShowCart(false)}
        onOpen={() => setShowCart(true)}
        onCreateFormula={handleCreateFormula}
        sidebarTop={NAVBAR_HEIGHT}
      />
      <BackToTopButton right={75} />
      <div
        className="flex flex-col items-center justify-center w-full"
        style={{
          minHeight: "60vh",
          width: "100%",
          marginTop: "32px",
        }}
      >
        <div
          className="formula-card-outer rounded-2xl p-8 flex flex-col items-start shadow-2xl animate-fadeInScaleUp card-shadow"
          style={{
            background: `linear-gradient(120deg, ${COLORS.backgroundGold} 80%, ${COLORS.accentGold} 100%)`,
            border: `2.5px solid ${COLORS.accentGold}`,
            maxWidth: CARD_MAX_WIDTH,
            width: "100%",
            textAlign: "left",
            boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
            margin: "0 auto 42px auto",
            position: "relative",
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            padding: "32px 32px 32px 32px",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "flex-start",
          }}
        >
          <div className="flex items-center mb-4 mt-2 animate-fadeInScaleUp">
            <span className="text-4xl mr-3">🧪</span>
            <h2 className="font-bold text-3xl" style={{ color: COLORS.claret, textAlign: "left" }}>
              {highlightText(Array.isArray(formula.pinyinName) ? formula.pinyinName[0] : formula.pinyinName, query)}
              <span className="ml-2 text-xl" style={{ color: COLORS.violet }}>{formula.chineseCharacters}</span>
            </h2>
          </div>
          <p className="mb-2" style={{ color: COLORS.violet }}>
            <strong>English Name:</strong> {highlightText(formula.englishName, query)}
          </p>
          <p className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Category:</strong> {highlightText(formula.category, query)}
          </p>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Ingredients & Dosages:</strong>
            <button
              style={{
                margin: "0.5em 0 1em 0",
                padding: "4px 10px",
                background: allInCart ? COLORS.claret : COLORS.accentEmerald,
                color: COLORS.backgroundGold,
                fontWeight: 600,
                fontSize: "0.97em",
                borderRadius: "10px",
                border: `2px solid ${COLORS.accentGold}`,
                boxShadow: `0 1px 5px -2px ${COLORS.accentEmerald}33`,
                cursor: "pointer",
                letterSpacing: "0.01em"
              }}
              onClick={handleAddOrRemoveAllHerbs}
              title={allInCart ? "Remove all herbs from cart" : "Add all herbs to cart"}
            >
              {allInCart ? "Remove All Herbs" : "Add All Herbs to Cart"}
            </button>
            <ul className="ml-2 formula-herb-list">
              {safeArr(formula.ingredientsAndDosages).map((ing, i) => {
                const pinyin = getPinyinFromIngredient(ing);
                const herbObj = findHerbObjByName(allHerbs, pinyin);
                const inCart = herbObj && cart.some(h => getHerbKey(h) === getHerbKey(herbObj));
                const formulaDosage = extractDosageFromIngredient(ing);
                return (
                  <li key={i} style={{ display: "flex", alignItems: "center", marginBottom: "2px" }}>
                    <span style={numberCircleStyle}>{i + 1}</span>
                    {herbObj ? (
                      <button
                        className={
                          `${herbLinkAnimating[i] ? "herb-link-pop " : ""}herb-link-hover${inCart ? " herb-link-in-cart" : ""}`
                        }
                        style={{
                          color: COLORS.herbLink,
                          background: inCart ? COLORS.accentEmerald : COLORS.herbLinkBg,
                          borderRadius: "1em",
                          border: inCart ? `2px solid ${COLORS.accentGold}` : "none",
                          fontWeight: 700,
                          fontSize: "1em",
                          marginRight: "0.35em",
                          padding: inCart ? "0 0.4em" : "0 0.22em",
                          textDecoration: "underline",
                          cursor: "pointer",
                          boxShadow: inCart ? `0 0 0 2px ${COLORS.accentGold}33` : "none"
                        }}
                        onClick={() => handleHerbLinkClick({ ...herbObj, dosage: formulaDosage, originalString: ing }, i)}
                        title={inCart ? `Remove ${herbObj.pinyinName} from cart` : `Add ${herbObj.pinyinName} to cart`}
                      >
                        {highlightText(ing, query)}
                        {inCart && <span style={{ fontWeight: 700, color: COLORS.backgroundRed, marginLeft: 3 }}>✔</span>}
                      </button>
                    ) : (
                      <span style={{ color: COLORS.herbLink }}>{highlightText(ing, query)}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Actions:</strong> {highlightText(formula.actions, query)}
          </div>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Indications:</strong> {highlightText(formula.indications, query)}
          </div>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Cautions/Contraindications:</strong>{" "}
            {safeArr(formula.cautionsAndContraindications).map((c, i) => (
              <span key={i}>{highlightText(c, query)}{i < safeArr(formula.cautionsAndContraindications).length - 1 ? "; " : ""}</span>
            ))}
          </div>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Modifications:</strong>
            <ul className="ml-4">
              {safeArr(formula.modifications).map((mod, i) => (
                <li key={i} style={{ display: "flex", alignItems: "flex-start", marginBottom: "6px" }}>
                  <span style={numberCircleStyle}>{i + 1}</span>
                  <span>{renderModifications(mod, i)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-2" style={{ color: COLORS.seal }}>
            <strong>Notes:</strong>{" "}
            {safeArr(formula.notes).map((n, i) => (
              <span key={i}>{highlightText(n, query)}{i < safeArr(formula.notes).length - 1 ? "; " : ""}</span>
            ))}
          </div>
          <div className="formula-bottom-btns">
            <button
              className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105 animate-pulseGlow"
              style={{
                background: COLORS.violet,
                color: COLORS.backgroundGold,
                alignSelf: "flex-start"
              }}
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
            <button
              className="px-6 py-3 font-bold rounded-full shadow-xl transition hover:scale-105"
              style={{
                background: COLORS.accentGold,
                color: COLORS.backgroundRed,
                alignSelf: "flex-start"
              }}
              onClick={handleAddToFormulaBuilder}
            >
              Add to Formula Builder
            </button>
          </div>
          {/* --- Add formula Explanation/KeyActions/YoSanCarries/Formats --- */}
          <div className="formula-explanation-extra mt-6 w-full" style={{ borderTop: `2px solid ${COLORS.accentGold}`, paddingTop: 18 }}>
            <KeyActionsExplanation
              keyActions={formula.keyActions}
              explanation={formula.explanation || categoryExplanation}
            />
            <ExtraPropsBlock yosancarries={yosancarries} formats={formats} />
          </div>
        </div>
      </div>
      <FormulaCategoryInfo />
      <FooterCard />
    </div>
  );
}