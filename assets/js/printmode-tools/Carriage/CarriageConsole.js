import { useContext, useState } from "react";

import * as Common from "./CarriageCommon";

import { CarriageJsonContext, ColorantToColorContext } from "../Context";
import ResizableTextarea from "../../common/react-components/ResizableTextarea";
import { useOnChange } from "../../common/react-hooks";

const CarriageConsole = () => {
  const [carriageJson, setCarriageJson] = useContext(CarriageJsonContext);

  const [colorantToColor, _setColorantToColor] = useContext(ColorantToColorContext);

  const [console, setConsole] = useState("");

  useOnChange(() => {
    const newConsole = Common.formatCarriageJson(carriageJson);

    setConsole(newConsole);
  }, carriageJson);

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
