import { useState } from "react";

import MasksetConsole from "./MasksetConsole";
import MasksetForm from "./MasksetForm";

import ConsoleCheckbox from "../ConsoleCheckbox";

const MasksetContent = () => {
  const [showConsole, setShowConsole] = useState(false);

  const consoleCheckbox = (
    <ConsoleCheckbox
      id="maskset-console-checkbox"
      checked={showConsole}
      onChange={() => setShowConsole((showConsole) => !showConsole)}
    />
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
