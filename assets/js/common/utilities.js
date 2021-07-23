function copyByJSON(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function isIntegerString(string) {
  return /^[-+]?[0-9]+$/g.test(string);
}

function isNonNegativeIntegerString(string) {
  return string === "-0" || /^[+]?[0-9]+$/g.test(string);
}

export { copyByJSON, isIntegerString, isNonNegativeIntegerString };
