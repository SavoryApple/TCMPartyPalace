import React from "react";

/**
 * FormulaCategoryInfo
 * In-depth, reference-rich explanations for each TCM formula subcategory.
 * Each section gives context, clinical rationale, diagnostic features, Western correlations, and practical significance for practitioners.
 * References (see bottom): Bensky & Barolet (Formulas & Strategies), Chen & Chen (Chinese Medical Herbology and Pharmacology), Shen-nong.com, AmericanDragon.com, AcupunctureToday.com, BluePoppy.com.
 */

const CATEGORY_STYLES = {
  h2: {
    color: "#7C5CD3",
    fontWeight: 900,
    fontSize: "1.4em",
    marginTop: "2em",
  },
  h3: {
    fontWeight: 900,
    color: "#A52439",
    fontSize: "1.1em",
    marginTop: "1em",
  },
};

const DEFAULT_STYLE = {
  background: "#F9E8C2",
  borderRadius: "1.1em",
  padding: "2.2em 1.2em",
  maxWidth: "850px",
  margin: "2em auto",
  boxShadow: "0 2px 20px #B38E3FCC",
  fontFamily: '"Noto Serif SC","Songti SC","KaiTi",serif',
};

export default function FormulaCategoryInfo({ style = {} }) {
  const mergedStyle = { ...DEFAULT_STYLE, ...style };

  return (
    <section style={mergedStyle}>
      <h1 style={{
        color: "#9A2D1F",
        fontWeight: 900,
        marginBottom: "1.2em",
        fontSize: "2em",
        textAlign: "center",
        letterSpacing: "-1px",
      }}>
        Chinese Herbal Formula Categories Reference Guide
      </h1>

      {/* Harmonize */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Harmonize</h2>
      <h3 style={CATEGORY_STYLES.h3}>Harmonize Lesser Yang-stage Disorders (Shao Yang)</h3>
      <p>
        The harmonization of Shao Yang-stage disorders is a central concept in classical Chinese medicine, described as conditions where the pathogenic factor is trapped midway between the body's exterior defenses and the interior organs. This "pivot" phase often presents as alternating chills and fever, chest or rib-side discomfort, bitter taste, dry throat, dizziness, and digestive symptoms such as nausea and poor appetite. These presentations may persist for weeks, especially after improper treatment, and often signal the body's inability to resolve infection or inflammatory processes. Formulas in this category gently regulate the interaction between defensive (Wei) Qi and nutrient (Ying) Qi, restoring flow and resolution without forceful expulsion. In contemporary clinical practice, this approach is relevant for relapsing viral illnesses, some autoimmune conditions, and malaria-like syndromes. Diagnosis integrates symptoms, tongue and pulse findings, and disease progression.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Harmonize Stomach and Intestines</h3>
      <p>
        Disorders requiring harmonization of the stomach and intestines often involve complex, mixed patterns such as simultaneous heat and cold, excess and deficiency, or rebellion and stagnation. Common symptoms include epigastric fullness, abdominal distension, nausea, vomiting, borborygmus, and irregular stools. These patterns frequently develop after excessive use of purgatives, antibiotics, or improper diet, disrupting the natural rhythm of the digestive tract. The goal of harmonizing formulas is to restore normal digestive function by modulating conflicting pathogenic influences and revitalizing the organ's capacity for transformation and transportation. In modern settings, these formulas are useful for functional dyspepsia, post-infectious IBS, and chronic gastritis. Diagnostic clues include a mixed tongue coating, variable pulse, and fluctuating symptoms.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Harmonize Liver and Spleen</h3>
      <p>
        Harmonization between the Liver and Spleen is vital for conditions where emotional stress or Qi stagnation disrupts digestion and assimilation. The Liver governs the smooth flow of Qi and emotions, while the Spleen is the root of postnatal Qi and blood. When Liver Qi becomes constrained—due to stress, frustration, or irregular lifestyle—it impairs Spleen transformation, resulting in abdominal pain, bloating, loss of appetite, loose stools, irritability, and menstrual irregularity. This pattern is increasingly common in modern life, correlating with psychosomatic GI disorders, IBS, PMS, and stress-related menstrual complaints. Diagnostic features include wiry pulse, pale tongue, and a combination of digestive and emotional symptoms. Treatment aims to restore harmony by coursing Liver Qi and strengthening Spleen function.
      </p>

      {/* Tonify */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Tonify</h2>
      <h3 style={CATEGORY_STYLES.h3}>Tonify the Qi</h3>
      <p>
        Qi tonification addresses fundamental deficiency of the body's energetic resources. Manifestations include persistent fatigue, weak voice, shortness of breath, spontaneous sweating, poor appetite, and susceptibility to illness. These deficiencies can result from chronic disease, excess physical exertion, poor nutrition, aging, or prolonged emotional strain. Qi is the driving force behind all physiological movement and protection against pathogens. Tonifying formulas strengthen organ systems, support immune function, enhance assimilation of nutrients, and promote overall vitality. In Western medicine, similar principles apply to rehabilitation after illness, chronic fatigue syndrome, anemia, and convalescence. Diagnosis usually combines constitutional symptoms, a weak or empty pulse, and a pale tongue.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Tonify the Blood</h3>
      <p>
        Blood tonification is central to addressing symptoms of poor tissue nourishment such as pallor, dizziness, palpitations, dry skin and hair, insomnia, and menstrual irregularities. Blood in TCM represents both the physical substance and its nourishing capacity for organs, mind, and spirit. Deficiency may arise from hemorrhage, chronic disease, postpartum depletion, or digestive weakness. Tonifying blood supports physical and mental resilience, reproductive health, and skin integrity. Western analogs include iron-deficiency anemia, postpartum fatigue, and nutritional deficits. Typical diagnostic findings include a pale tongue, thin pulse, and brittle nails.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Tonify the Qi and Blood Together</h3>
      <p>
        Qi and Blood are interdependent; their simultaneous depletion results in profound fatigue, pallor, palpitations, poor immunity, dizziness, and delayed recovery from illness, injury, or childbirth. Tonification of both is required when patients show weakness in mental, physical, and hematologic domains, often following major surgeries or prolonged illnesses. Such formulas enhance overall resilience, accelerate healing, and restore robust health. Diagnosis involves both Qi deficiency (weakness, fatigue) and Blood deficiency (pallor, dizziness, scanty menses).
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Tonify the Yin</h3>
      <p>
        Yin tonification is indicated when the body's cooling, moistening, and nourishing functions decline. Symptoms include dryness of skin and mucous membranes, night sweats, insomnia, irritability, thirst, and heat in the palms and soles. Chronic Yin deficiency is common with aging, after febrile diseases, or in conditions of chronic inflammation. Restoration of Yin promotes tissue repair, hormonal balance, and neurological stability. In biomedical terms, this pattern is relevant to menopause, Sjögren syndrome, or chronic dehydration states. Diagnosis includes a red, peeled tongue and thin, rapid pulse.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Tonify the Yang</h3>
      <p>
        Yang tonification targets deficiency in warmth, metabolic drive, and functional activity. Signs include cold limbs, chronic fatigue, edema, low libido, infertility, and urinary problems. Yang deficiency can result from aging, chronic illness, constitutional weakness, or excessive exposure to cold environments. Restoration of Yang improves circulation, metabolism, sexual function, and organ vitality. Western equivalents include hypothyroidism, adrenal insufficiency, and certain kidney disorders. Diagnosis is based on pale, swollen tongue, deep slow pulse, and pronounced cold symptoms.
      </p>

      {/* Invigorate Blood */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Invigorate Blood</h2>
      <h3 style={CATEGORY_STYLES.h3}>Dispel Blood Stasis</h3>
      <p>
        Blood stasis is a foundational pathology in TCM, describing impaired circulation that causes sharp, fixed pain, masses, bruising, and menstrual irregularities. Etiologies include trauma, chronic inflammation, Qi stagnation, cold invasion, or retention of pathogenic factors. Invigorating blood removes obstructions, dissolves masses, promotes healing, and relieves pain. These formulas are vital in treating chronic pain syndromes, fibroids, endometriosis, and post-traumatic swelling. Diagnosis includes a purple or dusky tongue, choppy pulse, and detailed pain history. Treatment relies on herbs that move blood, break up stasis, and support tissue repair.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warm Menses, Dispel Stasis</h3>
      <p>
        Menstrual disorders due to cold and blood stasis—such as delayed, scanty, or painful periods, infertility, and cold-induced abdominal pain—require warming and invigorating the blood. These formulas are used to improve uterine circulation, support fertility, and relieve pain. Etiologies often include cold exposure, constitutional cold, or chronic stagnation. Modern relevance includes dysmenorrhea, infertility, and endometriosis with cold uterine signs. Diagnosis includes cold sensation, abdominal pain relieved by warmth, and menstrual irregularity.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Treat Traumatic Injury</h3>
      <p>
        Traumatic injuries—fractures, sprains, contusions, post-surgical swelling—disrupt blood flow and tissue repair. Treatment focuses on promoting circulation, reducing inflammation, and accelerating healing. Herbal formulas in this subcategory are used for both acute and chronic injuries, often in conjunction with physical therapy, acupuncture, or conventional medicine. Diagnosis is based on injury history, swelling, bruising, and restricted mobility. Modern practice integrates these approaches for athletes, accident victims, and surgical recovery.
      </p>

      {/* Expel Wind */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Expel Wind</h2>
      <h3 style={CATEGORY_STYLES.h3}>From Skin and Channels</h3>
      <p>
        Wind is a metaphor for sudden, changing, and migratory symptoms—such as rashes, itching, spasms, and numbness. External wind invades the skin and channels, leading to allergic reactions, eczema, urticaria, and musculoskeletal symptoms. Expelling wind restores normal skin and channel function, often in tandem with other treatments for inflammation or infection. Diagnosis is based on rapid onset, migratory symptoms, and a floating pulse. Formulas may also address environmental influences such as seasonal changes and exposure to drafts.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Extinguish Internal Wind</h3>
      <p>
        Internal wind arises from extreme heat, Yin deficiency, or Liver dysfunction, and manifests as tremors, convulsions, dizziness, and stroke. These formulas calm the nervous system, reduce involuntary movements, and protect against complications. Relevant conditions include epilepsy, Parkinson's disease, essential tremor, and post-stroke syndromes. Diagnosis involves involuntary movement, tongue and pulse changes, and history of neurological events. Treatment combines calming, nourishing, and anti-inflammatory strategies.
      </p>

      {/* Topicals */}
      <h2 style={CATEGORY_STYLES.h2}>Topicals: Topical Patents for External Use</h2>
      <p>
        Topical herbal formulas are applied directly to the skin for treating wounds, infections, burns, inflammation, and pain. They can provide antimicrobial, anti-inflammatory, hemostatic, and analgesic effects. Applications include cuts, abrasions, contusions, sprains, and skin infections. Topical use is often combined with oral formulas or conventional treatments for enhanced healing and symptom relief. Diagnosis relies on visual inspection and detailed symptom history. Modern usage extends to sports injuries, chronic wounds, and dermatological conditions.
      </p>

      {/* Expel Dampness */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Expel Dampness</h2>
      <h3 style={CATEGORY_STYLES.h3}>Promote Urination and Leach Out Dampness</h3>
      <p>
        Dampness is excess fluid accumulation causing heaviness, edema, urinary difficulty, digestive sluggishness, and joint pain. Promoting urination helps resolve these symptoms and supports fluid metabolism. Etiologies include poor digestion, climate, organ dysfunction, and post-infectious states. Diagnosis includes swollen tongue, slippery pulse, and heaviness. Dampness is often implicated in chronic fatigue, nephrotic syndrome, and edema.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Transform Damp Turbidity</h3>
      <p>
        Damp turbidity refers to digestive sluggishness, bloating, loose stools, and a sense of fullness. Transformation improves GI motility, absorption, and reduces the burden of pathogenic dampness. Etiologies include poor diet, weak digestion, and environmental dampness. Diagnosis is based on greasy tongue coating, fullness, and food retention symptoms.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Clear Damp Heat</h3>
      <p>
        Damp-heat leads to inflammatory urinary, genital, or skin disorders marked by discharge, itching, pain, and redness. Clearing damp-heat resolves infection, inflammation, and discomfort. Etiologies include poor hygiene, infections, and excessive heat exposure. Diagnosis includes yellow tongue coating, rapid pulse, burning pain, and discharge. Damp-heat is a common pattern in UTIs, prostatitis, and eczema.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warm and Transform Water</h3>
      <p>
        Cold-induced fluid retention, such as chronic edema, urinary difficulty, or ascites, is addressed by warming Yang and promoting water metabolism. Etiologies include Yang deficiency, exposure to cold, or organ insufficiency. Diagnosis involves cold signs, fluid retention, and a deep, slow pulse. Warm and transform water formulas are relevant for renal and cardiac insufficiency with fluid overload.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Dispel Wind-Damp</h3>
      <p>
        Wind-damp causes joint pain, stiffness, heaviness, and migratory symptoms, often seen in arthritis, rheumatism, and chronic musculoskeletal disorders. Formulas dispel dampness and unblock channels to relieve pain and restore mobility. Etiologies include environmental dampness, trauma, and underlying deficiency. Diagnosis is based on migratory joint pain, weather sensitivity, and heavy limbs.
      </p>

      {/* Treat Dryness */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Treat Dryness</h2>
      <h3 style={CATEGORY_STYLES.h3}>Gently Disperse and Moisten</h3>
      <p>
        External dryness affects the lungs and skin, resulting in dry cough, throat discomfort, and mild bronchitis. Moistening strategies restore fluids, soothe mucous membranes, and support respiratory health. Etiologies include dry climate, excessive heat, and dehydration. Diagnosis is based on dry tongue, hacking cough, and hoarse voice.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Enrich Yin and Moisten Dryness</h3>
      <p>
        Chronic dryness from Yin deficiency leads to persistent dry cough, mouth, and throat, often following chronic lung disease or post-infectious states. Formulas enrich fluids, nourish Yin, and support tissue repair. Etiologies include aging, chronic illness, and prolonged febrile disease. Diagnosis features a red, dry tongue and thin pulse.
      </p>

      {/* Stop Bleeding */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Stop Bleeding</h2>
      <h3 style={CATEGORY_STYLES.h3}>Clear Heat and Stop Bleeding</h3>
      <p>
        Bleeding due to excess heat manifests as nosebleeds, hematuria, GI bleeding, and uterine bleeding. Treatment focuses on cooling blood, clearing heat, and stopping hemorrhage. Etiologies include infections, inflammation, and heatstroke. Diagnosis includes red, rapid pulse and active bleeding.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Tonify and Stop Bleeding</h3>
      <p>
        Chronic bleeding due to deficiency, such as uterine or GI bleeding with fatigue, requires tonification to support clotting and tissue repair. Etiologies include weak Qi, blood deficiency, or chronic illness. Diagnosis includes pale tongue, weak pulse, and long-standing bleeding.
      </p>

      {/* Stabilize and Bind */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Stabilize and Bind</h2>
      <h3 style={CATEGORY_STYLES.h3}>Stabilize Exterior and Lungs</h3>
      <p>
        These formulas prevent unwanted leakage of fluids, such as spontaneous sweating, chronic cough, or recurrent colds, by stabilizing surface defenses and lung function. Etiologies include Qi deficiency, weakened Wei Qi, or chronic respiratory compromise. Diagnosis is frequent sweating, vulnerability to infections, and a weak pulse.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Stabilize and Bind Intestines</h3>
      <p>
        Chronic diarrhea and dysentery are treated by binding and stabilizing the intestines and restoring absorption. Etiologies include Spleen deficiency, chronic infection, and food allergies. Diagnosis is frequent loose stools and poor digestion.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Stabilize Kidneys</h3>
      <p>
        Stabilizing the kidneys addresses leakage syndromes such as excessive urination, spermatorrhea, and nocturnal emissions, by strengthening the lower burner and consolidating essence. Etiologies include congenital weakness, aging, and hormonal imbalances. Diagnosis is urinary frequency, sexual weakness, and night sweats.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Stabilize the Womb</h3>
      <p>
        These formulas help prevent miscarriage, uterine bleeding, or habitual abortion by tonifying and securing the pregnancy. Etiologies include Qi and blood deficiency, constitutional weakness, and trauma. Diagnosis is threatened miscarriage, spotting, and abdominal pain.
      </p>

      {/* Treat Phlegm */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Treat Phlegm</h2>
      <h3 style={CATEGORY_STYLES.h3}>Dry Dampness and Expel Phlegm</h3>
      <p>
        Phlegm impedes respiratory, digestive, and mental function. Drying and expelling phlegm addresses chronic bronchitis, metabolic syndrome, and digestive stasis. Etiologies include damp diet, weak digestion, and environmental humidity. Diagnosis is thick tongue coating and productive cough.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Clear Heat and Transform Phlegm</h3>
      <p>
        Heat-type phlegm causes yellow sputum, chest congestion, and infection. Clearing heat and transforming phlegm resolves inflammation and supports respiratory health. Etiologies include acute infections, smoking, and pollution. Diagnosis is yellow tongue coat, fever, and infection signs.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Moisten Dryness and Transform Phlegm</h3>
      <p>
        Dry-type phlegm is sticky, hard to expectorate, and worsened by dryness. Moistening and transforming phlegm supports recovery from dry cough and mild asthma. Etiologies include dry climate, Yin deficiency, and chronic illness. Diagnosis is dry tongue, hacking cough, and scanty sputum.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Dissipate Nodules</h3>
      <p>
        Phlegm nodules include goiter, lymph node swelling, and benign tumors. Dissipating nodules addresses hard, painless lumps formed by phlegm accumulation. Etiologies include chronic phlegm, metabolic dysfunction, and genetic predisposition. Diagnosis is palpable masses and local discomfort.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warm and Transform Cold Phlegm</h3>
      <p>
        Cold-type phlegm produces clear, watery sputum and sluggish digestion. Warming and transforming cold phlegm is used for chronic bronchitis and weak digestion, particularly in elderly or frail patients. Etiologies include cold exposure, aging, and Yang deficiency. Diagnosis is pale tongue and copious sputum.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Transform Phlegm and Extinguish Wind</h3>
      <p>
        Phlegm-wind causes cough, dizziness, and convulsions, often in neurological or respiratory diseases. Addressing both phlegm and wind is critical for restoring normal function and preventing complications. Etiologies include extreme heat, Yin deficiency, and chronic phlegm. Diagnosis is cough with twitching or dizziness.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Induce Vomiting to Discharge Phlegm</h3>
      <p>
        Rarely used, these formulas induce vomiting to clear stubborn phlegm from the throat or chest. This approach is reserved for severe obstruction, such as life-threatening respiratory distress or stroke with phlegm-blocked airways. Etiologies include chronic phlegm accumulation or acute blockage. Diagnosis is visible obstruction and severe distress.
      </p>

      {/* Expel Parasites */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Expel Parasites</h2>
      <h3 style={CATEGORY_STYLES.h3}>Expel Parasites</h3>
      <p>
        These formulas target intestinal parasites—roundworms, pinworms, tapeworms—using anti-parasitic and digestive support strategies. Indications include abdominal pain, diarrhea, malnutrition, and irritability. Etiologies include poor hygiene, contaminated food, and environmental exposure. Diagnosis is GI symptoms and, in some cases, visual identification of worms.
      </p>

      {/* Release Exterior */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Release the Exterior</h2>
      <h3 style={CATEGORY_STYLES.h3}>Release Wind Cold</h3>
      <p>
        These formulas treat acute viral or bacterial infections with chills, fever, aversion to cold, headache, and body aches. Release of wind-cold restores surface defenses and prevents deeper invasion. Etiologies include exposure to cold, weakened Wei Qi, and seasonal epidemics. Diagnosis is floating, tight pulse, clear nasal discharge, and sensitivity to wind and cold.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Release Wind Heat</h3>
      <p>
        Release wind-heat formulas address fever, sore throat, thirst, and viral infection symptoms. They clear heat, expel pathogens, and support immune response. Etiologies include exposure to heat, viral infections, and seasonal influences. Diagnosis is floating, rapid pulse, yellow nasal discharge, and fever.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Release Exterior with Head and Neck Symptoms</h3>
      <p>
        Focused on sinus congestion, headache, and throat complaints, these formulas are used for allergies, sinusitis, and head colds. Etiologies include wind invasion, allergies, and environmental changes. Diagnosis is headache, stuffy nose, and facial pressure.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Release Exterior with Concurrent Deficiency Patterns</h3>
      <p>
        Used when the patient is weak (elderly, postpartum, chronically ill) but suffering from an acute infection, balancing immune support with pathogen expulsion. Etiologies include Qi deficiency, chronic disease, and seasonal exposure. Diagnosis is fever with fatigue, weak pulse, and recurrent infections.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Release Exterior with Underlying Excess (Interior)</h3>
      <p>
        These treat simultaneous external infection and internal excess, such as diarrhea with fever and abdominal pain, combining pathogen expulsion with interior clearing. Etiologies include food poisoning, acute enteritis, and viral infections. Diagnosis is fever, diarrhea, and abdominal pain.
      </p>

      {/* Drain Downward */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Drain Downward</h2>
      <h3 style={CATEGORY_STYLES.h3}>Purge Heat Accumulation</h3>
      <p>
        Purging heat treats severe constipation and abdominal pain due to excess in the bowels ("Yang Ming" syndrome), using strong laxatives and heat-clearing herbs. Etiologies include febrile disease, dietary excess, and dehydration. Diagnosis is dry stools, abdominal distension, fever, and red tongue.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Moist Laxatives</h3>
      <p>
        Moist laxatives relieve dry constipation and poor bowel movement, using moistening and lubricating herbs. Etiologies include dehydration, low fiber diet, and aging. Diagnosis is dry mouth, hard stools, and difficulty with defecation.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warm the Yang and Guide Out Accumulation</h3>
      <p>
        These formulas treat constipation with cold, deficiency, and sluggish digestion, using warming and stimulating herbs to restore motility. Etiologies include cold exposure, aging, and Yang deficiency. Diagnosis is cold limbs, abdominal pain, and constipation.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Drive out Excess Water</h3>
      <p>
        Used for severe edema, ascites, or effusion, these formulas employ strong diuretic and water-expelling herbs. Etiologies include heart or kidney failure, chronic liver disease, and fluid overload. Diagnosis is fluid retention, abdominal swelling, and breathlessness.
      </p>

      {/* Warm Interior Cold */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Warm Interior Cold</h2>
      <h3 style={CATEGORY_STYLES.h3}>Warm Interior Cold</h3>
      <p>
        These formulas address digestive and systemic symptoms of cold, such as abdominal pain, watery diarrhea, cold extremities, and poor appetite. Warming and activating metabolism restores digestive and systemic function. Etiologies include cold exposure, aging, and Yang deficiency. Diagnosis is pale tongue, deep pulse, and preference for warmth.
      </p>

      {/* Calm the Spirit */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Calm the Spirit</h2>
      <h3 style={CATEGORY_STYLES.h3}>Nourish the Heart</h3>
      <p>
        Calming formulas nourish Heart and Liver blood to treat insomnia, irritability, palpitations, and mild anxiety. Etiologies include blood deficiency, chronic stress, and emotional trauma. Diagnosis is poor sleep, emotional instability, and palpitations.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Sedate and Calm the Shen</h3>
      <p>
        Sedating formulas calm agitation, palpitations, restlessness, and acute emotional distress, using heavy, anchoring herbs and sedatives. Etiologies include acute stress, mania, and insomnia. Diagnosis is agitation, insomnia, and rapid pulse.
      </p>

      {/* Open the Orifices */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Open the Orifices</h2>
      <h3 style={CATEGORY_STYLES.h3}>Clear Heat and Open Orifices</h3>
      <p>
        These formulas revive consciousness and treat coma or stroke due to febrile illness, using aromatic herbs and heat-clearing agents. Etiologies include severe infection, encephalitis, and heatstroke. Diagnosis is loss of consciousness, high fever, and delirium.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Warm and Open Orifices</h3>
      <p>
        Used for cold-type collapse with unconsciousness, these formulas stimulate and revive consciousness. Etiologies include cold exposure, shock, and collapse. Diagnosis is sudden fainting, cold extremities, and weak pulse.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Scour Phlegm and Open Orifices</h3>
      <p>
        Scouring phlegm addresses obstruction of consciousness due to phlegm, used for stroke, coma, or severe respiratory compromise. Etiologies include chronic phlegm, acute blockage, and neurological events. Diagnosis is gurgling in throat, coma, and sticky tongue coat.
      </p>

      {/* Reduce Food Stagnation */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Reduce Food Stagnation</h2>
      <h3 style={CATEGORY_STYLES.h3}>Reduce Food Stagnation</h3>
      <p>
        These formulas relieve indigestion, bloating, and discomfort from overeating, poor digestion, or food retention, using herbs that promote motility and enzyme secretion. Etiologies include dietary excess, weak digestion, and stress. Diagnosis is fullness, belching, and foul breath.
      </p>

      {/* Clear Heat */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Clear Heat</h2>
      <h3 style={CATEGORY_STYLES.h3}>From the Qi Level</h3>
      <p>
        Clearing heat from the Qi level treats high fever, irritability, thirst, and big pulse, as seen in acute infections and inflammatory states. Etiologies include viral and bacterial infections, heatstroke, and inflammatory diseases. Diagnosis is high fever, sweating, and thirst.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>From Ying/Xue and Cool Blood</h3>
      <p>
        Cooling the blood is used for rashes, bleeding, and delirium from severe febrile diseases, using heat-clearing and blood-cooling herbs. Etiologies include severe infections, autoimmune diseases, and drug reactions. Diagnosis is skin eruptions, bleeding, and mental confusion.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Relieve Toxicity</h3>
      <p>
        Toxic heat refers to severe infections, abscesses, and sepsis. Clearing toxicity is achieved by heat-clearing, anti-inflammatory, and antimicrobial herbs. Etiologies include bacterial infections, sepsis, and systemic inflammation. Diagnosis is high fever, abscesses, and delirium.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>From the Organs</h3>
      <p>
        These formulas clear heat from specific organs (Heart, Stomach, Liver), treating oral ulcers, gastritis, hepatitis, and related syndromes. Etiologies include organ-specific infections, autoimmune conditions, and toxic exposures. Diagnosis is burning pain, redness, and organ-specific symptoms.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>From Deficiency</h3>
      <p>
        Heat from deficiency is due to Yin depletion, leading to tidal fever, night sweats, and chronic inflammation, commonly seen in endocrine and autoimmune disorders. Diagnosis is low-grade fever, dry mouth, and night sweats.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Summerheat</h3>
      <p>
        Summerheat syndromes are acute heat illnesses—heat stroke, dehydration, or fever—treated by clearing heat and replenishing fluids. Etiologies include environmental exposure, poor hydration, and overexertion. Diagnosis is fever, thirst, restlessness, and history of heat exposure.
      </p>

      {/* Regulate Qi */}
      <h2 style={CATEGORY_STYLES.h2}>Formulas that Regulate Qi</h2>
      <h3 style={CATEGORY_STYLES.h3}>Promote Movement of Qi</h3>
      <p>
        Qi stagnation causes distension, pain, emotional constraint, and digestive dysfunction. Promoting Qi movement relieves pain, improves digestion, and supports emotional wellbeing. Etiologies include stress, poor posture, diet, and sedentary lifestyle. Diagnosis is chest/abdominal fullness, pain, sighing, and mood changes.
      </p>
      <h3 style={CATEGORY_STYLES.h3}>Direct Rebellious Qi Downward</h3>
      <p>
        Rebellious Qi refers to upward movement—hiccups, nausea, cough—resulting from impaired stomach and lung descending function. Directing Qi downward normalizes digestion and breathing. Etiologies include reflux, asthma, chronic cough, and emotional stress. Diagnosis is belching, vomiting, or shortness of breath.
      </p>

      <hr style={{margin:"2em 0"}} />
      <div style={{fontSize:".97em", color:"#44210A", marginBottom:"0.6em"}}>
        <strong>References & further reading:</strong>
        <ul>
          <li>Bensky, D., & Barolet, R. Chinese Herbal Medicine: Formulas & Strategies, 2nd Ed.</li>
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