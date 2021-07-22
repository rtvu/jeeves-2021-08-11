import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Context from "./Context";
import { copyByJSON } from "../common/utilities";

function fromColorantsDefinitionToInput(colorantsDefinition) {
  colorantsDefinition = copyByJSON(colorantsDefinition);

  return {
    userInput: {
      color: colorantsDefinition[1],
      colorants: colorantsDefinition[0].join(", "),
    },
    formattedInput: {
      color: colorantsDefinition[1],
      colorants: colorantsDefinition[0],
    },
    validations: {
      colorValid: validateColorString(colorantsDefinition[1]),
      colorUnique: null,
      colorantsValid: validateColorantsString(colorantsDefinition[0].join(", ")),
      colorantsUnique: null,
    },
  };
}

function defaultInput() {
  const colorantsDefinition = [[], "#ffffff"];

  return fromColorantsDefinitionToInput(colorantsDefinition);
}

function defaultInputsContainer() {
  return {
    inputs: [],
    valid: false,
    validated: false,
  };
}

function validateColorString(string) {
  return /^#[0-9A-F]{6}$/i.test(string.trim());
}

function validateColorantsString(string) {
  return (
    string
      .split(",")
      .map((x) => x.trim())
      .indexOf("") < 0
  );
}

function validateColorUniqueness(inputs) {
  const store = {};

  for (let i = 0; i < inputs.length; i++) {
    const color = inputs[i].formattedInput.color;

    inputs[i].validations.colorUnique = true;

    if (Object.prototype.hasOwnProperty.call(store, color)) {
      const referenceIndex = store[color];

      inputs[i].validations.colorUnique = false;
      inputs[referenceIndex].validations.colorUnique = false;
    } else {
      store[color] = i;
    }
  }
}

function validateColorantUniqueness(inputs) {
  const store = {};

  for (let i = 0; i < inputs.length; i++) {
    const colorants = inputs[i].formattedInput.colorants;

    inputs[i].validations.colorantsUnique = true;

    for (let j = 0; j < colorants.length; j++) {
      const colorant = colorants[j];

      if (Object.prototype.hasOwnProperty.call(store, colorant)) {
        const referenceIndex = store[colorant];

        inputs[i].validations.colorantsUnique = false;
        inputs[referenceIndex].validations.colorantsUnique = false;
      } else {
        store[colorant] = i;
      }
    }
  }
}

function validateInput(input) {
  const validations = input.validations;

  return validations.colorValid && validations.colorUnique && validations.colorantsValid && validations.colorantsUnique;
}

function validateInputsContainer(inputsContainer) {
  inputsContainer.valid = true;

  for (let i = 0; i < inputsContainer.inputs.length; i++) {
    if (!validateInput(inputsContainer.inputs[i])) {
      inputsContainer.valid = false;

      return;
    }
  }
}

