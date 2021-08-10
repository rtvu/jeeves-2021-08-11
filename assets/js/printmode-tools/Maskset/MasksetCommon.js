import { isIntegerString } from "../../common/utilities";

const inputsProperties = [
  "display",
  "colorants",
  "inkLimit",
  "ramps",
  "specification",
  "showInterleave",
  "interleaveNozzles",
  "showWeave",
  "offset",
];

const formattedInputsProperties = [
  "display",
  "colorants",
  "inkLimit",
  "ramps",
  "height",
  "passes",
  "frontVoids",
  "backVoids",
  "pairings",
  "versions",
  "showInterleave",
  "interleaveNozzles",
  "showWeave",
  "offset",
];

const validationsProperties = [
  "displayValid",
  "colorantsValid",
  "colorantsUnique",
  "inkLimitValid",
  "rampsValid",
  "specificationValid",
  "showInterleaveValid",
  "interleaveNozzlesValid",
  "showWeaveValid",
  "offsetValid",
];

function masksetVersions() {
  return ["1.0"];
}

function inkLimits() {
  return [3, 5, 6, 8, 9];
}

function defaultMasksetVersion() {
  return "1.0";
}

function defaultInkLimit() {
  return 3;
}

function defaultMasksetJson() {
  return `{"version":"${defaultMasksetVersion()}","title":"","components":[]}`;
}

function defaultMaskset(idCounter = 0) {
  return {
    idCounter: idCounter,
    ids: [],
    components: {},
    title: "",
    valid: true,
    version: defaultMasksetVersion(),
  };
}

function defaultComponent() {
  return {
    inputs: {
      display: "off",
      colorants: "",
      inkLimit: defaultInkLimit().toString(),
      ramps: "off",
      specification: "",
      showInterleave: "off",
      interleaveNozzles: "0",
      showWeave: "off",
      offset: "-1",
    },
    formattedInputs: {
      display: null,
      colorants: null,
      inkLimit: null,
      ramps: null,
      height: null,
      passes: null,
      frontVoids: null,
      backVoids: null,
      pairings: null,
      versions: null,
      showInterleave: null,
      interleaveNozzles: null,
      showWeave: null,
      offset: null,
    },
    validations: {
      displayValid: null,
      colorantsValid: null,
      colorantsUnique: null,
      inkLimitValid: null,
      rampsValid: null,
      specificationValid: null,
      showInterleaveValid: null,
      interleaveNozzlesValid: null,
      showWeaveValid: null,
      offsetValid: null,
    },
  };
}

function appendComponent(maskset, inputs = {}) {
  const id = maskset.idCounter;

  maskset.ids.push({ id: id });
  maskset.components[id] = fromInputsToComponent(inputs);
  maskset.idCounter += 1;
}

function deleteComponent(maskset, id) {
  maskset.ids = maskset.ids.filter(({ id: xId }) => xId !== id);
  delete maskset.components[id];
}

function updateComponent(maskset, id, input, value) {
  maskset.components[id].inputs[input] = value;
}

function fromInputsToComponent(inputs = {}) {
  const component = defaultComponent();
  const source = {};

  for (let i = 0; i < inputsProperties.length; i++) {
    const property = inputsProperties[i];

    if (Object.prototype.hasOwnProperty.call(inputs, property)) {
      source[property] = inputs[property];
    }
  }

  Object.assign(component.inputs, source);

  return component;
}

function parseOnOff(string) {
  string = string.trim();

  if (string === "on") {
    return [true, true];
  }

  if (string === "off") {
    return [false, true];
  }

  return [null, false];
}

function isValidColorant(string, colorantToColor) {
  string = string.trim();

  if (
    string.length < 1 ||
    /\s/g.test(string) ||
    /^[^A-Z]/i.test(string) ||
    !Object.prototype.hasOwnProperty.call(colorantToColor, string)
  ) {
    return false;
  } else {
    return true;
  }
}

function parseColorants(string, colorantToColor) {
  string = string.trim();

  if (string === "") {
    return [[], false];
  }

  const list = string.split(",").map((x) => x.trim());

  if (list.indexOf("") < 0 && list.every((x) => isValidColorant(x, colorantToColor))) {
    return [list, true];
  } else {
    return [[], false];
  }
}

function parseValidInteger(string, validator) {
  string = string.trim();

  if (!isIntegerString(string)) {
    return [null, false];
  }

  const integer = parseInt(string);

  if (!validator(integer)) {
    return [null, false];
  }

  return [integer, true];
}

