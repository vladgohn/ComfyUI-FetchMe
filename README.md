# 🍖FetchMe

<p align="center">
  <img src="https://raw.githubusercontent.com/vladgohn/ComfyUI-FetchMe/main/img/FetchMe_Banner.png" alt="FetchMe icon" width="220">
</p>

FetchMe is a lightweight text utility pack for ComfyUI. It is designed for live prompt cleanup after vision and LLM nodes generate text, so you can automatically reshape the final prompt before it goes into image generation.

<p align="center">
  <img src="https://raw.githubusercontent.com/vladgohn/ComfyUI-FetchMe/main/img/screen.png" alt="FetchMe nodes in ComfyUI" width="320">
</p>

## What this package does

The package adds two nodes in the `FetchMe/Text` category:

- `Fetch Codex` creates a `DICT` object from one replacement value and up to 64 keys.
- `Fetch Filter` merges up to 10 codex dictionaries and replaces matching tokens in the input text.

Replacements are case-insensitive, so the filter will match the same token in different letter cases. The frontend script also keeps the nodes compact by showing only the inputs that are currently needed.

## Main workflow

FetchMe is especially useful in workflows where a vision model describes an input image and that description is reused as a prompt for generation.

Typical example:

1. A node such as Qwen-VL analyzes an image and outputs an auto-generated prompt.
2. That prompt contains terms you do not want to keep, such as `anime`, `cartoon`, `digital art`, `3d render`, or other style markers.
3. `Fetch Codex` defines replacement values for those unwanted terms.
4. `Fetch Filter` applies the replacements on the fly and outputs a cleaned prompt for the next generation node.

This makes FetchMe a live text filter between LLM output and the final render stage.

## Typical use cases

- Convert auto-described anime or illustration prompts into photo-oriented prompts before rendering.
- Replace unwanted style words coming from vision LLM output, such as `cartoon`, `digital`, `painted`, or `3d`.
- Normalize prompt language from different captioning models into one consistent style.
- Replace placeholders like `{CHARACTER}`, `{STYLE}`, or `{LOCATION}` in prompt templates.
- Keep one reusable text value mapped to many aliases or tokens.
- Build modular prompt systems where several codex dictionaries are merged before final text generation.
- Reduce manual editing when the same words must be updated across multiple prompt fragments.

## Nodes

### Fetch Codex

Creates a dictionary where every filled key points to the same value.

Inputs:

- `value`: replacement text.
- `key_1`, `key_2`, ..., `key_64`: tokens that should be replaced with `value`.

Output:

- `codex` (`DICT`)

Example:

```text
value = "photo, realistic, detailed skin, natural lighting"
key_1 = "anime"
key_2 = "cartoon"
key_3 = "digital art"
key_4 = "3d render"
```

Output codex:

```json
{
  "anime": "photo, realistic, detailed skin, natural lighting",
  "cartoon": "photo, realistic, detailed skin, natural lighting",
  "digital art": "photo, realistic, detailed skin, natural lighting",
  "3d render": "photo, realistic, detailed skin, natural lighting"
}
```

### Fetch Filter

Takes input text and applies replacements from one or more codex dictionaries.

Inputs:

- `text`: source text.
- `codex_1` ... `codex_10`: optional codex dictionaries.

Output:

- `text` (`STRING`)

Example:

```text
Input text:
"beautiful anime girl, digital art, soft shading, studio light"
```

With merged codex dictionaries:

```json
{
  "anime": "photo",
  "digital art": "photography",
  "soft shading": "natural skin texture"
}
```

Result:

```text
beautiful photo girl, photography, natural skin texture, studio light
```

## Installation

### Option 1. ComfyUI Manager / Registry

After the package is published to the ComfyUI Registry, install it from ComfyUI Manager or with:

```bash
comfy node install fetchme-text
```

### Option 2. Manual install

```bash
cd ComfyUI/custom_nodes
git clone https://github.com/vladgohn/ComfyUI-FetchMe.git
```

Restart ComfyUI after installation.

## Package contents

- `fetch_codex.py`: builds replacement dictionaries.
- `fetch_filter.py`: applies merged dictionary replacements to text.
- `js/fetch_theme.js`: UI customization for dynamic inputs and node colors.

## License

This project is released under the Apache License 2.0. Attribution and license notice must be preserved in redistributed copies. See `LICENSE` and `NOTICE`.
