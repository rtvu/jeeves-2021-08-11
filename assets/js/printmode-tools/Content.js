import { useEffect, useState } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import CarriageContent from "./Carriage/CarriageContent";
import ColorantsContent from "./ColorantsContent";
import MasksetContent from "./MasksetContent";

const tabKeys = {
  carriage: "carriage",
  colorants: "colorants",
  maskset: "maskset",
};

const Content = () => {
  const [activeKey, setActiveKey] = useState(tabKeys.carriage);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (event.ctrlKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) {
        setActiveKey((activeKey) => {
          if (activeKey === tabKeys.carriage && event.key === "ArrowRight") {
            return tabKeys.maskset;
          }

          if (activeKey === tabKeys.maskset && event.key === "ArrowRight") {
            return tabKeys.colorants;
          }

          if (activeKey === tabKeys.maskset && event.key === "ArrowLeft") {
            return tabKeys.carriage;
          }

          if (activeKey === tabKeys.colorants && event.key === "ArrowLeft") {
            return tabKeys.maskset;
          }

          return activeKey;
        });
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  return (
    <Tabs id="content" activeKey={activeKey} onSelect={setActiveKey}>
      <Tab eventKey={tabKeys.carriage} title="Carriage">
        <CarriageContent />
      </Tab>
      <Tab eventKey={tabKeys.maskset} title="Maskset">
        <MasksetContent />
      </Tab>
      <Tab eventKey={tabKeys.colorants} title="Custom Colorants">
        <ColorantsContent />
      </Tab>
    </Tabs>
  );
};

export default Content;
