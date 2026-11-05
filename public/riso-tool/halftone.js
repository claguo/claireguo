// Halftone / ASCII art tool — ported from the flight-chat admin halftone page
// (branch cla_halftones_test) onto the riso-tool vanilla stack.

const MAX_DIM = 2048;
const ASCII_RAMP = " .:-=+*#%@";

const state = {
  imageData: null,  // working-size pixels, white-composited (alpha = paper)
  width: 0,
  height: 0,
  gridSize: 8,
  invert: false,
  mode: "halftone", // "halftone" | "ascii"
  dots: [],
  asciiText: "",
  objectUrl: null,
};

// ---- DOM refs ----
const fileInput        = document.getElementById("file-input");
const dropzone         = document.getElementById("dropzone");
const workspace        = document.getElementById("workspace");
const clearBtn         = document.getElementById("clear-btn");
const modeHalftoneBtn  = document.getElementById("mode-halftone");
const modeAsciiBtn     = document.getElementById("mode-ascii");
const gridInput        = document.getElementById("grid-input");
const gridValue        = document.getElementById("grid-value");
const invertBtn        = document.getElementById("invert-btn");
const halftoneActions  = document.getElementById("halftone-actions");
const asciiActions     = document.getElementById("ascii-actions");
const downloadPngBtn   = document.getElementById("download-png");
const downloadSvgBtn   = document.getElementById("download-svg");
const copyTextBtn      = document.getElementById("copy-text");
const downloadAsciiBtn = document.getElementById("download-ascii-png");
const originalImg      = document.getElementById("original-img");
const resultCanvas     = document.getElementById("result-canvas");
const asciiPre         = document.getElementById("ascii-pre");
const resultLabel      = document.getElementById("result-label");

// ---- Setup ----
wireUpload();
wireDragDrop();
wireControls();

function wireUpload() {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // Reset so re-selecting the same file still triggers `change`.
    fileInput.value = "";
  });
  dropzone.addEventListener("click", () => fileInput.click());
}

function wireDragDrop() {
  ["dragenter", "dragover"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    dropzone.addEventListener(evt, (e) => {
      e.preventDefault();
      dropzone.classList.remove("dragover");
    })
  );
  dropzone.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type.startsWith("image/")) loadFile(file);
  });
}

function wireControls() {
  modeHalftoneBtn.addEventListener("click", () => setMode("halftone"));
  modeAsciiBtn.addEventListener("click", () => setMode("ascii"));

  gridInput.addEventListener("input", () => {
    state.gridSize = Number(gridInput.value);
    gridValue.textContent = `${state.gridSize}px`;
    render();
  });

  invertBtn.addEventListener("click", () => {
    state.invert = !state.invert;
    invertBtn.setAttribute("aria-pressed", String(state.invert));
    render();
  });

  downloadPngBtn.addEventListener("click", downloadPNG);
  downloadSvgBtn.addEventListener("click", downloadSVG);
  copyTextBtn.addEventListener("click", copyAsciiText);
  downloadAsciiBtn.addEventListener("click", downloadAsciiPNG);
  clearBtn.addEventListener("click", clearImage);
}

function setMode(mode) {
  state.mode = mode;
  modeHalftoneBtn.setAttribute("aria-pressed", String(mode === "halftone"));
  modeAsciiBtn.setAttribute("aria-pressed", String(mode === "ascii"));
  render();
}

// ---- Load ----
function loadFile(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
    state.objectUrl = url;
    processImage(img);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert("could not load that image");
  };
  img.src = url;
}

function processImage(img) {
  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_DIM);
  state.width = width;
  state.height = height;

  const src = document.createElement("canvas");
  src.width = width;
  src.height = height;
  const sctx = src.getContext("2d");
  // White background — handles transparent PNGs (alpha treated as paper).
  sctx.fillStyle = "#ffffff";
  sctx.fillRect(0, 0, width, height);
  sctx.drawImage(img, 0, 0, width, height);
  state.imageData = sctx.getImageData(0, 0, width, height);

  originalImg.src = state.objectUrl;
  dropzone.hidden = true;
  workspace.hidden = false;
  clearBtn.hidden = false;
  render();
}

function clearImage() {
  if (state.objectUrl) URL.revokeObjectURL(state.objectUrl);
  state.objectUrl = null;
  state.imageData = null;
  state.width = 0;
  state.height = 0;
  state.dots = [];
  state.asciiText = "";
  originalImg.removeAttribute("src");
  workspace.hidden = true;
  dropzone.hidden = false;
  clearBtn.hidden = true;
}

