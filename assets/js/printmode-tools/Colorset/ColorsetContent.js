import { useState } from "react";

import ColorsetConsole from "./ColorsetConsole";
import ColorsetForm from "./ColorsetForm";

import ConsoleCheckbox from "../ConsoleCheckbox";

const ColorsetContent = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <ConsoleCheckbox
      id="colorset-console-checkbox"
      checked={showConsole}
      onChange={() => setShowConsole((showConsole) => !showConsole)}
    />
  );

  return (
    <div className="my-3">
      <div className="row">
        <div className={`col-12 ${showConsole ? "col-lg-6 mb-3 mb-lg-0" : ""}`}>
          <ColorsetForm consoleCheckbox={consoleCheckbox} />
        </div>
        <div hidden={!showConsole} className="col-12 col-lg-6">
          <ColorsetConsole />
        </div>
      </div>
    </div>
  );
};

export default ColorsetContent;
