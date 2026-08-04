import { EditorSettingsTypes, ShortcutSettings } from "src/types/types";

export const STORAGE_LIMIT_BYTES = 7 * 1024 * 1024; // local storage limit in bytes, 7MB
export const SINGLE_CODE_LIMIT_BYTES = 0.5 * 1024 * 1024; // single code limit in bytes, 0.5MB
export const MAX_PROBLEM_IO_SIZE = 15; // max number problem IO size
export const MAX_TEST_CASES = 5; // max number of test cases
export const EXECUTE_CODE_LIMIT = 3 * 1000; // max number of minutes to execute code

export const accessRestrictionMessage = `/*
Code Editor Access:
• The code editor is available only while solving
  a codeforces problem. Functionalities are
  disabled on other pages.

• To access full functionality,
  Please visit: https://codeforces.com
  and navigate to a problem.

• If you find any issues, please feel free
  to report the issue at:
  https://github.com/MaanasSehgal/Codeforces-Lite/issues
*/
`;

// Shown as a toast when a shortcut is pressed outside a Codeforces problem page,
// where the editor above is read-only and cannot run/submit/reset/format anything.
export const shortcutAccessRestrictionMessage =
  "Shortcuts only work while solving a Codeforces problem. Visit codeforces.com and open a problem to use the editor.";

// Run and submit both need the Monaco instance, which mounts a moment after the panel does.
export const editorNotLoadedMessage = "Wait for the editor to load";

export const PREVIEW_CODE = `#include <bits/stdc++.h>
using namespace std;

// Checks if a number is prime
bool isPrime(int n) {
    if (n <= 1) return false;
    for (int i = 2; i * i <= n; i++) {
        if (n % i == 0) return false;
    }
    return true;
}

int main() {
    int n;
    cin >> n;
    if (isPrime(n)) cout << "YES";
    else cout << "NO";
    return 0;
}
`;

export const DEFAULT_EDITOR_SETTINGS: EditorSettingsTypes = {
  indentSize: 4,
  theme: "vs-dark",
  lineWrapping: false,
  autoSuggestions: true,
  minimap: true,
  lineNumbers: "on",
  keyBinding: "standard",
  cursorSmoothCaretAnimation: "off",
  cursorStyle: "line",
};

export const DEFAULT_SHORTCUT_SETTINGS: ShortcutSettings = {
  run: `Control + '`,
  submit: `Control + Enter`,
  reset: `Shift + Alt + R`,
  format: `Control + Shift + F`,
};

export const isProduction = true;

// Pause after a keystroke before the editor contents are written to storage.
export const AUTOSAVE_DEBOUNCE_MS = 800;
