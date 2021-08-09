import { useState } from "react";

import DefineCustomColorants from "./DefineCustomColorants";
import DefineCustomColorantsConsole from "./DefineCustomColorantsConsole";

const CustomColorants = () => {
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
    <>
      <div className="row">
        <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
          <DefineCustomColorants consoleCheckbox={consoleCheckbox} />
        </div>
        <div hidden={!showConsole} className="col-12 col-lg-6">
          <DefineCustomColorantsConsole />
        </div>
      </div>
    </>
  );
};

export default CustomColorants;
