import { copyByJSON, formatHexColorCode } from "./utilities";

const defaultColorToColorants = {
  "#00ffff": ["C", "C0", "C1", "C2"],
  "#aaffff": [].concat(
    ["c", "c0", "c1", "c2"],
    ["lc", "lc0", "lc1", "lc2"],
    ["Lc", "Lc0", "Lc1", "Lc2"],
    ["LC", "LC0", "LC1", "LC2"]
  ),
  "#ff00ff": ["M", "M0", "M1", "M2"],
  "#ffaaff": [].concat(
    ["m", "m0", "m1", "m2"],
    ["lm", "lm0", "lm1", "lm2"],
    ["Lm", "Lm0", "Lm1", "Lm2"],
    ["LM", "LM0", "LM1", "LM2"]
  ),
  "#ffff00": ["Y", "Y0", "Y1", "Y2"],
  "#000000": ["K", "K0", "K1", "K2"],
  "#eeeeff": [].concat(
    ["p", "p0", "p1", "p2"],
    ["pt", "pt0", "pt1", "pt2"],
    ["P", "P0", "P1", "P2"],
    ["Pt", "Pt0", "Pt1", "Pt2"],
    ["PT", "PT0", "PT1", "PT2"]
  ),
  "#eeffee": [].concat(
    ["s", "s0", "s1", "s2"],
    ["S", "S0", "S1", "S2"],
    ["oc", "oc0", "oc1", "oc2"],
    ["Oc", "Oc0", "Oc1", "Oc2"],
    ["OC", "OC0", "OC1", "OC2"]
  ),
  "#ffeeee": [].concat(
    ["w", "w0", "w1", "w2"],
    ["W", "W0", "W1", "W2"],
    ["wh", "wh0", "wh1", "wh2"],
    ["Wh", "Wh0", "Wh1", "Wh2"],
    ["WH", "WH0", "WH1", "WH2"]
  ),
};

const colorCodePropertiesHandler = {
  get: function (target, property) {
    const colorCode = formatHexColorCode(property);

    if (colorCode) {
      return target[colorCode];
    } else {
      return undefined;
    }
  },
  set: function (target, property, value) {
    const colorCode = formatHexColorCode(property);

    if (colorCode) {
      target[colorCode] = value;

      return true;
    } else {
      return false;
    }
  },
};

const colorCodeValuesHandler = {
  set: function (target, property, value) {
    const colorCode = formatHexColorCode(value);

    if (colorCode) {
      target[property] = colorCode;

      return true;
    } else {
      return false;
    }
  },
};

function withColorCodeProperties(source) {
  const result = new Proxy({}, colorCodePropertiesHandler);

  Object.assign(result, source);

  return result;
}

function withColorCodeValues(source) {
  const result = new Proxy({}, colorCodeValuesHandler);

  Object.assign(result, source);

  return result;
}

function normalizeColorToColorants(colorToColorants) {
  for (const color in colorToColorants) {
    colorToColorants[color].sort();
  }
}

const ColorantTools = {};

ColorantTools.invertColorToColorants = function (colorToColorants) {
  const colorantToColor = withColorCodeValues({});

  for (const color in colorToColorants) {
    for (let i = 0; i < colorToColorants[color].length; i++) {
      const colorant = colorToColorants[color][i];

      colorantToColor[colorant] = color;
    }
  }

  return colorantToColor;
};

ColorantTools.invertColorantToColor = function (colorantToColor) {
  const colorToColorants = withColorCodeProperties({});

  for (const colorant in colorantToColor) {
    const color = colorantToColor[colorant];

    if (Object.prototype.hasOwnProperty.call(colorToColorants, color)) {
      colorToColorants[color].push(colorant);
    } else {
      colorToColorants[color] = [colorant];
    }
  }

  normalizeColorToColorants(colorToColorants);

  return colorToColorants;
};

ColorantTools.getDefaultColorToColorants = function () {
  const colorToColorants = copyByJSON(defaultColorToColorants);

  normalizeColorToColorants(colorToColorants);

  return withColorCodeProperties(colorToColorants);
};

ColorantTools.getDefaultColorantToColor = function () {
  return ColorantTools.invertColorToColorants(ColorantTools.getDefaultColorToColorants());
};

ColorantTools.mergeCustomColorantToColor = function (customColorantToColor) {
  const colorantToColor = ColorantTools.getDefaultColorantToColor();

  return Object.assign(colorantToColor, customColorantToColor);
};

ColorantTools.mergeCustomColorToColorants = function (customColorToColorants) {
  const customColorantToColor = ColorantTools.invertColorToColorants(customColorToColorants);
  const mergedCustomColorantToColor = ColorantTools.mergeCustomColorantToColor(customColorantToColor);

  return ColorantTools.invertColorantToColor(mergedCustomColorantToColor);
};

export default ColorantTools;
