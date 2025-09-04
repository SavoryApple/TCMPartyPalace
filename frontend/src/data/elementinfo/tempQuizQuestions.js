// tempQuizQuestions.js
// Each question is an object with: prompt, A (Yin), B (Yang)
// For a sliding scale, show A on one end (value=1), B on the other (value=100)
// Your UI can label the slider: | A |———|———|———| B |

const WOOD_QUESTIONS = [
  {
    prompt: "When facing a challenge, I usually...",
    A: "support others quietly and wait for things to improve.",
    B: "take charge and push for quick results.",
  },
  {
    prompt: "In groups, I tend to...",
    A: "let others lead and encourage from the sidelines.",
    B: "step up and drive the group toward new goals.",
  },
  {
    prompt: "If there’s a problem, I most often...",
    A: "wait and hope it works out.",
    B: "act immediately to fix it.",
  },
  {
    prompt: "My approach to growth is usually...",
    A: "slow and steady.",
    B: "fast and bold.",
  },
  {
    prompt: "When someone needs help, I...",
    A: "give gentle advice and let them choose.",
    B: "direct them with clear steps.",
  },
  // New Wood Questions
  {
    prompt: "When plans change suddenly, I...",
    A: "adjust calmly and observe.",
    B: "rework the plan and move forward.",
  },
  {
    prompt: "My leadership style is...",
    A: "quiet encouragement.",
    B: "active direction.",
  },
  {
    prompt: "I handle mistakes by...",
    A: "reflecting and learning quietly.",
    B: "quickly correcting and moving on.",
  },
  {
    prompt: "I prefer to...",
    A: "support others behind the scenes.",
    B: "lead from the front.",
  },
  {
    prompt: "I respond to criticism by...",
    A: "considering feedback privately.",
    B: "addressing it openly and directly.",
  },
  {
    prompt: "I like to solve problems by...",
    A: "thinking things through.",
    B: "taking immediate action.",
  },
  {
    prompt: "When I make decisions, I...",
    A: "consult others and seek consensus.",
    B: "decide quickly and confidently.",
  },
  {
    prompt: "My energy in projects is...",
    A: "steady and persistent.",
    B: "dynamic and driven.",
  },
  {
    prompt: "I prefer teamwork that is...",
    A: "collaborative and gentle.",
    B: "goal-oriented and energetic.",
  },
  {
    prompt: "I value success that...",
    A: "benefits everyone equally.",
    B: "achieves ambitious goals.",
  },
  {
    prompt: "When under pressure, I...",
    A: "remain calm and resilient.",
    B: "rise to the challenge forcefully.",
  },
  {
    prompt: "I handle conflict by...",
    A: "listening and mediating.",
    B: "confronting and resolving issues.",
  },
  {
    prompt: "I motivate others by...",
    A: "offering quiet support.",
    B: "inspiring action.",
  },
  {
    prompt: "I approach change by...",
    A: "adjusting gradually.",
    B: "embracing it quickly.",
  },
  {
    prompt: "My role in groups is usually...",
    A: "facilitator and supporter.",
    B: "leader and initiator.",
  },
];

const FIRE_QUESTIONS = [
  {
    prompt: "I express my feelings by...",
    A: "keeping them quiet and private.",
    B: "sharing them openly and passionately.",
  },
  {
    prompt: "In social settings, I prefer...",
    A: "small, calm gatherings.",
    B: "lively, energetic parties.",
  },
  {
    prompt: "When someone is upset, I...",
    A: "comfort them quietly and listen.",
    B: "cheer them up with excitement and positivity.",
  },
  {
    prompt: "I celebrate achievements...",
    A: "in simple, personal ways.",
    B: "with big, enthusiastic gestures.",
  },
  {
    prompt: "With friends, I value...",
    A: "deep, gentle bonds.",
    B: "spontaneous, dynamic connections.",
  },
  // New Fire Questions
  {
    prompt: "My ideal environment is...",
    A: "peaceful and warm.",
    B: "vibrant and stimulating.",
  },
  {
    prompt: "I show excitement by...",
    A: "smiling softly.",
    B: "laughing loudly.",
  },
  {
    prompt: "I connect with others by...",
    A: "sharing quietly.",
    B: "engaging enthusiastically.",
  },
  {
    prompt: "I prefer conversations that are...",
    A: "thoughtful and meaningful.",
    B: "animated and lively.",
  },
  {
    prompt: "My sense of humor is...",
    A: "subtle and gentle.",
    B: "bold and expressive.",
  },
  {
    prompt: "I handle boredom by...",
    A: "reflecting inward.",
    B: "seeking excitement.",
  },
  {
    prompt: "When I am happy, I...",
    A: "feel content inside.",
    B: "show my joy outwardly.",
  },
  {
    prompt: "I build relationships through...",
    A: "intimacy and trust.",
    B: "fun and adventure.",
  },
  {
    prompt: "When I feel joyful, I tend to...",
    A: "enjoy the moment quietly.",
    B: "celebrate with enthusiasm and others.",
  },
  {
    prompt: "I prefer celebrations that are...",
    A: "private and meaningful.",
    B: "public and high-energy.",
  },
  {
    prompt: "My friendships are...",
    A: "long-lasting and deep.",
    B: "dynamic and ever-changing.",
  },
  {
    prompt: "I express love by...",
    A: "gentle gestures.",
    B: "grand declarations.",
  },
  {
    prompt: "I recharge by...",
    A: "being alone.",
    B: "being with others.",
  },
  {
    prompt: "I approach creativity by...",
    A: "thinking quietly.",
    B: "collaborating energetically.",
  },
  {
    prompt: "I prefer entertainment that is...",
    A: "calm and thoughtful.",
    B: "exciting and fast-paced.",
  },
];

