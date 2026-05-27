// MPL PH Season 17 Hero Data
// Pick/Ban rates sourced from MPL PH S17 Regular Season

const HEROES = [
  // Tanks
  { id: "tigreal",    name: "Tigreal",    role: "Tank",     icon: "⚔️",  pickRate: 32, banRate: 18, winRate: 51, tier: "A", color: "#4a90d9" },
  { id: "atlas",      name: "Atlas",      role: "Tank",     icon: "🌊",  pickRate: 44, banRate: 55, winRate: 54, tier: "S", color: "#4a90d9" },
  { id: "khufra",     name: "Khufra",     role: "Tank",     icon: "🏺",  pickRate: 61, banRate: 72, winRate: 53, tier: "S", color: "#4a90d9" },
  { id: "akai",       name: "Akai",       role: "Tank",     icon: "🐼",  pickRate: 28, banRate: 14, winRate: 49, tier: "B", color: "#4a90d9" },
  { id: "chip",       name: "Chip",       role: "Tank",     icon: "🤖",  pickRate: 55, banRate: 68, winRate: 55, tier: "S", color: "#4a90d9" },
  { id: "carmilla",   name: "Carmilla",   role: "Tank",     icon: "🦇",  pickRate: 22, banRate: 10, winRate: 48, tier: "B", color: "#4a90d9" },
  { id: "franco",     name: "Franco",     role: "Tank",     icon: "⚓",  pickRate: 18, banRate: 8,  winRate: 47, tier: "C", color: "#4a90d9" },
  { id: "grock",      name: "Grock",      role: "Tank",     icon: "🪨",  pickRate: 35, banRate: 22, winRate: 52, tier: "A", color: "#4a90d9" },
  { id: "baxia",      name: "Baxia",      role: "Tank",     icon: "🛡️",  pickRate: 30, banRate: 25, winRate: 50, tier: "A", color: "#4a90d9" },
  { id: "edith",      name: "Edith",      role: "Tank",     icon: "🔮",  pickRate: 48, banRate: 60, winRate: 56, tier: "S", color: "#4a90d9" },
  { id: "hilda",      name: "Hilda",      role: "Tank",     icon: "🪓",  pickRate: 20, banRate: 9,  winRate: 48, tier: "B", color: "#4a90d9" },
  { id: "johnson",    name: "Johnson",    role: "Tank",     icon: "🚗",  pickRate: 25, banRate: 20, winRate: 50, tier: "A", color: "#4a90d9" },

  // Fighters
  { id: "chou",       name: "Chou",       role: "Fighter",  icon: "🥊",  pickRate: 70, banRate: 45, winRate: 55, tier: "S", color: "#e67e22" },
  { id: "yuzhong",    name: "Yu Zhong",   role: "Fighter",  icon: "🐉",  pickRate: 38, banRate: 30, winRate: 52, tier: "A", color: "#e67e22" },
  { id: "fredrinn",   name: "Fredrinn",   role: "Fighter",  icon: "🦞",  pickRate: 42, banRate: 35, winRate: 53, tier: "A", color: "#e67e22" },
  { id: "arlott",     name: "Arlott",     role: "Fighter",  icon: "🌑",  pickRate: 55, banRate: 50, winRate: 54, tier: "S", color: "#e67e22" },
  { id: "terizla",    name: "Terizla",    role: "Fighter",  icon: "🔨",  pickRate: 25, banRate: 15, winRate: 50, tier: "B", color: "#e67e22" },
  { id: "paquito",    name: "Paquito",    role: "Fighter",  icon: "🥋",  pickRate: 30, banRate: 20, winRate: 51, tier: "A", color: "#e67e22" },
  { id: "ruby",       name: "Ruby",       role: "Fighter",  icon: "🗡️",  pickRate: 22, banRate: 12, winRate: 49, tier: "B", color: "#e67e22" },
  { id: "xborg",      name: "X.Borg",     role: "Fighter",  icon: "🔥",  pickRate: 28, banRate: 18, winRate: 51, tier: "A", color: "#e67e22" },
  { id: "badang",     name: "Badang",     role: "Fighter",  icon: "💨",  pickRate: 15, banRate: 8,  winRate: 47, tier: "C", color: "#e67e22" },
  { id: "kaja",       name: "Kaja",       role: "Fighter",  icon: "⚡",  pickRate: 33, banRate: 28, winRate: 52, tier: "A", color: "#e67e22" },
  { id: "guinevere",  name: "Guinevere",  role: "Fighter",  icon: "👑",  pickRate: 35, banRate: 30, winRate: 52, tier: "A", color: "#e67e22" },
  { id: "aldous",     name: "Aldous",     role: "Fighter",  icon: "💪",  pickRate: 18, banRate: 35, winRate: 50, tier: "A", color: "#e67e22" },

  // Assassins
  { id: "lancelot",   name: "Lancelot",   role: "Assassin", icon: "🗡",  pickRate: 58, banRate: 65, winRate: 53, tier: "S", color: "#9b59b6" },
  { id: "fanny",      name: "Fanny",      role: "Assassin", icon: "🪁",  pickRate: 50, banRate: 70, winRate: 54, tier: "S", color: "#9b59b6" },
  { id: "joy",        name: "Joy",        role: "Assassin", icon: "💜",  pickRate: 45, banRate: 58, winRate: 53, tier: "S", color: "#9b59b6" },
  { id: "nolan",      name: "Nolan",      role: "Assassin", icon: "🎯",  pickRate: 52, banRate: 62, winRate: 55, tier: "S", color: "#9b59b6" },
  { id: "helcurt",    name: "Helcurt",    role: "Assassin", icon: "🕷",  pickRate: 30, banRate: 40, winRate: 51, tier: "A", color: "#9b59b6" },
  { id: "karina",     name: "Karina",     role: "Assassin", icon: "🌹",  pickRate: 28, banRate: 22, winRate: 50, tier: "A", color: "#9b59b6" },
  { id: "benedetta",  name: "Benedetta",  role: "Assassin", icon: "🦋",  pickRate: 35, banRate: 28, winRate: 51, tier: "A", color: "#9b59b6" },
  { id: "gusion",     name: "Gusion",     role: "Assassin", icon: "🎩",  pickRate: 40, banRate: 35, winRate: 52, tier: "A", color: "#9b59b6" },
  { id: "ling",       name: "Ling",       role: "Assassin", icon: "🍃",  pickRate: 45, banRate: 50, winRate: 53, tier: "S", color: "#9b59b6" },
  { id: "hayabusa",   name: "Hayabusa",   role: "Assassin", icon: "⚔",  pickRate: 20, banRate: 30, winRate: 49, tier: "B", color: "#9b59b6" },
  { id: "yi_sun",     name: "Yi Sun-shin",role: "Assassin", icon: "⛵",  pickRate: 25, banRate: 18, winRate: 50, tier: "A", color: "#9b59b6" },

  // Mages
  { id: "kagura",     name: "Kagura",     role: "Mage",     icon: "☂️",  pickRate: 62, banRate: 55, winRate: 55, tier: "S", color: "#3498db" },
  { id: "lunox",      name: "Lunox",      role: "Mage",     icon: "🌙",  pickRate: 40, banRate: 45, winRate: 53, tier: "S", color: "#3498db" },
  { id: "yve",        name: "Yve",        role: "Mage",     icon: "🌌",  pickRate: 35, banRate: 30, winRate: 52, tier: "A", color: "#3498db" },
  { id: "valentina",  name: "Valentina",  role: "Mage",     icon: "🔮",  pickRate: 48, banRate: 55, winRate: 54, tier: "S", color: "#3498db" },
  { id: "pharsa",     name: "Pharsa",     role: "Mage",     icon: "🦅",  pickRate: 30, banRate: 20, winRate: 51, tier: "A", color: "#3498db" },
  { id: "lylia",      name: "Lylia",      role: "Mage",     icon: "🍄",  pickRate: 25, banRate: 18, winRate: 50, tier: "A", color: "#3498db" },
  { id: "xavier",     name: "Xavier",     role: "Mage",     icon: "🔵",  pickRate: 32, banRate: 25, winRate: 51, tier: "A", color: "#3498db" },
  { id: "eudora",     name: "Eudora",     role: "Mage",     icon: "⚡",  pickRate: 15, banRate: 8,  winRate: 48, tier: "C", color: "#3498db" },
  { id: "odette",     name: "Odette",     role: "Mage",     icon: "🦢",  pickRate: 18, banRate: 10, winRate: 48, tier: "C", color: "#3498db" },
  { id: "cecilion",   name: "Cecilion",   role: "Mage",     icon: "🧛",  pickRate: 22, banRate: 15, winRate: 50, tier: "B", color: "#3498db" },
  { id: "joy_mage",   name: "Chang'e",    role: "Mage",     icon: "🌕",  pickRate: 20, banRate: 12, winRate: 49, tier: "B", color: "#3498db" },
  { id: "alice",      name: "Alice",      role: "Mage",     icon: "🃏",  pickRate: 28, banRate: 22, winRate: 51, tier: "A", color: "#3498db" },
  { id: "kadita",     name: "Kadita",     role: "Mage",     icon: "🌊",  pickRate: 30, banRate: 20, winRate: 51, tier: "A", color: "#3498db" },

  // Marksmen
  { id: "beatrix",    name: "Beatrix",    role: "Marksman", icon: "🔫",  pickRate: 65, banRate: 58, winRate: 55, tier: "S", color: "#f39c12" },
  { id: "brody",      name: "Brody",      role: "Marksman", icon: "🎸",  pickRate: 45, banRate: 38, winRate: 53, tier: "S", color: "#f39c12" },
  { id: "karrie",     name: "Karrie",     role: "Marksman", icon: "🎪",  pickRate: 40, banRate: 45, winRate: 54, tier: "S", color: "#f39c12" },
  { id: "melissa",    name: "Melissa",    role: "Marksman", icon: "🧸",  pickRate: 42, banRate: 35, winRate: 53, tier: "A", color: "#f39c12" },
  { id: "natan",      name: "Natan",      role: "Marksman", icon: "🌀",  pickRate: 35, banRate: 40, winRate: 52, tier: "A", color: "#f39c12" },
  { id: "irithel",    name: "Irithel",    role: "Marksman", icon: "🏹",  pickRate: 28, banRate: 20, winRate: 51, tier: "A", color: "#f39c12" },
  { id: "granger",    name: "Granger",    role: "Marksman", icon: "🎻",  pickRate: 30, banRate: 22, winRate: 50, tier: "A", color: "#f39c12" },
  { id: "wanwan",     name: "Wan Wan",    role: "Marksman", icon: "🎯",  pickRate: 38, banRate: 42, winRate: 52, tier: "A", color: "#f39c12" },
  { id: "moskov",     name: "Moskov",     role: "Marksman", icon: "🏋️",  pickRate: 20, banRate: 12, winRate: 49, tier: "B", color: "#f39c12" },
  { id: "claude",     name: "Claude",     role: "Marksman", icon: "🐒",  pickRate: 25, banRate: 18, winRate: 50, tier: "B", color: "#f39c12" },

  // Supports
  { id: "estes",      name: "Estes",      role: "Support",  icon: "🌿",  pickRate: 42, banRate: 50, winRate: 54, tier: "S", color: "#2ecc71" },
  { id: "floryn",     name: "Floryn",     role: "Support",  icon: "🌸",  pickRate: 38, banRate: 42, winRate: 53, tier: "S", color: "#2ecc71" },
  { id: "angela",     name: "Angela",     role: "Support",  icon: "💝",  pickRate: 45, banRate: 60, winRate: 55, tier: "S", color: "#2ecc71" },
  { id: "mathilda",   name: "Mathilda",   role: "Support",  icon: "🦊",  pickRate: 50, banRate: 55, winRate: 54, tier: "S", color: "#2ecc71" },
  { id: "diggie",     name: "Diggie",     role: "Support",  icon: "⏰",  pickRate: 30, banRate: 35, winRate: 51, tier: "A", color: "#2ecc71" },
  { id: "rafaela",    name: "Rafaela",    role: "Support",  icon: "👼",  pickRate: 18, banRate: 10, winRate: 49, tier: "B", color: "#2ecc71" },
  { id: "faramis",    name: "Faramis",    role: "Support",  icon: "💀",  pickRate: 25, banRate: 20, winRate: 50, tier: "A", color: "#2ecc71" },
  { id: "lolita",     name: "Lolita",     role: "Support",  icon: "🛡",  pickRate: 22, banRate: 15, winRate: 50, tier: "A", color: "#2ecc71" },
];

