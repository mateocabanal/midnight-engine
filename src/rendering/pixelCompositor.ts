export const getPixelRenderScale = (cssHeight: number) => (cssHeight < 320 ? 1 : 0.5);

export type PixelCompositor = {
  resize: (width: number, height: number, dpr: number) => void;
  render: (draw: (ctx: CanvasRenderingContext2D) => void) => void;
};

export const createPixelCompositor = (canvas: HTMLCanvasElement): PixelCompositor | null => {
  const output = canvas.getContext("2d");
  const logicalCanvas = document.createElement("canvas");
  const logical = logicalCanvas.getContext("2d", { alpha: false });
  if (!output || !logical) return null;

  let cssWidth = 0;
  let cssHeight = 0;
  let dpr = 1;
  let scale = 1;

  return {
    resize(width, height, nextDpr) {
      cssWidth = width;
      cssHeight = height;
      dpr = nextDpr;
      scale = getPixelRenderScale(height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      logicalCanvas.width = Math.max(1, Math.ceil(width * scale));
      logicalCanvas.height = Math.max(1, Math.ceil(height * scale));
      logical.imageSmoothingEnabled = false;
      output.imageSmoothingEnabled = false;
    },
    render(draw) {
      logical.setTransform(scale, 0, 0, scale, 0, 0);
      logical.globalAlpha = 1;
      draw(logical);

      output.setTransform(dpr, 0, 0, dpr, 0, 0);
      output.globalAlpha = 1;
      output.clearRect(0, 0, cssWidth, cssHeight);
      output.imageSmoothingEnabled = false;
      output.drawImage(logicalCanvas, 0, 0, logicalCanvas.width, logicalCanvas.height, 0, 0, cssWidth, cssHeight);
    }
  };
};
