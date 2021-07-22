import { useEffect, useState } from "react";
import ColorantTools from "../common/colorant-tools";
import Context from "./Context";
import DefineColorantsAccordion from "./DefineColorantsAccordion";

const App = () => {
  const colorantToColorHook = useState(ColorantTools.defaultColorantToColor);
  const [colorantToColor, setColorantToColor] = colorantToColorHook;

  const customColorantsDefinitionsHook = useState([]);
  const [customColorantsDefinitions] = customColorantsDefinitionsHook;

  useEffect(() => {
    const customColorToColorants = {};
    for (let i = 0; i < customColorantsDefinitions.length; i++) {
      const [colorants, color] = customColorantsDefinitions[i];
      customColorToColorants[color] = colorants;
    }

    const customColorantToColor = ColorantTools.invertColorToColorants(customColorToColorants);

    const newColorantToColor = ColorantTools.mergeCustomColorantToColor(customColorantToColor);

    setColorantToColor(newColorantToColor);
  }, [customColorantsDefinitions, setColorantToColor]);

  return (
    <Context.Provider value={{ colorantToColorHook, customColorantsDefinitionsHook }}>
      <div>
        <h1 className="text-center mb-3">Printmode Tools</h1>
        <DefineColorantsAccordion />
      </div>
      <div className="row">
        <div className="col">
          <pre>{JSON.stringify(colorantToColor, undefined, 2)}</pre>
        </div>
        <div className="col">
          <pre>{JSON.stringify(customColorantsDefinitions, undefined, 2)}</pre>
        </div>
      </div>
    </Context.Provider>
  );
};

export default App;
