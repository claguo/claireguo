// Riso print tool — CMYK separation + per-layer color overlay (screen) + multiply stack.
// Live preview uses CSS mix-blend-mode; export reproduces the math on canvas.

const MAX_DIM = 2048;

// Riso ink palette, sourced from stencil.wiki/wiki/Category:Riso_inks.
// 80 inks with their official sRGB hex values.
const RISO_PALETTE = [
  { name: "Apricot",             hex: "#F6A04D" },
  { name: "Aqua",                hex: "#5EC8E5" },
  { name: "Bisque",              hex: "#F2CDCF" },
  { name: "Black",               hex: "#000000" },
  { name: "Blue",                hex: "#0078BF" },
  { name: "Brick",               hex: "#A75154" },
  { name: "Bright Gold",         hex: "#BA8032" },
  { name: "Bright Olive Green",  hex: "#B49F29" },
  { name: "Bright Red",          hex: "#F15060" },
  { name: "Brown",               hex: "#925F52" },
  { name: "Bubblegum",           hex: "#F984CA" },
  { name: "Burgundy",            hex: "#914E72" },
  { name: "Charcoal",            hex: "#70747C" },
  { name: "Citron",              hex: "#FAF3B7" },
  { name: "Copper",              hex: "#BD6439" },
  { name: "Coral",               hex: "#FF8E91" },
  { name: "Cornflower",          hex: "#62A8E5" },
  { name: "Cranberry",           hex: "#BA0C24" },
  { name: "Crimson",             hex: "#E45D50" },
  { name: "Dark Mauve",          hex: "#BD8CA6" },
  { name: "Emerald",             hex: "#19975D" },
  { name: "Flat Gold",           hex: "#BB8B41" },
  { name: "Fluorescent Green",   hex: "#44D62C" },
  { name: "Fluorescent Orange",  hex: "#FF7477" },
  { name: "Fluorescent Pink",    hex: "#FF48B0" },
  { name: "Fluorescent Red",     hex: "#FF4C65" },
  { name: "Fluorescent Yellow",  hex: "#F7FF00" },
  { name: "Forest",              hex: "#516E5A" },
  { name: "Granite",             hex: "#A5AAA8" },
  { name: "Grape",               hex: "#6C5D80" },
  { name: "Grass",               hex: "#397E58" },
  { name: "Gray",                hex: "#928D88" },
  { name: "Green",               hex: "#00A95C" },
  { name: "Hunter Green",        hex: "#407060" },
  { name: "Indigo",              hex: "#484D7A" },
  { name: "Ivy",                 hex: "#169B62" },
  { name: "Kelly Green",         hex: "#67B346" },
  { name: "Lagoon",              hex: "#2F6F65" },
  { name: "Lake",                hex: "#235BA8" },
  { name: "Light Gray",          hex: "#88898A" },
  { name: "Light Lime",          hex: "#E3ED55" },
  { name: "Light Mauve",         hex: "#E6B5C9" },
  { name: "Light Teal",          hex: "#009DA5" },
  { name: "Mahogany",            hex: "#8E595A" },
  { name: "Marine Red",          hex: "#D2515E" },
  { name: "Maroon",              hex: "#9E4C6E" },
  { name: "Medium Blue",         hex: "#3255A4" },
  { name: "Melon",               hex: "#FFAE3B" },
  { name: "Metallic Gold",       hex: "#AC936E" },
  { name: "Midnight",            hex: "#435060" },
  { name: "Mint",                hex: "#82D8D5" },
  { name: "Mist",                hex: "#B8C7C4" },
  { name: "Moss",                hex: "#68724D" },
  { name: "Orange",              hex: "#FF6C2F" },
  { name: "Orchid",              hex: "#BB76CF" },
  { name: "Paprika",             hex: "#EE7F4B" },
  { name: "Pine",                hex: "#237E74" },
  { name: "Plum",                hex: "#845991" },
  { name: "Pumpkin",             hex: "#FF6F4C" },
  { name: "Purple",              hex: "#765BA7" },
  { name: "Raisin",              hex: "#775D7A" },
  { name: "Raspberry Red",       hex: "#B44B65" },
  { name: "Red",                 hex: "#FF665E" },
  { name: "Riso-Federal Blue",   hex: "#3D5588" },
  { name: "Scarlet",             hex: "#F65058" },
  { name: "Sea Blue",            hex: "#0074A2" },
  { name: "Sea Foam",            hex: "#62C2B1" },
  { name: "Sky Blue",            hex: "#4982CF" },
  { name: "Slate",               hex: "#5E695E" },
  { name: "Smoky Teal",          hex: "#5F8289" },
  { name: "Spruce",              hex: "#4A635D" },
  { name: "Steel",               hex: "#375E77" },
  { name: "Sunflower",           hex: "#FFB511" },
  { name: "Teal",                hex: "#00838A" },
  { name: "Tomato",              hex: "#D2515E" },
  { name: "Turquoise",           hex: "#00AA93" },
  { name: "Violet",              hex: "#9D7AD2" },
  { name: "White",               hex: "#FFFFFF" },
  { name: "Wine",                hex: "#914E72" },
  { name: "Yellow",              hex: "#FFE800" },
];

// Sort palette by hue → lightness so visually similar inks group together.
// Grayscales (very low saturation) are bucketed to the end, sorted dark→light.
RISO_PALETTE.sort((a, b) => {
  const ha = hexToHsl(a.hex);
  const hb = hexToHsl(b.hex);
  const grayA = ha.s < 0.08;
  const grayB = hb.s < 0.08;
  if (grayA && grayB) return ha.l - hb.l;
  if (grayA) return 1;
  if (grayB) return -1;
  // Bucket hue into 12 slices so near-equal hues don't shuffle by tiny diffs.
  const bucketA = Math.floor(ha.h * 12);
  const bucketB = Math.floor(hb.h * 12);
  if (bucketA !== bucketB) return bucketA - bucketB;
  return ha.l - hb.l;
});

