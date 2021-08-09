import { useContext, useState } from "react";

import { ReactSortable } from "react-sortablejs";

import * as Common from "./CarriageCommon";

import Context from "../Context";

import { copyByJSON } from "../../common/utilities";
import Options from "../../common/react-components/Options";

const selectStyle = {
  backgroundPosition: "right 0.25rem center",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M 0 5 l 4 6 4-6'/%3e%3c/svg%3e")`,
};

const VersionOptions = () => {
  const values = Common.carriageVersions();
  const descriptions = values;

  return <Options values={values} descriptions={descriptions} />;
};

const CarriageForm = ({ consoleCheckbox }) => {
  const { carriageDefinitionStringHook, colorantToColorHook } = useContext(Context);

  const [carriageDefinitionString, setCarriageDefinitionString] = carriageDefinitionStringHook;

  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const [carriage, setCarriage] = useState(Common.defaultCarriage());

  const setIds = (ids) => {
    setCarriage((carriage) => {
      carriage = copyByJSON(carriage);
      carriage.ids = copyByJSON(ids);
      return carriage;
    });
  };

  const newCarriageDefinitionString = Common.toCarriageDefinitionString(carriage);

  const setNewCarriageDefinitionString = () => {
    setCarriageDefinitionString(newCarriageDefinitionString);
  };

  const [referenceCarriageDefinitionString, setReferenceCarriageDefinitionString] = useState(null);

  if (referenceCarriageDefinitionString !== carriageDefinitionString) {
    setReferenceCarriageDefinitionString(carriageDefinitionString);

    setCarriage((carriage) => {
      const idCounter = carriage.idCounter;

      carriage = Common.toCarriage(carriageDefinitionString, colorantToColor, idCounter);

      return carriage;
    });
  }

  const appendComponent = () => {
    setCarriage((carriage) => {
      carriage = copyByJSON(carriage);

      Common.appendComponent(carriage);
      Common.validateCarriage(carriage, colorantToColor);

      return carriage;
    });
  };

  const deleteComponent = (id) => {
    return () => {
      setCarriage((carriage) => {
        carriage = copyByJSON(carriage);

        Common.deleteComponent(carriage, id);
        Common.validateCarriage(carriage, colorantToColor);

        return carriage;
      });
    };
  };

  const updateComponent = (id, input) => {
    return (event) => {
      setCarriage((carriage) => {
        const value = event.target.value;

        carriage = copyByJSON(carriage);

        Common.updateComponent(carriage, id, input, value);
        Common.validateCarriage(carriage, colorantToColor);

        return carriage;
      });
    };
  };

  const updateTitle = (event) => {
    setCarriage((carriage) => {
      const value = event.target.value;

      carriage = copyByJSON(carriage);

      carriage.title = value;

      return carriage;
    });
  };

  const Component = ({ id: id }) => {
    const colorant = carriage.components[id].formattedInputs.colorant;

    let DisplayColor = null;
    if (Object.prototype.hasOwnProperty.call(colorantToColor, colorant)) {
      DisplayColor = (
        <input
          type="text"
          className="form-control form-control-sm"
          disabled
          style={{ backgroundColor: colorantToColor[colorant] }}
        />
      );
    } else {
      DisplayColor = (
        <input
          type="text"
          className="form-control form-control-sm is-invalid"
          disabled
          style={{ backgroundColor: "#ffffff" }}
        />
      );
    }

    const colorantValid = carriage.components[id].validations.colorantValid;
    const colorantUnique = carriage.components[id].validations.colorantUnique;
    const offsetValid = carriage.components[id].validations.offsetValid;
    const dieHeightsValid = carriage.components[id].validations.dieHeightsValid;
    const overlapsValid = carriage.components[id].validations.overlapsValid;
    const dieHeightsToOverlapsValid = carriage.components[id].validations.dieHeightsToOverlapsValid;

    return (
      <div key={id} className="row gx-2 align-items-center mb-3">
        <div className="col-1 text-center sortable-handle">☰</div>
        <div className="col-1">{DisplayColor}</div>
        <div className="col-2">
          <input
            type="text"
            className={`form-control form-control-sm ${colorantValid && colorantUnique ? "" : "is-invalid"}`}
            value={carriage.components[id].inputs.colorant}
            onChange={updateComponent(id, "colorant")}
          />
        </div>
        <div className="col-2">
          <input
            type="text"
            className={`form-control form-control-sm ${offsetValid ? "" : "is-invalid"}`}
            value={carriage.components[id].inputs.offset}
            onChange={updateComponent(id, "offset")}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className={`form-control form-control-sm ${
              dieHeightsValid && dieHeightsToOverlapsValid ? "" : "is-invalid"
            }`}
            value={carriage.components[id].inputs.dieHeights}
            onChange={updateComponent(id, "dieHeights")}
          />
        </div>
        <div className="col">
          <input
            type="text"
            className={`form-control form-control-sm ${overlapsValid && dieHeightsToOverlapsValid ? "" : "is-invalid"}`}
            value={carriage.components[id].inputs.overlaps}
            onChange={updateComponent(id, "overlaps")}
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
        <div className="col">Title{consoleCheckbox}</div>
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
        <div className="col">
          <input type="text" className="form-control form-control-sm" value={carriage.title} onChange={updateTitle} />
        </div>
      </div>

      <div className="row gx-2 mb-2">
        <div className="col-1"></div>
        <div className="col-1"></div>
        <div className="col-2">Colorant</div>
        <div className="col-2">Offset</div>
        <div className="col">Die Heights</div>
        <div className="col">Overlaps</div>
        <div className="col-1"></div>
      </div>

      <ReactSortable list={carriage.ids} setList={setIds} handle=".sortable-handle">
        {carriage.ids.map(Component)}
      </ReactSortable>
      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={appendComponent}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setNewCarriageDefinitionString}
          disabled={!carriage.valid || newCarriageDefinitionString === carriageDefinitionString}
        >
          Set
        </button>
      </div>
    </>
  );
};

export default CarriageForm;
