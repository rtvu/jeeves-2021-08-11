import { createContext } from "react";

const ActiveTabKeyContext = createContext();
const CarriageJsonContext = createContext();
const ColorsetJsonContext = createContext();
const ColorantToCarriageContext = createContext();
const ColorantToColorContext = createContext();
const MasksetJsonContext = createContext();

const Context = ({
  activeTabKeyHook,
  carriageJsonHook,
  children,
  colorsetJsonHook,
  colorantToCarriageHook,
  colorantToColorHook,
  masksetJsonHook,
}) => {
  return (
    <ActiveTabKeyContext.Provider value={activeTabKeyHook}>
      <CarriageJsonContext.Provider value={carriageJsonHook}>
        <ColorsetJsonContext.Provider value={colorsetJsonHook}>
          <ColorantToCarriageContext.Provider value={colorantToCarriageHook}>
            <ColorantToColorContext.Provider value={colorantToColorHook}>
              <MasksetJsonContext.Provider value={masksetJsonHook}>{children}</MasksetJsonContext.Provider>
            </ColorantToColorContext.Provider>
          </ColorantToCarriageContext.Provider>
        </ColorsetJsonContext.Provider>
      </CarriageJsonContext.Provider>
    </ActiveTabKeyContext.Provider>
  );
};

export {
  Context,
  ActiveTabKeyContext,
  CarriageJsonContext,
  ColorsetJsonContext,
  MasksetJsonContext,
  ColorantToCarriageContext,
  ColorantToColorContext,
};
