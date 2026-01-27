import os
import sys
import subprocess
import venv

VENV_DIR = "venv"


def run(cmd):
    subprocess.check_call(cmd, shell=True)


def main():
    try:
        if not os.path.exists(VENV_DIR):
            print("📦 Creating virtual environment")
            venv.create(VENV_DIR, with_pip=True)

        python = os.path.join(
            VENV_DIR,
            "Scripts" if os.name == "nt" else "bin",
            "python"
        )

        print("📥 Installing requirements")
        run(f"{python} -m pip install -r requirements.txt")

        print("🚀 Starting local runner (Ctrl+C to stop)")
        run(f"{python} server.py")

    except KeyboardInterrupt:
        print("\n👋 Local runner stopped")

    except subprocess.CalledProcessError as e:
        print(f"❌ Failed to start server: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()

