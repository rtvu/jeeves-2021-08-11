import { useContext, useState } from "react";

import * as Common from "./MasksetCommon";

import Context from "../Context";

import ResizableTextarea from "../../common/react-components/ResizableTextarea";

const MasksetConsole = () => {
  const { colorantToCarriageHook, colorantToColorHook, masksetDefinitionStringHook } = useContext(Context);

  const [colorantToCarriage, _setColorantToCarriage] = colorantToCarriageHook;

  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const [masksetDefinitionString, setMasksetDefinitionString] = masksetDefinitionStringHook;

  const [console, setConsole] = useState("");

  const [referenceMasksetDefinitionString, setReferenceMasksetDefinitionString] = useState(null);

  if (referenceMasksetDefinitionString !== masksetDefinitionString) {
    setReferenceMasksetDefinitionString(masksetDefinitionString);

    const newConsole = Common.formatMasksetDefinitionString(masksetDefinitionString);

    setConsole(newConsole);
  }

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const maskset = Common.toMaskset(console, colorantToColor, colorantToCarriage);

  const isValid = maskset !== null && maskset.valid;

  let newMasksetDefinitionString = null;
  if (isValid) {
    newMasksetDefinitionString = Common.toMasksetDefinitionString(maskset);
  }

  const setNewMasksetDefinitionString = () => {
    if (isValid) {
      setMasksetDefinitionString(newMasksetDefinitionString);
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
        onClick={setNewMasksetDefinitionString}
        disabled={!isValid || newMasksetDefinitionString === masksetDefinitionString}
      >
        Set
      </button>
    </>
  );
};

export default MasksetConsole;
