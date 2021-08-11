import { isNonNegativeIntegerString } from "../../common/utilities";

const inputsProperties = ["colorant", "offset", "dieHeights", "overlaps"];

const formattedInputsProperties = ["colorant", "offset", "dieHeights", "overlaps"];

const validationsProperties = [
  "colorantValid",
  "colorantUnique",
  "offsetValid",
  "dieHeightsValid",
  "overlapsValid",
  "dieHeightsToOverlapsValid",
];

function getCarriageVersions() {
  return ["1.0"];
}

function getDefaultCarriageVersion() {
  return "1.0";
}

function getDefaultCarriageJson() {
  return `{"version":"${getDefaultCarriageVersion()}","title":"","components":[]}`;
}

function getDefaultCarriage(idCounter = 0) {
  return {
    idCounter: idCounter,
    ids: [],
    components: {},
    title: "",
    valid: true,
    version: getDefaultCarriageVersion(),
  };
}

function getDefaultComponent() {
  return {
    inputs: {
      colorant: "",
      offset: "",
      dieHeights: "",
      overlaps: "",
    },
    formattedInputs: {
      colorant: null,
      offset: null,
      dieHeights: null,
      overlaps: null,
    },
    validations: {
      colorantValid: null,
      colorantUnique: null,
      offsetValid: null,
      dieHeightsValid: null,
      overlapsValid: null,
      dieHeightsToOverlapsValid: null,
    },
  };
}

function appendComponent(carriage, inputs = {}) {
  const id = carriage.idCounter;

  carriage.ids.push({ id: id });
  carriage.components[id] = fromInputsToComponent(inputs);
  carriage.idCounter += 1;
}

function deleteComponent(carriage, id) {
  carriage.ids = carriage.ids.filter(({ id: xId }) => xId !== id);
  delete carriage.components[id];
}

function updateComponent(carriage, id, input, value) {
  carriage.components[id].inputs[input] = value;
}

function fromInputsToComponent(inputs = {}) {
  const component = getDefaultComponent();
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

function parseColorant(string) {
  string = string.trim();

  if (string.length < 1 || /\s/g.test(string) || /^[^A-Z]/i.test(string)) {
    return [null, false];
  } else {
    return [string, true];
  }
}

function parseOffset(string) {
  string = string.trim();

  if (isNonNegativeIntegerString(string)) {
    const integer = parseInt(string, 10);

    return [integer, true];
  } else {
    return [null, false];
  }
}

function parseIntegerStringList(string) {
  string = string.trim();

  if (string === "") {
    return [[], true];
  }

  const list = string.split(",").map((x) => x.trim());

  if (list.every(isNonNegativeIntegerString)) {
    const integerList = list.map((x) => parseInt(x, 10));

    return [integerList, true];
  } else {
    return [[], false];
  }
}

function validateCarriage(carriage, colorantToColor) {
  for (let i = 0; i < carriage.ids.length; i++) {
    const id = carriage.ids[i].id;

    validateComponent(carriage.components[id], colorantToColor);
  }

  validateColorantUniqueness(carriage);

  carriage.valid = carriage.ids.every(({ id: id }) => {
    return isValidComponent(carriage.components[id]);
  });
}

function validateComponent(component, colorantToColor) {
  const [colorant, colorantValid] = parseColorant(component.inputs.colorant);
  component.formattedInputs.colorant = colorant;
  component.validations.colorantValid = colorantValid;
  if (colorantValid && !Object.prototype.hasOwnProperty.call(colorantToColor, colorant)) {
    component.validations.colorantValid = false;
  }

  const [offset, offsetValid] = parseOffset(component.inputs.offset);
  component.formattedInputs.offset = offset;
  component.validations.offsetValid = offsetValid;

  const [dieHeights, dieHeightsValid] = parseIntegerStringList(component.inputs.dieHeights);
  component.formattedInputs.dieHeights = dieHeights;
  component.validations.dieHeightsValid = dieHeightsValid;
  if (dieHeightsValid && dieHeights.length === 0) {
    component.validations.dieHeightsValid = false;
  }

  const [overlaps, overlapsValid] = parseIntegerStringList(component.inputs.overlaps);
  component.formattedInputs.overlaps = overlaps;
  component.validations.overlapsValid = overlapsValid;

  validateDieHeightsToOverlaps(component);
}

function validateDieHeightsToOverlaps(component) {
  if (
    component.validations.dieHeightsValid &&
    component.validations.overlapsValid &&
    component.formattedInputs.dieHeights.length - 1 === component.formattedInputs.overlaps.length
  ) {
    for (let i = 0; i < component.formattedInputs.dieHeights.length; i++) {
      let minimumHeight = 0;

      if (i > 0) {
        minimumHeight += component.formattedInputs.overlaps[i - 1];
      }

      if (i + 1 < component.formattedInputs.dieHeights.length) {
        minimumHeight += component.formattedInputs.overlaps[i];
      }

      if (minimumHeight > component.formattedInputs.dieHeights[i]) {
        component.validations.dieHeightsToOverlapsValid = false;

        return;
      }
    }

    component.validations.dieHeightsToOverlapsValid = true;

    return;
  }

  component.validations.dieHeightsToOverlapsValid = false;
}

function validateColorantUniqueness(carriage) {
  const store = {};
  const ids = carriage.ids;
  const components = carriage.components;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].id;
    const component = components[id];

    if (component.validations.colorantValid) {
      const colorant = component.formattedInputs.colorant;

      component.validations.colorantUnique = true;

      if (Object.prototype.hasOwnProperty.call(store, colorant)) {
        const referenceId = store[colorant];

        component.validations.colorantUnique = false;
        components[referenceId].validations.colorantUnique = false;
      } else {
        store[colorant] = id;
      }
    } else {
      component.validations.colorantUnique = false;
    }
  }
}