// MPL PH S17 Teams
const MPL_TEAMS = [
  { id: "tlph",  name: "Team Liquid PH",       shortName: "TLPH",  color: "#00b4f0" },
  { id: "twph",  name: "Twisted Mind PH",      shortName: "TWPH",  color: "#e74c3c" },
  { id: "apbr",  name: "AP Bren",              shortName: "APBR",  color: "#f39c12" },
  { id: "rora",  name: "Rebellion Zephyr",     shortName: "RORA",  color: "#27ae60" },
  { id: "omg",   name: "Oh My God",            shortName: "OMG",   color: "#9b59b6" },
  { id: "tnc",   name: "TNC Pro Team",         shortName: "TNC",   color: "#e74c3c" },
  { id: "onph",  name: "Omega Esports PH",     shortName: "ONPH",  color: "#f39c12" },
  { id: "flcp",  name: "Falcon Esports PH",    shortName: "FLCP",  color: "#3498db" },
];

// MLBB Draft Order (Standard BO3/BO5 draft)
const DRAFT_ORDER = [
  // Phase 1 Bans (4 bans)
  { phase: 1, type: "ban",  team: "blue", slot: 0 },
  { phase: 1, type: "ban",  team: "red",  slot: 0 },
  { phase: 1, type: "ban",  team: "blue", slot: 1 },
  { phase: 1, type: "ban",  team: "red",  slot: 1 },
  // Phase 1 Picks (6 picks)
  { phase: 1, type: "pick", team: "blue", slot: 0 },
  { phase: 1, type: "pick", team: "red",  slot: 0 },
  { phase: 1, type: "pick", team: "red",  slot: 1 },
  { phase: 1, type: "pick", team: "blue", slot: 1 },
  { phase: 1, type: "pick", team: "blue", slot: 2 },
  { phase: 1, type: "pick", team: "red",  slot: 2 },
  // Phase 2 Bans (4 bans)
  { phase: 2, type: "ban",  team: "red",  slot: 2 },
  { phase: 2, type: "ban",  team: "blue", slot: 2 },
  { phase: 2, type: "ban",  team: "red",  slot: 3 },
  { phase: 2, type: "ban",  team: "blue", slot: 3 },
  // Phase 2 Picks (4 picks)
  { phase: 2, type: "pick", team: "red",  slot: 3 },
  { phase: 2, type: "pick", team: "blue", slot: 3 },
  { phase: 2, type: "pick", team: "blue", slot: 4 },
  { phase: 2, type: "pick", team: "red",  slot: 4 },
];

