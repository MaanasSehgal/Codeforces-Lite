import os
import platform

LANGUAGES = {
    "c": {
        "source": "main.c",
        "compile": ["gcc", "main.c", "-O2", "-std=gnu11", "-o", "main"],
        "run": ["./main"],
        "cache": True,
    },
    "cpp": {
        "source": "main.cpp",
        "compile": ["g++", "main.cpp", "-O2", "-std=gnu++17", "-o", "main"],
        "run": ["./main"],
        "cache": True,
    },
    "python": {
        "source": "main.py",
        "compile": None,
        "run": ["python3" if platform.system() != "Windows" else "python", "main.py"],
        "cache": False,
    },
}

def is_supported(language: str) -> bool:
    return language in LANGUAGES
