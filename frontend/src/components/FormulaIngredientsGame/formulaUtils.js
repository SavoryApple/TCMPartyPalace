// Utility: Fisher-Yates shuffle (returns a new array)
export function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Utility: Format ingredients array as a string
export function formatIngredients(ingredients) {
  if (!ingredients) return "(No ingredients listed)";
  if (Array.isArray(ingredients)) return ingredients.join(", ");
  return ingredients;
}

// Utility: Get formulas from categoryList JSON given a category and subcategory
export function getFormulasFromCategory(categoryList, category, subcategory) {
  if (!category || !subcategory) return [];
  const catObj = categoryList.find(cat => cat.category === category);
  const subcatObj = catObj?.subcategories.find(sub => sub.title === subcategory);
  return subcatObj?.formulas || [];
}

// Utility: Generate card pairs for the memory game
// mode = "explanation" | "ingredients"
// formulas = array from either categoryList or API
export function generateCardPairs(formulas, mode) {
  if (!formulas || formulas.length === 0) return [];
  // Guarantee unique keys for cards, even with duplicate formula names
  if (mode === "explanation") {
    // Each formula: name ↔ explanation
    return formulas.map((f, idx) => [
      { id: `${f.name}-name-${idx}`, value: f.name, type: "name", pairId: `${f.name}-${idx}` },
      { id: `${f.name}-explanation-${idx}`, value: f.explanation, type: "explanation", pairId: `${f.name}-${idx}` },
    ]);
  } else {
    // Each formula: name ↔ ingredients
    return formulas.map((f, idx) => [
      { id: `${f.name}-name-${idx}`, value: f.name, type: "name", pairId: `${f.name}-${idx}` },
      {
        id: `${f.name}-ingredients-${idx}`,
        value: formatIngredients(f.ingredients),
        type: "ingredients",
        pairId: `${f.name}-${idx}`,
      },
    ]);
  }
}

// Utility: flatten and shuffle card pairs
export function prepareGameCards(formulas, mode) {
  const pairs = generateCardPairs(formulas, mode);
  return shuffle(pairs.flat());
}