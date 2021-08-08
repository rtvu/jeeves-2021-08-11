import { useContext, useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import Context from "./Context";
import ColorantTools from "../common/colorant-tools";
import ResizableTextarea from "../common/react-components/ResizableTextarea";

function toRegex(pattern, flags) {
  try {
    return [true, new RegExp(pattern, flags)];
  } catch (error) {
    return [false, null];
  }
}

const ColorantDefinitions = () => {
  const { colorantToColorHook } = useContext(Context);
  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const [colorToColorants, setColorToColorants] = useState([]);

  useEffect(() => {
    const source = ColorantTools.invertColorantToColor(colorantToColor);
    const newColorToColorants = [];

    for (const color of Object.keys(source).sort()) {
      const colorants = source[color];

      newColorToColorants.push({ color, colorants });
    }

    setColorToColorants(newColorToColorants);
  }, [colorantToColor]);

  const [showColorantsList, setShowColorantsList] = useState(false);

  useEffect(() => {
    const keydownHandler = (event) => {
      if (event.ctrlKey && event.shiftKey && event.key === " ") {
        setShowColorantsList(true);
      }
    };

    window.addEventListener("keydown", keydownHandler);

    return () => {
      window.removeEventListener("keydown", keydownHandler);
    };
  }, []);

  const [regexPattern, setRegexPattern] = useState("");
  const [regexCaseInsensitive, setRegexCaseInsensitive] = useState(true);

  const regexFlag = regexCaseInsensitive ? "i" : "";
  const [isValidRegex, regex] = toRegex(regexPattern.trim(), regexFlag);
  let filteredColorToColorants = colorToColorants;

  if (regexPattern.trim() !== "" && isValidRegex) {
    filteredColorToColorants = [];

    for (const { color, colorants } of colorToColorants) {
      const filteredColorants = colorants.filter((x) => regex.test(x));
      if (filteredColorants.length > 0) {
        filteredColorToColorants.push({ color, colorants: filteredColorants });
      }
    }
  }

  const ListItem = ({ color, colorants }) => {
    return (
      <li key={color} className="list-group-item">
        <div className="row gx-2">
          <div className="col-1">
            <input type="text" className="form-control form-control-sm" disabled style={{ backgroundColor: color }} />
          </div>
          <div className="col-2">
            <input
              type="text"
              className="form-control form-control-sm font-monospace"
              disabled
              value={color}
              style={{ backgroundColor: "#ffffff" }}
            />
          </div>
          <div className="col">
            <ResizableTextarea
              className="form-control form-control-sm font-monospace"
              rows="1"
              disabled
              value={colorants.join(", ")}
              style={{ backgroundColor: "#ffffff" }}
            ></ResizableTextarea>
          </div>
        </div>
      </li>
    );
  };

  return (
    <Modal show={showColorantsList} onHide={() => setShowColorantsList(false)} size="lg" scrollable={true}>
      <Modal.Header className="p-2" style={{ backgroundColor: "#f0f0f0" }}>
        <Modal.Title as="h5" className="text-center w-100">
          Colorant Definitions
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-1">
          Filter
          <div className="form-check form-check-inline float-end me-0">
            <input
              type="checkbox"
              className="form-check-input"
              id="case-insensitive-checkbox"
              checked={regexCaseInsensitive}
              onChange={() => setRegexCaseInsensitive((flag) => !flag)}
            />
            <label className="form-check-label" htmlFor="case-insensitive-checkbox">
              <small>Case Insensitive</small>
            </label>
          </div>
        </div>
        <input
          type="text"
          className="form-control form-control-sm mb-3"
          value={regexPattern}
          onChange={(event) => setRegexPattern(event.target.value)}
        />
        <div className="mb-1">Definitions</div>
        <ul className="list-group">{filteredColorToColorants.map(ListItem)}</ul>
      </Modal.Body>
    </Modal>
  );
};

export default ColorantDefinitions;
