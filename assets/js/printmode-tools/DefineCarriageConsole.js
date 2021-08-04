import { useContext, useState } from "react";
import ResizableTextarea from "../common/react-components/ResizableTextarea";
import Context from "./Context";
import * as Common from "./DefineCarriageCommon";

function formatCarriageDefinitionString(carriageDefinitionString) {
  const carriageDefinition = JSON.parse(carriageDefinitionString);

  let result = "";

  result += `{\n  "version": "${carriageDefinition.version}",\n`;
  result += `  "title": "${carriageDefinition.title}",\n`;

  if (carriageDefinition.components.length === 0) {
    result += `  "components": []\n`;
  } else {
    result += `  "components": [\n`;

    for (let i = 0; i < carriageDefinition.components.length; i++) {
      const colorant = JSON.stringify(carriageDefinition.components[i].colorant);
      const offset = JSON.stringify(carriageDefinition.components[i].offset);
      const dieHeights = JSON.stringify(carriageDefinition.components[i].dieHeights).replace(/,/g, ", ");
      const overlaps = JSON.stringify(carriageDefinition.components[i].overlaps).replace(/,/g, ", ");
      const component = `    {\n      "colorant": ${colorant},\n      "offset": ${offset},\n      "dieHeights": ${dieHeights},\n      "overlaps": ${overlaps}\n    }`;

      result += component;

      if (i !== carriageDefinition.components.length - 1) {
        result += ",";
      }

      result += "\n";
    }

    result += "  ]\n";
  }

  result += "}";

  return result;
}

const DefineCarriageConsole = () => {
  const { carriageDefinitionStringHook, colorantToColorHook } = useContext(Context);

  const [carriageDefinitionString, setCarriageDefinitionString] = carriageDefinitionStringHook;

  const [colorantToColor] = colorantToColorHook;

  const [referenceCarriageDefinitionString, setReferenceCarriageDefinitionString] = useState(null);

  const [console, setConsole] = useState("");

  if (referenceCarriageDefinitionString !== carriageDefinitionString) {
    setReferenceCarriageDefinitionString(carriageDefinitionString);

    const newConsole = formatCarriageDefinitionString(carriageDefinitionString);

    setConsole(newConsole);
  }

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const carriage = Common.toCarriage(console, colorantToColor);

  const isValid = carriage !== null && carriage.valid;

  let newCarriageDefinitionString = null;
  if (isValid) {
    newCarriageDefinitionString = Common.toCarriageDefinitionString(carriage);
  }

  const setNewCarriageDefinitionString = () => {
    if (isValid) {
      setCarriageDefinitionString(newCarriageDefinitionString);
    }
  };

  window.changeState = (string) => {
    setConsole(string);
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
        onClick={setNewCarriageDefinitionString}
        disabled={!isValid || newCarriageDefinitionString === carriageDefinitionString}
      >
        Set
      </button>
    </div>
  );
};

export default DefineCarriageConsole;
