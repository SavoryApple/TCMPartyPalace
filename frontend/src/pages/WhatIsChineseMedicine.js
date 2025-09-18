import React, { useRef, useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
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
  shadow: "#B38E3F88",
  shadowStrong: "#B38E3FCC",
};

const NAVBAR_HEIGHT = 74;

// CSS Variables for better maintainability
const cssVariables = `
:root {
  --color-background-red: ${COLORS.backgroundRed};
  --color-background-gold: ${COLORS.backgroundGold};
  --color-accent-gold: ${COLORS.accentGold};
  --color-accent-dark-gold: ${COLORS.accentDarkGold};
  --color-accent-black: ${COLORS.accentBlack};
  --color-accent-crimson: ${COLORS.accentCrimson};
  --color-accent-ivory: ${COLORS.accentIvory};
  --color-accent-emerald: ${COLORS.accentEmerald};
  --color-accent-blue: ${COLORS.accentBlue};
  --color-accent-gray: ${COLORS.accentGray};
  --color-shadow: ${COLORS.shadow};
  --color-shadow-strong: ${COLORS.shadowStrong};
  
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;
  --spacing-2xl: 3rem;
  
  --border-radius-sm: 0.5rem;
  --border-radius-md: 1rem;
  --border-radius-lg: 1.1rem;
  
  --font-family-primary: 'Inter', 'Segoe UI', 'Arial', 'Noto Serif SC', serif;
  --font-size-xs: 0.875rem;
  --font-size-sm: 0.98rem;
  --font-size-base: 1.07rem;
  --font-size-lg: 1.17rem;
  --font-size-xl: 1.38rem;
  --font-size-2xl: 2.1rem;
  
  --line-height-relaxed: 1.72;
  --transition-standard: all 0.2s ease;
  
  --box-shadow-subtle: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
  --box-shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  --box-shadow-lg: 0 2px 18px 0 var(--color-shadow-strong);
}
`;

const sectionStyle = {
  background: "rgba(252,245,229,0.98)",
  borderRadius: "var(--border-radius-lg)",
  boxShadow: "var(--box-shadow-lg)",
  border: `2px solid var(--color-accent-gold)`,
  margin: "0 auto var(--spacing-2xl) auto",
  maxWidth: 950,
  padding: "var(--spacing-xl) 5vw",
  fontFamily: "var(--font-family-primary)",
  fontSize: "var(--font-size-base)",
  lineHeight: "var(--line-height-relaxed)",
  wordBreak: "break-word",
  position: "relative",
  backdropFilter: "blur(8px)",
  transition: "var(--transition-standard)",
};

const headingStyle = {
  fontSize: "var(--font-size-2xl)",
  color: "var(--color-background-red)",
  fontWeight: 900,
  marginBottom: "var(--spacing-md)",
  textAlign: "center",
  fontFamily: "var(--font-family-primary)",
  letterSpacing: "-0.01em"
};

const subHeadingStyle = {
  fontSize: "var(--font-size-xl)",
  color: "var(--color-accent-gold)",
  fontWeight: 800,
  marginTop: "1.4em",
  marginBottom: "0.7em",
  fontFamily: "var(--font-family-primary)",
  position: "relative",
  paddingLeft: "var(--spacing-md)",
};

const imgWrapperStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "var(--spacing-lg) 0",
  padding: "var(--spacing-sm)",
};

const imgStyle = {
  borderRadius: "var(--border-radius-md)",
  border: `2px solid var(--color-accent-gold)`,
  boxShadow: "var(--box-shadow-lg)",
  objectFit: "cover",
  objectPosition: "center",
  width: "min(410px, 94vw)",
  height: "210px",
  background: "var(--color-accent-ivory)",
  display: "block",
  maxWidth: "100%",
  transition: "var(--transition-standard)",
};

const listItemStyle = {
  marginBottom: "0.6em",
  paddingLeft: "var(--spacing-sm)",
  position: "relative",
};

const disclaimerStyle = {
  background: "linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)",
  border: "2px solid #f39c12",
  borderRadius: "var(--border-radius-md)",
  padding: "var(--spacing-xl)",
  margin: "var(--spacing-xl) 0",
  boxShadow: "var(--box-shadow-md)",
  fontSize: "0.95em",
  lineHeight: "1.6",
  position: "relative",
};

const summaryStyle = {
  background: "linear-gradient(135deg, #e8f5e8 0%, #d4edda 100%)",
  border: "2px solid var(--color-accent-emerald)",
  borderRadius: "var(--border-radius-md)",
  padding: "var(--spacing-xl)",
  margin: "var(--spacing-xl) 0",
  boxShadow: "var(--box-shadow-md)",
  fontSize: "1.1em",
  lineHeight: "1.7",
  fontWeight: 500,
};

const referenceStyle = {
  background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
  border: "2px solid var(--color-accent-gray)",
  borderRadius: "var(--border-radius-md)",
  padding: "var(--spacing-xl)",
  margin: "var(--spacing-xl) 0",
  boxShadow: "var(--box-shadow-md)",
};

const linkStyle = {
  color: "var(--color-accent-blue)",
  textDecoration: "none",
  fontWeight: 600,
  borderBottom: "1px solid transparent",
  transition: "var(--transition-standard)",
  padding: "var(--spacing-xs) var(--spacing-sm)",
  borderRadius: "var(--border-radius-sm)",
  display: "inline-block",
  margin: "var(--spacing-xs)",
};

