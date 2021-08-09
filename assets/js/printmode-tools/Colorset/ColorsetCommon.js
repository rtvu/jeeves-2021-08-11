const inputsProperties = ["color", "colorants"];

const _formattedInputsProperties = ["color", "colorants"];

const validationsProperties = ["colorValid", "colorUnique", "colorantsValid", "colorantsUnique"];

function colorsetVersions() {
  return ["1.0"];
}

function defaultColorsetVersion() {
  return "1.0";
}

function defaultColorsetJson() {
  return `{"version":"${defaultColorsetVersion()}","components":[]}`;
}

function defaultColorset(idCounter = 0) {
  return {
    idCounter: idCounter,
    ids: [],
    components: {},
    valid: true,
    version: defaultColorsetVersion(),
  };
}

function defaultComponent() {
  return {
    inputs: {
      color: "#ffffff",
      colorants: "",
    },
    formattedInputs: {
      color: null,
      colorants: null,
    },
    validations: {
      colorValid: null,
      colorUnique: null,
      colorantsValid: null,
      colorantsUnique: null,
    },
  };
}

function appendComponent(colorset, inputs = {}) {
  const id = colorset.idCounter;

  colorset.ids.push({ id: id });
  colorset.components[id] = fromInputsToComponent(inputs);
  colorset.idCounter += 1;
}

function deleteComponent(colorset, id) {
  colorset.ids = colorset.ids.filter(({ id: xId }) => xId !== id);
  delete colorset.components[id];
}

function updateComponent(colorset, id, input, value) {
  colorset.components[id].inputs[input] = value;
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

function parseColor(string) {
  string = string.trim();

  if (/^#[0-9A-F]{6}$/i.test(string)) {
    return [string, true];
  } else {
    return [null, false];
  }
}

function isValidColorant(string) {
  string = string.trim();

  if (string.length < 1 || /\s/g.test(string) || /^[^A-Z]/i.test(string)) {
    return false;
  } else {
    return true;
  }
}

function parseColorants(string) {
  string = string.trim();

  if (string === "") {
    return [[], false];
  }

  const list = string.split(",").map((x) => x.trim());

  if (list.indexOf("") < 0 && list.every(isValidColorant)) {
    return [list, true];
  } else {
    return [[], false];
  }
}

function validateColorset(colorset) {
  for (let i = 0; i < colorset.ids.length; i++) {
    const id = colorset.ids[i].id;

    validateComponent(colorset.components[id]);
  }

  validateColorUniqueness(colorset);
  validateColorantUniqueness(colorset);

  colorset.valid = colorset.ids.every(({ id: id }) => {
    return isValidComponent(colorset.components[id]);
  });
}

function validateComponent(component) {
  const [color, colorValid] = parseColor(component.inputs.color);
  if (color !== null) {
    component.formattedInputs.color = color;
  }
  component.validations.colorValid = colorValid;

  const [colorants, colorantsValid] = parseColorants(component.inputs.colorants);
  component.formattedInputs.colorants = colorants;
  component.validations.colorantsValid = colorantsValid;
}

function validateColorUniqueness(colorset) {
  const store = {};
  const ids = colorset.ids;
  const components = colorset.components;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].id;
    const color = components[id].formattedInputs.color;

    components[id].validations.colorUnique = true;

    if (Object.prototype.hasOwnProperty.call(store, color)) {
      const referenceId = store[color];

      components[id].validations.colorUnique = false;
      components[referenceId].validations.colorUnique = false;
    } else {
      store[color] = id;
    }
  }
}

function validateColorantUniqueness(colorset) {
  const store = {};
  const ids = colorset.ids;
  const components = colorset.components;

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

function isValidColorsetJson(colorsetJson) {
  try {
    const parsed = JSON.parse(colorsetJson);

    if (
      !(
        Object.prototype.hasOwnProperty.call(parsed, "version") &&
        colorsetVersions().includes(parsed.version) &&
        Object.prototype.hasOwnProperty.call(parsed, "components") &&
        Array.isArray(parsed.components)
      )
    ) {
      return false;
    }

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];

      if (!(typeof component.color === "string" && Array.isArray(component.colorants))) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

function toColorsetJson(colorset) {
  if (colorset.valid) {
    const version = colorset.version;
    const components = [];

    for (let i = 0; i < colorset.ids.length; i++) {
      const id = colorset.ids[i].id;

      components.push(colorset.components[id].formattedInputs);
    }

    const colorsetJson = JSON.stringify({ version: version, components: components });

    return colorsetJson;
  } else {
    return null;
  }
}

function toColorset(colorsetJson, idCounter = 0) {
  try {
    if (!isValidColorsetJson(colorsetJson)) {
      return null;
    }

    const parsed = JSON.parse(colorsetJson);

    const colorset = defaultColorset(idCounter);

    colorset.version = parsed.version;

    for (let i = 0; i < parsed.components.length; i++) {
      const component = parsed.components[i];
      const color = component.color;
      const colorants = component.colorants.join(", ");

      appendComponent(colorset, { color, colorants });
    }

    validateColorset(colorset);

    return colorset;
  } catch (error) {
    return null;
  }
}

function formatColorsetJson(colorsetJson) {
  const parsed = JSON.parse(colorsetJson);

  let result = "";

  result += `{\n  "version": "${parsed.version}",\n`;

  if (parsed.components.length === 0) {
    result += `  "components": []\n`;
  } else {
    result += `  "components": [\n`;

    for (let i = 0; i < parsed.components.length; i++) {
      const color = JSON.stringify(parsed.components[i].color);
      const colorants = JSON.stringify(parsed.components[i].colorants).replace(/,/g, ", ");
      const component = `    {\n      "color": ${color},\n      "colorants": ${colorants}\n    }`;

      result += component;

      if (i !== parsed.components.length - 1) {
        result += ",";
      }

      result += "\n";
    }

    result += "  ]\n";
  }

  result += "}";

  return result;
}

export {
  colorsetVersions,
  defaultColorsetVersion,
  defaultColorsetJson,
  defaultColorset,
  appendComponent,
  deleteComponent,
  updateComponent,
  validateColorset,
  toColorsetJson,
  toColorset,
  formatColorsetJson,
};
