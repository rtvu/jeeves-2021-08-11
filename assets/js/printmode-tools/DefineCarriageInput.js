import { useContext, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Context from "./Context";
import { copyByJSON, isNonNegativeIntegerString } from "../common/utilities";

function fromUserInputToInput(userInput) {
  const newUserInput = copyByJSON(userInput);

  return {
    userInput: newUserInput,
    formattedInput: {
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
      specificationValid: false,
    },
  };
}

function defaultInput() {
  const userInput = {
    colorant: "",
    offset: "",
    dieHeights: "",
    overlaps: "",
  };

  return fromUserInputToInput(userInput);
}

function defaultInputsContainer() {
  return {
    ids: [],
    inputs: {},
    valid: false,
    validated: false,
    version: "1.0",
  };
}

function parseColorant(string) {
  const newString = string.trim();

  if (newString.length < 1 || /\s/g.test(newString) || /^[^A-Z]/i.test(newString)) {
    return [null, false];
  } else {
    return [newString, true];
  }
}

function parseOffset(string) {
  const newString = string.trim();

  if (isNonNegativeIntegerString(newString)) {
    return [parseInt(newString, 10), true];
  } else {
    return [null, false];
  }
}

function parseIntegerStringList(string) {
  const newString = string.trim();

  if (newString === "") {
    return [[], true];
  }

  const list = newString.split(",").map((x) => x.trim());

  if (list.every(isNonNegativeIntegerString)) {
    return [list.map((x) => parseInt(x, 10)), true];
  } else {
    return [[], false];
  }
}

function validateInputsContainer(inputsContainer) {
  for (let i = 0; i < inputsContainer.ids.length; i++) {
    const id = inputsContainer.ids[i].id;
    validateInput(inputsContainer.inputs[id]);
  }

  validateColorantUniqueness(inputsContainer);

  inputsContainer.valid = inputsContainer.ids.every(({ id: id }) => {
    return isInputValid(inputsContainer.inputs[id]);
  });

  inputsContainer.validated = true;

  return inputsContainer;
}

function validateInput(input) {
  const [colorant, colorantValid] = parseColorant(input.userInput.colorant);
  input.formattedInput.colorant = colorant;
  input.validations.colorantValid = colorantValid;

  const [offset, offsetValid] = parseOffset(input.userInput.offset);
  input.formattedInput.offset = offset;
  input.validations.offsetValid = offsetValid;

  const [dieHeights, dieHeightsValid] = parseIntegerStringList(input.userInput.dieHeights);
  input.formattedInput.dieHeights = dieHeights;
  input.validations.dieHeightsValid = dieHeightsValid;
  if (dieHeightsValid && dieHeights.length === 0) {
    input.validations.dieHeightsValid = false;
  }

  const [overlaps, overlapsValid] = parseIntegerStringList(input.userInput.overlaps);
  input.formattedInput.overlaps = overlaps;
  input.validations.overlapsValid = overlapsValid;

  validateSpecification(input);
}

function validateSpecification(input) {
  if (
    input.validations.dieHeightsValid &&
    input.validations.overlapsValid &&
    input.formattedInput.dieHeights.length - 1 === input.formattedInput.overlaps.length
  ) {
    for (let i = 0; i < input.formattedInput.dieHeights.length; i++) {
      let minimumHeight = 0;

      if (i > 0) {
        minimumHeight += input.formattedInput.overlaps[i - 1];
      }

      if (i + 1 < input.formattedInput.dieHeights.length) {
        minimumHeight += input.formattedInput.overlaps[i];
      }

      if (minimumHeight > input.formattedInput.dieHeights[i]) {
        input.validations.specificationValid = false;

        return;
      }
    }

    input.validations.specificationValid = true;

    return;
  }

  input.validations.specificationValid = false;
}

function validateColorantUniqueness(inputsContainer) {
  const store = {};
  const ids = inputsContainer.ids;
  const inputs = inputsContainer.inputs;

  for (let i = 0; i < ids.length; i++) {
    const id = ids[i].id;
    const input = inputs[id];

    if (input.validations.colorantValid) {
      const colorant = input.formattedInput.colorant;

      input.validations.colorantUnique = true;

      if (Object.prototype.hasOwnProperty.call(store, colorant)) {
        const referenceId = store[colorant];

        input.validations.colorantUnique = false;
        inputs[referenceId].validations.colorUnique = false;
      } else {
        store[colorant] = id;
      }
    } else {
      input.validations.colorantUnique = false;
    }
  }
}

function isInputValid(input) {
  return (
    input.validations.colorantValid &&
    input.validations.colorantUnique &&
    input.validations.offsetValid &&
    input.validations.dieHeightsValid &&
    input.validations.overlapsValid &&
    input.validations.specificationValid
  );
}

function fromInputsContainerToCarriageDefinitionString(inputsContainer) {
  const version = inputsContainer.version;
  const components = [];

  for (let i = 0; i < inputsContainer.ids.length; i++) {
    const id = inputsContainer.ids[i].id;
    components.push(inputsContainer.inputs[id].formattedInput);
  }

  const carriageDefinition = { version: version, components: components };
  return JSON.stringify(carriageDefinition);
}

function fromCarriageDefinitionStringToInputsContainer(carriageDefinitionString, idCounter) {
  const carriageDefinition = JSON.parse(carriageDefinitionString);
  const inputsContainer = defaultInputsContainer();
  const newIdCounter = idCounter + carriageDefinition.components.length;

  inputsContainer.version = carriageDefinition.version;

  for (let i = 0; i < carriageDefinition.components.length; i++) {
    const component = carriageDefinition.components[i];
    const id = idCounter + i;
    const userInput = {
      colorant: component.colorant,
      offset: component.offset.toString(),
      dieHeights: component.dieHeights.join(", "),
      overlaps: component.overlaps.join(", "),
    };

    inputsContainer.ids.push({ id: id });
    inputsContainer.inputs[id] = fromUserInputToInput(userInput);
  }

  return [inputsContainer, newIdCounter];
}

const DefineCarriageInput = () => {
  const { colorantToColorHook } = useContext(Context);
  const [colorantToColor] = colorantToColorHook;

  const { carriageDefinitionStringHook } = useContext(Context);
  const [carriageDefinitionString, setCarriageDefinitionString] = carriageDefinitionStringHook;

  const [idCounter, setIdCounter] = useState(0);

  const [inputsContainer, setInputsContainer] = useState(defaultInputsContainer());

  const setIds = (ids) => {
    setInputsContainer((inputsContainer) => {
      const newInputsContainer = copyByJSON(inputsContainer);

      newInputsContainer.ids = copyByJSON(ids);

      return newInputsContainer;
    });
  };

  const newCarriageDefinitionString = fromInputsContainerToCarriageDefinitionString(inputsContainer);

  const setNewCarriageDefinitionString = () => {
    setCarriageDefinitionString(newCarriageDefinitionString);
  };

  const [referenceCarriageDefinitionString, setReferenceCarriageDefinitionString] = useState(null);

  if (referenceCarriageDefinitionString !== carriageDefinitionString) {
    setReferenceCarriageDefinitionString(carriageDefinitionString);

    const [newInputsContainer, newIdCounter] = fromCarriageDefinitionStringToInputsContainer(
      carriageDefinitionString,
      idCounter
    );

    setIdCounter(newIdCounter);

    setInputsContainer(newInputsContainer);
  }

  const addInput = () => {
    setIdCounter((idCounter) => {
      return idCounter + 1;
    });

    setInputsContainer((inputsContainer) => {
      const newInputsContainer = copyByJSON(inputsContainer);

      newInputsContainer.ids.push({ id: idCounter });
      newInputsContainer.inputs[idCounter] = defaultInput();

      newInputsContainer.validated = false;

      return newInputsContainer;
    });
  };

  const deleteInput = (id) => {
    return () => {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);

        newInputsContainer.ids = newInputsContainer.ids.filter((x) => x.id !== id);
        delete newInputsContainer.inputs[id];

        newInputsContainer.validated = false;

        return newInputsContainer;
      });
    };
  };

  const updateInput = (id, input) => {
    return (event) => {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);

        newInputsContainer.inputs[id].userInput[input] = event.target.value;

        newInputsContainer.validated = false;

        return newInputsContainer;
      });
    };
  };

  if (!inputsContainer.validated) {
    if (Object.keys(inputsContainer.inputs).length > 0) {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);
        return validateInputsContainer(newInputsContainer);
      });
    } else {
      addInput();
    }
  }

  const Input = ({ id: id }) => {
    const colorant = inputsContainer.inputs[id].formattedInput.colorant;

    let colorInput = null;
    if (Object.prototype.hasOwnProperty.call(colorantToColor, colorant)) {
      colorInput = (
        <input
          type="text"
          className="form-control form-control-sm"
          disabled
          style={{ backgroundColor: colorantToColor[colorant] }}
        />
      );
    } else {
      colorInput = (
        <input
          type="text"
          className="form-control form-control-sm is-invalid"
          disabled
          style={{ backgroundColor: "#ffffff" }}
        />
      );
    }

    const colorantValid = inputsContainer.inputs[id].validations.colorantValid;
    const colorantUnique = inputsContainer.inputs[id].validations.colorantUnique;
    const offsetValid = inputsContainer.inputs[id].validations.offsetValid;
    const dieHeightsValid = inputsContainer.inputs[id].validations.dieHeightsValid;
    const overlapsValid = inputsContainer.inputs[id].validations.overlapsValid;
    const specificationValid = inputsContainer.inputs[id].validations.specificationValid;

    return (
      <div key={id} className="row gx-2 align-items-center mb-3">
        <div className="col-1 text-center sortable-handle">☰</div>
        <div className="col-1">{colorInput}</div>
        <div className="col-2">
          <input
            type="text"
            className={`form-control form-control-sm ${colorantValid && colorantUnique ? "" : "is-invalid"}`}
            value={inputsContainer.inputs[id].userInput.colorant}
            onChange={updateInput(id, "colorant")}
          />
        </div>
        <div className="col-2">
          <input
            type="text"
            className={`form-control form-control-sm ${offsetValid ? "" : "is-invalid"}`}
            value={inputsContainer.inputs[id].userInput.offset}
            onChange={updateInput(id, "offset")}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className={`form-control form-control-sm ${dieHeightsValid && specificationValid ? "" : "is-invalid"}`}
            value={inputsContainer.inputs[id].userInput.dieHeights}
            onChange={updateInput(id, "dieHeights")}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className={`form-control form-control-sm ${overlapsValid && specificationValid ? "" : "is-invalid"}`}
            value={inputsContainer.inputs[id].userInput.overlaps}
            onChange={updateInput(id, "overlaps")}
          />
        </div>
        <div className="col-1">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={deleteInput(id)}>
            ✕
          </button>
        </div>
      </div>
    );
  };

  return (
    <div>
      <div className="row gx-2 mb-2">
        <div className="col-1"></div>
        <div className="col-1"></div>
        <div className="col-2">Colorant</div>
        <div className="col-2">Offset</div>
        <div className="col">Die Heights</div>
        <div className="col">Overlaps</div>
        <div className="col-1"></div>
      </div>

      <ReactSortable list={inputsContainer.ids} setList={setIds} handle=".sortable-handle">
        {inputsContainer.ids.map(Input)}
      </ReactSortable>
      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={addInput}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setNewCarriageDefinitionString}
          disabled={!inputsContainer.valid || newCarriageDefinitionString === carriageDefinitionString}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default DefineCarriageInput;
