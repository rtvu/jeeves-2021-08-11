import { useEffect, useState } from "react";
import ColorantTools from "../common/colorant-tools";
import Context from "./Context";
import { defaultCarriageDefinitionString } from "./DefineCarriageCommon";
import { defaultCustomColorantsDefinitionString } from "./DefineCustomColorantsCommon";
import { defaultMasksetDefinitionString } from "./DefineMasksetCommon";
import ColorantDefinitions from "./ColorantDefinitions";
import DefineCarriageAccordion from "./DefineCarriageAccordion";
import DefineCustomColorantsAccordion from "./DefineCustomColorantsAccordion";
import DefineMasksetAccordion from "./DefineMasksetAccordion";
import Help from "./Help";

const App = () => {
  const colorantToColorHook = useState(ColorantTools.defaultColorantToColor);
  const [_colorantToColor, setColorantToColor] = colorantToColorHook;

  const colorantToCarriageHook = useState(null);
  const [_colorantToCarriage, setColorantToCarriage] = colorantToCarriageHook;

  const carriageDefinitionStringHook = useState(defaultCarriageDefinitionString());
  const [carriageDefinitionString, _setCarriageDefinitionString] = carriageDefinitionStringHook;

  const masksetDefinitionStringHook = useState(defaultMasksetDefinitionString());

  const customColorantsDefinitionStringHook = useState(defaultCustomColorantsDefinitionString());
  const [customColorantsDefinitionString, _setCustomColorantsDefinitionString] = customColorantsDefinitionStringHook;

  useEffect(() => {
    const customColorantsDefinition = JSON.parse(customColorantsDefinitionString);
    const customColorToColorants = {};

    for (let i = 0; i < customColorantsDefinition.components.length; i++) {
      const { color, colorants } = customColorantsDefinition.components[i];

      customColorToColorants[color] = colorants;
    }

    const customColorantToColor = ColorantTools.invertColorToColorants(customColorToColorants);

    const newColorantToColor = ColorantTools.mergeCustomColorantToColor(customColorantToColor);

    setColorantToColor(newColorantToColor);
  }, [customColorantsDefinitionString, setColorantToColor]);

  useEffect(() => {
    const carriageDefinition = JSON.parse(carriageDefinitionString);
    const newColorantToCarriage = {};

    for (let i = 0; i < carriageDefinition.components.length; i++) {
      const { colorant, offset, dieHieghts, overlaps } = carriageDefinition.components[i];

      newColorantToCarriage[colorant] = { offset, dieHieghts, overlaps };
    }

    setColorantToCarriage(newColorantToCarriage);
  }, [carriageDefinitionString, setColorantToCarriage]);

  return (
    <Context.Provider
      value={{
        carriageDefinitionStringHook,
        colorantToCarriageHook,
        colorantToColorHook,
        customColorantsDefinitionStringHook,
        masksetDefinitionStringHook,
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

      <DefineCarriageAccordion />
      <DefineMasksetAccordion />
      <DefineCustomColorantsAccordion />
      <ColorantDefinitions />
    </Context.Provider>
  );
};

export default App;
