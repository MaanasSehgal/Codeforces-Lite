import subprocess
import tempfile
import os
import shutil
import time
import signal
import platform
import logging

from languages import LANGUAGES
from cache import code_hash, get_cached_binary, save_binary

log = logging.getLogger("executor")


def kill_process(proc):
    try:
        if platform.system() != "Windows":
            os.killpg(os.getpgid(proc.pid), signal.SIGKILL)
        else:
            proc.kill()
    except Exception as e:
        log.warning(f"Failed to kill process: {e}")


def execute(code: str, language: str, inputs: list[str], time_limit: int):
    lang = LANGUAGES[language]
    tmpdir = tempfile.mkdtemp(prefix="cf_")
    results = []

    log.info(f"Execution started | language={language} | testcases={len(inputs)}")

    try:
        # ---------- WRITE SOURCE ----------
        src_path = os.path.join(tmpdir, lang["source"])
        with open(src_path, "w") as f:
            f.write(code)

        run_cmd = lang["run"]

        # ---------- COMPILE ----------
        if lang["compile"]:
            compile_cmd = lang["compile"]
            h = code_hash(code, compile_cmd)

            cached = get_cached_binary(h) if lang["cache"] else None

            if cached:
                log.info("Using cached binary")
                run_cmd = [cached]
            else:
                log.info("Compiling source")
                cp = subprocess.run(
                    compile_cmd,
                    cwd=tmpdir,
                    stdout=subprocess.PIPE,
                    stderr=subprocess.PIPE,
                    text=True
                )

                if cp.returncode != 0:
                    log.error("Compilation failed")
                    return {
                        "compile_error": cp.stderr,
                        "results": []
                    }

                binary_path = os.path.join(tmpdir, "main") if platform.system() != "Windows" else os.path.join(tmpdir, "main.exe") 
                os.chmod(binary_path, 0o755)

                if lang["cache"]:
                    run_cmd = [save_binary(binary_path, h)]
                else:
                    run_cmd = [binary_path]

        # ---------- RUN TEST CASES ----------
        for i, input_data in enumerate(inputs):
            log.info(f"Running test case {i + 1}")
            start = time.time()

            proc = subprocess.Popen(
                run_cmd,
                cwd=tmpdir,
                stdin=subprocess.PIPE,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                text=True,
                preexec_fn=os.setsid if platform.system() != "Windows" else None
            )

            try:
                stdout, stderr = proc.communicate(
                    input=input_data,
                    timeout=time_limit
                )
            except subprocess.TimeoutExpired:
                log.warning("Time limit exceeded")
                kill_process(proc)
                results.append({
                    "stdout": "",
                    "stderr": "Time Limit Exceeded",
                    "time": time_limit
                })
                continue

            results.append({
                "stdout": stdout,
                "stderr": stderr,
                "time": f"{time.time() - start:.3f}"
            })

        return {
            "compile_error": "",
            "results": results
        }

    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
        log.info("Temporary directory cleaned")