function parseSpecification(string) {
  string = string.trim();

  const list = string.split(",").map((x) => x.trim());

  if (list.length === 4) {
    list.push("1");
  }

  if (list.length === 5) {
    list.push("1");
  }

  if (list.length !== 6 || list.indexOf("") >= 0) {
    return [{ height: null, passes: null, frontVoids: null, backVoids: null, pairings: null, versions: null }, false];
  }

  const [height, heightValid] = parseValidInteger(list[0], (i) => i > 0);
  const [passes, passesValid] = parseValidInteger(list[1], (i) => i > 0);
  const [frontVoids, frontVoidsValid] = parseValidInteger(list[2], (i) => i >= 0);
  const [backVoids, backVoidsValid] = parseValidInteger(list[3], (i) => i >= 0);
  const [pairings, pairingsValid] = parseValidInteger(list[4], (i) => i > 0);
  const [versions, versionsValid] = parseValidInteger(list[5], (i) => i > 0);

  const result = { height, passes, frontVoids, backVoids, pairings, versions };

  if (heightValid && passesValid && frontVoidsValid && backVoidsValid && pairingsValid && versionsValid) {
    return [result, true];
  } else {
    return [result, false];
  }
}

function validateMaskset(maskset, colorantToColor, _colorantToCarriage) {
  for (let i = 0; i < maskset.ids.length; i++) {
    const id = maskset.ids[i].id;

    validateComponent(maskset.components[id], colorantToColor);
  }

  validateColorantUniqueness(maskset);

  maskset.valid = maskset.ids.every(({ id: id }) => {
    return isValidComponent(maskset.components[id]);
  });
}

function validateComponent(component, colorantToColor) {
  const [display, displayValid] = parseOnOff(component.inputs.display);
  component.formattedInputs.display = display;
  component.validations.displayValid = displayValid;

  const [colorants, colorantsValid] = parseColorants(component.inputs.colorants, colorantToColor);
  component.formattedInputs.colorants = colorants;
  component.validations.colorantsValid = colorantsValid;

  const [inkLimit, inkLimitValid] = parseValidInteger(component.inputs.inkLimit, (i) => inkLimits().includes(i));
  component.formattedInputs.inkLimit = inkLimit;
  component.validations.inkLimitValid = inkLimitValid;

  const [ramps, rampsValid] = parseOnOff(component.inputs.ramps);
  component.formattedInputs.ramps = ramps;
  component.validations.rampsValid = rampsValid;

  const [{ height, passes, frontVoids, backVoids, pairings, versions }, specificationValid] = parseSpecification(
    component.inputs.specification
  );
  component.formattedInputs.height = height;
  component.formattedInputs.passes = passes;
  component.formattedInputs.frontVoids = frontVoids;
  component.formattedInputs.backVoids = backVoids;
  component.formattedInputs.pairings = pairings;
  component.formattedInputs.versions = versions;
  component.validations.specificationValid = specificationValid;

  const [showInterleave, showInterleaveValid] = parseOnOff(component.inputs.showInterleave);
  component.formattedInputs.showInterleave = showInterleave;
  component.validations.showInterleaveValid = showInterleaveValid;

  const [interleaveNozzles, interleaveNozzlesValid] = parseValidInteger(
    component.inputs.interleaveNozzles,
    (i) => i >= 0
  );
  component.formattedInputs.interleaveNozzles = interleaveNozzles;
  component.validations.interleaveNozzlesValid = interleaveNozzlesValid;

  const [showWeave, showWeaveValid] = parseOnOff(component.inputs.showWeave);
  component.formattedInputs.showWeave = showWeave;
  component.validations.showWeaveValid = showWeaveValid;

  const [offset, offsetValid] = parseValidInteger(component.inputs.offset, (i) => i >= -1);
  component.formattedInputs.offset = offset;
  component.validations.offsetValid = offsetValid;
}

function validateColorantUniqueness(maskset) {
  const store = {};
  const ids = maskset.ids;
  const components = maskset.components;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].id;
    const colorants = components[id].formattedInputs.colorants;

    components[id].validations.colorantsUnique = true;

    for (let j = 0; j < colorants.length; j++) {
      const colorant = colorants[j];

      if (Object.prototype.hasOwnProperty.call(store, colorant)) {
        const referenceId = store[colorant];

        components[id].validations.colorantsUnique = false;
        components[referenceId].validations.colorantsUnique = false;
      } else {
        store[colorant] = id;
      }
    }
  }
}