// MPL S17 meta context for AI
const META_CONTEXT = `
MPL PH Season 17 Meta Summary:
- Top meta picks: Khufra, Chip, Edith (tank), Chou, Arlott (fighter), Nolan, Joy, Lancelot, Ling, Fanny (assassin), Kagura, Valentina, Beatrix (mage/marksman), Angela, Mathilda, Estes (support)
- S-Tier bans: Fanny (70%), Khufra (72%), Chip (68%), Nolan (62%), Lancelot (65%), Angela (60%), Valentina (55%)
- Most picked: Chou (70%), Beatrix (65%), Kagura (62%), Nolan (52%)
- Win conditions in MPL S17: Early game pressure with Chip portal plays, Fanny/Lancelot hyper-carry, Valentina stealing enemy ultimates, Angela global ult protection on MM
- Common compositions: Turtle strat (Angela+MM sustain), Dive comp (Chou+Chip+Nolan), Poke comp (Pharsa+Yve+Kagura), Death Bus (Johnson+Arlott), Full dive (Khufra+Fanny+Arlott)
- Counter picks: Baxia counters Estes/Floryn heals; Karrie melts tanks; Helcurt shuts down support-reliant teams
`;

export { HEROES, MPL_TEAMS, DRAFT_ORDER, META_CONTEXT };
