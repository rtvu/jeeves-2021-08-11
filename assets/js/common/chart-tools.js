const canvasBackgroundColor = (color) => {
  return {
    id: "canvas_background_color",
    beforeDraw: (chart) => {
      const context = chart.canvas.getContext("2d");
      context.save();
      context.globalCompositeOperation = "destination-over";
      context.fillStyle = color;
      context.fillRect(0, 0, chart.width, chart.height);
      context.restore();
    },
  };
};

export { canvasBackgroundColor };
