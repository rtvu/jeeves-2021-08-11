function copyByJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function formatHexColorCode(string) {
  if (typeof string !== "string") {
    return null;
  }

  string = string.trim().toLowerCase();

  let result = undefined;

  result = /^#?([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})$/i.exec(string);
  if (result) {
    return "#" + result[1] + result[2] + result[3];
  }

  result = /^#?([0-9a-f]{1})([0-9a-f]{1})([0-9a-f]{1})$/i.exec(string);
  if (result) {
    return "#" + result[1] + result[1] + result[2] + result[2] + result[3] + result[3];
  }

  return null;
}

function hexToRGB(string) {
  const result = /^#([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i.exec(string);

  return result
    ? {
        R: parseInt(result[1], 16),
        G: parseInt(result[2], 16),
        B: parseInt(result[3], 16),
      }
    : null;
}

function isIntegerString(string) {
  return /^[-+]?[0-9]+$/g.test(string);
}

function isNonNegativeIntegerString(string) {
  return string === "-0" || /^[+]?[0-9]+$/g.test(string);
}

export { copyByJSON, formatHexColorCode, hexToRGB, isIntegerString, isNonNegativeIntegerString };
