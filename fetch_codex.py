from __future__ import annotations
from typing import Dict, Tuple


class FetchMeCodex:
    MAX_KEYS = 64

    @classmethod
    def INPUT_TYPES(cls):
        required = {
            "value": ("STRING", {"default": "", "multiline": False}),
            "key_1": ("STRING", {"default": "", "multiline": False}),
            "key_2": ("STRING", {"default": "", "multiline": False}),
        }
        optional = {
            f"key_{idx}": ("STRING", {"default": "", "multiline": False})
            for idx in range(3, cls.MAX_KEYS + 1)
        }
        return {"required": required, "optional": optional}

    RETURN_TYPES = ("DICT",)
    RETURN_NAMES = ("codex",)
    FUNCTION = "run"
    CATEGORY = "FetchMe/Text"

    def _put(self, out: Dict[str, str], key: str, value: str) -> None:
        if key is None:
            return
        k = str(key).strip()
        if k == "":
            return
        out[k] = value

    def run(self, value: str, key_1: str, key_2: str, **kwargs) -> Tuple[Dict[str, str]]:
        replacement = "" if value is None else str(value)
        out: Dict[str, str] = {}

        self._put(out, key_1, replacement)
        self._put(out, key_2, replacement)

        for idx in range(3, self.MAX_KEYS + 1):
            self._put(out, kwargs.get(f"key_{idx}", ""), replacement)

        return (out,)


# Backward-compatible alias.
fetch_codex = FetchMeCodex
