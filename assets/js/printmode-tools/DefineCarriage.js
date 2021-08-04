import { useContext, useState } from "react";
import { ReactSortable } from "react-sortablejs";
import Context from "./Context";
import * as Common from "./DefineCarriageCommon";
import { copyByJSON } from "../common/utilities";

const DefineCarriage = () => {
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
    <div>
      <div className="mb-3">
        <div className="mb-2">Title</div>
        <input type="text" className="form-control form-control-sm" value={carriage.title} onChange={updateTitle} />
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
    </div>
  );
};

export default DefineCarriage;
