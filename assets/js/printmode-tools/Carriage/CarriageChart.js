import { useContext } from "react";
import { Bar } from "react-chartjs-2";

import { toCarriage } from "./CarriageCommon";

import Context from "../Context";
import { canvasBackgroundColor } from "../../common/chart-tools";
import { hexToRGB } from "../../common/utilities";

function processCarriage(carriage) {
  const processed = {
    colorant: [],
    offset: [],
    height: [],
    maxHeight: 0,
  };

  for (let i = 0; i < carriage.ids.length; i++) {
    const id = carriage.ids[i].id;
    const component = carriage.components[id];
    const colorant = component.formattedInputs.colorant;
    const offset = component.formattedInputs.offset;
    const height =
      component.formattedInputs.dieHeights.reduce((x, y) => x + y, 0) -
      component.formattedInputs.overlaps.reduce((x, y) => x + y, 0);

    processed.colorant.push(colorant);
    processed.offset.push(offset);
    processed.height.push(height);
    processed.maxHeight = Math.max(processed.maxHeight, offset + height);
  }

  return processed;
}

const CarriageChart = () => {
  const { carriageJsonHook, colorantToColorHook } = useContext(Context);

  const [carriageJson, _setCarriageJsonString] = carriageJsonHook;

  const [colorantToColor, _setColorantToColor] = colorantToColorHook;

  const carriage = toCarriage(carriageJson, colorantToColor);

  const plugins = [canvasBackgroundColor("white")];

  const data = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1,
        borderSkipped: false,
      },
    ],
  };

  let text = "Carriage";
  if (carriage.title !== "") {
    text = carriage.title;
  }

  const options = {};
  options.plugins = {
    legend: { display: false },
    title: { text: text, display: true, font: { weight: "bold", size: 20 } },
  };
  options.scales = {
    x: { title: { display: true, text: "Colorants" } },
    y: { title: { display: true, text: "Nozzles" } },
  };

  if (carriage.valid) {
    const processed = processCarriage(carriage);

    options.scales.y.max = processed.maxHeight;
    options.scales.y.min = 0;

    for (let i = 0; i < carriage.ids.length; i++) {
      const label = processed.colorant[i];
      const low = processed.maxHeight - processed.height[i] - processed.offset[i];
      const high = processed.maxHeight - processed.offset[i];
      const { R, G, B } = hexToRGB(colorantToColor[label]);

      data.labels.push(label);
      data.datasets[0].data.push([low, high]);
      data.datasets[0].backgroundColor.push(`rgba(${R}, ${G}, ${B}, 0.2)`);
      data.datasets[0].borderColor.push(`rgba(${R}, ${G}, ${B}, 1.0)`);
    }
  }

  return <Bar className="px-3 pt-0 pb-3" data={data} options={options} plugins={plugins} />;
};

export default CarriageChart;
