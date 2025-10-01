// Blank SVG Export - main plugin script
function toUtf8(bytes) {
  const chunk = 0x8000;
  let result = '';
  for (let i = 0; i < bytes.length; i += chunk) {
    const slice = bytes.subarray(i, Math.min(i + chunk, bytes.length));
    result += String.fromCharCode.apply(null, Array.prototype.slice.call(slice));
  }
  return decodeURIComponent(escape(result));
}

function sanitizeName(name) {
  if (!name) return "untitled";
  return name.replace(/[^a-zA-Z0-9-_\. ]+/g, "-").trim() || "untitled";
}

function describeSelection() {
  const selection = figma.currentPage.selection;
  return selection.map(node => ({
    id: node.id,
    name: sanitizeName(node.name || "untitled")
  }));
}

function sendSelection() {
  const meta = describeSelection();
  figma.ui.postMessage({ type: "selection-meta", items: meta });
}

async function exportNodes(requestItems) {
  const results = [];
  const errors = [];
  for (const item of requestItems) {
    const node = figma.getNodeById(item.id);
    if (!node || typeof node.exportAsync !== "function") {
      errors.push({ id: item.id, message: "Node not exportable" });
      continue;
    }
    try {
      const bytes = await node.exportAsync({ format: "SVG", svgOutlineText: false, svgSimplifyStroke: false });
      const text = toUtf8(bytes);
      results.push({ id: item.id, name: sanitizeName(item.name || node.name), svgText: text, size: bytes.byteLength });
    } catch (err) {
      const message = err && err.message ? err.message : String(err);
      errors.push({ id: item.id, message: message });
    }
  }
  figma.ui.postMessage({ type: "export-result", files: results, errors });
}

figma.ui.onmessage = async msg => {
  if (msg.type === "request-selection") {
    sendSelection();
  }
  if (msg.type === "focus-node") {
    const node = figma.getNodeById(msg.id);
    if (node) {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
      sendSelection();
    }
  }
  if (msg.type === "export-request") {
    const items = Array.isArray(msg.items) ? msg.items : [];
    await exportNodes(items);
  }
  if (msg.type === "close-plugin") {
    figma.closePlugin();
  }
};

figma.on("selectionchange", () => {
  sendSelection();
});

figma.showUI(__html__, { width: 720, height: 560 });
figma.ui.postMessage({ type: "ready" });
sendSelection();
