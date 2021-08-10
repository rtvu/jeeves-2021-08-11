import { useContext, useEffect } from "react";

import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";

import { ActiveTabKeyContext } from "./Context";
import CarriageContent from "./Carriage/CarriageContent";
import ColorsetContent from "./Colorset/ColorsetContent";
import MasksetContent from "./Maskset/MasksetContent";
import * as TabKeys from "./TabKeys";

const tabKeyStates = TabKeys.getStates();
const tabKeyActions = TabKeys.getActions();

const Content = () => {
  const [activeTabKey, setActiveTabKey] = useContext(ActiveTabKeyContext);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (event.ctrlKey && Object.values(tabKeyActions).includes(event.key)) {
        setActiveTabKey((activeTabKey) => {
          return TabKeys.transition(activeTabKey, event.key);
        });
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, [setActiveTabKey]);

  return (
    <Tabs id="content" activeKey={activeTabKey} onSelect={setActiveTabKey}>
      <Tab eventKey={tabKeyStates.carriage} title="Carriage">
        <CarriageContent />
      </Tab>
      <Tab eventKey={tabKeyStates.maskset} title="Maskset">
        <MasksetContent />
      </Tab>
      <Tab eventKey={tabKeyStates.colorset} title="Colorset">
        <ColorsetContent />
      </Tab>
    </Tabs>
  );
};

export default Content;
