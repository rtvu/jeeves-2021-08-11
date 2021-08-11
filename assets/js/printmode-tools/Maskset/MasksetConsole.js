import { useContext, useState } from "react";

import * as Common from "./MasksetCommon";

import { ColorantToCarriageContext, ColorantToColorContext, MasksetJsonContext } from "../Context";
import ResizableTextarea from "../../common/react-components/ResizableTextarea";
import { useOnChange } from "../../common/react-hooks";

const MasksetConsole = () => {
  const [colorantToCarriage, _setColorantToCarriage] = useContext(ColorantToCarriageContext);

  const [colorantToColor, _setColorantToColor] = useContext(ColorantToColorContext);

  const [masksetJson, setMasksetJson] = useContext(MasksetJsonContext);

  const [console, setConsole] = useState("");

  useOnChange(() => {
    const newConsole = Common.formatMasksetJson(masksetJson);

    setConsole(newConsole);
  }, masksetJson);

  const updateConsole = (event) => {
    const newConsole = event.target.value;

    setConsole(newConsole);
  };

  const maskset = Common.toMaskset(console, colorantToColor, colorantToCarriage);

  const isValid = maskset !== null && maskset.valid;

  let newMasksetJson = null;
  if (isValid) {
    newMasksetJson = Common.toMasksetJson(maskset);
  }

  const setNewMasksetJson = () => {
    if (isValid) {
      setMasksetJson(newMasksetJson);
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
        onClick={setNewMasksetJson}
        disabled={!isValid || newMasksetJson === masksetJson}
      >
        Set
      </button>
    </>
  );
};

export default MasksetConsole;
