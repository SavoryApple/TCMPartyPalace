// tempQuizQuestions.js
// Updated to 150 questions: Each element (Wood, Fire, Earth, Metal, Water) has 30 questions,
// split evenly between Yin (gentle, receptive, nurturing, subtle) and Yang (bold, dynamic, initiating, expressive) aspects.

const WOOD_YIN_QUESTIONS = [
  "I support others’ growth with encouragement and patience.",
  "I prefer steady, harmonious progress over bold moves.",
  "I nurture creativity in myself and those around me.",
  "I seek peaceful resolutions and gentle change.",
  "I value collaboration and shared growth.",
  "I am patient when working toward my goals.",
  "I help others find their direction calmly.",
  "I prefer to resolve conflict through understanding.",
  "I create space for new ideas to develop gradually.",
  "I appreciate subtle transformation and slow improvement.",
  "I feel fulfilled when mentoring or guiding others.",
  "I adapt gently to new situations.",
  "I find meaning in quiet, persistent effort.",
  "I encourage teamwork and gentle leadership.",
  "I value emotional safety in group settings."
];
const WOOD_YANG_QUESTIONS = [
  "I set ambitious goals and create detailed plans to achieve them.",
  "I feel invigorated by new challenges and opportunities.",
  "I am comfortable taking charge in group situations.",
  "I proactively seek out personal growth and learning experiences.",
  "I rebound quickly after experiencing setbacks.",
  "I prefer decisive action over prolonged discussion.",
  "I enjoy troubleshooting and developing creative solutions.",
  "I value autonomy and independence in daily life.",
  "Slow progress or inefficiency frustrates me.",
  "I thrive in competitive environments and strive for excellence.",
  "I am comfortable with risk and uncertainty when pursuing objectives.",
  "I am driven by achievement and recognition.",
  "I naturally motivate and energize others.",
  "I adapt swiftly to shifting circumstances.",
  "I defend my freedom and personal boundaries."
];

const FIRE_YIN_QUESTIONS = [
  "I enjoy close, heartfelt connections with others.",
  "I express my feelings gently and thoughtfully.",
  "I uplift those around me with quiet encouragement.",
  "I value emotional intimacy over excitement.",
  "I listen deeply and offer empathy in conversations.",
  "I create safe spaces for authentic self-expression.",
  "I find fulfillment in nurturing emotional bonds.",
  "I prefer gentle celebrations and meaningful rituals.",
  "I comfort others during emotional challenges.",
  "I value softness and warmth in my relationships.",
  "I am sensitive to others’ emotional needs.",
  "I encourage vulnerability and honesty.",
  "I feel energized by small, supportive gatherings.",
  "I express creativity through intimate settings.",
  "I bring joy in subtle, heartfelt ways."
];
const FIRE_YANG_QUESTIONS = [
  "I feel energized by lively social interactions.",
  "I am comfortable being the focus of attention.",
  "I express passion and excitement about life.",
  "I openly share my emotions with others.",
  "I build new friendships easily and value connection.",
  "I enjoy spontaneity and unexpected surprises.",
  "I use humor to break the ice and connect with people.",
  "I recover quickly from disappointments.",
  "I enjoy planning and hosting social gatherings.",
  "I maintain an optimistic attitude about the future.",
  "I am expressive and animated in conversations.",
  "I am drawn to artistic and creative activities.",
  "I am comfortable sharing my vulnerabilities.",
  "I celebrate milestones and personal achievements.",
  "I forgive quickly and move forward easily."
];

const EARTH_YIN_QUESTIONS = [
  "I enjoy nurturing others and providing comfort.",
  "I am patient and tolerant with people.",
  "I listen attentively and offer support.",
  "I value loyalty and long-term relationships.",
  "I am nurturing and supportive in relationships.",
  "I offer gentle encouragement rather than criticism.",
  "I conserve resources and avoid unnecessary waste.",
  "I enjoy routines, rituals, and predictability.",
  "I am empathetic and compassionate.",
  "I comfort others during distress.",
  "I seek harmony and cooperation in group settings.",
  "I am slow to anger and quick to forgive.",
  "I find joy in nature and gardening.",
  "I maintain organization and tidiness.",
  "I am patient with others' shortcomings."
];
const EARTH_YANG_QUESTIONS = [
  "I am reliable and consistently keep my commitments.",
  "I value stability and routine in my life.",
  "I am organized and create structure in my environment.",
  "I appreciate tradition and continuity.",
  "I make practical and sensible decisions.",
  "I am generous with my time and resources.",
  "I thrive in group activities and teamwork.",
  "I am dependable, especially in times of need.",
  "I prefer security and comfort over risk.",
  "I am deeply connected to my home and family.",
  "I remain grounded and steady under pressure.",
  "I anticipate future needs and prepare accordingly.",
  "I am sensitive to others' emotions and challenges.",
  "I resolve conflicts peacefully and diplomatically.",
  "I resolve problems calmly and patiently."
];