const DefineColorantsInput = () => {
  // Hooks

  const { customColorantsDefinitionsHook } = useContext(Context);
  const [customColorantsDefinitions, setCustomColorantsDefinitions] = customColorantsDefinitionsHook;

  const [inputsContainer, setInputsContainer] = useState(defaultInputsContainer());

  const [confirmDelete, setConfirmDelete] = useState({ index: -1, requireConfirmation: true, showModal: false });

  useEffect(() => {
    const newInputsContainer = defaultInputsContainer();

    for (const colorantsDefiniton of customColorantsDefinitions) {
      const input = fromColorantsDefinitionToInput(colorantsDefiniton);

      newInputsContainer.inputs.push(input);
    }

    setInputsContainer(newInputsContainer);
  }, [customColorantsDefinitions, setInputsContainer]);

  useEffect(() => {
    if (!inputsContainer.validated) {
      if (inputsContainer.inputs.length > 0) {
        const newInputsContainer = copyByJSON(inputsContainer);

        validateColorUniqueness(newInputsContainer.inputs);
        validateColorantUniqueness(newInputsContainer.inputs);
        validateInputsContainer(newInputsContainer);

        newInputsContainer.validated = true;

        setInputsContainer(newInputsContainer);
      } else {
        const newInputsContainer = defaultInputsContainer();

        newInputsContainer.inputs.push(defaultInput());

        setInputsContainer(newInputsContainer);
      }
    }
  }, [inputsContainer, setInputsContainer]);

  // Functions

  const addInput = () => {
    setInputsContainer((inputsContainer) => {
      const newInputsContainer = copyByJSON(inputsContainer);

      newInputsContainer.inputs.push(defaultInput());

      newInputsContainer.validated = false;

      return newInputsContainer;
    });
  };

  const deleteInput = (index) => {
    setInputsContainer((inputsContainer) => {
      const newInputsContainer = copyByJSON(inputsContainer);

      newInputsContainer.inputs.splice(index, 1);

      newInputsContainer.validated = false;

      return newInputsContainer;
    });
  };

  const triggerConfirmDelete = (index) => {
    return () => {
      if (confirmDelete.requireConfirmation) {
        setConfirmDelete((confirmDelete) => {
          const newConfirmDelete = copyByJSON(confirmDelete);

          newConfirmDelete.index = index;
          newConfirmDelete.show = true;

          return newConfirmDelete;
        });
      } else {
        deleteInput(index);
      }
    };
  };

  const cancelConfirmDelete = () => {
    setConfirmDelete((confirmDelete) => {
      const newConfirmDelete = copyByJSON(confirmDelete);

      newConfirmDelete.index = -1;
      newConfirmDelete.show = false;

      return newConfirmDelete;
    });
  };

  const deleteConfirmDelete = () => {
    setConfirmDelete((confirmDelete) => {
      const newConfirmDelete = copyByJSON(confirmDelete);

      deleteInput(newConfirmDelete.index);

      newConfirmDelete.index = -1;
      newConfirmDelete.show = false;

      return newConfirmDelete;
    });
  };

  const toggleRequireConfirm = () => {
    setConfirmDelete((confirmDelete) => {
      const newConfirmDelete = copyByJSON(confirmDelete);

      newConfirmDelete.requireConfirmation = !newConfirmDelete.requireConfirmation;

      return newConfirmDelete;
    });
  };

  const updateColor = (index) => {
    return (event) => {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);

        newInputsContainer.inputs[index].userInput.color = event.target.value;

        if (validateColorString(event.target.value)) {
          newInputsContainer.inputs[index].validations.colorValid = true;
          newInputsContainer.inputs[index].formattedInput.color = event.target.value.trim();
        } else {
          newInputsContainer.inputs[index].validations.colorValid = false;
        }

        newInputsContainer.validated = false;

        return newInputsContainer;
      });
    };
  };

  const resetColor = (index) => {
    return () => {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);

        newInputsContainer.inputs[index].userInput.color = newInputsContainer.inputs[index].formattedInput.color;
        newInputsContainer.inputs[index].validations.colorValid = true;

        newInputsContainer.validated = false;

        return newInputsContainer;
      });
    };
  };

  const escapeToResetColor = (index) => {
    return (event) => {
      if (event.key === "Escape") {
        resetColor(index)();
      }
    };
  };

  const updateColorants = (index) => {
    return (event) => {
      setInputsContainer((inputsContainer) => {
        const newInputsContainer = copyByJSON(inputsContainer);
        const colorants = event.target.value;

        newInputsContainer.inputs[index].userInput.colorants = colorants;
        newInputsContainer.inputs[index].formattedInput.colorants = colorants
          .split(",")
          .map((x) => x.trim())
          .filter((x) => x != "");
        newInputsContainer.inputs[index].validations.colorantsValid = validateColorantsString(colorants);

        newInputsContainer.validated = false;

        return newInputsContainer;
      });
    };
  };

  const setColorantsDefinitions = () => {
    const colorantsDefinitions = [];

    for (let i = 0; i < inputsContainer.inputs.length; i++) {
      const colorants = inputsContainer.inputs[i].formattedInput.colorants;
      const color = inputsContainer.inputs[i].formattedInput.color;

      colorantsDefinitions.push([colorants, color]);
    }

    setCustomColorantsDefinitions(colorantsDefinitions);
  };

  const Inputs = (input, index, inputs) => {
    const spaces = inputs.length.toString().length - (index + 1).toString().length;

    return (
      <div key={index.toString()} className="input-group input-group-sm mb-3">
        <span className="input-group-text font-monospace">
          {"\xa0".repeat(spaces)}
          {(index + 1).toString()}
        </span>

        <span className="input-group-text font-monospace">&nbsp;[</span>
        <input
          type="text"
          className={`form-control ${
            input.validations.colorantsValid && input.validations.colorantsUnique ? "" : "is-invalid text-danger"
          }`}
          placeholder="Colorants"
          value={input.userInput.colorants}
          onChange={updateColorants(index)}
        />
        <span className="input-group-text font-monospace">]&nbsp;</span>

        <input
          type="color"
          className={`form-control form-control-color ${input.validations.colorUnique ? "" : "is-invalid"}`}
          value={input.formattedInput.color}
          onChange={updateColor(index)}
        />
        <input
          type="text"
          className={`form-control font-monospace ${
            input.validations.colorValid && input.validations.colorUnique ? "" : "is-invalid text-danger"
          }`}
          maxLength="7"
          value={input.userInput.color}
          onChange={updateColor(index)}
          onBlur={resetColor(index)}
          onKeyDown={escapeToResetColor(index)}
        />

        <button type="button" className="btn btn-outline-secondary" onClick={triggerConfirmDelete(index)}>
          Delete
        </button>
      </div>
    );
  };

  const ConfirmDeleteModal = () => {
    return (
      <Modal show={confirmDelete.show} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Confirm delete.</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <button type="button" className="btn btn-secondary" onClick={cancelConfirmDelete}>
            Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={deleteConfirmDelete}>
            Delete
          </button>
        </Modal.Footer>
      </Modal>
    );
  };

  return (
    <div>
      {inputsContainer.inputs.map(Inputs)}
      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={addInput}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setColorantsDefinitions}
          disabled={!inputsContainer.valid}
        >
          Set
        </button>
        <div className="form-check form-check-inline">
          <input
            className="form-check-input"
            type="checkbox"
            id="deleteRequiresConfirmation"
            checked={confirmDelete.requireConfirmation}
            onChange={toggleRequireConfirm}
          />
          <label className="form-check-label" htmlFor="deleteRequiresConfirmation">
            Confirm Delete
          </label>
        </div>
      </div>
      {ConfirmDeleteModal()}
    </div>
  );
};

export default DefineColorantsInput;
