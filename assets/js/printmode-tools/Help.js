import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

import ResizableTextarea from "../common/react-components/ResizableTextarea";

const shortcuts = [
  ["Ctrl + Space", "Toggle Show Console"],
  ["Ctrl + Left/Right Arrow", "Navigate Tabs"],
  ["Ctrl + Shift + /", "Help"],
  ["Ctrl + Shift + Enter", "Colorant Definitions"],
  ["Ctrl + Shift + Space", "Main Console"],
];

const Help = () => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (!event.altKey && event.ctrlKey && !event.metaKey && event.shiftKey && event.key === "?") {
        setShowHelp(true);
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const ListItem = ([shortcut, description]) => {
    return (
      <li key={shortcut} className="list-group-item font-monospace" style={{ fontSize: "0.875rem" }}>
        <div className="row gx-2">
          <div className="col-12 col-sm-6 col-lg-4 mb-2 mb-sm-0">
            <ResizableTextarea
              className="form-control form-control-sm font-monospace"
              rows="1"
              disabled
              value={shortcut}
              style={{ backgroundColor: "#ffffff", resize: "none" }}
            ></ResizableTextarea>
          </div>
          <div className="col-12 col-sm-6 col-lg-8">
            <ResizableTextarea
              className="form-control form-control-sm font-monospace"
              rows="1"
              disabled
              value={description}
              style={{ backgroundColor: "#ffffff", resize: "none" }}
            ></ResizableTextarea>
          </div>
        </div>
      </li>
    );
  };

  return (
    <>
      <button type="button" className="btn btn-sm btn-outline-secondary float-end" onClick={() => setShowHelp(true)}>
        ?
      </button>
      <Modal show={showHelp} onHide={() => setShowHelp(false)} size="lg">
        <Modal.Header className="p-2" style={{ backgroundColor: "#f0f0f0" }}>
          <Modal.Title as="h5" className="text-center w-100">
            Help
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-1">Keyboard Shortcuts</div>
          <ul className="list-group">{shortcuts.map(ListItem)}</ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Help;
