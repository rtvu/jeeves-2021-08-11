import { useState } from "react";

import DefineCarriageChart from "./DefineCarriageChart";
import DefineCarriage from "./DefineCarriage";
import DefineCarriageConsole from "./DefineCarriageConsole";

const CarriageContent = () => {
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
      <DefineCarriageChart />
      <div className="row">
        <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
          <DefineCarriage consoleCheckbox={consoleCheckbox} />
        </div>
        <div hidden={!showConsole} className="col-12 col-lg-6">
          <DefineCarriageConsole />
        </div>
      </div>
    </>
  );
};

export default CarriageContent;