function findInk(name) {
  return RISO_PALETTE.find((i) => i.name === name) ?? RISO_PALETTE[0];
}

function hexToHsl(hex) {
  const v = hex.replace("#", "");
  const r = parseInt(v.slice(0, 2), 16) / 255;
  const g = parseInt(v.slice(2, 4), 16) / 255;
  const b = parseInt(v.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let s = 0;
  let h = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
  }
  return { h, s, l };
}

// Default each CMYK channel to the closest Riso ink — the standard four-color
// riso process approximation.
const CHANNELS = [
  { key: "c", channelName: "Cyan",    inkName: "Aqua" },
  { key: "m", channelName: "Magenta", inkName: "Fluorescent Pink" },
  { key: "y", channelName: "Yellow",  inkName: "Yellow" },
  { key: "k", channelName: "Black",   inkName: "Black" },
];

const HISTORY_LIMIT = 50;

function randomDirection() {
  const angle = Math.random() * Math.PI * 2;
  return { dirX: Math.cos(angle), dirY: Math.sin(angle) };
}

function makeLayerFromChannel(ch) {
  const ink = findInk(ch.inkName);
  const { dirX, dirY } = randomDirection();
  return {
    key: ch.key,
    channelName: ch.channelName,
    inkName: ink.name,
    color: ink.hex,
    visible: true,
    grayscale: false,
    opacity: 1,
    // [input, output] pairs over 0..255. First and last entries are the
    // shadow/highlight endpoints; interior points are user-added control points.
    curve: [[0, 0], [255, 255]],
    // Unit vector for misregistration drift; scaled by state.misregistration.
    dirX,
    dirY,
    originalImageData: null, // CMYK separation (or merged result); never mutated by curve edits
    adjustedImageData: null, // cache: curve applied to originalImageData
    canvas: null,            // displayed canvas (mirrors adjustedImageData)
  };
}

function identityCurve() { return [[0, 0], [255, 255]]; }
function cloneCurve(curve) { return curve.map((p) => p.slice()); }
function isIdentityCurve(curve) {
  return curve.length === 2
    && curve[0][0] === 0 && curve[0][1] === 0
    && curve[1][0] === 255 && curve[1][1] === 255;
}

const state = {
  width: 0,
  height: 0,
  layers: CHANNELS.map(makeLayerFromChannel),
  // Maximum layer offset in source pixels — simulates plate misregistration.
  misregistration: 0,
  history: [],   // pre-mutation snapshots; pop to undo
  future: [],    // post-undo snapshots; pop to redo. Cleared by any new mutation.
  selected: new Set(),
};

const MISREGISTRATION_MAX = 30;

// ---- DOM refs ----
const fileInput  = document.getElementById("file-input");
const exportBtn  = document.getElementById("export-btn");
const undoBtn    = document.getElementById("undo-btn");
const redoBtn    = document.getElementById("redo-btn");
const preview    = document.getElementById("preview");
const layersPane = document.getElementById("layers-panel");

// Floating "merge" button — shown when 2+ layers are selected.
const mergeFloatingBtn = document.createElement("button");
mergeFloatingBtn.type = "button";
mergeFloatingBtn.className = "merge-floating";
mergeFloatingBtn.textContent = "merge";
mergeFloatingBtn.hidden = true;
mergeFloatingBtn.addEventListener("click", mergeSelectedLayers);
document.body.appendChild(mergeFloatingBtn);

// ---- Setup ----
buildLayerPanel();
wireUpload();
wireDragDrop();
wireExport();
wireUndo();

// ---- Upload ----
function wireUpload() {
  fileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) loadFile(file);
    // Reset so re-selecting the same file still triggers `change`.
    fileInput.value = "";
  });
  // The empty drop-zone doubles as the upload trigger.
  preview.addEventListener("click", () => {
    if (preview.classList.contains("empty")) fileInput.click();
  });
}

function wireDragDrop() {
  ["dragenter", "dragover"].forEach((evt) =>
    preview.addEventListener(evt, (e) => {
      e.preventDefault();
      preview.classList.add("dragover");
    })
  );
  ["dragleave", "drop"].forEach((evt) =>
    preview.addEventListener(evt, (e) => {
      e.preventDefault();
      preview.classList.remove("dragover");
    })
  );
  preview.addEventListener("drop", (e) => {
    const file = e.dataTransfer?.files?.[0];
    if (file) loadFile(file);
  });
}

function loadFile(file) {
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    URL.revokeObjectURL(url);
    processImage(img);
  };
  img.onerror = () => {
    URL.revokeObjectURL(url);
    alert("could not load that image");
  };
  img.src = url;
}

// ---- Pipeline: image → CMYK separations ----
function processImage(img) {
  const { width, height } = fitWithin(img.naturalWidth, img.naturalHeight, MAX_DIM);
  state.width = width;
  state.height = height;
  // New image wipes any prior merges/adjustments so the layer panel starts fresh.
  state.layers = CHANNELS.map(makeLayerFromChannel);
  state.misregistration = 0;
  state.history = [];
  state.future = [];
  state.selected.clear();
  updateHistoryButtons();
  rebuildLayerCards();
  syncMisregistrationControl();
  applySelection();

  // Draw source onto a working canvas at the (possibly downscaled) target size.
  const src = document.createElement("canvas");
  src.width = width;
  src.height = height;
  const sctx = src.getContext("2d");
  // White background — handles transparent PNGs (alpha treated as paper).
  sctx.fillStyle = "#ffffff";
  sctx.fillRect(0, 0, width, height);
  sctx.drawImage(img, 0, 0, width, height);
  const srcData = sctx.getImageData(0, 0, width, height);

  separateCMYK(srcData);
  renderPreview();
  exportBtn.disabled = false;
}

