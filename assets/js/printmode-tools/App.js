import { useEffect, useState } from "react";

import ColorantDefinitions from "./ColorantDefinitions";
import Content from "./Content";
import Context from "./Context";
import Help from "./Help";

import { defaultCarriageJson } from "./Carriage/CarriageCommon";
import { defaultColorsetJson } from "./Colorset/ColorsetCommon";
import { defaultMasksetJson } from "./Maskset/MasksetCommon";

import ColorantTools from "../common/colorant-tools";

const App = () => {
  const colorantToColorHook = useState(ColorantTools.defaultColorantToColor);
  const [_colorantToColor, setColorantToColor] = colorantToColorHook;

  const colorantToCarriageHook = useState(null);
  const [_colorantToCarriage, setColorantToCarriage] = colorantToCarriageHook;

  const carriageJsonHook = useState(defaultCarriageJson());
  const [carriageJson, _setCarriageJson] = carriageJsonHook;

  const masksetJsonHook = useState(defaultMasksetJson());

  const colorsetJsonHook = useState(defaultColorsetJson());
  const [colorsetJson, _setColorsetJson] = colorsetJsonHook;

  useEffect(() => {
    const parsed = JSON.parse(colorsetJson);
    const customColorToColorants = {};

    for (let i = 0; i < parsed.components.length; i++) {
      const { color, colorants } = parsed.components[i];

      customColorToColorants[color] = colorants;
    }

    const customColorantToColor = ColorantTools.invertColorToColorants(customColorToColorants);

    const newColorantToColor = ColorantTools.mergeCustomColorantToColor(customColorantToColor);

    setColorantToColor(newColorantToColor);
  }, [colorsetJson, setColorantToColor]);

  useEffect(() => {
    const parsed = JSON.parse(carriageJson);
    const newColorantToCarriage = {};

    for (let i = 0; i < parsed.components.length; i++) {
      const { colorant, offset, dieHieghts, overlaps } = parsed.components[i];

      newColorantToCarriage[colorant] = { offset, dieHieghts, overlaps };
    }

    setColorantToCarriage(newColorantToCarriage);
  }, [carriageJson, setColorantToCarriage]);

  return (
    <Context.Provider
      value={{
        carriageJsonHook,
        colorantToCarriageHook,
        colorantToColorHook,
        colorsetJsonHook,
        masksetJsonHook,
      }}
    >
      <div className="row mb-3">
        <div className="col-1"></div>
        <div className="col">
          <h1 className="text-center m-0">Printmode Tools</h1>
        </div>
        <div className="col-1">
          <Help />
        </div>
      </div>

      <Content />

      <ColorantDefinitions />
    </Context.Provider>
  );
};

export default App;
