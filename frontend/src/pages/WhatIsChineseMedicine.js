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

const sectionStyle = {
  background: "rgba(252,245,229,0.98)",
  borderRadius: "1.1em",
  boxShadow: `0 2px 18px 0 ${COLORS.shadowStrong}`,
  border: `2px solid ${COLORS.accentGold}`,
  margin: "0 auto 36px auto",
  maxWidth: 950,
  padding: "28px 5vw",
  fontFamily: "'Inter', 'Segoe UI', 'Arial', 'Noto Serif SC', serif",
  fontSize: "1.07em",
  lineHeight: 1.72,
  wordBreak: "break-word",
};

const headingStyle = {
  fontSize: "2.1em",
  color: COLORS.backgroundRed,
  fontWeight: 900,
  marginBottom: "14px",
  textAlign: "center",
  fontFamily: "'Inter', 'Segoe UI', 'Arial', 'Noto Serif SC', serif",
  letterSpacing: "-0.01em"
};

const subHeadingStyle = {
  fontSize: "1.38em",
  color: COLORS.accentGold,
  fontWeight: 800,
  marginTop: "1.4em",
  marginBottom: "0.7em",
  fontFamily: "'Inter', 'Segoe UI', 'Arial', 'Noto Serif SC', serif",
};

const imgWrapperStyle = {
  width: "100%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  margin: "18px 0 18px 0",
};

const imgStyle = {
  borderRadius: "1em",
  border: `2px solid ${COLORS.accentGold}`,
  boxShadow: `0 4px 18px -6px ${COLORS.shadowStrong}`,
  objectFit: "cover",
  objectPosition: "center",
  width: "min(410px, 94vw)",
  height: "210px",
  background: COLORS.accentIvory,
  display: "block",
  maxWidth: "100%",
};

const listItemStyle = {
  marginBottom: "0.37em",
};

const mobileResponsiveStyle = `
@media (max-width: 650px) {
  .tcm-section {
    padding: 14px 5vw !important;
    font-size: 0.98em !important;
  }
  .tcm-main {
    padding: 0 2vw 8px 2vw !important;
  }
  .tcm-heading {
    font-size: 1.17em !important;
    padding-left: 2vw;
    padding-right: 2vw;
  }
  .tcm-subheading {
    font-size: 0.99em !important;
    padding-left: 2vw;
    padding-right: 2vw;
  }
  ul, ol {
    padding-left: 2em !important;
  }
  .tcm-img-wrapper {
    margin: 12px 0 12px 0 !important;
  }
  .tcm-img {
    width: 98vw !important;
    height: 200px !important;
    min-width: 0 !important;
    max-width: 98vw !important;
    object-fit: cover !important;
  }
  /* Increased text indent for easier reading on mobile */
  .tcm-section p, .tcm-section li {
    text-indent: 0.95em !important;
  }
}
`;

