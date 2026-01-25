from flask import Flask, request, jsonify
import logging
import signal
import sys
import shutil
import os

from executor import execute
from languages import is_supported
from cache import CACHE_DIR, ensure_cache

# ---------- LOGGING ----------
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s"
)

log = logging.getLogger("server")

app = Flask(__name__)


def cleanup_cache():
    if os.path.exists(CACHE_DIR):
        log.info("Cleaning binary cache")
        shutil.rmtree(CACHE_DIR, ignore_errors=True)
    ensure_cache()


def ask_port(default=5000):
    try:
        value = input(f"Enter port (default {default}): ").strip()
        if not value:
            return default
        port = int(value)
        if port < 1024 or port > 65535:
            raise ValueError
        return port
    except ValueError:
        print("❌ Invalid port. Using default.")
        return default


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


@app.route("/run", methods=["POST"])
def run():
    data = request.json or {}

    code = data.get("code", "")
    language = data.get("language", "")
    inputs = data.get("inputs", [])
    time_limit = int(data.get("timeLimit", 2))

    log.info(f"Run request | language={language}")

    if not is_supported(language):
        return jsonify({
            "compile_error": f"Language '{language}' not supported",
            "results": []
        })

    result = execute(code, language, inputs, time_limit)
    return jsonify(result)


def shutdown_handler(sig, frame):
    log.info("Shutting down server")
    cleanup_cache()
    sys.exit(0)


if __name__ == "__main__":
    print("🚀 Codeforces Local Runner")
    print("Supported languages: C, C++, Python")
    print("⚠️ Executes code on your machine. Run trusted code only.\n")

    cleanup_cache()

    signal.signal(signal.SIGINT, shutdown_handler)
    signal.signal(signal.SIGTERM, shutdown_handler)

    port = ask_port()
    log.info(f"Starting server on port {port}")

    app.run(host="127.0.0.1", port=port)

