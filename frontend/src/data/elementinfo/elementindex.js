// elementindex.js
// This file should ONLY contain element metadata and combos mapping, not quiz questions.
// It should export the elementIndex object as the DEFAULT export.

// Example imports (add your actual element metadata imports below):
import yinWoodElement from './yinWoodElement.js';
import yangWoodElement from './yangWoodElement.js';
import yinFireElement from './yinFireElement.js';
import yangFireElement from './yangFireElement.js';
import yinEarthElement from './yinEarthElement.js';
import yangEarthElement from './yangEarthElement.js';
import yinMetalElement from './yinMetalElement.js';
import yangMetalElement from './yangMetalElement.js';
import yinWaterElement from './yinWaterElement.js';
import yangWaterElement from './yangWaterElement.js';

// Combo imports (add all combos you have, e.g. woodFireCombo):
import woodFireCombo from './woodFireCombo.js';
import woodEarthCombo from './woodEarthCombo.js';
import woodMetalCombo from './woodMetalCombo.js';
import woodWaterCombo from './woodWaterCombo.js';
import fireWoodCombo from './fireWoodCombo.js';
import fireEarthCombo from './fireEarthCombo.js';
import fireMetalCombo from './fireMetalCombo.js';
import fireWaterCombo from './fireWaterCombo.js';
import earthWoodCombo from './earthWoodCombo.js';
import earthFireCombo from './earthFireCombo.js';
import earthMetalCombo from './earthMetalCombo.js';
import earthWaterCombo from './earthWaterCombo.js';
import metalWoodCombo from './metalWoodCombo.js';
import metalFireCombo from './metalFireCombo.js';
import metalEarthCombo from './metalEarthCombo.js';
import metalWaterCombo from './metalWaterCombo.js';
import waterWoodCombo from './waterWoodCombo.js';
import waterFireCombo from './waterFireCombo.js';
import waterEarthCombo from './waterEarthCombo.js';
import waterMetalCombo from './waterMetalCombo.js';

// Main mapping object of elementIndex
const elementIndex = {
  'Wood-Yin': yinWoodElement,
  'Wood-Yang': yangWoodElement,
  'Fire-Yin': yinFireElement,
  'Fire-Yang': yangFireElement,
  'Earth-Yin': yinEarthElement,
  'Earth-Yang': yangEarthElement,
  'Metal-Yin': yinMetalElement,
  'Metal-Yang': yangMetalElement,
  'Water-Yin': yinWaterElement,
  'Water-Yang': yangWaterElement,

  // All 20 ordered 2-element combos:
  "Wood-Fire": woodFireCombo,
  "Wood-Earth": woodEarthCombo,
  "Wood-Metal": woodMetalCombo,
  "Wood-Water": woodWaterCombo,

  "Fire-Wood": fireWoodCombo,
  "Fire-Earth": fireEarthCombo,
  "Fire-Metal": fireMetalCombo,
  "Fire-Water": fireWaterCombo,

  "Earth-Wood": earthWoodCombo,
  "Earth-Fire": earthFireCombo,
  "Earth-Metal": earthMetalCombo,
  "Earth-Water": earthWaterCombo,

  "Metal-Wood": metalWoodCombo,
  "Metal-Fire": metalFireCombo,
  "Metal-Earth": metalEarthCombo,
  "Metal-Water": metalWaterCombo,

  "Water-Wood": waterWoodCombo,
  "Water-Fire": waterFireCombo,
  "Water-Earth": waterEarthCombo,
  "Water-Metal": waterMetalCombo,
};

export default elementIndex;