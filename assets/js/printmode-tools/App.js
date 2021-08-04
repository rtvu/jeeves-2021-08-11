import { useEffect, useState } from "react";
import ColorantTools from "../common/colorant-tools";
import Context from "./Context";
import { defaultCarriageDefinitionString } from "./DefineCarriageCommon";
import { defaultCustomColorantsDefinitionString } from "./DefineCustomColorantsCommon";
import DefineCarriageAccordion from "./DefineCarriageAccordion";
import DefineCustomColorantsAccordion from "./DefineCustomColorantsAccordion";

const App = () => {
  const colorantToColorHook = useState(ColorantTools.defaultColorantToColor);
  const [colorantToColor, setColorantToColor] = colorantToColorHook;

  const customColorantsDefinitionStringHook = useState(defaultCustomColorantsDefinitionString());
  const [customColorantsDefinitionString, setCustomColorantsDefinitionStringHook] = customColorantsDefinitionStringHook;

  const carriageDefinitionStringHook = useState(defaultCarriageDefinitionString());

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

  return (
    <Context.Provider
      value={{ carriageDefinitionStringHook, colorantToColorHook, customColorantsDefinitionStringHook }}
    >
      <div>
        <h1 className="text-center mb-3">Printmode Tools</h1>
        <DefineCarriageAccordion />
        <DefineCustomColorantsAccordion />
      </div>
    </Context.Provider>
  );
};

export default App;