// Convert RGB pixels into four grayscale separations (white = no ink, black = full ink).
function separateCMYK(srcData) {
  const { width, height, data } = srcData;
  const planes = state.layers.map(() => new Uint8ClampedArray(width * height * 4));

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i] / 255;
    const g = data[i + 1] / 255;
    const b = data[i + 2] / 255;

    const k = 1 - Math.max(r, g, b);
    const denom = 1 - k;
    const c = denom === 0 ? 0 : (1 - r - k) / denom;
    const m = denom === 0 ? 0 : (1 - g - k) / denom;
    const y = denom === 0 ? 0 : (1 - b - k) / denom;

    // Each plane: grayscale where intensity = 255 * (1 - channelAmount)
    const channels = [c, m, y, k];
    for (let p = 0; p < 4; p++) {
      const v = Math.round(255 * (1 - channels[p]));
      planes[p][i]     = v;
      planes[p][i + 1] = v;
      planes[p][i + 2] = v;
      planes[p][i + 3] = 255;
    }
  }

  state.layers.forEach((layer, idx) => {
    layer.originalImageData = new ImageData(planes[idx], width, height);
    refreshLayerCanvas(layer);
  });
}

// Build a 256-entry tone-remap LUT from the curve's control points by
// linear interpolation between adjacent points (sorted by input).
function buildLUT(curve) {
  const pts = [...curve].sort((a, b) => a[0] - b[0]);
  if (pts[0][0] !== 0) pts.unshift([0, pts[0][1]]);
  if (pts[pts.length - 1][0] !== 255) pts.push([255, pts[pts.length - 1][1]]);
  const lut = new Uint8ClampedArray(256);
  let seg = 0;
  for (let i = 0; i < 256; i++) {
    while (seg < pts.length - 2 && pts[seg + 1][0] < i) seg++;
    const [x1, y1] = pts[seg];
    const [x2, y2] = pts[seg + 1];
    if (x2 === x1) lut[i] = y1;
    else {
      const t = (i - x1) / (x2 - x1);
      lut[i] = Math.round(y1 + t * (y2 - y1));
    }
  }
  return lut;
}

// Apply a curve LUT to a grayscale separation. Operates on the red channel
// only since the separation is grayscale (r=g=b).
function applyAdjustments(srcImageData, curve) {
  const { width, height, data: src } = srcImageData;
  const out = new Uint8ClampedArray(src.length);
  const lut = buildLUT(curve);
  for (let i = 0; i < src.length; i += 4) {
    const v = lut[src[i]];
    out[i]     = v;
    out[i + 1] = v;
    out[i + 2] = v;
    out[i + 3] = 255;
  }
  return new ImageData(out, width, height);
}

function refreshLayerCanvas(layer) {
  if (!layer.originalImageData) return;
  const adjusted = isIdentityCurve(layer.curve)
    ? layer.originalImageData
    : applyAdjustments(layer.originalImageData, layer.curve);
  layer.adjustedImageData = adjusted;
  if (!layer.canvas) layer.canvas = document.createElement("canvas");
  layer.canvas.width = adjusted.width;
  layer.canvas.height = adjusted.height;
  layer.canvas.getContext("2d").putImageData(adjusted, 0, 0);
}

// ---- Merge: combine two layers' separations via multiply (= ink coverage union) ----
function mergeLayers(sourceKey, targetKey) {
  const srcIdx = state.layers.findIndex((l) => l.key === sourceKey);
  const tgtIdx = state.layers.findIndex((l) => l.key === targetKey);
  if (srcIdx === -1 || tgtIdx === -1 || srcIdx === tgtIdx) return;
  const source = state.layers[srcIdx];
  const target = state.layers[tgtIdx];
  if (!source.originalImageData || !target.originalImageData) return;

  pushHistory();

  // Bake any adjustments into the merge so what the user sees is what they get.
  const a = (source.adjustedImageData ?? source.originalImageData).data;
  const b = (target.adjustedImageData ?? target.originalImageData).data;
  const w = target.originalImageData.width;
  const h = target.originalImageData.height;
  const out = new Uint8ClampedArray(a.length);
  for (let i = 0; i < a.length; i += 4) {
    const v = Math.round((a[i] * b[i]) / 255);
    out[i]     = v;
    out[i + 1] = v;
    out[i + 2] = v;
    out[i + 3] = 255;
  }
  target.originalImageData = new ImageData(out, w, h);
  target.curve = identityCurve();
  target.channelName = `${target.channelName} + ${source.channelName}`;
  refreshLayerCanvas(target);
  state.layers.splice(srcIdx, 1);
  state.selected.delete(sourceKey);
  rebuildLayerCards();
  renderPreview();
  applySelection();
}

// ---- Undo history ----
function snapshotState() {
  // Shallow per-layer copy; originalImageData is shared by reference (only
  // replaced wholesale by separateCMYK or mergeLayers, never mutated). The
  // curve array is deep-cloned so later edits don't mutate the snapshot.
  return {
    misregistration: state.misregistration,
    layers: state.layers.map((l) => ({
      key: l.key,
      channelName: l.channelName,
      inkName: l.inkName,
      color: l.color,
      visible: l.visible,
      grayscale: l.grayscale,
      opacity: l.opacity,
      curve: cloneCurve(l.curve),
      dirX: l.dirX,
      dirY: l.dirY,
      originalImageData: l.originalImageData,
    })),
  };
}