const EARTH_QUESTIONS = [
  {
    prompt: "I support others by...",
    A: "keeping things safe and steady.",
    B: "organizing and leading group efforts.",
  },
  {
    prompt: "When making decisions, I...",
    A: "keep things predictable.",
    B: "act quickly to solve problems.",
  },
  {
    prompt: "I show care by...",
    A: "listening and accepting others.",
    B: "giving direct help and advice.",
  },
  {
    prompt: "I value...",
    A: "tradition and routine.",
    B: "teamwork and practical solutions to new problems.",
  },
  {
    prompt: "When things go wrong, I...",
    A: "stay calm and forgive easily.",
    B: "step in to fix things and keep everyone on track.",
  },
  // New Earth Questions
  {
    prompt: "I feel most comfortable when...",
    A: "life is predictable.",
    B: "I am helping organize others.",
  },
  {
    prompt: "My approach to challenges is...",
    A: "steady perseverance.",
    B: "direct problem-solving.",
  },
  {
    prompt: "I prefer to...",
    A: "keep harmony.",
    B: "take responsibility for solutions.",
  },
  {
    prompt: "I like routines that are...",
    A: "consistent.",
    B: "flexible to group needs.",
  },
  {
    prompt: "I deal with change by...",
    A: "adapting slowly.",
    B: "helping everyone adjust.",
  },
  {
    prompt: "I feel secure when...",
    A: "I know what to expect.",
    B: "I’m actively involved in solutions.",
  },
  {
    prompt: "I offer support by...",
    A: "being present and caring.",
    B: "giving practical help.",
  },
  {
    prompt: "I find peace in...",
    A: "stability.",
    B: "working with others.",
  },
  {
    prompt: "I prefer relationships that are...",
    A: "steady and reliable.",
    B: "collaborative and active.",
  },
  {
    prompt: "I value harmony that is...",
    A: "gentle.",
    B: "well-organized.",
  },
  {
    prompt: "My advice is usually...",
    A: "accepting and empathetic.",
    B: "practical and direct.",
  },
  {
    prompt: "I react to stress by...",
    A: "calming myself.",
    B: "taking charge to fix things.",
  },
  {
    prompt: "I am happiest when...",
    A: "everyone is at peace.",
    B: "everyone is working together.",
  },
  {
    prompt: "I prefer environments that are...",
    A: "comfortable and familiar.",
    B: "structured and active.",
  },
  {
    prompt: "I approach conflict by...",
    A: "seeking compromise.",
    B: "finding clear solutions.",
  },
];

