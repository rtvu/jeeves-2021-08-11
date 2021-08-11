import { useContext, useState } from "react";
import { ReactSortable } from "react-sortablejs";

import * as Common from "./ColorsetCommon";

import { ColorsetJsonContext } from "../Context";
import Options from "../../common/react-components/Options";
import { useOnChange } from "../../common/react-hooks";
import { copyByJSON } from "../../common/utilities";

const selectStyle = {
  backgroundPosition: "right 0.25rem center",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M 0 5 l 4 6 4-6'/%3e%3c/svg%3e")`,
};

const VersionOptions = () => {
  const values = Common.getColorsetVersions();
  const descriptions = values;

  return <Options values={values} descriptions={descriptions} />;
};

const ColorsetForm = ({ consoleCheckbox }) => {
  const [colorsetJson, setColorsetJson] = useContext(ColorsetJsonContext);

  const [colorset, setColorset] = useState(Common.getDefaultColorset());

  const setIds = (ids) => {
    setColorset((colorset) => {
      colorset = copyByJSON(colorset);
      colorset.ids = copyByJSON(ids);
      return colorset;
    });
  };

  const newColorsetJson = Common.toColorsetJson(colorset);

  const setNewColorsetJson = () => {
    setColorsetJson(newColorsetJson);
  };

  useOnChange(() => {
    setColorset((colorset) => {
      const idCounter = colorset.idCounter;

      colorset = Common.toColorset(colorsetJson, idCounter);

      return colorset;
    });
  }, colorsetJson);

  const appendComponent = () => {
    setColorset((colorset) => {
      colorset = copyByJSON(colorset);

      Common.appendComponent(colorset);
      Common.validateColorset(colorset);

      return colorset;
    });
  };

  const deleteComponent = (id) => {
    return () => {
      setColorset((colorset) => {
        colorset = copyByJSON(colorset);

        Common.deleteComponent(colorset, id);
        Common.validateColorset(colorset);

        return colorset;
      });
    };
  };

  const updateComponent = (id, input) => {
    return (event) => {
      setColorset((colorset) => {
        const value = event.target.value;

        colorset = copyByJSON(colorset);

        Common.updateComponent(colorset, id, input, value);
        Common.validateColorset(colorset);

        return colorset;
      });
    };
  };

  const resetColor = (id) => {
    return () => {
      setColorset((colorset) => {
        colorset = copyByJSON(colorset);

        colorset.components[id].inputs.color = colorset.components[id].formattedInputs.color;

        Common.validateColorset(colorset);

        return colorset;
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
    const component = colorset.components[id];
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

      <ReactSortable list={colorset.ids} setList={setIds} handle=".sortable-handle">
        {colorset.ids.map(Component)}
      </ReactSortable>

      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={appendComponent}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setNewColorsetJson}
          disabled={!colorset.valid || newColorsetJson === colorsetJson}
        >
          Set
        </button>
      </div>
    </>
  );
};

export default ColorsetForm;
