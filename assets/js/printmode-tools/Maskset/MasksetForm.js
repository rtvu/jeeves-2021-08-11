import { useContext, useState } from "react";
import { OverlayTrigger, Popover } from "react-bootstrap";
import { ReactSortable } from "react-sortablejs";

import * as Common from "./MasksetCommon";

import { ColorantToCarriageContext, ColorantToColorContext, MasksetJsonContext } from "../Context";
import Options from "../../common/react-components/Options";
import { copyByJSON } from "../../common/utilities";

const selectStyle = {
  backgroundPosition: "right 0.25rem center",
  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 16'%3e%3cpath fill='none' stroke='%23343a40' stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M 0 5 l 4 6 4-6'/%3e%3c/svg%3e")`,
};

const VersionOptions = () => {
  const values = Common.masksetVersions();
  const descriptions = values;

  return <Options values={values} descriptions={descriptions} />;
};

const OnOffOptions = () => {
  const values = ["on", "off"];
  const descriptions = ["On", "Off"];

  return <Options values={values} descriptions={descriptions} />;
};

const InkLimitsOptions = () => {
  const values = Common.inkLimits().map((x) => {
    return x.toString();
  });

  const descriptions = Common.inkLimits().map((x) => {
    return x.toString() + "d";
  });

  return <Options values={values} descriptions={descriptions} />;
};

