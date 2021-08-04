import { useContext, useState } from "react";
import ResizableTextarea from "../common/react-components/ResizableTextarea";
import Context from "./Context";
import * as Common from "./DefineCustomColorantsCommon";

function formatCustomColorantsDefinitionString(customColorantsDefinitionString) {
  const customColorantsDefinition = JSON.parse(customColorantsDefinitionString);

  let result = "";

  result += `{\n  "version": "${customColorantsDefinition.version}",\n`;

  if (customColorantsDefinition.components.length === 0) {
    result += `  "components": []\n`;
  } else {
    result += `  "components": [\n`;

    for (let i = 0; i < customColorantsDefinition.components.length; i++) {
      const color = JSON.stringify(customColorantsDefinition.components[i].color);
      const colorants = JSON.stringify(customColorantsDefinition.components[i].colorants).replace(/,/g, ", ");
      const component = `    {\n      "color": ${color},\n      "colorants": ${colorants}\n    }`;

      result += component;

      if (i !== customColorantsDefinition.components.length - 1) {
        result += ",";
      }

      result += "\n";
    }

    result += "  ]\n";
  }

  result += "}";

  return result;
}

const DefineCustomColorantsConsole = () => {
  const { customColorantsDefinitionStringHook } = useContext(Context);

  const [customColorantsDefinitionString, setCustomColorantsDefinitionString] = customColorantsDefinitionStringHook;

  const [referenceCustomColorantsDefinitionString, setReferenceCustomColorantsDefinitionString] = useState(null);

  const [console, setConsole] = useState("");

  if (referenceCustomColorantsDefinitionString !== customColorantsDefinitionString) {
    setReferenceCustomColorantsDefinitionString(customColorantsDefinitionString);

    const newConsole = formatCustomColorantsDefinitionString(customColorantsDefinitionString);

    setConsole(newConsole);
  }

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const customColorants = Common.toCustomColorants(console);

  const isValid = customColorants !== null && customColorants.valid;

  let newCustomColorantsDefinitionString = null;
  if (isValid) {
    newCustomColorantsDefinitionString = Common.toCustomColorantsDefinitionString(customColorants);
  }

  const setNewCustomColorantsDefinitionString = () => {
    if (isValid) {
      setCustomColorantsDefinitionString(newCustomColorantsDefinitionString);
    }
  };

  return (
    <div>
      <div className="mb-2">Console</div>
      <ResizableTextarea
        className="form-control mb-3 font-monospace"
        value={console}
        onChange={updateConsole}
        style={{ fontSize: "0.75rem", lineHeight: 1.1 }}
      />
      <button
        type="button"
        className="btn btn-primary btn-sm me-3"
        onClick={setNewCustomColorantsDefinitionString}
        disabled={!isValid || newCustomColorantsDefinitionString === customColorantsDefinitionString}
      >
        Set
      </button>
    </div>
  );
};

export default DefineCustomColorantsConsole;