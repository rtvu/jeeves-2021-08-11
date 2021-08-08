import { useState } from "react";
import DefineMaskset from "./DefineMaskset";
import DefineMasksetConsole from "./DefineMasksetConsole";

const DefineMasksetAccordion = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <div className="form-check form-check-inline float-end me-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="maskset-console-checkbox"
        checked={showConsole}
        onChange={() => setShowConsole((showConsole) => !showConsole)}
      />
      <label className="form-check-label" htmlFor="maskset-console-checkbox">
        <small>Show Console</small>
      </label>
    </div>
  );

  return (
    <div className="accordion mb-3">
      <div className="accordion-item">
        <h2 className="accordion-header">
          <button
            type="button"
            className="accordion-button collapsed"
            data-bs-toggle="collapse"
            data-bs-target="#customize-maskset-body-1"
          >
            Define Maskset
          </button>
        </h2>
        <div id="customize-maskset-body-1" className="accordion-collapse collapse">
          <div className="accordion-body">
            <div className={`${showConsole ? "mb-3" : ""}`}>
              <DefineMaskset consoleCheckbox={consoleCheckbox} />
            </div>
            <div hidden={!showConsole}>
              <DefineMasksetConsole />
            </div>

            {/* <DefineMasksetChart />
            <div className="row">
              <div className="col-12 col-lg-6 mb-3 mb-lg-0">
                <DefineMaskset />
              </div>
              <div className="col-12 col-lg-6">
                <DefineMasksetConsole />
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineMasksetAccordion;
