# cache.py
import os
import hashlib
import shutil

CACHE_DIR = os.path.expanduser("~/.cf_binary_cache")

def ensure_cache():
    os.makedirs(CACHE_DIR, exist_ok=True)

def code_hash(code: str, compile_cmd: list[str]) -> str:
    h = hashlib.sha256()
    h.update(code.encode())
    h.update(" ".join(compile_cmd).encode())
    return h.hexdigest()

def get_cached_binary(hash_key: str) -> str | None:
    path = os.path.join(CACHE_DIR, hash_key)
    return path if os.path.exists(path) else None

def save_binary(binary_path: str, hash_key: str) -> str:
    ensure_cache()
    target = os.path.join(CACHE_DIR, hash_key)
    shutil.move(binary_path, target)
    os.chmod(target, 0o755)
    return target
