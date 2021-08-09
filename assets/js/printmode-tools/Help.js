import { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";

const Help = () => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === "?") {
        setShowHelp(true);
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

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
          <ul className="list-group">
            <li className="list-group-item font-monospace" style={{ fontSize: "0.875rem" }}>
              Ctrl + Left/Right Arrow : Navigate Tabs
            </li>
            <li className="list-group-item font-monospace" style={{ fontSize: "0.875rem" }}>
              Ctrl + Shift + /&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;: Help
            </li>

            <li className="list-group-item font-monospace" style={{ fontSize: "0.875rem" }}>
              Ctrl + Shift + Enter&nbsp;&nbsp;&nbsp;&nbsp;: Colorant Definitions
            </li>
            <li className="list-group-item font-monospace" style={{ fontSize: "0.875rem" }}>
              Ctrl + Shift + Space&nbsp;&nbsp;&nbsp;&nbsp;: Main Console
            </li>
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Help;
