WEB_DIRECTORY = "js"

from .fetch_filter import FetchMeFilter
from .fetch_codex import FetchMeCodex

NODE_CLASS_MAPPINGS = {
    "FetchMeFilter": FetchMeFilter,
    "FetchMeCodex": FetchMeCodex,
}

NODE_DISPLAY_NAME_MAPPINGS = {
    "FetchMeFilter": "🍖Fetch Filter",
    "FetchMeCodex": "🍖Fetch Codex",
}

__all__ = [
    "WEB_DIRECTORY",
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
]
