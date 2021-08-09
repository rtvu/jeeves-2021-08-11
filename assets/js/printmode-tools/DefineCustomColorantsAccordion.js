import { useState } from "react";
import DefineCustomColorants from "./DefineCustomColorants";
import DefineCustomColorantsConsole from "./DefineCustomColorantsConsole";

const DefineColorantsAccordion = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <div className="form-check form-check-inline float-end me-0">
      <input
        type="checkbox"
        className="form-check-input"
        id="custom-colorants-console-checkbox"
        checked={showConsole}
        onChange={() => setShowConsole((showConsole) => !showConsole)}
      />
      <label className="form-check-label" htmlFor="custom-colorants-console-checkbox">
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
            data-bs-target="#customize-colorants-body-1"
          >
            Define Colorants
          </button>
        </h2>
        <div id="customize-colorants-body-1" className="accordion-collapse collapse">
          <div className="accordion-body">
            <div className="row">
              <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
                <DefineCustomColorants consoleCheckbox={consoleCheckbox} />
              </div>
              <div hidden={!showConsole} className="col-12 col-lg-6">
                <DefineCustomColorantsConsole />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DefineColorantsAccordion;
