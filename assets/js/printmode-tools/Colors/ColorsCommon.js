function customColorantsVersions() {
  return ["1.0"];
}

function defaultCustomColorantsDefinitionString() {
  return '{"version":"1.0","components":[]}';
}

function defaultCustomColorants(idCounter = 0) {
  return {
    idCounter: idCounter,
    ids: [],
    components: {},
    valid: true,
    version: "1.0",
  };
}

function defaultComponent() {
  return {
    inputs: {
      color: "#ffffff",
      colorants: "",
    },
    formattedInputs: {
      color: "#ffffff",
      colorants: [],
    },
    validations: {
      colorValid: false,
      colorUnique: false,
      colorantsValid: true,
      colorantsUnique: false,
    },
  };
}

function appendComponent(customColorants, color = "#ffffff", colorants = "") {
  const id = customColorants.idCounter;

  customColorants.ids.push({ id: id });
  customColorants.components[id] = fromInputsToComponent(color, colorants);
  customColorants.idCounter += 1;
}

function deleteComponent(customColorants, id) {
  customColorants.ids = customColorants.ids.filter(({ id: xId }) => xId !== id);
  delete customColorants.components[id];
}

function updateComponent(customColorants, id, input, value) {
  customColorants.components[id].inputs[input] = value;
}

function fromInputsToComponent(color = "", colorants = "") {
  const component = defaultComponent();

  component.inputs.color = color;
  component.inputs.colorants = colorants;

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

function validateCustomColorants(customColorants) {
  for (let i = 0; i < customColorants.ids.length; i++) {
    const id = customColorants.ids[i].id;

    validateComponent(customColorants.components[id]);
  }

  validateColorUniqueness(customColorants);
  validateColorantUniqueness(customColorants);

  customColorants.valid = customColorants.ids.every(({ id: id }) => {
    return isComponentValid(customColorants.components[id]);
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

function validateColorUniqueness(customColorants) {
  const store = {};
  const ids = customColorants.ids;
  const components = customColorants.components;

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

function validateColorantUniqueness(customColorants) {
  const store = {};
  const ids = customColorants.ids;
  const components = customColorants.components;

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

function isComponentValid(component) {
  return (
    component.validations.colorValid &&
    component.validations.colorUnique &&
    component.validations.colorantsValid &&
    component.validations.colorantsUnique
  );
}

function isCustomColorantsDefinitionValid(customColorantsDefinition) {
  if (
    !(
      Object.prototype.hasOwnProperty.call(customColorantsDefinition, "version") &&
      customColorantsVersions().includes(customColorantsDefinition.version) &&
      Object.prototype.hasOwnProperty.call(customColorantsDefinition, "components") &&
      Array.isArray(customColorantsDefinition.components)
    )
  ) {
    return false;
  }

  for (let i = 0; i < customColorantsDefinition.components.length; i++) {
    const component = customColorantsDefinition.components[i];

    if (!(typeof component.color === "string" && Array.isArray(component.colorants))) {
      return false;
    }
  }

  return true;
}

function toCustomColorantsDefinitionString(customColorants) {
  if (customColorants.valid) {
    const version = customColorants.version;
    const components = [];

    for (let i = 0; i < customColorants.ids.length; i++) {
      const id = customColorants.ids[i].id;

      components.push(customColorants.components[id].formattedInputs);
    }

    const customColorantsDefinition = { version: version, components: components };
    const customColorantsDefinitionString = JSON.stringify(customColorantsDefinition);

    return customColorantsDefinitionString;
  } else {
    return null;
  }
}

function toCustomColorants(customColorantsDefinitionString, idCounter = 0) {
  try {
    const customColorantsDefinition = JSON.parse(customColorantsDefinitionString);

    if (!isCustomColorantsDefinitionValid(customColorantsDefinition)) {
      return null;
    }

    const customColorants = defaultCustomColorants(idCounter);

    customColorants.version = customColorantsDefinition.version;

    for (let i = 0; i < customColorantsDefinition.components.length; i++) {
      const component = customColorantsDefinition.components[i];
      const color = component.color;
      const colorants = component.colorants.join(", ");

      appendComponent(customColorants, color, colorants);
    }

    validateCustomColorants(customColorants);

    return customColorants;
  } catch (error) {
    return null;
  }
}

function formatCustomColorantsDefinitionString(customColorantsDefinitionString) {
  const customColorantsDefinition = JSON.parse(customColorantsDefinitionString);

  let result = "";

  result += `{\n  "version": "${customColorantsDefinition.version}",\n`;

  if (customColorantsDefinition.components.length === 0) {
    result += `  "components": []\n`;
  } else {
    result += `  "components": [\n`;

    for (let i = 0; i < customColorantsDefinition.components.length; i++) {
      const color = JSON.stringify(customColorantsDefinition.components[i].color);
      const colorants = JSON.stringify(customColorantsDefinition.components[i].colorants).replace(/,/g, ", ");
      const component = `    {\n      "color": ${color},\n      "colorants": ${colorants}\n    }`;

      result += component;

      if (i !== customColorantsDefinition.components.length - 1) {
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
  customColorantsVersions,
  defaultCustomColorantsDefinitionString,
  defaultCustomColorants,
  appendComponent,
  deleteComponent,
  updateComponent,
  validateCustomColorants,
  toCustomColorantsDefinitionString,
  toCustomColorants,
  formatCustomColorantsDefinitionString,
};
