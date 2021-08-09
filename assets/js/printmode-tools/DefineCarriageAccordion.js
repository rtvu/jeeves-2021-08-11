import { useState } from "react";
import DefineCarriage from "./DefineCarriage";
import DefineCarriageChart from "./DefineCarriageChart";
import DefineCarriageConsole from "./DefineCarriageConsole";

const DefineCarriageAccordion = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <div className="form-check form-check-inline float-end me-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="carriage-console-checkbox"
        checked={showConsole}
        onChange={() => setShowConsole((showConsole) => !showConsole)}
      />
      <label className="form-check-label" htmlFor="carriage-console-checkbox">
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
            data-bs-target="#customize-carriage-body-1"
          >
            Define Carriage
          </button>
        </h2>
        <div id="customize-carriage-body-1" className="accordion-collapse collapse">
          <div className="accordion-body">
            <DefineCarriageChart />
            <div className="row">
              <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
                <DefineCarriage consoleCheckbox={consoleCheckbox} />
              </div>
              <div hidden={!showConsole} className="col-12 col-lg-6">
                <DefineCarriageConsole />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineCarriageAccordion;
