import { useContext, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Context from "./Context";
import * as Common from "./DefineCustomColorantsCommon";
import { copyByJSON } from "../common/utilities";

const DefineCustomColorants = () => {
  const { customColorantsDefinitionStringHook } = useContext(Context);

  const [customColorantsDefinitionString, setCustomColorantsDefinitionString] = customColorantsDefinitionStringHook;

  const [customColorants, setCustomColorants] = useState(Common.defaultCustomColorants());

  const setIds = (ids) => {
    setCustomColorants((customColorants) => {
      customColorants = copyByJSON(customColorants);
      customColorants.ids = copyByJSON(ids);
      return customColorants;
    });
  };

  const newCustomColorantsDefinitionString = Common.toCustomColorantsDefinitionString(customColorants);

  const setNewCustomColorantsDefinitionString = () => {
    setCustomColorantsDefinitionString(newCustomColorantsDefinitionString);
  };

  const [referenceCustomColorantsDefinitionString, setReferenceCustomColorantsDefinitionString] = useState(null);

  if (referenceCustomColorantsDefinitionString !== customColorantsDefinitionString) {
    setReferenceCustomColorantsDefinitionString(customColorantsDefinitionString);

    setCustomColorants((customColorants) => {
      const idCounter = customColorants.idCounter;

      customColorants = Common.toCustomColorants(customColorantsDefinitionString, idCounter);

      return customColorants;
    });
  }

  const appendComponent = () => {
    setCustomColorants((customColorants) => {
      customColorants = copyByJSON(customColorants);

      Common.appendComponent(customColorants);
      Common.validateCustomColorants(customColorants);

      return customColorants;
    });
  };

  const deleteComponent = (id) => {
    return () => {
      setCustomColorants((customColorants) => {
        customColorants = copyByJSON(customColorants);

        Common.deleteComponent(customColorants, id);
        Common.validateCustomColorants(customColorants);

        return customColorants;
      });
    };
  };

  const updateComponent = (id, input) => {
    return (event) => {
      setCustomColorants((customColorants) => {
        const value = event.target.value;

        customColorants = copyByJSON(customColorants);

        Common.updateComponent(customColorants, id, input, value);
        Common.validateCustomColorants(customColorants);

        return customColorants;
      });
    };
  };

  const resetColor = (id) => {
    return () => {
      setCustomColorants((customColorants) => {
        customColorants = copyByJSON(customColorants);

        customColorants.components[id].inputs.color = customColorants.components[id].formattedInputs.color;

        Common.validateCustomColorants(customColorants);

        return customColorants;
      });
    };
  };

  const escapeToResetColor = (id) => {
    return (event) => {
      if (event.key === "Escape") {
        resetColor(id)();
      }
    };
  };

  const Component = ({ id: id }) => {
    const component = customColorants.components[id];
    const colorValid = component.validations.colorValid;
    const colorUnique = component.validations.colorUnique;
    const colorantsValid = component.validations.colorantsValid;
    const colorantsUnique = component.validations.colorantsUnique;

    return (
      <div key={id} className="row gx-2 align-items-center mb-3">
        <div className="col-1 text-center sortable-handle">☰</div>
        <div className="col input-group input-group-sm">
          <input
            type="color"
            className={`form-control form-control-color ${colorUnique ? "" : "is-invalid"}`}
            value={component.formattedInputs.color}
            onChange={updateComponent(id, "color")}
          />
          <input
            type="text"
            className={`form-control font-monospace ${colorValid && colorUnique ? "" : "is-invalid text-danger"}`}
            maxLength="7"
            value={component.inputs.color}
            onChange={updateComponent(id, "color")}
            onBlur={resetColor(id)}
            onKeyDown={escapeToResetColor(id)}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className={`form-control form-control-sm ${
              colorantsValid && colorantsUnique ? "" : "is-invalid text-danger"
            }`}
            value={component.inputs.colorants}
            onChange={updateComponent(id, "colorants")}
          />
        </div>
        <div className="col-1">
          <button type="button" className="btn btn-outline-secondary btn-sm" onClick={deleteComponent(id)}>
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
        <div className="col">Color</div>
        <div className="col">Colorants</div>
        <div className="col-1"></div>
      </div>

      <ReactSortable list={customColorants.ids} setList={setIds} handle=".sortable-handle">
        {customColorants.ids.map(Component)}
      </ReactSortable>

      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={appendComponent}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setNewCustomColorantsDefinitionString}
          disabled={!customColorants.valid || newCustomColorantsDefinitionString === customColorantsDefinitionString}
        >
          Set
        </button>
      </div>
    </div>
  );
};

export default DefineCustomColorants;