// Commit a pre-mutation snapshot to the undo stack. Any new mutation also
// invalidates the redo stack (we've branched away from that future).
function commitHistory(snap) {
  state.history.push(snap);
  if (state.history.length > HISTORY_LIMIT) state.history.shift();
  state.future.length = 0;
  updateHistoryButtons();
}

function pushHistory() {
  commitHistory(snapshotState());
}

function applySnapshot(snap) {
  state.misregistration = snap.misregistration ?? 0;
  state.layers = snap.layers.map((s) => ({
    ...s,
    curve: cloneCurve(s.curve),
    canvas: null,
    adjustedImageData: null,
  }));
  state.layers.forEach(refreshLayerCanvas);
  // The layer set may differ from the current selection; drop selection rather
  // than guess which keys still exist.
  state.selected.clear();
  rebuildLayerCards();
  syncMisregistrationControl();
  renderPreview();
  applySelection();
}

function undo() {
  if (state.history.length === 0) return;
  state.future.push(snapshotState());
  applySnapshot(state.history.pop());
  updateHistoryButtons();
}

function redo() {
  if (state.future.length === 0) return;
  state.history.push(snapshotState());
  applySnapshot(state.future.pop());
  updateHistoryButtons();
}

function updateHistoryButtons() {
  undoBtn.disabled = state.history.length === 0;
  redoBtn.disabled = state.future.length === 0;
}

function wireUndo() {
  undoBtn.addEventListener("click", undo);
  redoBtn.addEventListener("click", redo);
  window.addEventListener("keydown", (e) => {
    const mod = e.metaKey || e.ctrlKey;
    if (!mod) return;
    const isZ = e.key === "z" || e.key === "Z";
    const isY = e.key === "y" || e.key === "Y";
    if (isZ && !e.shiftKey) {
      e.preventDefault();
      undo();
    } else if ((isZ && e.shiftKey) || isY) {
      e.preventDefault();
      redo();
    }
  });
}

// ---- Preview rendering ----
function renderPreview() {
  preview.classList.remove("empty");
  // Clear any existing layers (keep .drop-hint paragraph if present — hidden via CSS).
  preview.querySelectorAll(".layer").forEach((el) => el.remove());

  fitPreview();

  state.layers.forEach((layer) => {
    const div = document.createElement("div");
    div.className = "layer" + (layer.grayscale ? " grayscale" : "");
    div.dataset.key = layer.key;
    div.hidden = !layer.visible;
    div.style.opacity = String(layer.opacity);

    div.appendChild(layer.canvas);

    const tint = document.createElement("div");
    tint.className = "tint";
    tint.style.setProperty("--ink", layer.color);
    div.appendChild(tint);

    preview.appendChild(div);
  });
  updateAllLayerTransforms();
}

// CSS scale: source pixels → displayed pixels (preview is sized to fit aspect).
function previewScale() {
  if (!state.width) return 1;
  return preview.clientWidth / state.width;
}

function updateLayerTransform(layer) {
  const el = preview.querySelector(`.layer[data-key="${layer.key}"]`);
  if (!el) return;
  const scale = previewScale();
  const dx = layer.dirX * state.misregistration * scale;
  const dy = layer.dirY * state.misregistration * scale;
  el.style.transform = `translate(${dx}px, ${dy}px)`;
}

function updateAllLayerTransforms() {
  state.layers.forEach(updateLayerTransform);
}

// Size .preview to fit inside its wrapper while preserving the source aspect
// ratio (object-fit: contain behavior).
function fitPreview() {
  if (!state.width) return;
  const wrap = preview.parentElement;
  const wrapW = wrap.clientWidth;
  const wrapH = wrap.clientHeight;
  const aspect = state.width / state.height;
  let w, h;
  if (wrapW / wrapH > aspect) {
    h = wrapH;
    w = h * aspect;
  } else {
    w = wrapW;
    h = w / aspect;
  }
  preview.style.width = w + "px";
  preview.style.height = h + "px";
}

window.addEventListener("resize", () => {
  fitPreview();
  updateAllLayerTransforms();
});

function updateLayerInPreview(layer) {
  const el = preview.querySelector(`.layer[data-key="${layer.key}"]`);
  if (!el) return;
  el.hidden = !layer.visible;
  el.classList.toggle("grayscale", layer.grayscale);
  el.style.opacity = String(layer.opacity);
  const tint = el.querySelector(".tint");
  if (tint) tint.style.setProperty("--ink", layer.color);
}

// ---- Selection ----
// Selecting a card solos its layer by toggling the visibility of the others —
// the same effect as clicking each non-selected card's eye button. Holding
// shift extends the selection. Two or more selected layers reveal a floating
// "merge" button.
function applySelection() {
  state.layers.forEach((l) => {
    const cardEl = layersPane.querySelector(`.layer-card[data-key="${l.key}"]`);
    if (cardEl) {
      cardEl.classList.toggle("selected", state.selected.has(l.key));
      cardEl.classList.toggle("disabled", !l.visible);
    }
    updateLayerInPreview(l);
  });
  mergeFloatingBtn.hidden = state.selected.size < 2;
}

