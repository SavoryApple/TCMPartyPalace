import React, { useRef, useState, useMemo, useEffect } from "react";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";
import BackToTopButton from "../components/BackToTopButton";
import { Link } from "react-router-dom";

// --- Organ Foods Imports ---
import HEART_FOODS from "../data/OrganFoods/HeartFoods";
import SPLEEN_FOODS from "../data/OrganFoods/SpleenFoods";
import LIVER_FOODS from "../data/OrganFoods/LiverFoods";
import LUNG_FOODS from "../data/OrganFoods/LungFoods";
import KIDNEY_FOODS from "../data/OrganFoods/KidneyFoods";
import STOMACH_FOODS from "../data/OrganFoods/StomachFoods";
import LARGE_INTESTINE_FOODS from "../data/OrganFoods/LargeIntestineFoods";
import SMALL_INTESTINE_FOODS from "../data/OrganFoods/SmallIntestineFoods";
import GALLBLADDER_FOODS from "../data/OrganFoods/GallbladderFoods";
import BLADDER_FOODS from "../data/OrganFoods/BladderFoods";
import PERICARDIUM_FOODS from "../data/OrganFoods/PericardiumFoods";

// --- Color palette ---
const COLORS = {
  background: "#F9E8C2",
  card: "#FCF5E5",
  border: "#D4AF37",
  accent: "#9A2D1F",
  gold: "#D4AF37",
  heading: "#9A2D1F",
  faded: "#D9C8B4",
  accentBlack: "#44210A",
  blue: "#2176AE",
  emerald: "#438C3B",
  highlight: "#ffe066",
  violet: "#7C5CD3",
  shadowStrong: "#B38E3FCC",
};

const NAVBAR_HEIGHT = 84;

const foodItem = (name, taste, temperature, functions) => ({
  name,
  taste,
  temperature,
  functions,
});

const SYNDROME_FOOD_MAP = {
  ...HEART_FOODS,
  ...SPLEEN_FOODS,
  ...LIVER_FOODS,
  ...LUNG_FOODS,
  ...KIDNEY_FOODS,
  ...STOMACH_FOODS,
  ...LARGE_INTESTINE_FOODS,
  ...SMALL_INTESTINE_FOODS,
  ...GALLBLADDER_FOODS,
  ...BLADDER_FOODS,
  ...PERICARDIUM_FOODS,
};

const SYNDROMES = Object.keys(SYNDROME_FOOD_MAP);

const ORGAN_KEYWORDS = [
  "Heart", "Spleen", "Liver", "Lung", "Kidney",
  "Stomach", "Large Intestine", "Small Intestine",
  "Gallbladder", "Bladder", "Pericardium"
];

function highlightQuery(text, query) {
  if (!query) return text;
  const regex = new RegExp(`(${query})`, "gi");
  return (
    <span>
      {String(text).split(regex).map((part, i) =>
        regex.test(part)
          ? <span key={i} style={{ background: COLORS.highlight, color: COLORS.accent, fontWeight: 700 }}>{part}</span>
          : part
      )}
    </span>
  );
}

function getFoodsForSyndrome(syndrome) {
  if (SYNDROME_FOOD_MAP[syndrome]) {
    return SYNDROME_FOOD_MAP[syndrome];
  }
  return [
    foodItem("Brown rice", "Sweet", "Neutral", "Tonifies Qi, gentle nourishment"),
    foodItem("Oats", "Sweet", "Warm", "Tonifies Qi, calms Mind"),
    foodItem("Spinach", "Sweet", "Cool", "Nourishes Blood, moistens dryness"),
    foodItem("Carrots", "Sweet", "Neutral", "Tonifies Blood, strengthens digestion"),
    foodItem("Sweet potato", "Sweet", "Neutral", "Tonifies Spleen Qi"),
    foodItem("Pear", "Sweet", "Cool", "Moistens dryness, nourishes Yin"),
    foodItem("Pumpkin", "Sweet", "Warm", "Tonifies Qi, harmonizes digestion"),
    foodItem("Barley", "Sweet", "Cool", "Clears Heat, supports digestion"),
    foodItem("Chicken", "Sweet", "Warm", "Tonifies Qi and Blood"),
    foodItem("Cod", "Sweet", "Neutral", "Tonifies Qi, strengthens Spleen"),
    foodItem("Dates", "Sweet", "Warm", "Tonifies Qi and Blood"),
    foodItem("Lotus root", "Sweet", "Cool", "Nourishes Blood, stops bleeding"),
    foodItem("Apples", "Sweet, Sour", "Cool", "Moistens dryness, calms Shen"),
    foodItem("Black sesame", "Sweet", "Neutral", "Nourishes Blood, moistens dryness"),
    foodItem("Goji berries", "Sweet", "Neutral", "Nourishes Yin and Blood"),
  ];
}

