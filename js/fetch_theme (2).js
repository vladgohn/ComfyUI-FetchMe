import { app } from "../../scripts/app.js";

const BRAND = "#5e2db3";
const FETCHME_CLASSES = new Set(["FetchMeFilter", "FetchMeCodex"]);
const DYNAMIC_KEY_CLASSES = new Set(["FetchMeCodex"]);

const FILTER_INPUT_LABELS = {
  codex_1: "codex_I",
  codex_2: "codex_II",
  codex_3: "codex_III",
  codex_4: "codex_IV",
  codex_5: "codex_V",
  codex_6: "codex_VI",
  codex_7: "codex_VII",
  codex_8: "codex_VIII",
};

function applyBrandColor(node) {
  node.color = BRAND;
  node.bgcolor = BRAND;
}

function relabelInputs(node, labels) {
  if (!Array.isArray(node.inputs)) {
    return;
  }
  for (const input of node.inputs) {
    if (!input || typeof input.name !== "string") {
      continue;
    }
    const label = labels[input.name];
    if (label) {
      input.label = label;
    }
  }
}

function keyIndex(name) {
  if (typeof name !== "string") {
    return null;
  }
  const match = /^key_(\d+)$/.exec(name);
  if (!match) {
    return null;
  }
  return Number(match[1]);
}

function isFilled(widget) {
  const v = widget?.value;
  return typeof v === "string" ? v.trim() !== "" : !!v;
}

function installDynamicKeyFields(node) {
  if (!Array.isArray(node.widgets) || node.widgets.length === 0) {
    return;
  }

  const allWidgets = [...node.widgets];
  const keyEntries = allWidgets
    .map((widget, pos) => ({ widget, idx: keyIndex(widget?.name), pos }))
    .filter((entry) => Number.isFinite(entry.idx))
    .sort((a, b) => a.idx - b.idx);

  if (keyEntries.length === 0) {
    return;
  }

  const firstKeyPos = Math.min(...keyEntries.map((e) => e.pos));
  const lastKeyPos = Math.max(...keyEntries.map((e) => e.pos));

  const prefix = allWidgets.slice(0, firstKeyPos);
  const suffix = allWidgets.slice(lastKeyPos + 1);
  const keyWidgets = keyEntries.map((e) => e.widget);
  const fullWidgets = [...prefix, ...keyWidgets, ...suffix];

  const applyValuesFromConfig = (cfg) => {
    const values = cfg?.widgets_values;
    if (!Array.isArray(values)) {
      return;
    }
    const n = Math.min(values.length, fullWidgets.length);
    for (let i = 0; i < n; i += 1) {
      fullWidgets[i].value = values[i];
    }
  };

  const refresh = () => {
    let lastFilled = 0;
    for (let i = 0; i < keyWidgets.length; i += 1) {
      if (isFilled(keyWidgets[i])) {
        lastFilled = i + 1;
      }
    }

    const minVisible = 2;
    const desiredCount = Math.max(minVisible, Math.min(keyWidgets.length, lastFilled + 1));
    node.widgets = [...prefix, ...keyWidgets.slice(0, desiredCount), ...suffix];

    if (typeof node.computeSize === "function" && typeof node.setSize === "function") {
      node.setSize(node.computeSize());
    }
    node.setDirtyCanvas(true, true);
  };

  for (const widget of keyWidgets) {
    if (widget._fetchDynamicBound) {
      continue;
    }
    const originalCallback = widget.callback;
    widget.callback = (...args) => {
      if (typeof originalCallback === "function") {
        originalCallback(...args);
      }
      refresh();
    };
    widget._fetchDynamicBound = true;
  }

  const originalSerialize = node.onSerialize;
  node.onSerialize = function (o) {
    if (typeof originalSerialize === "function") {
      originalSerialize.call(this, o);
    }
    o.widgets_values = fullWidgets.map((w) => w.value);
  };

  const originalConfigure = node.onConfigure;
  node.onConfigure = function (...args) {
    const result = originalConfigure ? originalConfigure.apply(this, args) : undefined;
    applyValuesFromConfig(args[0]);
    refresh();
    return result;
  };

  refresh();
}

app.registerExtension({
  name: "FetchMe.ThemeAndLabels",
  nodeCreated(node) {
    if (!node || !FETCHME_CLASSES.has(node.comfyClass)) {
      return;
    }

    applyBrandColor(node);

    if (node.comfyClass === "FetchMeFilter") {
      relabelInputs(node, FILTER_INPUT_LABELS);
    }

    if (DYNAMIC_KEY_CLASSES.has(node.comfyClass)) {
      installDynamicKeyFields(node);
    }
  },
});
