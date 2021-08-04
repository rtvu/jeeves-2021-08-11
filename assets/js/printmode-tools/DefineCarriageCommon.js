import { copyByJSON, isNonNegativeIntegerString } from "../common/utilities";

function versionIds() {
  return ["1.0"];
}

function defaultCarriageDefinitionString() {
  return '{"version":"1.0","title":"","components":[]}';
}

function defaultCarriage(idCounter = 0) {
  return {
    idCounter: idCounter,
    ids: [],
    components: {},
    title: "",
    valid: true,
    version: "1.0",
  };
}

function defaultComponent() {
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
      dieHeights: [],
      overlaps: [],
    },
    validations: {
      colorantValid: false,
      colorantUnique: false,
      offsetValid: false,
      dieHeightsValid: false,
      overlapsValid: true,
      dieHeightsToOverlapsValid: false,
    },
  };
}

function appendComponent(carriage, colorant = "", offset = "", dieHeights = "", overlaps = "") {
  const id = carriage.idCounter;

  carriage.ids.push({ id: id });
  carriage.components[id] = fromInputsToComponent(colorant, offset, dieHeights, overlaps);
  carriage.idCounter += 1;
}

function deleteComponent(carriage, id) {
  carriage.ids = carriage.ids.filter(({ id: xId }) => xId !== id);
  delete carriage.components[id];
}

function updateComponent(carriage, id, input, value) {
  carriage.components[id].inputs[input] = value;
}

function fromInputsToComponent(colorant = "", offset = "", dieHeights = "", overlaps = "") {
  const component = defaultComponent();

  component.inputs.colorant = copyByJSON(colorant);
  component.inputs.offset = copyByJSON(offset);
  component.inputs.dieHeights = copyByJSON(dieHeights);
  component.inputs.overlaps = copyByJSON(overlaps);

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
    return isComponentValid(carriage.components[id]);
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
        components[referenceId].validations.colorUnique = false;
      } else {
        store[colorant] = id;
      }
    } else {
      component.validations.colorantUnique = false;
    }
  }
}

function isComponentValid(component) {
  return (
    component.validations.colorantValid &&
    component.validations.colorantUnique &&
    component.validations.offsetValid &&
    component.validations.dieHeightsValid &&
    component.validations.overlapsValid &&
    component.validations.dieHeightsToOverlapsValid
  );
}

function isCarriageDefinitionValid(carriageDefinition) {
  if (
    !(
      Object.prototype.hasOwnProperty.call(carriageDefinition, "version") &&
      versionIds().includes(carriageDefinition.version) &&
      Object.prototype.hasOwnProperty.call(carriageDefinition, "title") &&
      typeof carriageDefinition.title === "string" &&
      Object.prototype.hasOwnProperty.call(carriageDefinition, "components") &&
      Array.isArray(carriageDefinition.components)
    )
  ) {
    return false;
  }

  for (let i = 0; i < carriageDefinition.components.length; i++) {
    const component = carriageDefinition.components[i];

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
}

function toCarriageDefinitionString(carriage) {
  if (carriage.valid) {
    const version = carriage.version;
    const title = carriage.title.trim();
    const components = [];

    for (let i = 0; i < carriage.ids.length; i++) {
      const id = carriage.ids[i].id;

      components.push(carriage.components[id].formattedInputs);
    }

    const carriageDefinition = { version: version, title: title, components: components };
    const carriageDefinitionString = JSON.stringify(carriageDefinition);

    return carriageDefinitionString;
  } else {
    return null;
  }
}

function toCarriage(carriageDefinitionString, colorantToColor, idCounter = 0) {
  try {
    const carriageDefinition = JSON.parse(carriageDefinitionString);

    if (!isCarriageDefinitionValid(carriageDefinition)) {
      return null;
    }

    const carriage = defaultCarriage(idCounter);

    carriage.version = carriageDefinition.version;
    carriage.title = carriageDefinition.title;

    for (let i = 0; i < carriageDefinition.components.length; i++) {
      const component = carriageDefinition.components[i];
      const colorant = component.colorant;
      const offset = component.offset.toString();
      const dieHeights = component.dieHeights.join(", ");
      const overlaps = component.overlaps.join(", ");

      appendComponent(carriage, colorant, offset, dieHeights, overlaps);
    }

    validateCarriage(carriage, colorantToColor);

    return carriage;
  } catch (error) {
    return null;
  }
}

export {
  versionIds,
  defaultCarriageDefinitionString,
  defaultCarriage,
  appendComponent,
  deleteComponent,
  updateComponent,
  validateCarriage,
  toCarriageDefinitionString,
  toCarriage,
};
