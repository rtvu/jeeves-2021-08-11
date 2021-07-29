import { copyByJSON } from "./utilities";

const defaultColorToColorants = {
  "#00ffff": ["C", "C0", "C1", "C2"],
  "#aaffff": ["c", "c0", "c1", "c2"],
  "#ff00ff": ["M", "M0", "M1", "M2"],
  "#ffaaff": ["m", "m0", "m1", "m2"],
  "#ffff00": ["Y", "Y0", "Y1", "Y2"],
  "#000000": ["K", "K0", "K1", "K2"],
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
