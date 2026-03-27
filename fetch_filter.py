from __future__ import annotations
import re
from typing import Dict, Tuple


class FetchMeFilter:
    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "text": ("STRING", {"forceInput": True}),
            },
            "optional": {
                "codex_1": ("DICT",),
                "codex_2": ("DICT",),
                "codex_3": ("DICT",),
                "codex_4": ("DICT",),
                "codex_5": ("DICT",),
                "codex_6": ("DICT",),
                "codex_7": ("DICT",),
                "codex_8": ("DICT",),
            },
        }

    RETURN_TYPES = ("STRING",)
    RETURN_NAMES = ("text",)
    FUNCTION = "run"
    CATEGORY = "FetchMe/Text"

    def _merge_codex(self, out: Dict[str, str], value: Dict | None) -> None:
        if value is None or not isinstance(value, dict):
            return
        out.update(value)

    def run(
        self,
        text: str,
        codex_1: Dict | None = None,
        codex_2: Dict | None = None,
        codex_3: Dict | None = None,
        codex_4: Dict | None = None,
        codex_5: Dict | None = None,
        codex_6: Dict | None = None,
        codex_7: Dict | None = None,
        codex_8: Dict | None = None,
    ) -> Tuple[str]:
        out = "" if text is None else str(text)

        merged: Dict[str, str] = {}
        self._merge_codex(merged, codex_1)
        self._merge_codex(merged, codex_2)
        self._merge_codex(merged, codex_3)
        self._merge_codex(merged, codex_4)
        self._merge_codex(merged, codex_5)
        self._merge_codex(merged, codex_6)
        self._merge_codex(merged, codex_7)
        self._merge_codex(merged, codex_8)

        for key, value in merged.items():
            token = str(key)
            if token == "":
                continue
            replacement = "" if value is None else str(value)
            pattern = re.compile(re.escape(token), re.IGNORECASE)
            out = pattern.sub(replacement, out)

        return (out,)


# Backward-compatible alias.
fetch_filter = FetchMeFilter