// ---- Compute ----
function computeHalftone(imageData, gridSize, invert) {
  const { width, height, data } = imageData;
  const dots = [];

  for (let y = 0; y < height; y += gridSize) {
    for (let x = 0; x < width; x += gridSize) {
      let totalLuminance = 0;
      let count = 0;

      const cellW = Math.min(gridSize, width - x);
      const cellH = Math.min(gridSize, height - y);

      for (let cy = 0; cy < cellH; cy++) {
        for (let cx = 0; cx < cellW; cx++) {
          const i = ((y + cy) * width + (x + cx)) * 4;
          totalLuminance +=
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          count++;
        }
      }

      const avgLuminance = totalLuminance / count;
      const intensity = invert ? avgLuminance : 1 - avgLuminance;
      const radius = intensity * (gridSize / 2);

      if (radius > 0.5) {
        dots.push({ cx: x + cellW / 2, cy: y + cellH / 2, r: radius });
      }
    }
  }

  return dots;
}

function computeAscii(imageData, gridSize, invert) {
  const { width, height, data } = imageData;
  // Characters are taller than wide; use ~0.6× width for sampling
  const cellW = Math.round(gridSize * 0.6);
  const cellH = gridSize;
  const ramp = invert ? ASCII_RAMP : ASCII_RAMP.split("").reverse().join("");
  const rows = [];

  for (let y = 0; y < height; y += cellH) {
    let row = "";
    for (let x = 0; x < width; x += cellW) {
      let totalLuminance = 0;
      let count = 0;

      const cw = Math.min(cellW, width - x);
      const ch = Math.min(cellH, height - y);

      for (let cy = 0; cy < ch; cy++) {
        for (let cx = 0; cx < cw; cx++) {
          const i = ((y + cy) * width + (x + cx)) * 4;
          totalLuminance +=
            (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
          count++;
        }
      }

      const avg = totalLuminance / count;
      const idx = Math.min(Math.floor(avg * ramp.length), ramp.length - 1);
      row += ramp[idx];
    }
    rows.push(row);
  }

  return rows.join("\n");
}

// ---- Render ----
function render() {
  if (!state.imageData) return;

  const isAscii = state.mode === "ascii";
  resultLabel.textContent = isAscii ? "ascii" : "halftone";
  resultCanvas.hidden = isAscii;
  asciiPre.hidden = !isAscii;
  halftoneActions.hidden = isAscii;
  asciiActions.hidden = !isAscii;

  if (isAscii) {
    state.asciiText = computeAscii(state.imageData, state.gridSize, state.invert);
    asciiPre.textContent = state.asciiText;
    asciiPre.style.fontSize = `${state.gridSize}px`;
    asciiPre.style.backgroundColor = state.invert ? "#000" : "#fff";
    asciiPre.style.color = state.invert ? "#fff" : "#000";
  } else {
    const { width, height } = state;
    resultCanvas.width = width;
    resultCanvas.height = height;

    state.dots = computeHalftone(state.imageData, state.gridSize, state.invert);

    const ctx = resultCanvas.getContext("2d");
    ctx.fillStyle = state.invert ? "#000000" : "#ffffff";
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = state.invert ? "#ffffff" : "#000000";
    for (const dot of state.dots) {
      ctx.beginPath();
      ctx.arc(dot.cx, dot.cy, dot.r, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}

// ---- Export ----
function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadPNG() {
  resultCanvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, "halftone.png");
  }, "image/png");
}

function downloadSVG() {
  const { dots, width, height, invert } = state;
  if (!dots.length || !width) return;

  const bgColor = invert ? "#000000" : "#ffffff";
  const dotColor = invert ? "#ffffff" : "#000000";

  const circles = dots
    .map((d) => `<circle cx="${d.cx}" cy="${d.cy}" r="${d.r.toFixed(2)}"/>`)
    .join("\n  ");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  <rect width="${width}" height="${height}" fill="${bgColor}"/>
  <g fill="${dotColor}">
  ${circles}
  </g>
</svg>`;

  downloadBlob(new Blob([svg], { type: "image/svg+xml" }), "halftone.svg");
}

async function copyAsciiText() {
  if (!state.asciiText) return;
  await navigator.clipboard.writeText(state.asciiText);
}

function downloadAsciiPNG() {
  if (!state.asciiText) return;
  const lines = state.asciiText.split("\n");
  const fontSize = state.gridSize;
  const charWidth = fontSize * 0.6;
  const cols = lines[0]?.length ?? 0;
  const rows = lines.length;
  const cw = Math.ceil(cols * charWidth);
  const ch = rows * fontSize;

  const canvas = document.createElement("canvas");
  canvas.width = cw;
  canvas.height = ch;
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = state.invert ? "#000000" : "#ffffff";
  ctx.fillRect(0, 0, cw, ch);

  ctx.fillStyle = state.invert ? "#ffffff" : "#000000";
  ctx.font = `${fontSize}px monospace`;
  ctx.textBaseline = "top";

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < lines[r].length; c++) {
      ctx.fillText(lines[r][c], c * charWidth, r * fontSize);
    }
  }

  canvas.toBlob((blob) => {
    if (blob) downloadBlob(blob, "ascii-art.png");
  }, "image/png");
}

// ---- Helpers ----
function fitWithin(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h };
  const scale = max / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}