const METAL_QUESTIONS = [
  {
    prompt: "I prefer...",
    A: "quiet reflection and personal boundaries.",
    B: "clear rules and high standards for everyone.",
  },
  {
    prompt: "In tough times, I...",
    A: "stay reserved and let go of what’s not needed.",
    B: "organize and set strict limits.",
  },
  {
    prompt: "I like...",
    A: "simplicity and minimalism.",
    B: "precision and thoroughness.",
  },
  {
    prompt: "With feedback, I...",
    A: "accept it quietly and think it over.",
    B: "use it right away to improve and fix mistakes.",
  },
  {
    prompt: "I communicate...",
    A: "gently and with restraint.",
    B: "directly and clearly.",
  },
  // New Metal Questions
  {
    prompt: "I value...",
    A: "privacy and introspection.",
    B: "clarity and order.",
  },
  {
    prompt: "I organize my space by...",
    A: "keeping only what I need.",
    B: "arranging everything precisely.",
  },
  {
    prompt: "I handle emotions by...",
    A: "processing them privately.",
    B: "addressing them logically.",
  },
  {
    prompt: "My standards are...",
    A: "personal and flexible.",
    B: "strict and universal.",
  },
  {
    prompt: "I prefer feedback that is...",
    A: "gentle and thoughtful.",
    B: "honest and direct.",
  },
  {
    prompt: "My work style is...",
    A: "independent and focused.",
    B: "exact and efficient.",
  },
  {
    prompt: "I make decisions by...",
    A: "considering quietly.",
    B: "analyzing precisely.",
  },
  {
    prompt: "I prefer relationships that are...",
    A: "respectful and private.",
    B: "straightforward and clear.",
  },
  {
    prompt: "I approach learning by...",
    A: "reflecting deeply.",
    B: "studying thoroughly.",
  },
  {
    prompt: "I react to criticism by...",
    A: "thinking it over alone.",
    B: "using it to improve immediately.",
  },
  {
    prompt: "I value beauty that is...",
    A: "subtle and understated.",
    B: "refined and perfect.",
  },
  {
    prompt: "I approach challenges by...",
    A: "detaching and accepting.",
    B: "setting clear boundaries.",
  },
  {
    prompt: "I prefer routines that are...",
    A: "simple.",
    B: "well-defined.",
  },
  {
    prompt: "I communicate best when...",
    A: "I have time to reflect.",
    B: "I can be precise.",
  },
];

const WATER_QUESTIONS = [
  {
    prompt: "I seek...",
    A: "peace and depth through solitude and reflection.",
    B: "new ideas and adapt quickly to change.",
  },
  {
    prompt: "When things are uncertain, I...",
    A: "trust my intuition and go inward.",
    B: "take creative action and try different solutions.",
  },
  {
    prompt: "I connect with others through...",
    A: "gentle empathy.",
    B: "inspiring and sharing imaginative projects.",
  },
  {
    prompt: "I value...",
    A: "quiet beauty and meaningful talks.",
    B: "bold creativity and emotional honesty.",
  },
  {
    prompt: "When life is hard, I...",
    A: "quietly process my feelings.",
    B: "bounce back and turn problems into opportunities.",
  },
  // New Water Questions
  {
    prompt: "I prefer...",
    A: "solitude and reflection.",
    B: "exploring new experiences.",
  },
  {
    prompt: "I approach life by...",
    A: "going with the flow.",
    B: "creating new paths.",
  },
  {
    prompt: "I handle stress by...",
    A: "retreating inward.",
    B: "finding creative solutions.",
  },
  {
    prompt: "I learn best when...",
    A: "I can explore quietly.",
    B: "I can experiment freely.",
  },
  {
    prompt: "My creativity is...",
    A: "gentle and subtle.",
    B: "bold and imaginative.",
  },
  {
    prompt: "I build relationships through...",
    A: "understanding others deeply.",
    B: "sharing new ideas.",
  },
  {
    prompt: "I find peace in...",
    A: "stillness.",
    B: "creative movement.",
  },
  {
    prompt: "I respond to uncertainty by...",
    A: "trusting my intuition.",
    B: "seeking new experiences.",
  },
  {
    prompt: "I value wisdom that is...",
    A: "quiet and timeless.",
    B: "innovative and daring.",
  },
  {
    prompt: "I prefer to...",
    A: "listen and observe.",
    B: "inspire and motivate.",
  },
  {
    prompt: "My intuition is...",
    A: "strong and guiding.",
    B: "adaptive and inventive.",
  },
  {
    prompt: "I handle conflict by...",
    A: "avoiding confrontation.",
    B: "transforming it creatively.",
  },
  {
    prompt: "I prefer environments that are...",
    A: "peaceful and calm.",
    B: "stimulating and new.",
  },
  {
    prompt: "I express myself by...",
    A: "writing or reflecting.",
    B: "creating or performing.",
  },
];

const QUIZ_QUESTIONS = [
  ...WOOD_QUESTIONS,
  ...FIRE_QUESTIONS,
  ...EARTH_QUESTIONS,
  ...METAL_QUESTIONS,
  ...WATER_QUESTIONS,
];

export {
  WOOD_QUESTIONS,
  FIRE_QUESTIONS,
  EARTH_QUESTIONS,
  METAL_QUESTIONS,
  WATER_QUESTIONS,
  QUIZ_QUESTIONS,
};