export default function WhatIsChineseMedicine() {
  const navBarRef = useRef();
  const [navBarHeight, setNavBarHeight] = useState(NAVBAR_HEIGHT);

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

  // Back to Home button (as in About.js)
  const backToHomeButton = (
    <div
      style={{
        position: "fixed",
        top: navBarHeight + 12,
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

  const reservedTopHeight = navBarHeight;

  // Helper for consistent image tag
  const ConsistentImg = ({ src, alt }) => (
    <div className="tcm-img-wrapper" style={imgWrapperStyle}>
      <img className="tcm-img" src={src} alt={alt} style={imgStyle} />
    </div>
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: COLORS.backgroundGold,
        overflowX: "hidden",
        fontFamily: "'Inter', 'Segoe UI', 'Arial', 'Noto Serif SC', serif",
        position: "relative",
      }}
    >
      <style>{mobileResponsiveStyle}</style>
      {/* Fixed NavBar */}
      <div
        ref={navBarRef}
        style={{
          width: "100%",
          position: "fixed",
          top: 0,
          left: 0,
          zIndex: 99,
        }}
      >
        <NavBar
          showReportError={true}
          showAbout={true}
          showAdminButtons={true}
          showLogo={true}
          fixed={true}
        />
      </div>
      {backToHomeButton}
      {/* Spacer to avoid content under navbar */}
      <div style={{ height: reservedTopHeight, minHeight: reservedTopHeight }} />
      {/* Main content and footer in a flex column */}
      <main className="tcm-main" style={{ padding: "0 8px 18px 8px" }}>
        <BackToTopButton />
        {/* INTRO */}
        <section className="tcm-section" style={sectionStyle}>
          <h1 className="tcm-heading" style={headingStyle}>What is Chinese Medicine?</h1>
          <ConsistentImg src="/images/tcm-overview.webp" alt="Traditional Chinese Medicine overview" />
          <p>
            <b>Traditional Chinese Medicine (TCM)</b> is a comprehensive, scholarly, and empirically-based system of medicine that has developed for over 2,500 years and continues to evolve today. Chinese medicine is a complete and independent system of diagnosis, prevention, and treatment, built upon a unique understanding of physiology, pathology, and the laws of nature. It is practiced worldwide, both as primary care and complementary medicine. TCM is used to treat a broad range of disorders, from musculoskeletal pain to internal medicine, women’s health, mental health, pediatrics, and more.
          </p>
          <p>
            Unlike biomedicine, which is anatomical and reductionist, TCM is holistic and functional. It emphasizes <b>pattern recognition</b> and dynamic balance, aiming to restore harmony within the individual and with their environment. TCM theory draws from ancient texts (such as the <i>Huangdi Neijing</i> and <i>Shang Han Lun</i>), centuries of clinical experience, and is increasingly validated by modern scientific research.
          </p>
        </section>

        {/* PHILOSOPHY & FUNDAMENTALS */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>TCM Philosophy & Fundamental Principles</h2>
          <ConsistentImg src="/images/fundamentals.webp" alt="Yin Yang, Five Phases, and TCM classical diagrams" />
          <p>
            The foundation of Chinese medicine is an elegant and sophisticated philosophy describing the body, mind, and environment as a dynamic, interconnected whole. These principles are essential for understanding all clinical practice, diagnosis, and treatment in TCM:
          </p>
          <ul>
            <li style={listItemStyle}>
              <b>Yin and Yang:</b> All natural phenomena—including physiology and pathology—are seen as constantly shifting interactions between yin (cool, nourishing, restful, material, interior, downward) and yang (warm, active, transformative, immaterial, exterior, upward). Health represents the dynamic equilibrium of yin and yang; disease is a manifestation of imbalance, separation, or blockage.
            </li>
            <li style={listItemStyle}>
              <b>Wu Xing (Five Phases):</b> The Five Phases (Wood, Fire, Earth, Metal, Water) represent movement, transformation, and relationships in nature and the body. Each phase is linked with organs, emotions, tissues, seasons, directions, and more. The cycles of generation (sheng) and control (ke) help explain physiological processes, growth, and pathological changes.
            </li>
            <li style={listItemStyle}>
              <b>Qi (Vital Energy):</b> Qi is the fundamental life force in all living things. In humans, it is responsible for movement, warmth, defense, transformation, and containment. Qi circulates through the meridians (jing-luo), connecting organs and tissues. Types of qi include <b>Yuan Qi</b> (original/constitutional), <b>Zong Qi</b> (gathering/pectoral), <b>Wei Qi</b> (defensive), <b>Ying Qi</b> (nutritive), and <b>Zheng Qi</b> (upright).
            </li>
            <li style={listItemStyle}>
              <b>Jinye (Body Fluids):</b> Jinye includes all normal fluids: thin, clear fluids (sweat, saliva, tears, mucus) and thick, nourishing fluids (synovial, cerebrospinal, marrow, sexual fluids). These moisten, lubricate, and nourish tissues. Fluid pathology (dryness, edema, phlegm) is central in TCM diagnosis.
            </li>
            <li style={listItemStyle}>
              <b>Xue (Blood):</b> Blood in TCM nourishes and moistens the body, anchors the mind (shen), and harmonizes with qi. Blood and qi are mutually dependent: “Qi is the commander of blood; blood is the mother of qi.”
            </li>
            <li style={listItemStyle}>
              <b>Zang-Fu Organs:</b> Organs are seen as functional networks, not just anatomical entities. The <b>zang</b> (Heart, Liver, Spleen, Lungs, Kidneys) store vital substances and govern key functions; the <b>fu</b> (Small Intestine, Large Intestine, Gallbladder, Stomach, Bladder, San Jiao) transform, transmit, and excrete.
            </li>
            <li style={listItemStyle}>
              <b>Meridians and Collaterals:</b> The channel system (12 primary meridians, 8 extraordinary vessels, branches, and collaterals) forms a network throughout the body for qi, blood, and information flow. The 12 primary meridians are what are accessed most readily by acupuncture needles. Blockage or imbalance in the channels is a primary cause of disease.
            </li>
            <li style={listItemStyle}>
              <b>Pathogenic Factors ("Six Evils"):</b> Disease may be caused by invasion of external environmental factors—Wind, Cold, Heat/Fire, Dampness, Dryness, and Summerheat—known as the “Six Evils.” Internal factors (the “Seven Emotions”: joy, anger, anxiety, thought, grief, fear, shock) and lifestyle factors (diet, trauma, overwork, sexual activity) are also recognized.
            </li>
            <li style={listItemStyle}>
              <b>Biao-Li (Exterior-Interior), Xu-Shi (Deficiency-Excess), Han-Re (Cold-Heat):</b> These core dualities describe the location, nature, and strength of disease, guiding every aspect of pattern diagnosis and treatment.
            </li>
            <li style={listItemStyle}>
              <b>Jing, Qi, Shen:</b> Essence (jing), energy (qi), and spirit (shen) are the “Three Treasures.” Jing is the material foundation, inherited from our parents (prenatal) and replenished by life (postnatal); qi is vital functional energy; shen is consciousness, cognition, and emotional-spiritual health.
            </li>
            <li style={listItemStyle}>
              <b>Constitution (Ti Zhi):</b> Each person is born with a unique constitution, influencing their strengths, weaknesses, and tendencies toward disease. TCM diagnosis and therapy are always individualized.
            </li>
          </ul>
          <p>
            These frameworks support a truly integrative view: body, mind, emotions, and environment are inseparable, and all disease is understood in context.
          </p>
        </section>

        {/* HISTORICAL ROOTS */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>Philosophy, Historical Roots, and Legitimacy</h2>
          <ConsistentImg src="/images/daoism.webp" alt="historical roots" />
          <p>
            TCM’s deep roots reach back to classical Chinese philosophy, especially Daoism, Confucianism, and (later) Buddhism. The <b>Daoist</b> concept of harmony with nature, <b>Confucian</b> emphasis on ethical conduct and social balance, and Buddhist ideas of suffering and transformation all play roles in the formation of TCM.
          </p>
          <p>
            TCM is not a religion, but a methodical, evidence-based tradition of empirical observation, codified in classical texts like the <i>Huangdi Neijing</i> (Yellow Emperor’s Inner Classic), <i>Shang Han Lun</i> (Treatise on Cold Damage), and many others. It has been refined through centuries of scholarly debate, clinical practice, and innovation. Today, TCM is recognized as a legitimate, regulated medical profession in dozens of countries, with extensive research verifying its safety and efficacy.
          </p>
          <p>
            TCM is separate from but shares philosophical lineage with Daoism, and its clinical efficacy is documented in both traditional East Asian scholarship and modern scientific literature.
          </p>
        </section>

        {/* DIAGNOSIS */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>Diagnosis in Chinese Medicine: Methods & Systems</h2>
          <ConsistentImg src="/images/diagnosis.webp" alt="Tongue and pulse diagnosis" />
          <p>
            Diagnosis in TCM is a comprehensive, integrative process, considering not only the main complaint but also the entire physiological, emotional, and environmental context of the patient. The aim is to identify the <b>root cause (ben)</b> and the <b>branch (biao)</b>—that is, both the underlying pattern and its symptomatic expressions.
          </p>
          <ul>
            <li style={listItemStyle}>
              <b>Observation (望, wàng):</b> The practitioner observes skin, eyes, face, posture, gait, tongue (body color, shape, coat, moisture, cracks, sublingual veins), and spirit (shen).
            </li>
            <li style={listItemStyle}>
              <b>Auscultation & Olfaction (闻, wén):</b> Listening to breathing, speech, cough, and discerning odors.
            </li>
            <li style={listItemStyle}>
              <b>Inquiry (问, wèn):</b> A thorough intake: symptoms, sleep, appetite, thirst, digestion, elimination, pain, menstrual and reproductive history, medical history, emotional state, lifestyle, and more.
            </li>
            <li style={listItemStyle}>
              <b>Palpation (切, qiè):</b> Pulse diagnosis (three positions, three depths per wrist, assessing qualities like floating, deep, slippery, wiry, choppy, rapid, slow, etc.), palpation of channels, abdomen, affected areas.
            </li>
          </ul>
          <p>
            The practitioner synthesizes findings to identify the <b>pattern of disharmony</b> (bian zheng), such as Qi Deficiency, Blood Stasis, Liver Qi Stagnation, Damp-Heat, or unique combinations thereof. Treatment is then tailored to this pattern, not just the disease label.
          </p>
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.09em" }}>Major Theoretical Systems in TCM</h3>
          <ul>
            <li style={listItemStyle}>
              <b>Shang Han Lun (Treatise on Cold Damage):</b> Focuses on acute, externally-contracted diseases. Six channel system (Taiyang, Yangming, Shaoyang, Taiyin, Shaoyin, Jueyin) describes disease progression and appropriate treatment.
            </li>
            <li style={listItemStyle}>
              <b>Wen Bing (Warm Disease Theory):</b> Developed in the Qing dynasty for epidemic febrile diseases. Emphasizes the Four Levels (Wei, Qi, Ying, Xue) and the Three Burners (San Jiao).
            </li>
            <li style={listItemStyle}>
              <b>Zang-Fu Theory:</b> Considers organs as networks of function, emotion, and spirit, not just anatomy.
            </li>
            <li style={listItemStyle}>
              <b>San Jiao (Triple Burner):</b> A unique TCM organ, dividing the body into upper, middle, and lower functional regions, governing qi and fluid metabolism.
            </li>
            <li style={listItemStyle}>
              <b>Five Phases (Wu Xing):</b> Explains physiology, pathology, emotional health, and treatment strategy through interrelationships of the phases.
            </li>
            <li style={listItemStyle}>
              <b>Pattern Differentiation (Bian Zheng):</b> Modern TCM integrates classical theory with contemporary models (such as those of Giovanni Maciocia), enabling nuanced diagnosis and highly individualized treatment.
            </li>
          </ul>
        </section>

        {/* MODALITIES */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>Clinical Modalities in Chinese Medicine</h2>

          {/* Acupuncture */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Acupuncture</h3>
          <ConsistentImg src="/images/acupuncture.webp" alt="Acupuncture treatment" />
          <p>
            <b>Acupuncture</b> is the insertion of sterile, hair-thin needles into specific points along the body's meridians. Each point has unique properties, and combinations are selected for their synergistic effects. Acupuncture regulates qi and blood, alleviates pain, harmonizes organ function, calms the mind, and restores physiological balance. Approaches include classical acupuncture, empirical point prescriptions, and micro-acupuncture systems.
          </p>
          <p>
            Modern research confirms effects on the nervous, endocrine, and immune systems. Conditions treated include pain (acute & chronic), headaches, neuropathy, autoimmune disorders, allergies, digestive and reproductive health, insomnia, mood disorders, and support for cancer care.
          </p>
          <ul>
            <li><b>Trigger point (dry needling):</b> Often confused with acupuncture, this technique targets palpable muscular knots and is within the scope of TCM.</li>
            <li><b>Scalp acupuncture:</b> Used for neurological rehabilitation (stroke, MS, Parkinson’s), chronic pain, and complex syndromes.</li>
            <li><b>Auricular acupuncture:</b> Ear points correspond to the whole body; used for pain, addiction, mental health, weight loss, and more.</li>
          </ul>

          {/* Electroacupuncture */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Electroacupuncture (Estim)</h3>
          <ConsistentImg src="/images/estim.webp" alt="Electroacupuncture with wires attached to needles" />
          <p>
            <b>Electroacupuncture</b> applies gentle electrical current to needles, enhancing stimulation and therapeutic effects. Used for stubborn pain, peripheral neuropathy, paralysis, muscle atrophy, and certain neurological disorders. Frequency, waveform, and duration are tailored to each case.
          </p>

          {/* Cupping */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Cupping Therapy</h3>
          <ConsistentImg src="/images/cupping.webp" alt="Cupping therapy with glass cups" />
          <p>
            <b>Cupping</b> uses negative pressure to lift tissue, open pores, increase circulation, and move qi and blood. 
            It is used for musculoskeletal pain, myofascial restrictions, respiratory infections (especially at early stage), allergies, digestive complaints, and detoxification. 
            Cupping marks are subcutaneous petechiae/ecchymosis, reflecting stagnation or toxin clearance, and fade in a few days.
          </p>
          <ul>
            <li>
              <b>Bamboo cupping:</b> Traditional, heat-retentive, less common in modern clinics due to sanitation limits.
            </li>
            <li>
              <b>Glass fire cupping:</b> Standard in professional practice; offers strong, even suction. Best for moving cupping (sliding cups) along the back, abdomen, and large muscle groups.
            </li>
            <li>
              <b>Suction/pump cupping:</b> Plastic cups with adjustable suction, used in settings where fire is not practical.
            </li>
            <li>
              <b>Silicone cupping:</b> Best for delicate areas (face, forearms, wrists) or self-treatment. Gentlest suction, ideal for pediatric, geriatric, or sensitive patients.
            </li>
          </ul>
          <p>
            <b>Indications:</b> Pain with stagnation, muscle tightness, cough, asthma, common cold (especially at onset), and as an adjunct to manual therapy. 
            <b>Contraindications:</b> Broken skin, high fever, bleeding disorders, patient refusal, or pregnancy over abdomen/lower back.
          </p>

          {/* Moxibustion */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Moxibustion</h3>
          <ConsistentImg src="/images/moxibustion.webp" alt="Moxibustion over acupuncture points" />
          <p>
            <b>Moxibustion</b> involves burning mugwort (Ai Ye) to warm acupuncture points, channels, and the body. It dispels cold, alleviates pain, boosts immune function, and supports yang qi. Used for chronic pain, menstrual disorders, digestive issues, fatigue, certain breech pregnancies, and prevention of seasonal illness.
          </p>
          <ul>
            <li>Direct (rice grain moxa): Tiny cones burned on the skin (with protection).</li>
            <li>Indirect: Moxa sticks, warming needles, or herbal moxa boxes.</li>
          </ul>

          {/* Tuina */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Tuina (Medical Manual Therapy)</h3>
          <ConsistentImg src="/images/tuina.webp" alt="Tuina massage" />
          <p>
            <b>Tuina</b> integrates massage, acupressure, joint mobilization, stretching, and manipulation. It addresses musculoskeletal pain, sports injuries, headaches, digestive complaints, pediatric issues, and more. Pediatric tuina is gentle and effective for common childhood concerns.
          </p>

          {/* Herbal Medicine */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Chinese Herbal Medicine</h3>
          <ConsistentImg src="/images/herbalmedicine.webp" alt="Chinese herbs" />
          <p>
            <b>Chinese herbal medicine</b> uses hundreds of botanicals, minerals, and some animal substances, most often in synergistic formulas. Herbs are selected for their energetic properties (temperature, flavor, meridian entry) and combined to treat complex patterns. Available as decoctions, powders, pills, tinctures, and topicals.
          </p>
          <ul>
            <li>Classical formulas (e.g., <i>Gui Zhi Tang, Xiao Yao San, Liu Wei Di Huang Wan</i>).</li>
            <li>Modern formulas adapted for contemporary diseases.</li>
            <li>Herbs can address acute and chronic disease, support immunity, recovery, fertility, mental health, and more.</li>
          </ul>
          <p>
            Practitioners are trained to consider herb-drug interactions, toxicity, allergies, and to monitor for side effects.
          </p>

          {/* Nutrition */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>TCM Nutrition & Dietetics</h3>
          <ConsistentImg src="/images/nutrition.webp" alt="TCM diet therapy" />
          <p>
            Food is medicine in TCM. Foods are classified by flavor, temperature, and organ affinity. Diet is individualized based on constitution, climate, season, and presenting pattern. Warming foods are given for cold and deficiency; cooling, moistening foods for heat or dryness; damp-producing foods are avoided when resolving phlegm or digestive stagnation.
          </p>
          <ul>
            <li>Emphasis on cooked foods, seasonal eating, and moderation.</li>
            <li>Therapeutic diets for pregnancy, post-partum, chronic illness, and recovery.</li>
          </ul>

          {/* Qigong/Tai Chi */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.17em" }}>Qigong & Tai Chi</h3>
          <ConsistentImg src="/images/taichi.webp" alt="Qigong exercise outdoors" />
          <p>
            Qigong and Tai Chi are movement, breath, and meditative practices that cultivate and harmonize qi, improve balance and flexibility, reduce stress, and support mental and physical health. Used for prevention, rehabilitation, and chronic disease management.
          </p>

          {/* Other Modalities */}
          <h3 className="tcm-subheading" style={{ ...subHeadingStyle, color: COLORS.backgroundRed, fontSize: "1.14em" }}>Other Modalities</h3>
          <ConsistentImg src="/images/tcm-overview.webp" alt="Other modalities" />
          <ul>
            <li>
              <b>Gua Sha:</b> Scraping therapy to release muscle tension, boost circulation, and treat acute colds or fevers.
            </li>
            <li>
              <b>External herbal applications:</b> Plasters, balms, washes, poultices for pain, trauma, or skin conditions.
            </li>
            <li>
              <b>Heat therapy:</b> Infrared lamps, hot stones, herbal compresses.
            </li>
            <li>
              <b>Bloodletting:</b> Minor controlled bleeding for acute stagnation or heat (rare in the West, still used in Asia).
            </li>
            <li>
              <b>Ear seeds, magnets, acupressure:</b> Non-invasive adjuncts for ongoing stimulation and self-care.
            </li>
          </ul>
        </section>

        {/* SAFETY, TRAINING, AND INTEGRATION */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>Safety, Professional Training, and Integration</h2>
          <ConsistentImg src="/images/clinic.webp" alt="Safety and Training" />
          <p>
            TCM is practiced by highly trained professionals. Comprehensive programs are 4-5 years in length (Master’s or Doctorate), covering classical and modern theory, biomedicine, clinical safety, and thousands of hours of supervised clinical practice. Students learn to recognize medical emergencies (“red flags”), avoid herb-drug interactions, and refer when necessary.
          </p>
          <p>
            In the U.S., most states require graduation from an accredited program (ACAOM), passage of national board exams (NCCAOM), and continuing education. Some states allow acupuncture-only licensure after 2-3 year programs, which do <b>not</b> include herbal medicine or advanced internal medicine. Such practitioners may not be qualified to prescribe herbs or treat complex internal conditions. This distinction is important for patients seeking comprehensive TCM care.
          </p>
          <p>
            TCM practitioners often work in multidisciplinary teams, and integration with Western medicine is expanding in pain clinics, oncology, women’s health, mental health, and rehabilitation settings. Hospitals and academic centers increasingly offer acupuncture, herbal medicine, and related therapies as part of integrative medicine.
          </p>
          <p>
            When performed by a licensed practitioner, TCM is safe and effective. Adverse effects are rare and generally mild (minor bruising, brief soreness, etc.). Clean needle technique and rigorous sanitation are standard. Herbal prescriptions are personalized and monitored for safety.
          </p>
        </section>

        {/* CONCLUSION */}
        <section className="tcm-section" style={sectionStyle}>
          <h2 className="tcm-subheading" style={subHeadingStyle}>Why Choose Chinese Medicine?</h2>
          <ConsistentImg src="/images/clinic.webp" alt="Modern TCM clinic" />
          <ul>
            <li>
              <b>Comprehensive and holistic:</b> TCM addresses body, mind, emotions, and spirit, treating root causes and symptoms together.
            </li>
            <li>
              <b>Personalized medicine:</b> Diagnosis and treatment are tailored to each person’s constitution, history, and pattern.
            </li>
            <li>
              <b>Effective for prevention and chronic disease:</b> TCM excels at prevention, chronic conditions, complex syndromes, recovery, and health optimization.
            </li>
            <li>
              <b>Safe and evidence-informed:</b> Licensed practitioners use time-tested methods and modern knowledge to maximize benefit and minimize risk.
            </li>
            <li>
              <b>Integrative and complementary:</b> TCM can be used alone or with Western medicine to improve outcomes, reduce side effects, and enhance quality of life.
            </li>
          </ul>
          <p>
            Whether you are a patient seeking a deeper understanding of your health, or a practitioner or student refining your clinical knowledge, TCM offers a rich, nuanced, and effective approach to medicine—one that continues to inspire healing and scholarship worldwide.
          </p>
        </section>
        <FooterCard />
      </main>
    </div>
  );
}