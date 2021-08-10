import { createContext } from "react";

const CarriageJsonContext = createContext();
const ColorsetJsonContext = createContext();
const ColorantToCarriageContext = createContext();
const ColorantToColorContext = createContext();
const MasksetJsonContext = createContext();

const Context = ({
  carriageJsonHook,
  children,
  colorsetJsonHook,
  colorantToCarriageHook,
  colorantToColorHook,
  masksetJsonHook,
}) => {
  return (
    <CarriageJsonContext.Provider value={carriageJsonHook}>
      <ColorsetJsonContext.Provider value={colorsetJsonHook}>
        <ColorantToCarriageContext.Provider value={colorantToCarriageHook}>
          <ColorantToColorContext.Provider value={colorantToColorHook}>
            <MasksetJsonContext.Provider value={masksetJsonHook}>{children}</MasksetJsonContext.Provider>
          </ColorantToColorContext.Provider>
        </ColorantToCarriageContext.Provider>
      </ColorsetJsonContext.Provider>
    </CarriageJsonContext.Provider>
  );
};

export {
  Context,
  CarriageJsonContext,
  ColorsetJsonContext,
  MasksetJsonContext,
  ColorantToCarriageContext,
  ColorantToColorContext,
};
