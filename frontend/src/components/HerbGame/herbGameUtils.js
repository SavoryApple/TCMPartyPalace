// Utility functions for Herb Matching Game
// Supports modes: name ↔ keyActions, name ↔ category/subcategory, name ↔ group

// --- Helpers ---
function normalize(str) {
  return (str || "")
    .replace(/\s|-/g, "")
    .replace(/\(.*?\)/, "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function getHerbDisplayNames(herb) {
  // Returns all display names: pinyin, pharmaceutical, english, name
  const names = [];
  if (Array.isArray(herb.pinyinName)) names.push(...herb.pinyinName);
  else if (herb.pinyinName) names.push(herb.pinyinName);
  if (herb.pharmaceuticalName) names.push(herb.pharmaceuticalName);
  if (herb.name) names.push(herb.name);
  if (herb.englishNames) {
    if (Array.isArray(herb.englishNames)) names.push(...herb.englishNames);
    else names.push(herb.englishNames);
  }
  return [...new Set(names.filter(Boolean))];
}

function uniquePairs(arr) {
  // Remove duplicate pairs based on a composite key
  const seen = new Set();
  return arr.filter(pair => {
    // For new version, use name+pharmaceutical as key
    let left = pair.left && (pair.left.pinyinName || pair.left.name || pair.left);
    let right = pair.right && (pair.right.pinyinName || pair.right.name || pair.right);
    let pharmLeft = pair.left && (pair.left.pharmaceutical || pair.left.pharmaceuticalName || pair.left.latin || "");
    let pharmRight = pair.right && (pair.right.pharmaceutical || pair.right.pharmaceuticalName || pair.right.latin || "");
    const key = `${left}|${pharmLeft}|${right}|${pharmRight}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// --- Pair Generators ---

export function generateNameKeyActionsPairs(herbCategoryList) {
  // herbCategoryList: contents of herbCategoryListObject.json
  // Returns: [{ left: herbObj, right: herbObj, mode, ... }]
  let pairs = [];
  const categories = Array.isArray(herbCategoryList.categories)
    ? herbCategoryList.categories
    : Array.isArray(herbCategoryList)
      ? herbCategoryList
      : [];
  categories.forEach(cat => {
    (cat.subcategories || []).forEach(subcat => {
      (subcat.herbs || []).forEach(herb => {
        if (herb.keyActions) {
          pairs.push({
            left: herb,
            right: herb,
            mode: "name-keyActions",
            category: cat.category || cat.name, // <--- PATCHED
            subcategory: subcat.name || subcat.title,
          });
        }
      });
    });
  });
  return uniquePairs(pairs);
}

export function generateNameCategoryPairs(herbCategoryList) {
  // Returns: [{ left: herbObj, right: herbObj, mode, ... }]
  let pairs = [];
  const categories = Array.isArray(herbCategoryList.categories)
    ? herbCategoryList.categories
    : Array.isArray(herbCategoryList)
      ? herbCategoryList
      : [];
  categories.forEach(cat => {
    (cat.subcategories || []).forEach(subcat => {
      (subcat.herbs || []).forEach(herb => {
        pairs.push({
          left: herb,
          right: herb,
          mode: "name-category",
          category: cat.category || cat.name, // <--- PATCHED
          subcategory: subcat.name || subcat.title,
        });
      });
    });
  });
  return uniquePairs(pairs);
}

export function generateNameGroupPairs(herbGroupsList, allHerbs = []) {
  // herbGroupsList: contents of herbGroupsList.json
  // allHerbs: array of all MongoDB herb objects (for extra info, optional)
  // Returns: [{ left: displayName, right: groupName, herbObj }]
  let pairs = [];
  const groupArr = Array.isArray(herbGroupsList.groups)
    ? herbGroupsList.groups
    : Array.isArray(herbGroupsList)
      ? herbGroupsList
      : [];
  groupArr.forEach(group => {
    (group.herbs || []).forEach(herbName => {
      // Try to get herb object from allHerbs by normalized pinyinName/name
      let herbObj = null;
      if (allHerbs && allHerbs.length) {
        const norm = normalize(
          typeof herbName === "object"
            ? herbName.pinyinName || herbName.name
            : herbName
        );
        herbObj = allHerbs.find(h =>
          normalize(h.pinyinName || h.name) === norm
        );
      }
      // If herbName is a string, use as displayName, else use all display names
      const displayNames = typeof herbName === "object"
        ? getHerbDisplayNames(herbName)
        : [herbName.replace(/\(.*?\)/, "").trim()];
      displayNames.forEach(name => {
        pairs.push({
          left: name,
          right: group.category || group.group || group.name,
          herbObj: herbObj || herbName,
          mode: "name-group",
          group: group.category || group.group || group.name,
        });
      });
    });
  });
  return uniquePairs(pairs);
}

// --- Main Pair Generator ---
export function generateHerbGamePairs({
  herbCategoryList,
  herbGroupsList,
  allHerbs = [],
  mode = "name-keyActions"
}) {
  if (mode === "name-keyActions") {
    return generateNameKeyActionsPairs(herbCategoryList);
  } else if (mode === "name-category") {
    return generateNameCategoryPairs(herbCategoryList);
  } else if (mode === "name-group") {
    return generateNameGroupPairs(herbGroupsList, allHerbs);
  } else {
    return [];
  }
}

// --- Utility: Shuffle (Fisher-Yates) ---
export function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// --- Utility: Format Card Pair for Memory Game ---
export function generateCardPairs(pairs, mode) {
  // Each pair: { left, right }
  // Returns: [{ id, value, type, pairId }, ...] * 2 for memory game
  return pairs.map((pair, idx) => [
    {
      id: `herbgame-${pair.left}-name-${idx}`,
      value: pair.left,
      type: "name",
      pairId: `herbgame-${idx}`,
      herbObj: pair.herbObj,
      mode,
    },
    {
      id: `herbgame-${pair.right}-${mode}-${idx}`,
      value: pair.right,
      type: mode.replace("name-", ""),
      pairId: `herbgame-${idx}`,
      herbObj: pair.herbObj,
      mode,
    },
  ]);
}

// --- Utility: Flatten and Shuffle for Game Board ---
export function prepareGameCards(pairs, mode) {
  const cardPairs = generateCardPairs(pairs, mode);
  return shuffle(cardPairs.flat());
}