function isValidComponent(component) {
  return validationsProperties.map((property) => component.validations[property]).every((x) => x);
}

function isValidCarriageJson(carriageJson) {
  try {
    const parsed = JSON.parse(carriageJson);

    if (
      !(
        Object.prototype.hasOwnProperty.call(parsed, "version") &&
        getCarriageVersions().includes(parsed.version) &&
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
          typeof component.colorant === "string" &&
          Number.isInteger(component.offset) &&
          Array.isArray(component.dieHeights) &&
          Array.isArray(component.overlaps)
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

function toCarriageJson(carriage) {
  if (carriage.valid) {
    const version = carriage.version;
    const title = carriage.title.trim();
    const components = [];

    for (let i = 0; i < carriage.ids.length; i++) {
      const id = carriage.ids[i].id;

      components.push(carriage.components[id].formattedInputs);
    }

    const carriageJson = JSON.stringify({ version: version, title: title, components: components });

    return carriageJson;
  } else {
    return null;
  }
}

function toCarriage(carriageJson, colorantToColor, idCounter = 0) {
  try {
    if (!isValidCarriageJson(carriageJson)) {
      return null;
    }

    const parsed = JSON.parse(carriageJson);

    const carriage = getDefaultCarriage(idCounter);

    carriage.version = parsed.version;
    carriage.title = parsed.title;

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];
      const colorant = component.colorant;
      const offset = component.offset.toString();
      const dieHeights = component.dieHeights.join(", ");
      const overlaps = component.overlaps.join(", ");

      appendComponent(carriage, { colorant, offset, dieHeights, overlaps });
    }

    validateCarriage(carriage, colorantToColor);

    return carriage;
  } catch (error) {
    return null;
  }
}

function formatCarriageJson(carriageJson) {
  const parsed = JSON.parse(carriageJson);

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
        if (["dieHeights", "overlaps"].includes(property)) {
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
  getCarriageVersions,
  getDefaultCarriageVersion,
  getDefaultCarriageJson,
  getDefaultCarriage,
  appendComponent,
  deleteComponent,
  updateComponent,
  validateCarriage,
  toCarriageJson,
  toCarriage,
  formatCarriageJson,
};