const MasksetForm = ({ consoleCheckbox }) => {
  const [colorantToCarriage, _setColorantToCarriage] = useContext(ColorantToCarriageContext);

  const [colorantToColor, _setColorantToColor] = useContext(ColorantToColorContext);

  const [masksetJson, setMasksetJson] = useContext(MasksetJsonContext);

  const [maskset, setMaskset] = useState(Common.defaultMaskset());

  const setIds = (ids) => {
    setMaskset((maskset) => {
      maskset = copyByJSON(maskset);
      maskset.ids = copyByJSON(ids);

      return maskset;
    });
  };

  const newMasksetJson = Common.toMasksetJson(maskset);

  const setNewMasksetJson = () => {
    setMasksetJson(newMasksetJson);
  };

  const [referenceMasksetJson, setReferenceMasksetJson] = useState(null);

  if (referenceMasksetJson !== masksetJson) {
    setReferenceMasksetJson(masksetJson);

    setMaskset((maskset) => {
      const idCounter = maskset.idCounter;

      maskset = Common.toMaskset(masksetJson, colorantToColor, colorantToCarriage, idCounter);

      return maskset;
    });
  }

  const appendComponent = () => {
    setMaskset((maskset) => {
      maskset = copyByJSON(maskset);

      Common.appendComponent(maskset);
      Common.validateMaskset(maskset, colorantToColor, colorantToCarriage);

      return maskset;
    });
  };

  const deleteComponent = (id) => {
    return () => {
      setMaskset((maskset) => {
        maskset = copyByJSON(maskset);

        Common.deleteComponent(maskset, id);
        Common.validateMaskset(maskset, colorantToColor, colorantToCarriage);

        return maskset;
      });
    };
  };

  const updateComponent = (id, input) => {
    return (event) => {
      setMaskset((maskset) => {
        const value = event.target.value;

        maskset = copyByJSON(maskset);

        Common.updateComponent(maskset, id, input, value);
        Common.validateMaskset(maskset, colorantToColor, colorantToCarriage);

        return maskset;
      });
    };
  };

  const updateTitle = (event) => {
    setMaskset((maskset) => {
      const value = event.target.value;

      maskset = copyByJSON(maskset);

      maskset.title = value;

      return maskset;
    });
  };

  const Component = ({ id: id }) => {
    const { display, colorants, inkLimit, ramps, specification, showInterleave, interleaveNozzles, showWeave, offset } =
      maskset.components[id].inputs;

    const { colorantsValid, colorantsUnique, specificationValid, interleaveNozzlesValid, offsetValid } =
      maskset.components[id].validations;

    const popover = (
      <Popover id={`maskset-modifiers-${id.toString()}`}>
        <Popover.Header as="h3">Modifiers</Popover.Header>
        <Popover.Body>
          <div className="row gx-2 align-items-center mb-3">
            <div className="col">
              <div className="mb-1">Show Interleave</div>
              <select
                className="form-select form-select-sm pe-3"
                style={selectStyle}
                value={showInterleave}
                onChange={updateComponent(id, "showInterleave")}
                onBlur={updateComponent(id, "showInterleave")}
              >
                <OnOffOptions />
              </select>
            </div>
            <div className="col">
              <div className="mb-1">Interleave Nozzles</div>
              <input
                type="text"
                className={`form-control form-select-sm  ${interleaveNozzlesValid ? "" : "is-invalid"}`}
                value={interleaveNozzles}
                onChange={updateComponent(id, "interleaveNozzles")}
              />
            </div>
          </div>
          <div className="mb-3">
            <div className="mb-1">Show Weave</div>
            <select
              className="form-select form-select-sm pe-3"
              style={selectStyle}
              value={showWeave}
              onChange={updateComponent(id, "showWeave")}
              onBlur={updateComponent(id, "showWeave")}
            >
              <OnOffOptions />
            </select>
          </div>
          <div>
            <div className="mb-1">Offset</div>
            <input
              type="text"
              className={`form-control form-select-sm  ${offsetValid ? "" : "is-invalid"}`}
              value={offset}
              onChange={updateComponent(id, "offset")}
            />
          </div>
        </Popover.Body>
      </Popover>
    );

    return (
      <div key={id} className="row gx-2 align-items-center mb-3">
        <div className="col-1 text-center sortable-handle">☰</div>

        <div className="col-1">
          <select
            className="form-select form-select-sm pe-3"
            style={selectStyle}
            value={display}
            onChange={updateComponent(id, "display")}
            onBlur={updateComponent(id, "display")}
          >
            <OnOffOptions />
          </select>
        </div>

        <div className="col-2">
          <input
            type="text"
            className={`form-control form-select-sm  ${colorantsValid && colorantsUnique ? "" : "is-invalid"}`}
            value={colorants}
            onChange={updateComponent(id, "colorants")}
          />
        </div>

        <div className="col-1">
          <select
            className="form-select form-select-sm pe-3"
            style={selectStyle}
            value={inkLimit}
            onChange={updateComponent(id, "inkLimit")}
            onBlur={updateComponent(id, "inkLimit")}
          >
            <InkLimitsOptions />
          </select>
        </div>

        <div className="col-1">
          <select
            className="form-select form-select-sm pe-3"
            style={selectStyle}
            value={ramps}
            onChange={updateComponent(id, "ramps")}
            onBlur={updateComponent(id, "ramps")}
          >
            <OnOffOptions />
          </select>
        </div>

        <div className="col">
          <input
            type="text"
            className={`form-control form-select-sm  ${specificationValid ? "" : "is-invalid"}`}
            value={specification}
            onChange={updateComponent(id, "specification")}
          />
        </div>

        <div className="col-1">
          <div className="d-grid">
            <OverlayTrigger trigger="click" placement="left" rootClose={true} overlay={popover} r>
              <button type="button" className="btn btn-outline-secondary btn-sm">
                ▲
              </button>
            </OverlayTrigger>
          </div>
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
          <input type="text" className="form-control form-control-sm" value={maskset.title} onChange={updateTitle} />
        </div>
      </div>

      <div className="row gx-2 mb-2">
        <div className="col-1"></div>
        <div className="col-1">Display</div>
        <div className="col-2">Colorants</div>
        <div className="col-1">Ink Limit</div>
        <div className="col-1">Ramps</div>
        <div className="col">
          Specification
          <br />
          <div style={{ fontSize: "12px" }}>
            Height, Passes, Front, Back, Pairings<sup>*</sup>, Versions<sup>*</sup>
          </div>
        </div>
        <div className="col-1">Mods</div>
        <div className="col-1"></div>
      </div>

      <ReactSortable list={maskset.ids} setList={setIds} handle=".sortable-handle">
        {maskset.ids.map(Component)}
      </ReactSortable>

      <div>
        <button type="button" className="btn btn-primary btn-sm me-3" onClick={appendComponent}>
          Add
        </button>
        <button
          type="button"
          className="btn btn-primary btn-sm me-3"
          onClick={setNewMasksetJson}
          disabled={!maskset.valid || newMasksetJson === masksetJson}
        >
          Set
        </button>
      </div>
    </>
  );
};

export default MasksetForm;
