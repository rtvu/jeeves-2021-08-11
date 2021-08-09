import { useContext, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Context from "./Context";
import * as Common from "./DefineCustomColorantsCommon";
import { copyByJSON } from "../common/utilities";
import Options from "../common/react-components/Options";

const selectStyle = {
  backgroundPosition: "right 0.25rem center",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M 0 5 l 4 6 4-6'/%3e%3c/svg%3e")`,
};

const VersionOptions = () => {
  const values = Common.customColorantsVersions();
  const descriptions = values;

  return <Options values={values} descriptions={descriptions} />;
};

const DefineCustomColorants = ({ consoleCheckbox }) => {
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
        <div className="col-4">
          <div className="input-group input-group-sm">
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
    <>
      <div className="row gx-2 mb-2">
        <div className="col-2">Version</div>
        <div className="col">{consoleCheckbox}</div>
      </div>

      <div className="row gx-2 mb-3">
        <div className="col-2">
          <select
            value="1.0"
            disabled
            className="form-select form-select-sm pe-3"
            style={selectStyle}
            // value={}
            // onChange={}
          >
            <VersionOptions />
          </select>
        </div>
        <div className="col"></div>
      </div>

      <div className="row gx-2 mb-2">
        <div className="col-1"></div>
        <div className="col-4">Color</div>
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
    </>
  );
};

export default DefineCustomColorants;
