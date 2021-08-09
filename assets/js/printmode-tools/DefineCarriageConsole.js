import { useContext, useState } from "react";
import ResizableTextarea from "../common/react-components/ResizableTextarea";
import Context from "./Context";
import * as Common from "./DefineCarriageCommon";

const DefineCarriageConsole = () => {
  const { carriageDefinitionStringHook, colorantToColorHook } = useContext(Context);

  const [carriageDefinitionString, setCarriageDefinitionString] = carriageDefinitionStringHook;

  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const [referenceCarriageDefinitionString, setReferenceCarriageDefinitionString] = useState(null);

  const [console, setConsole] = useState("");

  if (referenceCarriageDefinitionString !== carriageDefinitionString) {
    setReferenceCarriageDefinitionString(carriageDefinitionString);

    const newConsole = Common.formatCarriageDefinitionString(carriageDefinitionString);

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
    <>
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
    </>
  );
};

export default DefineCarriageConsole;
