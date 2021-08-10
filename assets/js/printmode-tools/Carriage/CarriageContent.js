import { useState } from "react";

import CarriageChart from "./CarriageChart";
import CarriageConsole from "./CarriageConsole";
import CarriageForm from "./CarriageForm";

import ConsoleCheckbox from "../ConsoleCheckbox";

const CarriageContent = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <ConsoleCheckbox
      id="carriage-console-checkbox"
      checked={showConsole}
      onChange={() => setShowConsole((showConsole) => !showConsole)}
    />
  );

  return (
    <div className="my-3">
      <CarriageChart />
      <div className="row">
        <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
          <CarriageForm consoleCheckbox={consoleCheckbox} />
        </div>
        <div hidden={!showConsole} className="col-12 col-lg-6">
          <CarriageConsole />
        </div>
      </div>
    </div>
  );
};

export default CarriageContent;
