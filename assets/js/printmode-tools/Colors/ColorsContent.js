import { useState } from "react";

import ColorsConsole from "./ColorsConsole";
import ColorsForm from "./ColorsForm";

const ColorsContent = () => {
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
    <div className="my-3">
      <div className="row">
        <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
          <ColorsForm consoleCheckbox={consoleCheckbox} />
        </div>
        <div hidden={!showConsole} className="col-12 col-lg-6">
          <ColorsConsole />
        </div>
      </div>
    </div>
  );
};

export default ColorsContent;
