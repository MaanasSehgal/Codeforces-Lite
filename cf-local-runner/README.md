# Codeforces Local Runner

Local execution server for the **Codeforces-Lite** browser extension.  
Allows running code on your own machine instead of using Judge0.

> ⚠️ Executes code locally. Use only with trusted code.

---

## Features

- Local code execution (no external API)
- Faster runs for development and testing
- Supports multiple test cases
- Binary caching for C/C++
- Automatic cleanup on start and shutdown
- Cross-platform (Linux, macOS, Windows*)

\* C/C++ on Windows requires WSL, MinGW, or MSYS2.

---

## Supported Languages

- C  
- C++  
- Python  

---

## Requirements

- Python 3.9+
- pip
- C/C++ compiler (for C/C++ execution)

---

## Quick Start

```bash
cd cf_local_runner
python start.py