function toggleCardSelection(layer, shiftKey) {
  pushHistory();
  if (shiftKey) {
    if (state.selected.has(layer.key)) state.selected.delete(layer.key);
    else state.selected.add(layer.key);
  } else if (state.selected.size === 1 && state.selected.has(layer.key)) {
    state.selected.clear();
  } else {
    state.selected.clear();
    state.selected.add(layer.key);
  }
  // Drive visibility from the new selection: solo selected layers, restore
  // everyone when selection becomes empty.
  const anySelected = state.selected.size > 0;
  state.layers.forEach((l) => {
    l.visible = anySelected ? state.selected.has(l.key) : true;
  });
  applySelection();
}

// Multiply all selected layers' separations into the topmost selected layer
// (in current panel order), then drop the others. One history entry, one rebuild.
function mergeSelectedLayers() {
  const ordered = state.layers.filter((l) => state.selected.has(l.key));
  if (ordered.length < 2) return;
  const target = ordered[0];
  const sources = ordered.slice(1);
  if (!target.originalImageData) return;

  pushHistory();

  const w = target.originalImageData.width;
  const h = target.originalImageData.height;
  let acc = (target.adjustedImageData ?? target.originalImageData).data;
  for (const s of sources) {
    if (!s.originalImageData) continue;
    const sd = (s.adjustedImageData ?? s.originalImageData).data;
    const out = new Uint8ClampedArray(acc.length);
    for (let i = 0; i < acc.length; i += 4) {
      const v = Math.round((acc[i] * sd[i]) / 255);
      out[i]     = v;
      out[i + 1] = v;
      out[i + 2] = v;
      out[i + 3] = 255;
    }
    acc = out;
    target.channelName = `${target.channelName} + ${s.channelName}`;
  }
  target.originalImageData = new ImageData(acc, w, h);
  target.curve = identityCurve();
  refreshLayerCanvas(target);

  const removeKeys = new Set(sources.map((s) => s.key));
  state.layers = state.layers.filter((l) => !removeKeys.has(l.key));
  state.selected.clear();
  rebuildLayerCards();
  renderPreview();
  applySelection();
}

// ---- Popover helpers ----
// Position: anchored to anchor's right edge, opens to the left so it doesn't
// clip off the right of the layers panel. Flip vertically if it would overflow.
function positionPopover(pop, anchor) {
  const rect = anchor.getBoundingClientRect();
  const popRect = pop.getBoundingClientRect();
  const margin = 6;
  let left = rect.right - popRect.width;
  if (left < margin) left = margin;
  let top = rect.bottom + margin;
  if (top + popRect.height > window.innerHeight - margin) {
    top = Math.max(margin, rect.top - popRect.height - margin);
  }
  pop.style.left = left + "px";
  pop.style.top = top + "px";
}

// Dismiss on outside click / Escape. Defer registration so the same click that
// opened the popover doesn't immediately close it.
function setupPopoverDismiss(pop) {
  setTimeout(() => {
    const close = (e) => {
      if (e.type === "keydown" && e.key !== "Escape") return;
      if (e.type === "click" && pop.contains(e.target)) return;
      pop.remove();
      document.removeEventListener("click", close, true);
      document.removeEventListener("keydown", close, true);
    };
    document.addEventListener("click", close, true);
    document.addEventListener("keydown", close, true);
  }, 0);
}

// ---- Riso ink palette popover ----
// Scrollable list anchored under the swatch. Each entry shows ink + name + hex.
function openPalette(layer, anchor, onPick) {
  document.querySelectorAll(".palette-popover").forEach((p) => p.remove());

  const pop = document.createElement("div");
  pop.className = "palette-popover";

  RISO_PALETTE.forEach((ink) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "palette-item";
    if (ink.hex.toLowerCase() === layer.color.toLowerCase()) {
      item.classList.add("selected");
    }
    item.innerHTML =
      `<span class="palette-dot" style="background:${ink.hex}"></span>` +
      `<span class="palette-name">${ink.name}</span>` +
      `<span class="palette-hex">${ink.hex.toUpperCase()}</span>`;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      pushHistory();
      layer.color = ink.hex;
      layer.inkName = ink.name;
      updateLayerInPreview(layer);
      onPick();
      pop.remove();
    });
    pop.appendChild(item);
  });

  document.body.appendChild(pop);
  positionPopover(pop, anchor);

  const sel = pop.querySelector(".palette-item.selected");
  if (sel) sel.scrollIntoView({ block: "nearest" });

  setupPopoverDismiss(pop);
}

// ---- Merge picker popover ----
function openMergePicker(layer, anchor) {
  document.querySelectorAll(".palette-popover").forEach((p) => p.remove());
  const targets = state.layers.filter((l) => l.key !== layer.key);
  if (targets.length === 0) return;

  const pop = document.createElement("div");
  pop.className = "palette-popover";

  const header = document.createElement("div");
  header.className = "popover-header";
  header.textContent = `merge ${layer.channelName.toLowerCase()} into…`;
  pop.appendChild(header);

  targets.forEach((t) => {
    const item = document.createElement("button");
    item.type = "button";
    item.className = "palette-item";
    item.innerHTML =
      `<span class="palette-dot" style="background:${t.color}"></span>` +
      `<span class="palette-name">${t.channelName}</span>` +
      `<span class="palette-hex">${t.inkName}</span>`;
    item.addEventListener("click", (e) => {
      e.stopPropagation();
      mergeLayers(layer.key, t.key);
      pop.remove();
    });
    pop.appendChild(item);
  });

  document.body.appendChild(pop);
  positionPopover(pop, anchor);
  setupPopoverDismiss(pop);
}

