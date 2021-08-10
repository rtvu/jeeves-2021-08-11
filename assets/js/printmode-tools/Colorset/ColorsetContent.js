import { useContext, useEffect, useState } from "react";

import ColorsetConsole from "./ColorsetConsole";
import ColorsetForm from "./ColorsetForm";
import * as TabKeys from "../TabKeys";

import ConsoleCheckbox from "../ConsoleCheckbox";
import { ActiveTabKeyContext } from "../Context";

const tabKeyStates = TabKeys.getStates();

const ColorsetContent = () => {
  const [activeTabKey, _setActiveTabKey] = useContext(ActiveTabKeyContext);

  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (activeTabKey === tabKeyStates.colorset && event.ctrlKey && event.key === " ") {
        setShowConsole((showConsole) => !showConsole);
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [activeTabKey]);

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
