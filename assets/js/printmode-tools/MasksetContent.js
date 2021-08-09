import { useState } from "react";

import DefineMaskset from "./DefineMaskset";
import DefineMasksetConsole from "./DefineMasksetConsole";

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
    <>
      <div className={`${showConsole ? "mb-3" : ""}`}>
        <DefineMaskset consoleCheckbox={consoleCheckbox} />
      </div>
      <div hidden={!showConsole}>
        <DefineMasksetConsole />
      </div>
    </>
  );
};

export default MasksetContent;
