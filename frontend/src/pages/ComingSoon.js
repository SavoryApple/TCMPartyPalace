import React from "react";
import { Link } from "react-router-dom";
import NavBar from "../components/NavBar";
import FooterCard from "../components/FooterCard";

// Match colors and style from App.js and HerbCategoryList.js
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

const NAVBAR_HEIGHT = 84;
const FILTER_BAR_HEIGHT = 0; // Not present on this page
const sidebarTop = NAVBAR_HEIGHT + FILTER_BAR_HEIGHT;

const COMING_FEATURES = [
  "Comprehensive 5 element personality quiz",
  "Page for patients to visit that explains what chinese medicine is and how acupuncture fits into that",
  "Page for practitioners to refer patients to when suggesting medicinal foods to add to ones diet, with a simple printable format",
  "Western symptom index showing what TCM syndromes each can belong to",
  "Diagnosis tool where the user selects symptoms/tongue/pulse from a dropdown and an algorithm suggests possible TCM diagnoses, with suggested basic treatments",
  "A new formula category list based on TCM syndromes/zang fu patterns",
  "New page to search for formulas by symptoms/TCM syndromes, based on Maccioca's list of symptoms (don't know how symptoms like pain would work yet)",
  "Single herb pictures (for as many as are realistically obtainable)",
  "Section for acupuncture with detailed pictures, diagrams, and point locations. Then merge with formulas to create treatment plans, organized by pattern differentiation diagnosis",
  "Add new checkbox filter to only show Yo San's pharmacy inventory if desired",
  "Clean up the herb and formula card information",
  "Add a login for users to write comments and contribute their own clinical experience, upload tongue pictures",
  "Add a page with helpful links like LHASA OMS, CNT etc. (and show step by step how to USE the insane CNT website!)",
  "A page with a basic tool for using the Kiiko method",
  "Access to translated excerpts of classical texts to show alongside formulas to give more context",
  "Herb drug interaction information on each herb for western medicine practitioners to easily check",
  "Herb substitution(s) recommendation for each herb",
  "Real world or historical TCM case studies, sortable by condition, pattern, formula etc",
  "Audio pronunciation for all pinyin terms",
  "Easy to understand explanations of pulses and a tongue photo database",
  "PDF report generator for practitioners to provide to patients describing their syndrome, treatment purpose, and dietary/lifestyle recommendations",
  "Licensing/board prep section with interactive learning games",
  "Herbal supply directory showing list of reputable herb suppliers",
  "User forum for TCM or Q&A board, for practitioners and students to ask TCM related questions",
  "Events calendar - conferences, webinars, classes etc. related to TCM",
  "Email courses with \"daily herb facts\" perhaps in the style of a 30 day series to engage and educate users",
  "An AI assistant for TCM - chat feature that helps with TCM questions, formula suggestions, textbook references, trained by the standard textbooks and classical texts",
  "Syndrome search optimization: pages like best herbs for liver qi stagnation or formulas for damp heat diarrhea",
  "Quiz: which formula matches your symptoms?",
  "Dark mode toggle for entire site",
  "Daily formula spotlight (educational)",
  "Page for supplements and how they relate to TCM language, and when to recommend them",
  "Formula builder tool based on adding formula modules together",
];

export default function ComingSoon() {
  // Back to Home button (styled and positioned like HerbCategoryList.js)
  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: sidebarTop + 12,
        right: 32,
        zIndex: 101,
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

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        fontFamily: '"Noto Serif SC", "Songti SC", "KaiTi", serif',
        position: "relative",
        overflowX: "hidden",
      }}
    >
      <NavBar
        showReportError={true}
        showAbout={true}
        showAdminButtons={true}
        showLogo={true}
        fixed={true}
        showBackToHome={false} // Do NOT show in navbar
      />
      {backToHomeButton}
      <div style={{ height: NAVBAR_HEIGHT }} />
      <div
        style={{
          maxWidth: 820,
          margin: "0 auto",
          background: COLORS.accentIvory,
          borderRadius: "2em",
          boxShadow: `0 6px 40px -8px ${COLORS.shadowStrong}`,
          border: `2.5px solid ${COLORS.accentGold}`,
          padding: "36px 18px 46px 18px",
          marginTop: "32px",
          marginBottom: "42px",
        }}
      >
        <h2
          style={{
            fontSize: "2.15em",
            fontWeight: 900,
            color: COLORS.backgroundRed,
            marginBottom: "12px",
            letterSpacing: "-.01em",
            textShadow: `0 2px 14px ${COLORS.accentGold}`,
            textAlign: "center",
          }}
        >
          🚀 Coming Soon to TCM Atlas
        </h2>
        <p
          style={{
            fontSize: "1.2em",
            color: COLORS.accentBlack,
            marginBottom: 18,
            fontWeight: 600,
            textAlign: "center"
          }}
        >
          Here are exciting new features and tools planned for future releases:
        </p>
        <ol
          style={{
            listStyle: "decimal inside",
            paddingLeft: 0,
            fontSize: "1.1em",
            color: COLORS.backgroundRed,
            fontWeight: 500,
            margin: 0,
            lineHeight: 1.65,
            maxWidth: 750,
            background: "none",
          }}
        >
          {COMING_FEATURES.map((feature, idx) => (
            <li
              key={idx}
              style={{
                background: idx % 2 === 0 ? COLORS.backgroundGold : COLORS.accentIvory,
                padding: "10px 18px",
                borderRadius: "1em",
                marginBottom: "8px",
                boxShadow: idx % 2 === 0
                  ? `0 1px 10px -8px ${COLORS.accentGold}`
                  : `0 1px 10px -8px ${COLORS.accentIvory}`,
                borderLeft: `6px solid ${COLORS.accentGold}`,
                fontSize: "1.08em",
                fontWeight: 600,
              }}
            >
              {(idx === 0 || idx === 1 || idx === 2) ? (
                <span style={{ textDecoration: "line-through" }}>{feature}</span>
              ) : feature}
            </li>
          ))}
        </ol>
      </div>
      <FooterCard />
    </div>
  );
}