// ---- Layer panel UI ----
function buildLayerPanel() {
  const title = document.createElement("h2");
  title.className = "panel-title";
  title.textContent = "layers";
  layersPane.appendChild(title);

  const global = document.createElement("div");
  global.className = "global-controls";
  const allGray = document.createElement("button");
  allGray.className = "icon-btn";
  allGray.type = "button";
  allGray.title = "show all layers as grayscale";
  allGray.textContent = "GS";
  allGray.setAttribute("aria-pressed", "false");
  allGray.addEventListener("click", () => {
    pushHistory();
    const pressed = allGray.getAttribute("aria-pressed") === "true";
    const next = !pressed;
    allGray.setAttribute("aria-pressed", String(next));
    state.layers.forEach((l) => {
      l.grayscale = next;
      const btn = layersPane.querySelector(`[data-grayscale-for="${l.key}"]`);
      if (btn) btn.setAttribute("aria-pressed", String(next));
      updateLayerInPreview(l);
    });
  });
  global.appendChild(allGray);
  const globalLabel = document.createElement("span");
  globalLabel.style.fontSize = "11px";
  globalLabel.style.color = "var(--muted)";
  globalLabel.textContent = "all → grayscale";
  global.appendChild(globalLabel);

  // Misregistration: shifts each layer by up to N source pixels in a per-layer
  // random direction, simulating real-world plate misalignment.
  const misRow = document.createElement("div");
  misRow.className = "global-row";
  const misLabel = document.createElement("span");
  misLabel.className = "global-row-label";
  misLabel.textContent = "misregister";
  const misInput = document.createElement("input");
  misInput.type = "range";
  misInput.min = "0";
  misInput.max = String(MISREGISTRATION_MAX);
  misInput.step = "1";
  misInput.value = String(state.misregistration);
  misInput.id = "misregistration-input";
  const misValue = document.createElement("span");
  misValue.className = "global-row-value";
  misValue.id = "misregistration-value";
  misValue.textContent = `${state.misregistration}px`;
  const reshuffle = document.createElement("button");
  reshuffle.type = "button";
  reshuffle.className = "icon-btn icon-btn-sm";
  reshuffle.title = "randomize per-layer drift directions";
  reshuffle.textContent = "↻";
  reshuffle.addEventListener("click", () => {
    pushHistory();
    state.layers.forEach((l) => {
      const { dirX, dirY } = randomDirection();
      l.dirX = dirX;
      l.dirY = dirY;
    });
    updateAllLayerTransforms();
  });
  misInput.addEventListener("input", () => {
    state.misregistration = Number(misInput.value);
    misValue.textContent = `${state.misregistration}px`;
    updateAllLayerTransforms();
  });
  bindSliderHistory(misInput);
  misRow.appendChild(misLabel);
  misRow.appendChild(misInput);
  misRow.appendChild(misValue);
  misRow.appendChild(reshuffle);
  global.appendChild(misRow);

  layersPane.appendChild(global);

  rebuildLayerCards();
}

// Mirror state.misregistration into the slider after undo / new image load.
function syncMisregistrationControl() {
  const input = document.getElementById("misregistration-input");
  const value = document.getElementById("misregistration-value");
  if (input) input.value = String(state.misregistration);
  if (value) value.textContent = `${state.misregistration}px`;
}

function rebuildLayerCards() {
  layersPane.querySelectorAll(".layer-card").forEach((el) => el.remove());
  state.layers.forEach((layer) => layersPane.appendChild(buildLayerCard(layer)));
}

// Capture state before a slider drag and commit it on release. Skips committing
// if the value never actually changed (no `change` event fires).
function bindSliderHistory(input) {
  let before = null;
  input.addEventListener("pointerdown", () => { before = snapshotState(); });
  input.addEventListener("keydown", (e) => {
    const k = e.key;
    if (k.startsWith("Arrow") || k === "PageUp" || k === "PageDown" || k === "Home" || k === "End") {
      if (!before) before = snapshotState();
    }
  });
  input.addEventListener("change", () => {
    if (!before) return;
    commitHistory(before);
    before = null;
  });
}