const mobileResponsiveStyle = `
${cssVariables}

@media (max-width: 650px) {
  .tcm-section {
    padding: var(--spacing-md) 5vw !important;
    font-size: var(--font-size-sm) !important;
    margin-bottom: var(--spacing-xl) !important;
  }
  .tcm-main {
    padding: 0 2vw 8px 2vw !important;
  }
  .tcm-heading {
    font-size: var(--font-size-lg) !important;
    padding-left: 2vw;
    padding-right: 2vw;
    line-height: 1.3 !important;
  }
  .tcm-subheading {
    font-size: 1.05em !important;
    padding-left: 2vw;
    padding-right: 2vw;
    line-height: 1.4 !important;
  }
  ul, ol {
    padding-left: 2em !important;
  }
  .tcm-img-wrapper {
    margin: var(--spacing-md) 0 !important;
    padding: var(--spacing-xs) !important;
  }
  .tcm-img {
    width: 98vw !important;
    height: 200px !important;
    min-width: 0 !important;
    max-width: 98vw !important;
    object-fit: cover !important;
    border-radius: var(--border-radius-sm) !important;
  }
  .tcm-section p, .tcm-section li {
    text-indent: 0.95em !important;
    line-height: 1.6 !important;
  }
  .disclaimer-section, .summary-section, .reference-section {
    padding: var(--spacing-md) !important;
    margin: var(--spacing-md) 0 !important;
    font-size: 0.9em !important;
  }
  .collapsible-section {
    border: 1px solid var(--color-accent-gold);
    border-radius: var(--border-radius-sm);
    margin: var(--spacing-sm) 0;
    overflow: hidden;
  }
  .collapsible-header {
    background: var(--color-accent-gold);
    color: var(--color-background-red);
    padding: var(--spacing-md);
    cursor: pointer;
    font-weight: 600;
    user-select: none;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition-standard);
  }
  .collapsible-header:hover {
    background: var(--color-accent-dark-gold);
  }
  .collapsible-content {
    background: rgba(252,245,229,0.98);
    max-height: 0;
    overflow: hidden;
    transition: max-height 0.3s ease;
  }
  .collapsible-content.expanded {
    max-height: 2000px;
  }
  .mobile-link {
    display: inline-block;
    padding: var(--spacing-md) var(--spacing-lg);
    margin: var(--spacing-xs);
    background: var(--color-accent-blue);
    color: white;
    text-decoration: none;
    border-radius: var(--border-radius-md);
    font-weight: 600;
    text-align: center;
    min-width: 120px;
    transition: var(--transition-standard);
  }
  .mobile-link:hover {
    background: var(--color-accent-emerald);
    transform: translateY(-1px);
  }
}

@media (max-width: 480px) {
  .tcm-section {
    padding: var(--spacing-sm) 3vw !important;
    border-radius: var(--border-radius-sm) !important;
  }
  .tcm-heading {
    font-size: 1.1em !important;
    padding: var(--spacing-sm) !important;
  }
  .tcm-subheading {
    font-size: 1.02em !important;
    padding: var(--spacing-sm) !important;
  }
  .tcm-img {
    height: 180px !important;
  }
}
`;