function isValidComponent(component) {
  return validationsProperties.map((property) => component.validations[property]).every((x) => x);
}

function isValidMasksetJson(masksetJson) {
  try {
    const parsed = JSON.parse(masksetJson);
    if (
      !(
        Object.prototype.hasOwnProperty.call(parsed, "version") &&
        masksetVersions().includes(parsed.version) &&
        Object.prototype.hasOwnProperty.call(parsed, "title") &&
        typeof parsed.title === "string" &&
        Object.prototype.hasOwnProperty.call(parsed, "components") &&
        Array.isArray(parsed.components)
      )
    ) {
      return false;
    }

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];

      if (
        !(
          typeof component.display === "boolean" &&
          Array.isArray(component.colorants) &&
          Number.isInteger(component.inkLimit) &&
          typeof component.ramps === "boolean" &&
          Number.isInteger(component.height) &&
          Number.isInteger(component.passes) &&
          Number.isInteger(component.frontVoids) &&
          Number.isInteger(component.backVoids) &&
          Number.isInteger(component.pairings) &&
          Number.isInteger(component.versions) &&
          typeof component.showInterleave === "boolean" &&
          Number.isInteger(component.interleaveNozzles) &&
          typeof component.showWeave === "boolean" &&
          Number.isInteger(component.offset)
        )
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

function toMasksetJson(maskset) {
  if (maskset.valid) {
    const version = maskset.version;
    const title = maskset.title.trim();
    const components = [];

    for (let i = 0; i < maskset.ids.length; i++) {
      const id = maskset.ids[i].id;

      components.push(maskset.components[id].formattedInputs);
    }

    const masksetJson = JSON.stringify({ version: version, title: title, components: components });

    return masksetJson;
  } else {
    return null;
  }
}

function toMaskset(masksetJson, colorantToColor, colorantToCarriage, idCounter = 0) {
  try {
    if (!isValidMasksetJson(masksetJson)) {
      return null;
    }

    const parsed = JSON.parse(masksetJson);

    const maskset = defaultMaskset(idCounter);

    maskset.version = parsed.version;
    maskset.title = parsed.title;

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];
      const display = component.display ? "on" : "off";
      const colorants = component.colorants.join(", ");
      const inkLimit = component.inkLimit.toString();
      const ramps = component.ramps ? "on" : "off";
      const { height, passes, frontVoids, backVoids, pairings, versions } = component;
      const specification = [height, passes, frontVoids, backVoids, pairings, versions].join(", ");
      const showInterleave = component.showInterleave ? "on" : "off";
      const interleaveNozzles = component.interleaveNozzles.toString();
      const showWeave = component.showWeave ? "on" : "off";
      const offset = component.offset.toString();

      appendComponent(maskset, {
        display,
        colorants,
        inkLimit,
        ramps,
        specification,
        showInterleave,
        interleaveNozzles,
        showWeave,
        offset,
      });
    }

    validateMaskset(maskset, colorantToColor, colorantToCarriage);

    return maskset;
  } catch (error) {
    return null;
  }
}

function formatMasksetJson(masksetJson) {
  const parsed = JSON.parse(masksetJson);

  let result = "";

  result += `{\n  "version": "${parsed.version}",\n`;
  result += `  "title": "${parsed.title}",\n`;

  if (parsed.components.length === 0) {
    result += `  "components": []\n`;
  } else {
    result += `  "components": [\n`;

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];

      result += "    {\n";

      for (let j = 0; j < formattedInputsProperties.length; j++) {
        const property = formattedInputsProperties[j];

        let string = JSON.stringify(component[property]);
        if (property === "colorants") {
          string = string.replace(/,/g, ", ");
        }

        result += `      "${property}": ${string}`;
        result += j !== formattedInputsProperties.length - 1 ? ",\n" : "\n";
      }

      result += "    }";
      result += i !== parsed.components.length - 1 ? ",\n" : "\n";
    }

    result += "  ]\n";
  }

  result += "}";

  return result;
}

export {
  masksetVersions,
  inkLimits,
  defaultMasksetVersion,
  defaultInkLimit,
  defaultMasksetJson,
  defaultMaskset,
  appendComponent,
  deleteComponent,
  updateComponent,
  validateMaskset,
  toMasksetJson,
  toMaskset,
  formatMasksetJson,
};