const METAL_YIN_QUESTIONS = [
  "I value solitude and time for reflection.",
  "I am cautious and reserved with emotions.",
  "I find comfort in routine and ritual.",
  "I reflect thoughtfully before judging others.",
  "I let go of things that no longer serve me.",
  "I maintain emotional boundaries.",
  "I prefer clarity and directness in interactions.",
  "I am receptive to constructive criticism.",
  "I am comfortable with consistent routines.",
  "I respond calmly under pressure.",
  "I am careful and thorough in my work.",
  "I am precise and detail-oriented.",
  "I appreciate simplicity and minimalism.",
  "I seek out quiet environments for focus.",
  "I value inner discipline and self-control."
];
const METAL_YANG_QUESTIONS = [
  "I create order and structure in my surroundings.",
  "I approach decisions analytically and logically.",
  "I appreciate quality and refinement in products and experiences.",
  "I am disciplined and focused on my goals.",
  "I strive for objectivity and fairness.",
  "I set clear boundaries for myself and others.",
  "I maintain organization in work and habits.",
  "I act with honesty and integrity.",
  "I make difficult decisions with calm rationality.",
  "I am methodical and efficient in my tasks.",
  "I am resilient during adverse situations.",
  "I am skilled at detecting errors and flaws.",
  "I value transparency and accountability.",
  "I manage resources and time efficiently.",
  "I plan and organize projects thoroughly."
];

const WATER_YIN_QUESTIONS = [
  "I am intuitive and sense others' emotions.",
  "I seek depth and meaning in my experiences.",
  "I value time alone for reflection and growth.",
  "I am gentle and sensitive in relationships.",
  "I value authenticity and honesty in myself and others.",
  "I express my feelings through creative outlets.",
  "I value solitude for introspection.",
  "I comfort others during emotional distress.",
  "I am thoughtful and introspective.",
  "I enjoy practicing meditation or mindfulness.",
  "I am open to spiritual experiences and perspectives.",
  "I am comfortable with uncertainty.",
  "I am sensitive to beauty and aesthetics.",
  "I enjoy deep, meaningful conversations.",
  "I find meaning in life's challenges and transitions."
];
const WATER_YANG_QUESTIONS = [
  "I am imaginative and approach life creatively.",
  "I adapt easily to change and uncertainty.",
  "I am resilient when facing adversity.",
  "I enjoy exploring my inner world and emotions.",
  "I value spirituality and personal development.",
  "I am empathetic and compassionate.",
  "I am flexible and open-minded to new ideas.",
  "I am comfortable with ambiguity and mystery.",
  "I solve problems using creative thinking.",
  "I enjoy artistic hobbies like music, writing, or painting.",
  "I adjust my course easily when circumstances change.",
  "I value emotional honesty.",
  "I am comfortable with silence and reflection.",
  "I explore dreams and imagination frequently.",
  "I am drawn to water and natural landscapes."
];

// Export all questions as a single array if needed
const QUIZ_QUESTIONS = [
  ...WOOD_YIN_QUESTIONS,
  ...WOOD_YANG_QUESTIONS,
  ...FIRE_YIN_QUESTIONS,
  ...FIRE_YANG_QUESTIONS,
  ...EARTH_YIN_QUESTIONS,
  ...EARTH_YANG_QUESTIONS,
  ...METAL_YIN_QUESTIONS,
  ...METAL_YANG_QUESTIONS,
  ...WATER_YIN_QUESTIONS,
  ...WATER_YANG_QUESTIONS,
];

export {
  WOOD_YIN_QUESTIONS,
  WOOD_YANG_QUESTIONS,
  FIRE_YIN_QUESTIONS,
  FIRE_YANG_QUESTIONS,
  EARTH_YIN_QUESTIONS,
  EARTH_YANG_QUESTIONS,
  METAL_YIN_QUESTIONS,
  METAL_YANG_QUESTIONS,
  WATER_YIN_QUESTIONS,
  WATER_YANG_QUESTIONS,
  QUIZ_QUESTIONS,
};