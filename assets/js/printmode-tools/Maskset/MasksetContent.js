import { useContext, useEffect, useState } from "react";

import MasksetConsole from "./MasksetConsole";
import MasksetForm from "./MasksetForm";
import * as TabKeys from "../TabKeys";

import ConsoleCheckbox from "../ConsoleCheckbox";
import { ActiveTabKeyContext } from "../Context";

const tabKeyStates = TabKeys.getStates();

const MasksetContent = () => {
  const [activeTabKey, _setActiveTabKey] = useContext(ActiveTabKeyContext);

  const [showConsole, setShowConsole] = useState(false);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (
        activeTabKey === tabKeyStates.maskset &&
        !event.altKey &&
        event.ctrlKey &&
        !event.metaKey &&
        !event.shiftKey &&
        event.key === " "
      ) {
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