export default function MedicinalFoods() {
  const printRef = useRef();
  const [selected, setSelected] = useState(SYNDROMES[0]);
  const [search, setSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownOpenManual, setDropdownOpenManual] = useState(false);
  const [showAllFoods, setShowAllFoods] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const filteredSyndromes = useMemo(() => {
    if (!search) return SYNDROMES;
    const q = search.trim().toLowerCase();
    const organ = ORGAN_KEYWORDS.find(org => org.toLowerCase() === q);
    if (organ) {
      return SYNDROMES.filter(s =>
        s.toLowerCase().includes(organ.toLowerCase())
      );
    }
    return SYNDROMES.filter(s =>
      s.toLowerCase().includes(q) ||
      ORGAN_KEYWORDS.some(org => org.toLowerCase().startsWith(q) && s.toLowerCase().includes(org.toLowerCase()))
    );
  }, [search]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
        setDropdownOpenManual(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setHighlightedIndex(0);
  }, [search, dropdownOpen]);

  const allFoods = useMemo(() => {
    const foods = {};
    SYNDROMES.forEach(syn => {
      getFoodsForSyndrome(syn).forEach(f => {
        const key = `${f.name}|${f.taste}|${f.temperature}`;
        if (!foods[key]) {
          foods[key] = { ...f, syndromes: [syn] };
        } else {
          foods[key].syndromes.push(syn);
        }
      });
    });
    return Object.values(foods).sort((a, b) => a.name.localeCompare(b.name));
  }, []);

  function handleDropdownSelect(s) {
    setSelected(s);
    setDropdownOpen(false);
    setDropdownOpenManual(false);
    setShowAllFoods(false);
    setSearch("");
  }

  const handleManualDropdown = () => {
    setDropdownOpenManual(v => {
      if (!v) setDropdownOpen(false);
      return !v;
    });
  };

  const handleSearchFocus = () => {
    setDropdownOpen(true);
    setDropdownOpenManual(false);
  };

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

  function handlePrint() {
    if (printRef.current) {
      const printContent = printRef.current.innerHTML;
      const win = window.open("", "", "width=900,height=900");
      win.document.write(`
        <html>
          <head>
            <title>Medicinal Foods - TCM Atlas</title>
            <style>
              body { font-family: 'Noto Serif SC', 'Songti SC', 'KaiTi', serif; background: #F9E8C2; }
              .food-card { border: 2px solid #D4AF37; background: #FCF5E5; border-radius: 1.5em; margin: 22px 0; padding: 22px 28px; max-width: 640px; }
              .food-title { color: #9A2D1F; font-size: 1.25em; font-weight: 700; margin-bottom: 10px; text-align: center; }
              .food-table { width: 100%; border-collapse: separate; border-spacing: 0; margin-top: 10px; }
              .food-table th, .food-table td { border: 1px solid #D4AF37; padding: 7px 12px; font-size: 1.09em; }
              .food-table th { background: #F9E8C2; color: #9A2D1F; font-weight: bold; }
              .food-table td { background: #FCF5E5; color: #44210A; }
              .food-table tr:nth-child(odd) td { background: #F9E8C2; }
              .food-keyfoods { display: flex; flex-wrap: wrap; gap: 16px; justify-content: center; margin-bottom: 14px; }
              .food-keyfood { background: #F9E8C2; border-radius: 1em; padding: 10px 16px; border: 1.5px dashed #D4AF37; color: #9A2D1F; font-weight: 700; font-size: 1.08em; display: flex; align-items: center; }
            </style>
          </head>
          <body>
            ${printContent}
          </body>
        </html>
      `);
      win.document.close();
      win.focus();
      win.print();
    }
  }

  const animationCSS = `
    @keyframes fadeInSlide {
      0% { opacity: 0; transform: translateY(30px) scale(0.97);}
      60% { opacity: 0.85; transform: translateY(-10px) scale(1.02);}
      100% { opacity: 1; transform: translateY(0) scale(1);}
    }
    .animate-fadeInSlide { animation: fadeInSlide 0.7s cubic-bezier(.36,1.29,.45,1.01);}
    @keyframes gradientBG {
      0% {background-position: 0% 50%;}
      50% {background-position: 100% 50%;}
      100% {background-position: 0% 50%;}
    }
    .gradient-background {
      background: linear-gradient(120deg, #F9E8C2 0%, #D4AF37 30%, #7C5CD3 65%, #68C5E6 100%);
      background-size: 300% 300%;
      animation: gradientBG 12s ease-in-out infinite;
    }
    .dropdown-outer {
      position: relative;
      max-width: 480px;
      margin: 0 auto;
      margin-bottom: 14px;
      z-index: 12;
    }
    .dropdown-list {
      position: absolute;
      left: 0; right: 0;
      top: 100%;
      background: #fff;
      border: 2px solid #D4AF37;
      border-radius: 0 0 1em 1em;
      box-shadow: 0 8px 32px -12px #B38E3FCC;
      max-height: 310px;
      overflow-y: auto;
      width: 100%;
      z-index: 99;
      animation: fadeInSlide 0.3s cubic-bezier(.36,1.29,.45,1.01);
    }
    .dropdown-item {
      padding: 13px 28px;
      cursor: pointer;
      font-size: 1.09em;
      font-family: "Noto Serif SC", "Songti SC", "KaiTi", serif;
      background: #FCF5E5;
      color: #9A2D1F;
      border-bottom: 1px solid #D4AF3722;
      transition: background 0.18s, color 0.18s;
    }
    .dropdown-item:last-child { border-bottom: none; }
    .dropdown-item:hover, .dropdown-item:focus {
      background: #68C5E6;
      color: #fff;
      outline: none;
    }
    .dropdown-highlighted {
      background: #7C5CD3 !important;
      color: #fff !important;
    }
    .dropdown-selected {
      background: #D4AF37;
      color: #9A2D1F;
      font-weight: 900;
    }
    .dropdown-control {
      width: 100%;
      padding: 13px 28px;
      border-radius: 1em;
      border: 2.5px solid #D4AF37;
      font-size: 1.1em;
      background: #fff;
      color: #9A2D1F;
      text-align: left;
      font-family: "Noto Serif SC", "Songti SC", "KaiTi", serif;
      box-shadow: 0 1px 6px 0 #D4AF3740;
      cursor: pointer;
      font-weight: 700;
      position: relative;
      z-index: 11;
      transition: box-shadow 0.22s;
    }
    .dropdown-arrow {
      position: absolute;
      right: 30px;
      top: 50%;
      transform: translateY(-50%);
      font-size: 1.3em;
      color: #7C5CD3;
      pointer-events: none;
    }
    .food-chip {
      background: linear-gradient(92deg,#68C5E6 0%, #D4AF37 100%);
      color: #44210A;
      font-weight: 700;
      font-size: 1.08em;
      border-radius: 0.9em;
      padding: 7px 15px;
      margin: 0px 6px 6px 0;
      display: flex;
      align-items: center;
      box-shadow: 0 2px 12px -6px #68C5E6AA;
      border: 2px solid #D4AF37;
      animation: fadeInSlide 0.44s cubic-bezier(.36,1.29,.45,1.01);
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
  `;

  return (
    <div className="gradient-background"
      style={{
        minHeight: "100vh",
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        paddingBottom: 56,
        transition: "background 0.8s cubic-bezier(.36,1.29,.45,1.01)",
        position: "relative"
      }}>
      <style>{animationCSS}</style>
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
        showBackToHome={false}
      />
      {backToHomeButton}
      <BackToTopButton right={75} />
      <div style={{ height: NAVBAR_HEIGHT }} />

      {/* SEARCH BAR AND AUTOCOMPLETE DROPDOWN */}
      <div style={{ maxWidth: 430, margin: "0 auto", marginBottom: 16, textAlign: "center", position: "relative" }}>
        <input
          ref={inputRef}
          type="text"
          aria-label="Syndrome search"
          placeholder="Type a maccioca differentiation organ (e.g. Heart)..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "14px 24px",
            borderRadius: "1em",
            border: `2.5px solid ${COLORS.violet}`,
            fontSize: "1.08em",
            marginBottom: 7,
            fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
            background: "#fff",
            color: COLORS.heading,
            boxShadow: `0 2px 8px 0 ${COLORS.violet}33`,
            outline: "none",
            transition: "box-shadow 0.18s",
          }}
          onFocus={handleSearchFocus}
          onKeyDown={e => {
            if (dropdownOpen && filteredSyndromes.length > 0) {
              if (e.key === "ArrowDown") {
                setHighlightedIndex(i =>
                  i < filteredSyndromes.length - 1 ? i + 1 : 0
                );
              } else if (e.key === "ArrowUp") {
                setHighlightedIndex(i =>
                  i > 0 ? i - 1 : filteredSyndromes.length - 1
                );
              } else if (e.key === "Enter") {
                handleDropdownSelect(filteredSyndromes[highlightedIndex]);
                e.preventDefault();
              } else if (e.key === "Escape") {
                setDropdownOpen(false);
              }
            }
          }}
        />
        {/* SEARCH BAR AUTOCOMPLETE DROPDOWN */}
        {(dropdownOpen && search.length > 0) && (
          <div className="dropdown-list animate-fadeInSlide" style={{
            position: "absolute", left: 0, right: 0, top: "100%", zIndex: 110,
          }}>
            {filteredSyndromes.length === 0 && (
              <div className="dropdown-item" style={{ color: COLORS.accentBlack }}>
                No syndrome found
              </div>
            )}
            {filteredSyndromes.map((s, i) => (
              <div
                key={s}
                tabIndex={0}
                className={
                  "dropdown-item" +
                  (s === selected ? " dropdown-selected" : "") +
                  (i === highlightedIndex ? " dropdown-highlighted" : "")
                }
                style={{
                  background: i === highlightedIndex ? COLORS.violet : undefined,
                  color: i === highlightedIndex ? "#fff" : undefined,
                }}
                onMouseEnter={() => setHighlightedIndex(i)}
                onMouseDown={e => {
                  e.preventDefault();
                  handleDropdownSelect(s);
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleDropdownSelect(s);
                }}
                role="option"
                aria-selected={s === selected}
              >
                {highlightQuery(s, search)}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MANUAL DROPDOWN BUTTON/SELECTOR */}
      <div className="dropdown-outer" ref={dropdownRef}>
        <button
          className="dropdown-control"
          aria-haspopup="listbox"
          aria-expanded={dropdownOpenManual}
          style={{
            position: "relative",
            background: dropdownOpenManual ? COLORS.violet : "#fff",
            color: dropdownOpenManual ? "#fff" : COLORS.heading,
            border: `2.5px solid ${dropdownOpenManual ? COLORS.violet : COLORS.gold}`,
            fontWeight: dropdownOpenManual ? 900 : 700,
            boxShadow: dropdownOpenManual ? `0 4px 24px -7px ${COLORS.violet}66` : `0 1px 6px 0 ${COLORS.gold}33`,
            outline: dropdownOpenManual ? `2.5px solid ${COLORS.violet}` : "none",
            transition: "background 0.18s, color 0.18s, border 0.18s",
          }}
          tabIndex={0}
          onClick={handleManualDropdown}
        >
          <span style={{ fontWeight: 900, fontSize: "1.13em" }}>
            {selected}
          </span>
          <span className="dropdown-arrow" aria-hidden="true" style={{
            color: dropdownOpenManual ? COLORS.gold : COLORS.violet,
            transition: "color 0.15s",
          }}>
            ▼
          </span>
        </button>
        {dropdownOpenManual && (
          <div
            className="dropdown-list animate-fadeInSlide"
            tabIndex={-1}
            role="listbox"
          >
            {SYNDROMES.map((s, i) => (
              <div
                key={s}
                tabIndex={0}
                className={
                  "dropdown-item" +
                  (s === selected ? " dropdown-selected" : "")
                }
                onClick={() => handleDropdownSelect(s)}
                onKeyDown={e => {
                  if (e.key === "Enter" || e.key === " ") handleDropdownSelect(s);
                }}
                role="option"
                aria-selected={s === selected}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ textAlign: "center", marginTop: 18, marginBottom: 0 }}>
        <button
          className="animate-fadeInSlide"
          onClick={handlePrint}
          style={{
            padding: "13px 32px",
            borderRadius: "1em",
            border: `2.5px solid ${COLORS.emerald}`,
            background: COLORS.violet,
            color: "#fff",
            fontWeight: 900,
            fontSize: "1.11em",
            boxShadow: `0 3px 14px -5px ${COLORS.violet}`,
            cursor: "pointer",
            marginTop: 4,
            marginBottom: 8,
            letterSpacing: "-.01em",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          🖨️ Print This Food List
        </button>
        <button
          className="animate-fadeInSlide"
          onClick={() => setShowAllFoods((v) => !v)}
          style={{
            padding: "13px 32px",
            borderRadius: "1em",
            border: `2.5px solid ${COLORS.accentGold}`,
            background: showAllFoods ? COLORS.accentGold : COLORS.background,
            color: showAllFoods ? COLORS.backgroundRed : COLORS.accentBlack,
            fontWeight: 900,
            fontSize: "1.07em",
            boxShadow: `0 2px 8px -3px ${COLORS.gold}`,
            cursor: "pointer",
            marginTop: 4,
            marginLeft: 18,
            letterSpacing: "-.01em",
            transition: "background 0.18s, color 0.18s",
          }}
        >
          {showAllFoods ? "Show Only Selected" : "Show All Foods"}
        </button>
      </div>
      <div ref={printRef}>
        {!showAllFoods ? (
          <div
            className="food-card animate-fadeInSlide"
            style={{
              background: COLORS.card,
              border: `2.5px solid ${COLORS.gold}`,
              borderRadius: "1.5em",
              margin: "26px 0 0 0",
              padding: "26px 32px",
              maxWidth: 670,
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: `0 2px 12px -5px ${COLORS.emerald}33`,
              marginTop: 30,
            }}
          >
            <div
              className="food-title"
              style={{
                color: COLORS.heading,
                fontWeight: 900,
                fontSize: "1.32em",
                marginBottom: 14,
                textAlign: "center",
                letterSpacing: "-.01em",
                borderBottom: `2px solid ${COLORS.emerald}`,
                paddingBottom: 12,
                textShadow: `0 2px 10px ${COLORS.gold}55`
              }}
            >
              {selected}
            </div>
            <div style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "10px",
              marginBottom: 18,
              justifyContent: "center"
            }}>
              {getFoodsForSyndrome(selected).slice(0, 5).map(f =>
                <div key={f.name} className="food-chip">
                  <span style={{ fontSize: "1.15em", marginRight: 7 }}>🥗</span>
                  <span>{f.name}</span>
                </div>
              )}
            </div>
            <table className="food-table" style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              marginTop: 8,
              background: "#fff",
              borderRadius: "1.2em",
              overflow: "hidden",
              boxShadow: `0 2px 12px -8px ${COLORS.shadowStrong}`,
              animation: "fadeInSlide 0.7s",
            }}>
              <thead>
                <tr>
                  <th style={{ width: "29%", background: COLORS.violet, color: "#fff", fontWeight: 900, borderTopLeftRadius: "1.1em" }}>Food Item</th>
                  <th style={{ width: "17%", background: COLORS.emerald, color: "#fff", fontWeight: 900 }}>Taste</th>
                  <th style={{ width: "17%", background: COLORS.blue, color: "#fff", fontWeight: 900 }}>Temp.</th>
                  <th style={{ width: "37%", background: COLORS.gold, color: "#fff", fontWeight: 900, borderTopRightRadius: "1.1em" }}>Functions</th>
                </tr>
              </thead>
              <tbody>
                {getFoodsForSyndrome(selected).map(food => (
                  <tr key={food.name} className="animate-fadeInSlide" style={{ animationDuration: "0.7s" }}>
                    <td style={{ fontWeight: 700, color: COLORS.accentBlack }}>{food.name}</td>
                    <td style={{ color: COLORS.blue, fontWeight: 700 }}>{food.taste}</td>
                    <td style={{ color: COLORS.emerald, fontWeight: 700 }}>{food.temperature}</td>
                    <td style={{ color: COLORS.accent, fontWeight: 500 }}>{food.functions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div
            className="food-card animate-fadeInSlide"
            style={{
              background: COLORS.card,
              border: `2.5px solid ${COLORS.gold}`,
              borderRadius: "1.5em",
              margin: "26px 0 0 0",
              padding: "26px 32px",
              maxWidth: 900,
              marginLeft: "auto",
              marginRight: "auto",
              boxShadow: `0 2px 12px -5px ${COLORS.emerald}33`,
              marginTop: 30,
            }}
          >
            <div
              className="food-title"
              style={{
                color: COLORS.heading,
                fontWeight: 900,
                fontSize: "1.25em",
                marginBottom: 18,
                textAlign: "center",
                letterSpacing: "-.01em",
                borderBottom: `2px solid ${COLORS.emerald}`,
                paddingBottom: 12,
                textShadow: `0 2px 8px ${COLORS.gold}55`
              }}
            >
              All Medicinal Foods (by Food)
            </div>
            <table className="food-table" style={{
              width: "100%",
              borderCollapse: "separate",
              borderSpacing: 0,
              marginTop: 8,
              background: "#fff",
              borderRadius: "1.2em",
              overflow: "hidden",
              boxShadow: `0 2px 12px -8px ${COLORS.shadowStrong}`,
              animation: "fadeInSlide 0.7s",
            }}>
              <thead>
                <tr>
                  <th style={{ width: "24%", background: COLORS.violet, color: "#fff", fontWeight: 900, borderTopLeftRadius: "1.1em" }}>Food Item</th>
                  <th style={{ width: "12%", background: COLORS.emerald, color: "#fff", fontWeight: 900 }}>Taste</th>
                  <th style={{ width: "12%", background: COLORS.blue, color: "#fff", fontWeight: 900 }}>Temp.</th>
                  <th style={{ width: "28%", background: COLORS.gold, color: "#fff", fontWeight: 900 }}>Functions</th>
                  <th style={{ width: "24%", background: COLORS.accent, color: "#fff", fontWeight: 900, borderTopRightRadius: "1.1em" }}>For Syndromes</th>
                </tr>
              </thead>
              <tbody>
                {allFoods.map(food => (
                  <tr key={food.name + food.taste + food.temperature} className="animate-fadeInSlide" style={{ animationDuration: "0.7s" }}>
                    <td style={{ fontWeight: 700, color: COLORS.accentBlack }}>{food.name}</td>
                    <td style={{ color: COLORS.blue, fontWeight: 700 }}>{food.taste}</td>
                    <td style={{ color: COLORS.emerald, fontWeight: 700 }}>{food.temperature}</td>
                    <td style={{ color: COLORS.accent, fontWeight: 500 }}>{food.functions}</td>
                    <td style={{ color: COLORS.violet, fontSize: "0.98em" }}>
                      {food.syndromes?.slice(0, 3).join(", ")}
                      {food.syndromes && food.syndromes.length > 3 ? `, +${food.syndromes.length - 3} more` : ""}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      <FooterCard />
    </div>
  );
}