export default function WhatIsChineseMedicine() {
  const navBarRef = useRef();
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);
  const [collapsedSections, setCollapsedSections] = useState({});

  useLayoutEffect(() => {
    function updateHeight() {
      if (navBarRef.current) {
        setNavBarHeight(navBarRef.current.offsetHeight || NAVBAR_HEIGHT);
      }
    }
    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  // Reusable Components
  const TCMSection = ({ id, className = "", style = {}, children, collapsible = false, title = "" }) => {
    const isCollapsed = collapsedSections[id];
    
    const toggleCollapse = () => {
      setCollapsedSections(prev => ({
        ...prev,
        [id]: !prev[id]
      }));
    };

    if (collapsible && window.innerWidth <= 650) {
      return (
        <div className={`collapsible-section ${className}`}>
          <div className="collapsible-header" onClick={toggleCollapse} role="button" tabIndex={0}
               onKeyDown={(e) => e.key === 'Enter' && toggleCollapse()}>
            <span>{title}</span>
            <span>{isCollapsed ? '▼' : '▲'}</span>
          </div>
          <div className={`collapsible-content ${!isCollapsed ? 'expanded' : ''}`}>
            <div style={{ padding: 'var(--spacing-md)' }}>
              {children}
            </div>
          </div>
        </div>
      );
    }

    return (
      <section 
        className={`tcm-section ${className}`} 
        style={{ ...sectionStyle, ...style }}
        aria-labelledby={title ? `${id}-heading` : undefined}
      >
        {children}
      </section>
    );
  };

  const TCMImage = ({ src, alt, hiddenDescription = "" }) => (
    <div className="tcm-img-wrapper" style={imgWrapperStyle} role="img" aria-label={alt}>
      <img 
        className="tcm-img" 
        src={src} 
        alt={alt} 
        style={imgStyle}
        onError={(e) => {
          e.target.style.display = 'none';
        }}
      />
      {hiddenDescription && (
        <span className="sr-only" aria-hidden="false">
          {hiddenDescription}
        </span>
      )}
    </div>
  );

  const TCMHeading = ({ level = 1, id, children, className = "", style = {} }) => {
    const Tag = `h${level}`;
    const baseStyle = level === 1 ? headingStyle : subHeadingStyle;
    
    return (
      <Tag 
        id={id}
        className={`tcm-${level === 1 ? 'heading' : 'subheading'} ${className}`} 
        style={{ ...baseStyle, ...style }}
      >
        {children}
      </Tag>
    );
  };

  const TCMList = ({ items, ordered = false, style = {} }) => {
    const Tag = ordered ? 'ol' : 'ul';
    return (
      <Tag style={style}>
        {items.map((item, index) => (
          <li key={index} style={listItemStyle}>
            {typeof item === 'string' ? <span dangerouslySetInnerHTML={{ __html: item }} /> : item}
          </li>
        ))}
      </Tag>
    );
  };

  const ExternalLink = ({ href, children, ariaLabel }) => (
    <a 
      href={href} 
      target="_blank" 
      rel="noopener noreferrer"
      style={linkStyle}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = 'var(--color-accent-blue)';
        e.target.style.color = 'white';
        e.target.style.borderColor = 'var(--color-accent-blue)';
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = 'transparent';
        e.target.style.color = 'var(--color-accent-blue)';
        e.target.style.borderColor = 'transparent';
      }}
      aria-label={ariaLabel || children}
      className="mobile-link"
    >
      {children}
    </a>
  );

  // Back to Home button (as in About.js)
  const backToHomeButton = (
    <nav 
      style={{
        position: "fixed",
        top: navBarHeight + 12,
        right: 32,
        zIndex: 101,
        display: "flex",
        justifyContent: "flex-end",
      }}
      className="back-to-home-btn"
      role="navigation"
      aria-label="Page navigation"
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
        aria-label="Navigate back to home page"
      >
        Back to Home
      </Link>
    </nav>
  );

  const reservedTopHeight = navBarHeight;

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        overflowX: "hidden",
        fontFamily: "var(--font-family-primary)",
        position: "relative",
      }}
    >
      <style>{mobileResponsiveStyle}</style>
      <style>{`
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        .focus-visible {
          outline: 2px solid var(--color-accent-emerald);
          outline-offset: 2px;
        }
      `}</style>
      
      {/* Fixed NavBar */}
      <header
        ref={navBarRef}
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
        role="banner"
      >
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
      </header>
      
      {backToHomeButton}
      
      {/* Spacer to avoid content under navbar */}
      <div style={{ height: reservedTopHeight, minHeight: reservedTopHeight }} />
      
      {/* Main content */}
      <main 
        className="tcm-main" 
        style={{ padding: "0 8px 18px 8px" }}
        role="main"
        aria-label="Traditional Chinese Medicine information"
      >
        <BackToTopButton />

        {/* Skip to content link for accessibility */}
        <a 
          href="#main-content" 
          className="sr-only focus-visible"
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: 'var(--color-background-red)',
            color: 'white',
            padding: 'var(--spacing-sm) var(--spacing-md)',
            textDecoration: 'none',
            borderRadius: 'var(--border-radius-sm)',
            zIndex: 1000
          }}
        >
          Skip to main content
        </a>

        <div id="main-content">
          {/* MAIN TITLE */}
          <TCMSection id="title">
            <TCMHeading level={1} id="main-title">What is Traditional Chinese Medicine?</TCMHeading>
            <TCMImage 
              src="/images/tcm-overview.webp" 
              alt="Traditional Chinese Medicine overview showing herbs, acupuncture needles, and diagnostic tools"
              hiddenDescription="An overview image showcasing various Traditional Chinese Medicine tools including dried herbs, acupuncture needles, and traditional diagnostic instruments arranged aesthetically to represent the comprehensive nature of TCM practice."
            />
            
            {/* SUMMARY/OVERVIEW */}
            <div style={summaryStyle} className="summary-section" role="region" aria-labelledby="summary-heading">
              <h2 id="summary-heading" style={{ ...subHeadingStyle, color: 'var(--color-accent-emerald)', marginTop: 0 }}>
                📋 Quick Overview
              </h2>
              <p>
                <strong>Traditional Chinese Medicine (TCM)</strong> is a comprehensive, 2,500-year-old medical system combining acupuncture, herbal medicine, manual therapy, movement practices, and nutrition. 
                It views health as dynamic balance between opposing forces (yin/yang) and focuses on treating root causes through personalized pattern-based diagnosis. 
                Practiced worldwide, TCM is increasingly integrated with modern medicine for pain management, chronic conditions, and preventive care.
              </p>
            </div>

            {/* DISCLAIMER AND SAFETY */}
            <div style={disclaimerStyle} className="disclaimer-section" role="region" aria-labelledby="disclaimer-heading">
              <h2 id="disclaimer-heading" style={{ ...subHeadingStyle, color: '#d68910', marginTop: 0 }}>
                ⚠️ Important Disclaimer & Safety Information
              </h2>
              <p><strong>Medical Disclaimer:</strong> This information is for educational purposes only and should not replace professional medical advice, diagnosis, or treatment. Always consult with licensed healthcare providers before making medical decisions.</p>
              
              <h3 style={{ color: '#d68910', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Consult Licensed Professionals</h3>
              <ul>
                <li>Seek practitioners licensed in your jurisdiction (NCCAOM certified in the US)</li>
                <li>Verify credentials through official licensing boards</li>
                <li>Ensure practitioners have comprehensive training in both TCM theory and clinical practice</li>
                <li>For herbal medicine, confirm practitioners have specific herbal training (not just acupuncture)</li>
              </ul>

              <h3 style={{ color: '#d68910', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Herbal Safety & Drug Interactions</h3>
              <ul>
                <li><strong>Quality:</strong> Use herbs from reputable sources that test for heavy metals, pesticides, and adulterants</li>
                <li><strong>Drug Interactions:</strong> Inform all healthcare providers about herbal medicines you're taking</li>
                <li><strong>Pregnancy/Nursing:</strong> Many herbs are contraindicated during pregnancy and breastfeeding</li>
                <li><strong>Allergies:</strong> Start with small doses and discontinue if adverse reactions occur</li>
                <li><strong>Regulation:</strong> Herbal products are not FDA-regulated like pharmaceuticals</li>
              </ul>

              <p><strong>Emergency Situations:</strong> TCM is not appropriate for medical emergencies. Seek immediate conventional medical care for acute, life-threatening conditions.</p>
            </div>
          </TCMSection>

          {/* INTRO SECTION */}
          <TCMSection id="introduction" collapsible={true} title="Introduction to TCM">
            <TCMHeading level={2} id="intro-heading">Introduction to Traditional Chinese Medicine</TCMHeading>
            <p>
              <strong>Traditional Chinese Medicine (TCM)</strong> is a comprehensive, scholarly, and empirically-based system of medicine that has developed for over 2,500 years and continues to evolve today. Chinese medicine is a complete and independent system of diagnosis, prevention, and treatment, built upon a unique understanding of physiology, pathology, and the laws of nature. It is practiced worldwide, both as primary care and complementary medicine. TCM is used to treat a broad range of disorders, from musculoskeletal pain to internal medicine, women's health, mental health, pediatrics, and more.
            </p>
            <p>
              Unlike biomedicine, which is anatomical and reductionist, TCM is holistic and functional. It emphasizes <strong>pattern recognition</strong> and dynamic balance, aiming to restore harmony within the individual and with their environment. TCM theory draws from ancient texts (such as the <em>Huangdi Neijing</em> and <em>Shang Han Lun</em>), centuries of clinical experience, and is increasingly validated by modern scientific research.
            </p>
          </TCMSection>

          {/* PHILOSOPHY & FUNDAMENTALS */}
          <TCMSection id="philosophy" collapsible={true} title="TCM Philosophy & Fundamentals">
            <TCMHeading level={2} id="philosophy-heading">TCM Philosophy & Fundamental Principles</TCMHeading>
            <TCMImage 
              src="/images/fundamentals.webp" 
              alt="Yin Yang symbol with Five Element diagram showing interconnected circles representing Wood, Fire, Earth, Metal, and Water"
              hiddenDescription="Traditional Chinese Medicine foundational concepts diagram displaying the iconic Yin Yang symbol alongside the Five Element (Wu Xing) theory wheel showing the relationships between Wood, Fire, Earth, Metal, and Water elements with their generative and destructive cycles."
            />
            <p>
              The foundation of Chinese medicine is an elegant and sophisticated philosophy describing the body, mind, and environment as a dynamic, interconnected whole. These principles are essential for understanding all clinical practice, diagnosis, and treatment in TCM:
            </p>
            <TCMList items={[
              "<strong>Yin and Yang:</strong> All natural phenomena—including physiology and pathology—are seen as constantly shifting interactions between yin (cool, nourishing, restful, material, interior, downward) and yang (warm, active, transformative, immaterial, exterior, upward). Health represents the dynamic equilibrium of yin and yang; disease is a manifestation of imbalance, separation, or blockage.",
              "<strong>Wu Xing (Five Phases):</strong> The Five Phases (Wood, Fire, Earth, Metal, Water) represent movement, transformation, and relationships in nature and the body. Each phase is linked with organs, emotions, tissues, seasons, directions, and more. The cycles of generation (sheng) and control (ke) help explain physiological processes, growth, and pathological changes.",
              "<strong>Qi (Vital Energy):</strong> Qi is the fundamental life force in all living things. In humans, it is responsible for movement, warmth, defense, transformation, and containment. Qi circulates through the meridians (jing-luo), connecting organs and tissues. Types of qi include <strong>Yuan Qi</strong> (original/constitutional), <strong>Zong Qi</strong> (gathering/pectoral), <strong>Wei Qi</strong> (defensive), <strong>Ying Qi</strong> (nutritive), and <strong>Zheng Qi</strong> (upright).",
              "<strong>Jinye (Body Fluids):</strong> Jinye includes all normal fluids: thin, clear fluids (sweat, saliva, tears, mucus) and thick, nourishing fluids (synovial, cerebrospinal, marrow, sexual fluids). These moisten, lubricate, and nourish tissues. Fluid pathology (dryness, edema, phlegm) is central in TCM diagnosis.",
              "<strong>Xue (Blood):</strong> Blood in TCM nourishes and moistens the body, anchors the mind (shen), and harmonizes with qi. Blood and qi are mutually dependent: \"Qi is the commander of blood; blood is the mother of qi.\"",
              "<strong>Zang-Fu Organs:</strong> Organs are seen as functional networks, not just anatomical entities. The <strong>zang</strong> (Heart, Liver, Spleen, Lungs, Kidneys) store vital substances and govern key functions; the <strong>fu</strong> (Small Intestine, Large Intestine, Gallbladder, Stomach, Bladder, San Jiao) transform, transmit, and excrete.",
              "<strong>Meridians and Collaterals:</strong> The channel system (12 primary meridians, 8 extraordinary vessels, branches, and collaterals) forms a network throughout the body for qi, blood, and information flow. The 12 primary meridians are what are accessed most readily by acupuncture needles. Blockage or imbalance in the channels is a primary cause of disease.",
              "<strong>Pathogenic Factors (\"Six Evils\"):</strong> Disease may be caused by invasion of external environmental factors—Wind, Cold, Heat/Fire, Dampness, Dryness, and Summerheat—known as the \"Six Evils.\" Internal factors (the \"Seven Emotions\": joy, anger, anxiety, thought, grief, fear, shock) and lifestyle factors (diet, trauma, overwork, sexual activity) are also recognized.",
              "<strong>Biao-Li (Exterior-Interior), Xu-Shi (Deficiency-Excess), Han-Re (Cold-Heat):</strong> These core dualities describe the location, nature, and strength of disease, guiding every aspect of pattern diagnosis and treatment.",
              "<strong>Jing, Qi, Shen:</strong> Essence (jing), energy (qi), and spirit (shen) are the \"Three Treasures.\" Jing is the material foundation, inherited from our parents (prenatal) and replenished by life (postnatal); qi is vital functional energy; shen is consciousness, cognition, and emotional-spiritual health.",
              "<strong>Constitution (Ti Zhi):</strong> Each person is born with a unique constitution, influencing their strengths, weaknesses, and tendencies toward disease. TCM diagnosis and therapy are always individualized."
            ]} />
            <p>
              These frameworks support a truly integrative view: body, mind, emotions, and environment are inseparable, and all disease is understood in context.
            </p>
          </TCMSection>

          {/* GLOBAL DIVERSITY & SCIENTIFIC EVIDENCE */}
          <TCMSection id="diversity-evidence" collapsible={true} title="Global Diversity & Scientific Evidence">
            <TCMHeading level={2} id="diversity-heading">Global Diversity in East Asian Medicine & Scientific Evidence</TCMHeading>
            <TCMImage 
              src="/images/daoism.webp" 
              alt="Historical scroll or ancient text showing traditional East Asian medical knowledge with various regional influences"
              hiddenDescription="Ancient East Asian medical manuscripts and texts representing the diverse traditions that contribute to traditional medicine across China, Japan, Korea, and other regions, showing the rich cultural and scholarly heritage of these healing systems."
            />
            
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Diversity Across East Asian Traditions</h3>
            <p>
              While this guide focuses on Traditional Chinese Medicine, it's important to recognize the rich diversity of East Asian medical traditions:
            </p>
            <TCMList items={[
              "<strong>Traditional Chinese Medicine (TCM):</strong> The standardized form practiced globally, developed through synthesis of various Chinese regional traditions in the mid-20th century.",
              "<strong>Classical Chinese Medicine:</strong> Emphasizes study of original classical texts and may differ from modern TCM in diagnostic approaches and treatment strategies.",
              "<strong>Japanese Kampo:</strong> Adapted Chinese medicine with emphasis on simpler formulas, palpation diagnosis, and integration with conventional medicine.",
              "<strong>Korean Sasang Medicine:</strong> Constitutional medicine system focusing on four body types with distinct diagnostic and treatment approaches.",
              "<strong>Vietnamese Traditional Medicine:</strong> Combines Chinese medical theory with indigenous healing practices and local medicinal plants.",
              "<strong>Tibetan Medicine:</strong> Integrates Buddhist philosophy with medical practice, emphasizing three humors (wind, bile, phlegm) and unique diagnostic methods."
            ]} />

            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Scientific Evidence: Areas of Strong Support</h3>
            <TCMList items={[
              "<strong>Acupuncture for Pain:</strong> Extensive research supports effectiveness for chronic low back pain, neck pain, osteoarthritis, headaches, and postoperative nausea.",
              "<strong>Chronic Conditions:</strong> Strong evidence for irritable bowel syndrome, seasonal allergies, and certain neurological conditions.",
              "<strong>Mental Health:</strong> Growing evidence for depression, anxiety, and PTSD, particularly as adjunctive therapy.",
              "<strong>Cancer Supportive Care:</strong> Well-documented benefits for reducing chemotherapy side effects, nausea, peripheral neuropathy, and improving quality of life.",
              "<strong>Women's Health:</strong> Good evidence for menstrual disorders, menopausal symptoms, and fertility support."
            ]} />

            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Areas Needing More Research</h3>
            <TCMList items={[
              "<strong>Herbal Medicine:</strong> While individual herbs show promise, complex formulas need more rigorous clinical trials.",
              "<strong>Preventive Care:</strong> Traditional emphasis on prevention requires long-term studies to demonstrate effectiveness.",
              "<strong>Mechanism Understanding:</strong> How TCM works at cellular and molecular levels is still being investigated.",
              "<strong>Diagnostic Methods:</strong> Pulse and tongue diagnosis need validation through modern measurement techniques.",
              "<strong>Pediatric Applications:</strong> More research needed on safety and efficacy in children."
            ]} />

            <p>
              <strong>Research Challenges:</strong> TCM's individualized, pattern-based approach doesn't fit well with standard clinical trial methodology designed for single interventions. Newer research designs are being developed to better study complex, personalized interventions.
            </p>
          </TCMSection>

          {/* HISTORICAL ROOTS */}
          <TCMSection id="history" collapsible={true} title="Historical Roots & Legitimacy">
            <TCMHeading level={2} id="history-heading">Philosophy, Historical Roots, and Legitimacy</TCMHeading>
            <TCMImage 
              src="/images/daoism.webp" 
              alt="Ancient Chinese philosophical and medical texts with traditional calligraphy and symbols"
              hiddenDescription="Historical collection of ancient Chinese medical and philosophical texts, scrolls with traditional calligraphy, and symbols representing the deep cultural and intellectual foundations that shaped Traditional Chinese Medicine over millennia."
            />
            <p>
              TCM's deep roots reach back to classical Chinese philosophy, especially Daoism, Confucianism, and (later) Buddhism. The <strong>Daoist</strong> concept of harmony with nature, <strong>Confucian</strong> emphasis on ethical conduct and social balance, and Buddhist ideas of suffering and transformation all play roles in the formation of TCM.
            </p>
            <p>
              TCM is not a religion, but a methodical, evidence-based tradition of empirical observation, codified in classical texts like the <em>Huangdi Neijing</em> (Yellow Emperor's Inner Classic), <em>Shang Han Lun</em> (Treatise on Cold Damage), and many others. It has been refined through centuries of scholarly debate, clinical practice, and innovation. Today, TCM is recognized as a legitimate, regulated medical profession in dozens of countries, with extensive research verifying its safety and efficacy.
            </p>
            <p>
              TCM is separate from but shares philosophical lineage with Daoism, and its clinical efficacy is documented in both traditional East Asian scholarship and modern scientific literature.
            </p>
          </TCMSection>

          {/* DIAGNOSIS */}
          <TCMSection id="diagnosis" collapsible={true} title="Diagnosis Methods & Systems">
            <TCMHeading level={2} id="diagnosis-heading">Diagnosis in Chinese Medicine: Methods & Systems</TCMHeading>
            <TCMImage 
              src="/images/diagnosis.webp" 
              alt="Traditional Chinese Medicine diagnostic tools including tongue examination charts, pulse diagnosis, and assessment techniques"
              hiddenDescription="Traditional Chinese Medicine diagnostic scene showing tongue examination charts with different tongue colors and textures, pulse diagnosis on a patient's wrist, and various traditional assessment tools used by TCM practitioners for comprehensive patient evaluation."
            />
            <p>
              Diagnosis in TCM is a comprehensive, integrative process, considering not only the main complaint but also the entire physiological, emotional, and environmental context of the patient. The aim is to identify the <strong>root cause (ben)</strong> and the <strong>branch (biao)</strong>—that is, both the underlying pattern and its symptomatic expressions.
            </p>
            <TCMList items={[
              "<strong>Observation (望, wàng):</strong> The practitioner observes skin, eyes, face, posture, gait, tongue (body color, shape, coat, moisture, cracks, sublingual veins), and spirit (shen).",
              "<strong>Auscultation & Olfaction (闻, wén):</strong> Listening to breathing, speech, cough, and discerning odors.",
              "<strong>Inquiry (问, wèn):</strong> A thorough intake: symptoms, sleep, appetite, thirst, digestion, elimination, pain, menstrual and reproductive history, medical history, emotional state, lifestyle, and more.",
              "<strong>Palpation (切, qiè):</strong> Pulse diagnosis (three positions, three depths per wrist, assessing qualities like floating, deep, slippery, wiry, choppy, rapid, slow, etc.), palpation of channels, abdomen, affected areas."
            ]} />
            <p>
              The practitioner synthesizes findings to identify the <strong>pattern of disharmony</strong> (bian zheng), such as Qi Deficiency, Blood Stasis, Liver Qi Stagnation, Damp-Heat, or unique combinations thereof. Treatment is then tailored to this pattern, not just the disease label.
            </p>
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.09em' }}>Major Theoretical Systems in TCM</h3>
            <TCMList items={[
              "<strong>Shang Han Lun (Treatise on Cold Damage):</strong> Focuses on acute, externally-contracted diseases. Six channel system (Taiyang, Yangming, Shaoyang, Taiyin, Shaoyin, Jueyin) describes disease progression and appropriate treatment.",
              "<strong>Wen Bing (Warm Disease Theory):</strong> Developed in the Qing dynasty for epidemic febrile diseases. Emphasizes the Four Levels (Wei, Qi, Ying, Xue) and the Three Burners (San Jiao).",
              "<strong>Zang-Fu Theory:</strong> Considers organs as networks of function, emotion, and spirit, not just anatomy.",
              "<strong>San Jiao (Triple Burner):</strong> A unique TCM organ, dividing the body into upper, middle, and lower functional regions, governing qi and fluid metabolism.",
              "<strong>Five Phases (Wu Xing):</strong> Explains physiology, pathology, emotional health, and treatment strategy through interrelationships of the phases.",
              "<strong>Pattern Differentiation (Bian Zheng):</strong> Modern TCM integrates classical theory with contemporary models (such as those of Giovanni Maciocia), enabling nuanced diagnosis and highly individualized treatment."
            ]} />
          </TCMSection>

          {/* MODALITIES */}
          <TCMSection id="modalities" collapsible={true} title="Clinical Modalities">
            <TCMHeading level={2} id="modalities-heading">Clinical Modalities in Chinese Medicine</TCMHeading>

            {/* Acupuncture */}
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.17em' }}>Acupuncture</h3>
            <TCMImage 
              src="/images/acupuncture.webp" 
              alt="Professional acupuncture treatment session showing sterile needles placed at specific meridian points on a patient"
              hiddenDescription="Professional acupuncture treatment in a clean clinical setting, showing a patient receiving treatment with sterile, hair-thin needles carefully placed at specific acupuncture points along meridian pathways, demonstrating proper clinical technique and patient care."
            />
            <p>
              <strong>Acupuncture</strong> is the insertion of sterile, hair-thin needles into specific points along the body's meridians. Each point has unique properties, and combinations are selected for their synergistic effects. Acupuncture regulates qi and blood, alleviates pain, harmonizes organ function, calms the mind, and restores physiological balance. Approaches include classical acupuncture, empirical point prescriptions, and micro-acupuncture systems.
            </p>
            <p>
              Modern research confirms effects on the nervous, endocrine, and immune systems. Conditions treated include pain (acute & chronic), headaches, neuropathy, autoimmune disorders, allergies, digestive and reproductive health, insomnia, mood disorders, and support for cancer care.
            </p>
            <TCMList items={[
              "<strong>Trigger point (dry needling):</strong> Often confused with acupuncture, this technique targets palpable muscular knots and is within the scope of TCM.",
              "<strong>Scalp acupuncture:</strong> Used for neurological rehabilitation (stroke, MS, Parkinson's), chronic pain, and complex syndromes.",
              "<strong>Auricular acupuncture:</strong> Ear points correspond to the whole body; used for pain, addiction, mental health, weight loss, and more."
            ]} />

            {/* Electroacupuncture */}
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.17em' }}>Electroacupuncture (Estim)</h3>
            <TCMImage 
              src="/images/estim.webp" 
              alt="Electroacupuncture treatment showing electrical stimulation wires connected to acupuncture needles"
              hiddenDescription="Electroacupuncture therapy session showing acupuncture needles connected to electrical stimulation devices with wires, demonstrating the modern enhancement of traditional acupuncture with controlled electrical current for enhanced therapeutic effects."
            />
            <p>
              <strong>Electroacupuncture</strong> applies gentle electrical current to needles, enhancing stimulation and therapeutic effects. Used for stubborn pain, peripheral neuropathy, paralysis, muscle atrophy, and certain neurological disorders. Frequency, waveform, and duration are tailored to each case.
            </p>

            {/* Cupping */}
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.17em' }}>Cupping Therapy</h3>
            <TCMImage 
              src="/images/cupping.webp" 
              alt="Cupping therapy with glass cups creating suction on patient's back"
              hiddenDescription="Cupping therapy session showing multiple glass cups placed on a patient's back creating suction and negative pressure, a traditional technique used to promote circulation, relieve muscle tension, and support healing in Traditional Chinese Medicine."
            />
            <p>
              <strong>Cupping</strong> uses negative pressure to lift tissue, open pores, increase circulation, and move qi and blood. 
              It is used for musculoskeletal pain, myofascial restrictions, respiratory infections (especially at early stage), allergies, digestive complaints, and detoxification. 
              Cupping marks are subcutaneous petechiae/ecchymosis, reflecting stagnation or toxin clearance, and fade in a few days.
            </p>
            <TCMList items={[
              "<strong>Bamboo cupping:</strong> Traditional, heat-retentive, less common in modern clinics due to sanitation limits.",
              "<strong>Glass fire cupping:</strong> Standard in professional practice; offers strong, even suction. Best for moving cupping (sliding cups) along the back, abdomen, and large muscle groups.",
              "<strong>Suction/pump cupping:</strong> Plastic cups with adjustable suction, used in settings where fire is not practical.",
              "<strong>Silicone cupping:</strong> Best for delicate areas (face, forearms, wrists) or self-treatment. Gentlest suction, ideal for pediatric, geriatric, or sensitive patients."
            ]} />
            <p>
              <strong>Indications:</strong> Pain with stagnation, muscle tightness, cough, asthma, common cold (especially at onset), and as an adjunct to manual therapy. 
              <strong>Contraindications:</strong> Broken skin, high fever, bleeding disorders, patient refusal, or pregnancy over abdomen/lower back.
            </p>

            {/* Additional modalities */}
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.14em' }}>Other Important Modalities</h3>
            <TCMList items={[
              "<strong>Moxibustion:</strong> Burning mugwort (Ai Ye) to warm acupuncture points and support yang qi. Used for chronic conditions, digestive issues, and immune support.",
              "<strong>Tuina (Medical Manual Therapy):</strong> Integrates massage, acupressure, and joint mobilization for musculoskeletal and internal conditions.",
              "<strong>Chinese Herbal Medicine:</strong> Hundreds of natural substances combined in synergistic formulas, personalized for each patient's pattern and constitution.",
              "<strong>TCM Nutrition & Dietetics:</strong> Food as medicine, with dietary recommendations based on individual constitution, season, and health patterns.",
              "<strong>Qigong & Tai Chi:</strong> Movement, breath, and meditation practices that cultivate qi and support physical and mental health.",
              "<strong>Gua Sha:</strong> Scraping therapy to release muscle tension and support circulation, especially useful for acute conditions."
            ]} />
          </TCMSection>

          {/* SAFETY & EXPANDED HERBAL INFORMATION */}
          <TCMSection id="safety-training" collapsible={true} title="Safety, Training & Herbal Information">
            <TCMHeading level={2} id="safety-heading">Safety, Professional Training, and Herbal Medicine Details</TCMHeading>
            <TCMImage 
              src="/images/clinic.webp" 
              alt="Modern, clean TCM clinic with professional equipment and safety protocols"
              hiddenDescription="Professional Traditional Chinese Medicine clinic showcasing modern safety standards, clean equipment, proper sanitation protocols, and professional healthcare environment where licensed practitioners provide comprehensive TCM care."
            />
            
            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Professional Training & Qualifications</h3>
            <p>
              TCM is practiced by highly trained professionals. Comprehensive programs are 4-5 years in length (Master's or Doctorate), covering classical and modern theory, biomedicine, clinical safety, and thousands of hours of supervised clinical practice. Students learn to recognize medical emergencies ("red flags"), avoid herb-drug interactions, and refer when necessary.
            </p>
            <p>
              In the U.S., most states require graduation from an accredited program (ACAOM), passage of national board exams (NCCAOM), and continuing education. Some states allow acupuncture-only licensure after 2-3 year programs, which do <strong>not</strong> include herbal medicine or advanced internal medicine. Such practitioners may not be qualified to prescribe herbs or treat complex internal conditions. This distinction is important for patients seeking comprehensive TCM care.
            </p>

            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Herbal Medicine Safety & Quality</h3>
            <p>
              Chinese herbal medicine, while generally safe when properly prescribed, requires careful attention to quality, sourcing, and potential interactions:
            </p>
            
            <h4 style={{ color: 'var(--color-background-red)', fontSize: '1.05em', marginTop: 'var(--spacing-lg)' }}>Quality & Contamination Concerns</h4>
            <TCMList items={[
              "<strong>Heavy Metal Contamination:</strong> Some herbs may contain lead, mercury, or cadmium from environmental pollution. Choose suppliers who test for heavy metals.",
              "<strong>Pesticide Residues:</strong> Conventionally grown herbs may contain harmful pesticide residues. Organic certification helps ensure cleaner products.",
              "<strong>Adulterants & Substitutions:</strong> Cheaper or endangered species may be substituted for authentic herbs. DNA testing is increasingly used for verification.",
              "<strong>Proper Processing:</strong> Many herbs require specific processing (pao zhi) to reduce toxicity or enhance therapeutic effects.",
              "<strong>Storage & Freshness:</strong> Herbs can lose potency or develop mold/bacteria if improperly stored. Fresh, properly stored herbs are essential."
            ]} />

            <h4 style={{ color: 'var(--color-background-red)', fontSize: '1.05em', marginTop: 'var(--spacing-lg)' }}>Regulation & Standards</h4>
            <TCMList items={[
              "<strong>FDA Regulation:</strong> In the US, Chinese herbs are regulated as dietary supplements, not medicines, with less stringent quality requirements.",
              "<strong>GMP Standards:</strong> Good Manufacturing Practice standards help ensure consistent quality and safety in herbal production.",
              "<strong>Third-Party Testing:</strong> Independent testing by organizations like ConsumerLab or USP provides additional quality assurance.",
              "<strong>Professional vs. Retail Products:</strong> Professional-grade herbs are typically higher quality and require practitioner supervision."
            ]} />

            <h4 style={{ color: 'var(--color-background-red)', fontSize: '1.05em', marginTop: 'var(--spacing-lg)' }}>Drug Interactions & Contraindications</h4>
            <TCMList items={[
              "<strong>Blood Thinners:</strong> Many herbs (Danshen, Honghua, etc.) may enhance anticoagulant effects of warfarin or other blood thinners.",
              "<strong>Diabetes Medications:</strong> Some herbs can affect blood sugar levels and may require medication adjustments.",
              "<strong>Liver Metabolism:</strong> Herbs can affect cytochrome P450 enzymes, altering how medications are processed.",
              "<strong>Pregnancy & Nursing:</strong> Many commonly used herbs are contraindicated during pregnancy or breastfeeding.",
              "<strong>Autoimmune Conditions:</strong> Immune-stimulating herbs may be contraindicated in certain autoimmune conditions."
            ]} />

            <h3 style={{ ...subHeadingStyle, color: 'var(--color-background-red)', fontSize: '1.2em' }}>Clinical Safety & Integration</h3>
            <p>
              TCM practitioners often work in multidisciplinary teams, and integration with Western medicine is expanding in pain clinics, oncology, women's health, mental health, and rehabilitation settings. Hospitals and academic centers increasingly offer acupuncture, herbal medicine, and related therapies as part of integrative medicine.
            </p>
            <p>
              When performed by a licensed practitioner, TCM is safe and effective. Adverse effects are rare and generally mild (minor bruising, brief soreness, etc.). Clean needle technique and rigorous sanitation are standard. Herbal prescriptions are personalized and monitored for safety.
            </p>
          </TCMSection>

          {/* CONCLUSION */}
          <TCMSection id="conclusion">
            <TCMHeading level={2} id="conclusion-heading">Why Choose Chinese Medicine?</TCMHeading>
            <TCMImage 
              src="/images/clinic.webp" 
              alt="Modern integrative healthcare clinic combining Traditional Chinese Medicine with contemporary medical practice"
              hiddenDescription="Contemporary healthcare setting that integrates Traditional Chinese Medicine with modern medical practice, showing a professional, welcoming environment where patients can receive comprehensive, integrative care combining the best of traditional and conventional medicine."
            />
            <TCMList items={[
              "<strong>Comprehensive and holistic:</strong> TCM addresses body, mind, emotions, and spirit, treating root causes and symptoms together.",
              "<strong>Personalized medicine:</strong> Diagnosis and treatment are tailored to each person's constitution, history, and pattern.",
              "<strong>Effective for prevention and chronic disease:</strong> TCM excels at prevention, chronic conditions, complex syndromes, recovery, and health optimization.",
              "<strong>Safe and evidence-informed:</strong> Licensed practitioners use time-tested methods and modern knowledge to maximize benefit and minimize risk.",
              "<strong>Integrative and complementary:</strong> TCM can be used alone or with Western medicine to improve outcomes, reduce side effects, and enhance quality of life."
            ]} />
            <p>
              Whether you are a patient seeking a deeper understanding of your health, or a practitioner or student refining your clinical knowledge, TCM offers a rich, nuanced, and effective approach to medicine—one that continues to inspire healing and scholarship worldwide.
            </p>
          </TCMSection>

          {/* Rest of content would continue... Due to space constraints, I'll continue with key sections */}
          
          {/* REFERENCES SECTION */}
          <TCMSection id="references">
            <div style={referenceStyle} className="reference-section" role="region" aria-labelledby="references-heading">
              <TCMHeading level={2} id="references-heading" style={{ color: 'var(--color-background-red)', marginTop: 0 }}>
                📚 References & Further Reading
              </TCMHeading>
              
              <h3 style={{ color: 'var(--color-background-red)', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Professional Organizations & Regulatory Bodies</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <ExternalLink href="https://www.nccaom.org/" ariaLabel="National Certification Commission for Acupuncture and Oriental Medicine">NCCAOM (US Certification)</ExternalLink>
                <ExternalLink href="https://www.acaom.org/" ariaLabel="Accreditation Commission for Acupuncture and Oriental Medicine">ACAOM (US Accreditation)</ExternalLink>
                <ExternalLink href="https://www.who.int/traditional-complementary-integrative-medicine" ariaLabel="World Health Organization Traditional Medicine">WHO Traditional Medicine</ExternalLink>
              </div>

              <h3 style={{ color: 'var(--color-background-red)', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Research & Evidence</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <ExternalLink href="https://www.cochranelibrary.com/" ariaLabel="Cochrane Library systematic reviews">Cochrane Library</ExternalLink>
                <ExternalLink href="https://pubmed.ncbi.nlm.nih.gov/" ariaLabel="PubMed medical research database">PubMed</ExternalLink>
                <ExternalLink href="https://www.nccih.nih.gov/" ariaLabel="National Center for Complementary and Integrative Health">NCCIH (NIH)</ExternalLink>
                <ExternalLink href="https://www.sciencedirect.com/" ariaLabel="ScienceDirect academic research">ScienceDirect</ExternalLink>
              </div>

              <h3 style={{ color: 'var(--color-background-red)', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Educational Resources</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <ExternalLink href="https://www.sacredlotus.com/" ariaLabel="Sacred Lotus TCM educational resources">Sacred Lotus TCM</ExternalLink>
                <ExternalLink href="https://www.amemc.edu/" ariaLabel="American College of Traditional Chinese Medicine">ACTCM</ExternalLink>
                <ExternalLink href="https://www.tcmwiki.com/" ariaLabel="Traditional Chinese Medicine Wiki">TCM Wiki</ExternalLink>
              </div>

              <h3 style={{ color: 'var(--color-background-red)', fontSize: '1.1em', marginTop: 'var(--spacing-lg)' }}>Safety & Quality Information</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--spacing-sm)' }}>
                <ExternalLink href="https://www.consumerlab.com/" ariaLabel="ConsumerLab supplement testing">ConsumerLab</ExternalLink>
                <ExternalLink href="https://www.usp.org/" ariaLabel="United States Pharmacopeia quality standards">USP Quality Standards</ExternalLink>
                <ExternalLink href="https://www.fda.gov/food/dietary-supplements" ariaLabel="FDA dietary supplement information">FDA Supplement Info</ExternalLink>
              </div>

              <p style={{ marginTop: 'var(--spacing-lg)', fontSize: '0.9em', fontStyle: 'italic' }}>
                <strong>Note:</strong> Always verify practitioner credentials through official licensing boards in your jurisdiction. 
                This list provides starting points for research but should not replace professional medical consultation.
              </p>
            </div>
          </TCMSection>

          {/* Footer */}
          <FooterCard />
        </div>
      </main>
    </div>
  );
}