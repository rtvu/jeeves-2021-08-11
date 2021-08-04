import { copyByJSON } from "./utilities";

const defaultColorToColorants = {
  "#00ffff": ["C", "C0", "C1", "C2"],
  "#aaffff": [].concat(
    ["c", "c0", "c1", "c2"],
    ["LC", "LC0", "LC1", "LC2"],
    ["Lc", "Lc0", "Lc1", "Lc2"],
    ["lc", "lc0", "lc1", "lc2"]
  ),
  "#ff00ff": ["M", "M0", "M1", "M2"],
  "#ffaaff": [].concat(
    ["m", "m0", "m1", "m2"],
    ["LM", "LM0", "LM1", "LM2"],
    ["Lm", "Lm0", "Lm1", "Lm2"],
    ["lm", "lm0", "lm1", "lm2"]
  ),
  "#ffff00": ["Y", "Y0", "Y1", "Y2"],
  "#000000": ["K", "K0", "K1", "K2"],
  "#eeeeff": [].concat(["P", "P0", "P1", "P2"], ["PT", "PT0", "PT1", "PT2"], ["Pt", "Pt0", "Pt1", "Pt2"]),
};

function normalizeColorToColorants(colorToColorants) {
  const newColorToColorants = copyByJSON(colorToColorants);
  for (const color in newColorToColorants) {
    newColorToColorants[color].sort();
  }
  return newColorToColorants;
}

const ColorantTools = {};

ColorantTools.invertColorToColorants = function (colorToColorants) {
  const colorantToColor = {};
  for (const color in colorToColorants) {
    for (let i = 0; i < colorToColorants[color].length; i++) {
      const colorant = colorToColorants[color][i];
      colorantToColor[colorant] = color;
    }
  }
  return colorantToColor;
};

ColorantTools.invertColorantToColor = function (colorantToColor) {
  const colorToColorants = {};
  for (const colorant in colorantToColor) {
    const color = colorantToColor[colorant];
    if (Object.prototype.hasOwnProperty.call(colorToColorants, color)) {
      colorToColorants[color].push(colorant);
    } else {
      colorToColorants[color] = [colorant];
    }
  }
  return normalizeColorToColorants(colorToColorants);
};

ColorantTools.defaultColorToColorants = normalizeColorToColorants(defaultColorToColorants);

ColorantTools.defaultColorantToColor = ColorantTools.invertColorToColorants(ColorantTools.defaultColorToColorants);

ColorantTools.mergeCustomColorantToColor = function (customColorantToColor) {
  const colorantToColor = copyByJSON(ColorantTools.defaultColorantToColor);
  return Object.assign(colorantToColor, customColorantToColor);
};

ColorantTools.mergeCustomColorToColorants = function (customColorToColorants) {
  const customColorantToColor = ColorantTools.invertColorToColorants(customColorToColorants);
  const mergedCustomColorantToColor = ColorantTools.mergeCustomColorantToColor(customColorantToColor);
  return ColorantTools.invertColorantToColor(mergedCustomColorantToColor);
};

export default ColorantTools;
