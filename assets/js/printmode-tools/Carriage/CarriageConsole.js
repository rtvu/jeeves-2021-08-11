import { useContext, useState } from "react";

import * as Common from "./CarriageCommon";

import Context from "../Context";
import ResizableTextarea from "../../common/react-components/ResizableTextarea";

const CarriageConsole = () => {
  const { carriageJsonHook, colorantToColorHook } = useContext(Context);

  const [carriageJson, setCarriageJson] = carriageJsonHook;

  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const [referenceCarriageJson, setReferenceCarriageJson] = useState(null);

  const [console, setConsole] = useState("");

  if (referenceCarriageJson !== carriageJson) {
    setReferenceCarriageJson(carriageJson);

    const newConsole = Common.formatCarriageJson(carriageJson);

    setConsole(newConsole);
  }

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const carriage = Common.toCarriage(console, colorantToColor);

  const isValid = carriage !== null && carriage.valid;

  let newCarriageJson = null;
  if (isValid) {
    newCarriageJson = Common.toCarriageJson(carriage);
  }

  const setNewCarriageJson = () => {
    if (isValid) {
      setCarriageJson(newCarriageJson);
    }
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
        onClick={setNewCarriageJson}
        disabled={!isValid || newCarriageJson === carriageJson}
      >
        Set
      </button>
    </>
  );
};

export default CarriageConsole;