// Per-layer curve editor: a tiny SVG plotting input tone (x: 0 black → 255 white)
// against output tone. Click empty area to add a control point, drag to move,
// right-click to remove (interior points only). Endpoints are y-draggable but
// x-locked to 0 / 255.
function buildCurveEditor(layer) {
  const NS = "http://www.w3.org/2000/svg";
  const VB = 256;            // viewBox is square; SVG element is stretched
  const HIT = 14;            // viewBox-unit radius for point hit detection
  const POINT = 8;           // viewBox-unit side length of point markers

  const wrap = document.createElement("div");
  wrap.className = "curve-editor";

  const header = document.createElement("div");
  header.className = "curve-header";
  const lbl = document.createElement("span");
  lbl.textContent = "curve";
  const reset = document.createElement("button");
  reset.type = "button";
  reset.className = "curve-reset";
  reset.textContent = "reset";
  header.appendChild(lbl);
  header.appendChild(reset);
  wrap.appendChild(header);

  const svg = document.createElementNS(NS, "svg");
  svg.setAttribute("viewBox", `0 0 ${VB} ${VB}`);
  svg.setAttribute("preserveAspectRatio", "none");
  svg.classList.add("curve-svg");
  svg.setAttribute("title", "click to add point · drag to move · right-click to remove");

  const ref = document.createElementNS(NS, "line");
  ref.setAttribute("x1", "0");  ref.setAttribute("y1", String(VB));
  ref.setAttribute("x2", String(VB)); ref.setAttribute("y2", "0");
  ref.setAttribute("class", "curve-ref");
  svg.appendChild(ref);

  const path = document.createElementNS(NS, "path");
  path.setAttribute("class", "curve-path");
  svg.appendChild(path);

  const ptsGroup = document.createElementNS(NS, "g");
  svg.appendChild(ptsGroup);

  wrap.appendChild(svg);

  const xToSvg = (x) => x;
  const yToSvg = (y) => 255 - y;
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function svgPosFromEvent(e) {
    const rect = svg.getBoundingClientRect();
    return {
      sx: ((e.clientX - rect.left) / rect.width) * VB,
      sy: ((e.clientY - rect.top) / rect.height) * VB,
    };
  }

  function svgToCurve(sx, sy) {
    return {
      x: clamp(Math.round(sx), 0, 255),
      y: clamp(Math.round(255 - sy), 0, 255),
    };
  }

  // Hit test in viewBox units. Iterate from end so newer points win on overlap.
  function pointAt(sx, sy) {
    for (let i = layer.curve.length - 1; i >= 0; i--) {
      const px = xToSvg(layer.curve[i][0]);
      const py = yToSvg(layer.curve[i][1]);
      if (Math.abs(sx - px) <= HIT && Math.abs(sy - py) <= HIT) return i;
    }
    return -1;
  }

  function render() {
    layer.curve.sort((a, b) => a[0] - b[0]);
    let d = "";
    layer.curve.forEach((p, i) => {
      d += (i === 0 ? "M" : " L") + " " + xToSvg(p[0]) + " " + yToSvg(p[1]);
    });
    path.setAttribute("d", d);
    while (ptsGroup.firstChild) ptsGroup.removeChild(ptsGroup.firstChild);
    layer.curve.forEach((p, i) => {
      const r = document.createElementNS(NS, "rect");
      r.setAttribute("x", String(xToSvg(p[0]) - POINT / 2));
      r.setAttribute("y", String(yToSvg(p[1]) - POINT / 2));
      r.setAttribute("width", String(POINT));
      r.setAttribute("height", String(POINT));
      r.setAttribute("class", "curve-pt");
      r.dataset.idx = String(i);
      ptsGroup.appendChild(r);
    });
  }

  // Drag state. `dragMutated` ensures we push history once per gesture, lazily
  // (so a dead click on an existing point without movement doesn't dirty history).
  let activeIdx = -1;
  let dragMutated = false;

  svg.addEventListener("pointerdown", (e) => {
    if (e.button !== 0) return;  // ignore right-click here; handled in contextmenu
    const { sx, sy } = svgPosFromEvent(e);
    const hit = pointAt(sx, sy);
    if (hit !== -1) {
      activeIdx = hit;
      dragMutated = false;
    } else {
      const { x, y } = svgToCurve(sx, sy);
      // x=0 / x=255 are reserved for the endpoints — don't add duplicates there.
      if (x <= 0 || x >= 255) return;
      pushHistory();
      let insertAt = layer.curve.findIndex((p) => p[0] > x);
      if (insertAt === -1) insertAt = layer.curve.length;
      layer.curve.splice(insertAt, 0, [x, y]);
      activeIdx = insertAt;
      dragMutated = true;
      render();
      refreshLayerCanvas(layer);
    }
    svg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });

  svg.addEventListener("pointermove", (e) => {
    if (activeIdx === -1) return;
    const { sx, sy } = svgPosFromEvent(e);
    const { x, y } = svgToCurve(sx, sy);
    const isFirst = activeIdx === 0;
    const isLast = activeIdx === layer.curve.length - 1;
    let nx;
    if (isFirst) nx = 0;
    else if (isLast) nx = 255;
    else {
      const prevX = layer.curve[activeIdx - 1][0];
      const nextX = layer.curve[activeIdx + 1][0];
      nx = clamp(x, prevX + 1, nextX - 1);
    }
    if (!dragMutated) {
      pushHistory();
      dragMutated = true;
    }
    layer.curve[activeIdx][0] = nx;
    layer.curve[activeIdx][1] = y;
    render();
    refreshLayerCanvas(layer);
  });

  function endDrag(e) {
    if (activeIdx === -1) return;
    if (svg.hasPointerCapture(e.pointerId)) svg.releasePointerCapture(e.pointerId);
    activeIdx = -1;
    dragMutated = false;
  }
  svg.addEventListener("pointerup", endDrag);
  svg.addEventListener("pointercancel", endDrag);

  svg.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const { sx, sy } = svgPosFromEvent(e);
    const hit = pointAt(sx, sy);
    if (hit !== -1 && hit !== 0 && hit !== layer.curve.length - 1) {
      pushHistory();
      layer.curve.splice(hit, 1);
      render();
      refreshLayerCanvas(layer);
    }
  });

  reset.addEventListener("click", () => {
    if (isIdentityCurve(layer.curve)) return;
    pushHistory();
    layer.curve = identityCurve();
    render();
    refreshLayerCanvas(layer);
  });

  render();
  return wrap;
}

function buildSliderRow(label, min, max, value, onInput) {
  const row = document.createElement("div");
  row.className = "layer-row";
  const lbl = document.createElement("span");
  lbl.className = "layer-row-label";
  lbl.textContent = label;
  const input = document.createElement("input");
  input.type = "range";
  input.min = String(min);
  input.max = String(max);
  input.value = String(value);
  input.addEventListener("input", () => onInput(Number(input.value)));
  bindSliderHistory(input);
  row.appendChild(lbl);
  row.appendChild(input);
  return row;
}

