import { useContext, useState } from "react";

import * as Common from "./ColorsetCommon";

import { ColorsetJsonContext } from "../Context";
import ResizableTextarea from "../../common/react-components/ResizableTextarea";

const ColorsetConsole = () => {
  const [colorsetJson, setColorsetJson] = useContext(ColorsetJsonContext);

  const [referenceColorsetJson, setReferenceColorsetJson] = useState(null);

  const [console, setConsole] = useState("");

  if (referenceColorsetJson !== colorsetJson) {
    setReferenceColorsetJson(colorsetJson);

    const newConsole = Common.formatColorsetJson(colorsetJson);

    setConsole(newConsole);
  }

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const colorset = Common.toColorset(console);

  const isValid = colorset !== null && colorset.valid;

  let newColorsetJson = null;
  if (isValid) {
    newColorsetJson = Common.toColorsetJson(colorset);
  }

  const setNewColorsetJson = () => {
    if (isValid) {
      setColorsetJson(newColorsetJson);
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
        onClick={setNewColorsetJson}
        disabled={!isValid || newColorsetJson === colorsetJson}
      >
        Set
      </button>
    </>
  );
};

export default ColorsetConsole;
