import { useState } from "react";

import MasksetForm from "./MasksetForm";
import MasksetConsole from "./MasksetConsole";

const MasksetContent = () => {
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
    <div className="my-3">
      <div className={`${showConsole ? "mb-3" : ""}`}>
        <MasksetForm consoleCheckbox={consoleCheckbox} />
      </div>
      <div hidden={!showConsole}>
        <MasksetConsole />
      </div>
    </div>
  );
};

export default MasksetContent;