function buildLayerCard(layer) {
  const card = document.createElement("div");
  card.className = "layer-card";
  card.dataset.key = layer.key;
  if (!layer.visible) card.classList.add("disabled");
  if (state.selected.has(layer.key)) card.classList.add("selected");

  // Clicks on inner controls (swatch, sliders, action buttons) shouldn't trigger
  // selection — they have their own behavior.
  card.addEventListener("click", (e) => {
    if (e.target.closest("button, input")) return;
    toggleCardSelection(layer, e.shiftKey);
  });

  // Color swatch — clicking opens the Riso ink palette popover.
  const swatch = document.createElement("button");
  swatch.type = "button";
  swatch.className = "swatch";
  swatch.style.background = layer.color;
  swatch.title = "choose riso ink";
  swatch.addEventListener("click", (e) => {
    e.stopPropagation();
    openPalette(layer, swatch, () => {
      swatch.style.background = layer.color;
      inkLabel.textContent = `${layer.inkName} · ${layer.color.toUpperCase()}`;
    });
  });
  card.appendChild(swatch);

  // Meta column: channel name + ink + opacity slider + curve editor.
  const meta = document.createElement("div");
  meta.className = "layer-meta";
  const name = document.createElement("div");
  name.className = "layer-name";
  name.innerHTML = `${layer.channelName} <span class="channel">${layer.key.toUpperCase()}</span>`;
  meta.appendChild(name);

  const inkLabel = document.createElement("div");
  inkLabel.className = "ink-label";
  inkLabel.textContent = `${layer.inkName} · ${layer.color.toUpperCase()}`;
  meta.appendChild(inkLabel);

  meta.appendChild(buildSliderRow("opacity", 0, 100, Math.round(layer.opacity * 100), (v) => {
    layer.opacity = v / 100;
    updateLayerInPreview(layer);
  }));
  meta.appendChild(buildCurveEditor(layer));

  card.appendChild(meta);

  // Actions column: grayscale + merge. Visibility is driven by clicking the
  // card body itself (see `toggleCardSelection`).
  const actions = document.createElement("div");
  actions.className = "layer-actions";

  const gs = document.createElement("button");
  gs.className = "icon-btn";
  gs.type = "button";
  gs.title = "show only grayscale separation";
  gs.textContent = "GS";
  gs.dataset.grayscaleFor = layer.key;
  gs.setAttribute("aria-pressed", String(layer.grayscale));
  gs.addEventListener("click", () => {
    pushHistory();
    layer.grayscale = !layer.grayscale;
    gs.setAttribute("aria-pressed", String(layer.grayscale));
    updateLayerInPreview(layer);
  });

  const merge = document.createElement("button");
  merge.className = "icon-btn";
  merge.type = "button";
  merge.title = "merge into another layer";
  merge.textContent = "M";
  merge.disabled = state.layers.length < 2;
  merge.addEventListener("click", (e) => {
    e.stopPropagation();
    openMergePicker(layer, merge);
  });

  actions.appendChild(gs);
  actions.appendChild(merge);
  card.appendChild(actions);

  return card;
}

// ---- Export: bake screen+multiply pipeline into a single PNG ----
function wireExport() {
  exportBtn.addEventListener("click", () => {
    const canvas = composite();
    canvas.toBlob((png) => {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(png);
      a.download = "riso-export.png";
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    }, "image/png");
  });
}

function composite() {
  const { width, height } = state;
  const out = document.createElement("canvas");
  out.width = width;
  out.height = height;
  const octx = out.getContext("2d");

  // Start with white "paper".
  const dst = new Uint8ClampedArray(width * height * 4);
  for (let i = 0; i < dst.length; i += 4) {
    dst[i] = 255;
    dst[i + 1] = 255;
    dst[i + 2] = 255;
    dst[i + 3] = 255;
  }

  for (const layer of state.layers) {
    if (!layer.visible) continue;
    const ink = hexToRgb(layer.color);
    const showTint = !layer.grayscale;
    const opacity = layer.opacity;
    const gray = (layer.adjustedImageData ?? layer.originalImageData).data;

    for (let i = 0; i < dst.length; i += 4) {
      const g = gray[i]; // grayscale: r=g=b
      // Step 1: tint = screen(grayscale, ink). Grayscale-only mode skips the screen.
      const tr = showTint ? 255 - ((255 - g) * (255 - ink.r)) / 255 : g;
      const tg = showTint ? 255 - ((255 - g) * (255 - ink.g)) / 255 : g;
      const tb = showTint ? 255 - ((255 - g) * (255 - ink.b)) / 255 : g;

      // Step 2: blend into composite via multiply, modulated by opacity.
      const mr = (dst[i]     * tr) / 255;
      const mg = (dst[i + 1] * tg) / 255;
      const mb = (dst[i + 2] * tb) / 255;

      dst[i]     = dst[i]     * (1 - opacity) + mr * opacity;
      dst[i + 1] = dst[i + 1] * (1 - opacity) + mg * opacity;
      dst[i + 2] = dst[i + 2] * (1 - opacity) + mb * opacity;
    }
  }

  octx.putImageData(new ImageData(dst, width, height), 0, 0);
  return out;
}

// ---- Helpers ----
function fitWithin(w, h, max) {
  if (w <= max && h <= max) return { width: w, height: h };
  const scale = max / Math.max(w, h);
  return { width: Math.round(w * scale), height: Math.round(h * scale) };
}

function hexToRgb(hex) {
  const v = hex.replace("#", "");
  const n = parseInt(v.length === 3 ? v.split("").map((c) => c + c).join("") : v, 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

function toHex(color) {
  if (color.startsWith("#")) {
    if (color.length === 4) {
      return "#" + color.slice(1).split("").map((c) => c + c).join("");
    }
    return color;
  }
  return "#000000";
}
