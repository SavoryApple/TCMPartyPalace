import React from "react";

/**
 * HerbCategoryInfo
 * In-depth, reference-rich explanations for each TCM herb subcategory.
 * Each section gives context, clinical rationale, diagnostic features, Western correlations, and practical significance for practitioners and students.
 * References (see bottom): Bensky & Gamble (Chinese Herbal Medicine: Materia Medica), Chen & Chen (Chinese Medical Herbology and Pharmacology), Shen-nong.com, AmericanDragon.com, BluePoppy.com, AcupunctureToday.com.
 */

const CATEGORY_STYLES = {
  h2: {
    color: "#3B4461",
    fontWeight: 900,
    fontSize: "1.35em",
    marginTop: "2em",
  },
  h3: {
    fontWeight: 900,
    color: "#A52439",
    fontSize: "1.08em",
    marginTop: "1em",
  },
};

const DEFAULT_STYLE = {
  background: "#FFF7E3",
  borderRadius: "1.1em",
  padding: "2.2em 1.2em",
  maxWidth: "850px",
  margin: "2em auto",
  boxShadow: "0 2px 20px #3B4461CC",
  fontFamily: '"Noto Serif SC","Songti SC","KaiTi",serif',
};

export default function HerbCategoryInfo({ style = {} }) {
  const mergedStyle = { ...DEFAULT_STYLE, ...style };

  return (
    <section style={mergedStyle}>
      <h1 style={{
        color: "#3B4461",
        fontWeight: 900,
        marginBottom: "1.2em",
        fontSize: "2em",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        Chinese Herbal Categories Reference Guide
      </h1>

      {/* Release the Exterior */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Release the Exterior</h2>
      <h3 style={CATEGORY_STYLES.h3}>Warming Herbs</h3>
      <p>
        Warming herbs that release the exterior are used to treat wind-cold invasions, typified by chills, mild fever, headache, body aches, and the absence of sweating. These herbs promote sweating and help expel external pathogens, supporting the body's defensive Qi. Clinical applications include early-stage cold or flu, sinus congestion, and muscle stiffness due to cold exposure. Many have diaphoretic and mild analgesic actions; common examples are cinnamon twig, ginger, and ephedra.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Cooling Herbs</h3>
      <p>
        Cooling herbs are used when external wind-heat invades, presenting with higher fever, sore throat, thirst, and sweating. These herbs help vent heat from the exterior and clear pathogenic factors, often with anti-inflammatory and antipyretic effects. Examples include peppermint, mulberry leaf, and chrysanthemum. They are suitable for early-stage viral infections, allergic reactions, and febrile illnesses with pronounced heat signs.
      </p>

      {/* Clear Heat */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Clear Heat</h2>
      <h3 style={CATEGORY_STYLES.h3}>Drain Fire</h3>
      <p>
        Herbs that drain fire are potent heat-clearing substances targeting high fever, irritability, thirst, and rapid pulse. They are used in acute febrile diseases, inflammatory conditions, and some metabolic disorders. These herbs often reduce body temperature and inflammation, and may correlate with Western antipyretics and anti-inflammatories. Examples include gypsum, gardenia, and rhubarb.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Cool Blood</h3>
      <p>
        Herbs that cool the blood treat disorders where heat has entered the blood level, causing bleeding, rashes, delirium, and high fever. These herbs are used for hematuria, epistaxis, skin eruptions, and severe febrile illnesses. They may have hemostatic and anti-inflammatory effects. Notable examples include raw rehmannia, moutan, and red peony root.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Deficiency Heat</h3>
      <p>
        Deficiency heat-clearing herbs address heat arising from Yin deficiency, characterized by low-grade fever, night sweats, hot flashes, and restlessness. These herbs nourish Yin and clear lingering heat, supporting chronic inflammatory and menopausal syndromes. Examples include Qing Hao (sweet wormwood), Di Gu Pi (lycium bark), and Bai Wei.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Dry Dampness</h3>
      <p>
        Herbs that clear heat and dry dampness are used when damp-heat accumulates in the body, causing jaundice, dysentery, urinary difficulty, and skin disorders. These herbs have drying, heat-clearing, and antimicrobial properties, often used in infectious diarrhea, hepatitis, and eczema. Examples include Huang Qin (scutellaria), Huang Lian (coptis), and Huang Bai (phellodendron).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Resolve Toxicity</h3>
      <p>
        Herbs that resolve toxicity treat severe infections, abscesses, skin sores, and systemic toxicity. These herbs possess strong antimicrobial, anti-inflammatory, and detoxifying effects and are used for boils, carbuncles, and certain viral or bacterial infections. Examples include Jin Yin Hua (honeysuckle), Lian Qiao (forsythia), and Pu Gong Ying (dandelion).
      </p>

      {/* Downward Draining */}
      <h2 style={CATEGORY_STYLES.h2}>Downward Draining Herbs</h2>
      <h3 style={CATEGORY_STYLES.h3}>Purgatives</h3>
      <p>
        Purgative herbs strongly promote bowel movements to expel accumulation of heat, food, or toxins. Used for severe constipation, acute abdomen, and some febrile diseases, they act similarly to strong laxatives in Western medicine. Examples include Da Huang (rhubarb root) and Mang Xiao (mirabilite).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Moist Laxatives</h3>
      <p>
        Moist laxatives gently lubricate the intestines to relieve dry constipation, especially in elderly or weak patients. They are milder than purgatives and often used in chronic cases. Examples are Huo Ma Ren (hemp seed) and Yu Li Ren (prunus seed).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Harsh Expellents</h3>
      <p>
        Harsh expellents forcefully drive out water accumulation and severe stagnation, used for edema, ascites, and pleural effusion. These herbs are strong and often toxic, reserved for life-threatening situations. Examples include Gan Sui (kan-sui root), Qian Niu Zi (morning glory seed), and Ba Dou (croton seed).
      </p>

      {/* Drain Dampness */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Drain Dampness</h2>
      <h3 style={CATEGORY_STYLES.h3}>Drain Dampness</h3>
      <p>
        These herbs promote urination to resolve edema, urinary difficulty, and damp accumulation. They are widely used in nephrotic syndrome, ascites, and urinary tract infections. Many also lower blood pressure and support kidney function. Examples include Fu Ling (poria), Zhu Ling, and Ze Xie (water plantain).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Aromatically Transform Dampness</h3>
      <p>
        Aromatic damp-transforming herbs awaken the Spleen and transform dampness, treating digestive stagnation, nausea, and bloating. Their volatile oils stimulate digestion and absorption, helpful in chronic digestive complaints and food retention. Examples are Huo Xiang (patchouli), Pei Lan (eupatorium), and Bai Dou Kou (round cardamom).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Dispel Wind-Dampness</h3>
      <p>
        Herbs that dispel wind-dampness treat musculoskeletal pain, joint stiffness, and heaviness. They are used for bi syndrome (arthritis, rheumatism), often in combination with tonics or blood movers. Examples include Du Huo (angelica root), Qin Jiao (gentiana), and Sang Ji Sheng (mistletoe).
      </p>

      {/* Transform Phlegm */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Transform Phlegm</h2>
      <h3 style={CATEGORY_STYLES.h3}>Cooling to Transform Phlegm-Heat</h3>
      <p>
        These herbs clear heat and transform thick, yellow, sticky phlegm in the lungs and digestive tract. They have expectorant, anti-inflammatory, and sometimes antitussive actions, used in bronchitis, pneumonia, and phlegm-heat syndromes. Examples include Qian Hu (hogfennel root), Chuan Bei Mu (fritillaria bulb), and Gua Lou (trichosanthes fruit).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warming to Transform Phlegm-Cold</h3>
      <p>
        Herbs in this group warm and dry excess moisture, transforming cold, watery phlegm. They are used for chronic cough with clear sputum, digestive phlegm, and weak metabolic function. Notable examples include Ban Xia (pinellia), Jie Geng (platycodon), and Bai Qian.
      </p>

      {/* Relieve Cough and Wheeze */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Relieve Cough and Wheeze</h2>
      <h3 style={CATEGORY_STYLES.h3}>Relieve Cough and Wheeze</h3>
      <p>
        These herbs address cough and wheezing by descending Lung Qi, transforming phlegm, moistening dryness, or clearing heat. They are used in asthma, bronchitis, pertussis, and allergic cough. Examples include Xing Ren (apricot seed), Zi Wan (aster root), and Bai Bu (stemona root).
      </p>

      {/* Emetics */}
      <h2 style={CATEGORY_STYLES.h2}>Emetics</h2>
      <h3 style={CATEGORY_STYLES.h3}>Emetic Herbs</h3>
      <p>
        Emetic herbs induce vomiting to expel phlegm, food, or toxins from the upper GI tract, reserved for severe obstruction or poisoning. This category is rarely used and requires careful supervision. Examples are Gua Di (melon stalk) and Lu Feng Fang (honeycomb).
      </p>

      {/* Relieve Food Stagnation */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Relieve Food Stagnation</h2>
      <h3 style={CATEGORY_STYLES.h3}>Relieve Food Stagnation</h3>
      <p>
        These herbs promote digestion, reduce bloating, and resolve food retention in the stomach and intestines. They are used for indigestion, overeating, and pediatric digestive disorders. Examples include Shan Zha (hawthorn fruit), Mai Ya (barley sprout), and Ji Nei Jin (chicken gizzard lining).
      </p>

      {/* Regulate Qi */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Regulate Qi</h2>
      <h3 style={CATEGORY_STYLES.h3}>Regulate the Qi</h3>
      <p>
        Herbs that regulate Qi move stagnation, ease pain, and support digestive and respiratory function. They treat distension, bloating, chest tightness, and emotional constraint. Examples include Chen Pi (tangerine peel), Xiang Fu (cyperus), and Mu Xiang (costus root).
      </p>

      {/* Regulate Blood */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Regulate Blood</h2>
      <h3 style={CATEGORY_STYLES.h3}>Stop Bleeding</h3>
      <p>
        Stop-bleeding herbs treat both acute and chronic hemorrhagic conditions, using mechanisms such as cooling blood, invigorating blood, or astringency. Applications include epistaxis, uterine bleeding, hematuria, and trauma. Examples include San Qi (notoginseng), Pu Huang (cattail pollen), and Bai Mao Gen (imperata root).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Invigorate Blood</h3>
      <p>
        Herbs that invigorate blood promote circulation, relieve pain, and dissolve stasis. Used for trauma, dysmenorrhea, chronic pain, and cardiovascular disease, many also have anti-inflammatory and tissue-repair actions. Examples include Chuan Xiong (ligusticum), Dan Shen (salvia), and Yan Hu Suo (corydalis).
      </p>

      {/* Warm the Interior */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Warm the Interior</h2>
      <h3 style={CATEGORY_STYLES.h3}>Warm the Interior</h3>
      <p>
        Warming herbs strengthen the body's Yang and dispel cold from the interior, treating cold-induced pain, digestive insufficiency, and cold limbs. Applications include cold abdominal pain, diarrhea, and hypothyroid-like syndromes. Examples include Fu Zi (aconite), Gan Jiang (dried ginger), and Rou Gui (cinnamon bark).
      </p>

      {/* Tonify Qi */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Tonify Qi</h2>
      <h3 style={CATEGORY_STYLES.h3}>Tonify Qi</h3>
      <p>
        Qi-tonifying herbs replenish vital energy, support immunity, and enhance organ function. Indications are fatigue, weakness, poor appetite, and chronic illness. Some also have adaptogenic or immune-modulating effects. Notable examples are Ren Shen (ginseng), Dang Shen (codonopsis), and Huang Qi (astragalus).
      </p>

      {/* Tonify Blood */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Tonify Blood</h2>
      <h3 style={CATEGORY_STYLES.h3}>Tonify Blood</h3>
      <p>
        Blood-tonifying herbs nourish and invigorate blood, treating anemia, pallor, dizziness, and menstrual disorders. They support recovery from illness, postpartum depletion, and chronic blood loss. Examples include Shu Di Huang (prepared rehmannia), Dang Gui (angelica sinensis), and Bai Shao (white peony).
      </p>

      {/* Tonify Yin */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Tonify the Yin</h2>
      <h3 style={CATEGORY_STYLES.h3}>Tonify Yin</h3>
      <p>
        Yin-tonifying herbs replenish fluids, nourish tissues, and calm internal heat. Used for dryness, night sweats, hot flashes, and chronic inflammatory conditions, they are vital for convalescence and aging. Examples include Mai Men Dong (ophiopogon), Tian Men Dong (asparagus root), and Nu Zhen Zi (ligustrum).
      </p>

      {/* Tonify Yang */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Tonify the Yang</h2>
      <h3 style={CATEGORY_STYLES.h3}>Tonify Yang</h3>
      <p>
        Yang-tonifying herbs restore warmth, sexual vitality, and physical strength. Indications include impotence, infertility, cold limbs, and edema. Many support kidney and endocrine function. Examples are Lu Rong (deer antler), Yin Yang Huo (epimedium), and Du Zhong (eucommia).
      </p>

      {/* Stabilize and Bind */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Stabilize and Bind</h2>
      <h3 style={CATEGORY_STYLES.h3}>Stabilize and Bind</h3>
      <p>
        These herbs prevent leakage of fluids and essence, treating chronic diarrhea, excessive sweating, urinary incontinence, and seminal emission. They act through astringency and tonification, suitable for chronic and constitutional deficiency syndromes. Examples include Shan Zhu Yu (cornus fruit), Wu Wei Zi (schisandra), and Lian Zi (lotus seed).
      </p>

      {/* Calm the Shen */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Calm the Shen</h2>
      <h3 style={CATEGORY_STYLES.h3}>Anchor/Settle/Sedate</h3>
      <p>
        Herbs that anchor, settle, and sedate calm the spirit by weighing down the mind and subduing anxiety, agitation, or insomnia. They often contain heavy minerals or shells and are used in severe cases of restlessness or mania. Examples include Long Gu (dragon bone), Mu Li (oyster shell), and Zhen Zhu (pearl).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Nourish Heart</h3>
      <p>
        Heart-nourishing herbs calm the spirit by nourishing blood and Yin, treating insomnia, irritability, palpitations, and mild anxiety. They are gentle and suitable for chronic emotional disturbances. Examples are Suan Zao Ren (ziziphus), Bai Zi Ren (arborvitae seed), and He Huan Pi (albizzia bark).
      </p>

      {/* Open the Orifices */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Open the Orifices</h2>
      <h3 style={CATEGORY_STYLES.h3}>Open Orifices</h3>
      <p>
        These herbs restore consciousness and treat coma, collapse, or severe mental disturbance by opening sensory channels and dispersing phlegm or heat. They are aromatic and potent, often reserved for emergencies. Examples include She Xiang (musk), Bing Pian (borneol), and Shi Chang Pu (acorus).
      </p>

      {/* Extinguish Wind/Stop Tremors */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Extinguish Wind/Stop Tremors</h2>
      <h3 style={CATEGORY_STYLES.h3}>Extinguish Wind/Stop Tremors</h3>
      <p>
        Extinguishing wind herbs treat internal wind manifested as tremors, convulsions, spasms, and dizziness. They are used in neurologic disorders, stroke recovery, and pediatric convulsions. Examples include Gou Teng (uncaria), Tian Ma (gastrodia), and Bai Ji Li (tribulus).
      </p>

      {/* Expel Parasites */}
      <h2 style={CATEGORY_STYLES.h2}>Herbs that Expel Parasites</h2>
      <h3 style={CATEGORY_STYLES.h3}>Expel Parasites</h3>
      <p>
        Anti-parasitic herbs eliminate intestinal worms and protozoa, supporting digestion and absorption. Indications include abdominal pain, diarrhea, malnutrition, and visible parasites. Examples include Shi Jun Zi (quisqualis), Ku Lian Pi (chinaberry root bark), and Bing Lang (areca nut).
      </p>

      {/* Topical Herbs */}
      <h2 style={CATEGORY_STYLES.h2}>Topical Herbs</h2>
      <h3 style={CATEGORY_STYLES.h3}>Topicals</h3>
      <p>
        Topical herbs are applied externally for skin infections, wounds, burns, inflammation, and pain. They have antimicrobial, anti-inflammatory, and hemostatic effects, and may be used for boils, abscesses, sprains, and chronic wounds. Examples include Bai Zhi (angelica dahurica), Liu Huang (sulfur), and Bing Pian (borneol).
      </p>

      {/* Obsolete Substances */}
      <h2 style={CATEGORY_STYLES.h2}>Obsolete Substances</h2>
      <h3 style={CATEGORY_STYLES.h3}>Obsolete</h3>
      <p>
        Obsolete substances are herbs or materials no longer used due to toxicity, endangered status, or lack of efficacy. Some were historically important, such as realgar, mercury, or rhinoceros horn, but are now replaced by safer alternatives. This category is important for understanding historical materia medica and current safety standards.
      </p>

      <hr style={{margin:"2em 0"}} />
      <div style={{fontSize:".97em", color:"#44210A", marginBottom:"0.6em"}}>
        <strong>References & further reading:</strong>
        <ul>
          <li>Bensky, D., & Gamble, A. Chinese Herbal Medicine: Materia Medica, 3rd Ed.</li>
          <li>Chen, J., & Chen, T. Chinese Medical Herbology and Pharmacology.</li>
          <li><a href="https://www.americandragon.com/" target="_blank" rel="noopener noreferrer">American Dragon</a></li>
          <li><a href="https://shen-nong.com/" target="_blank" rel="noopener noreferrer">Shen-nong.com</a></li>
          <li><a href="https://acupuncturetoday.com/" target="_blank" rel="noopener noreferrer">Acupuncture Today</a></li>
          <li><a href="https://bluepoppy.com/" target="_blank" rel="noopener noreferrer">BluePoppy.com</a></li>
        </ul>
      </div>
    </section>
  );
}