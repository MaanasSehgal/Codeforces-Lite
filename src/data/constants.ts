import { EditorSettingsTypes, ShortcutSettings } from "src/types/types";

export type BoilerplateTemplate = {
  id: string;
  label: string;
  description: string;
  code: string;
};

// Marks the caret: authored by the user in a template, and spliced into the buffer by the
// pre-1.5.9 save path. Both the template reader and the legacy migration strip it.
export const TEMPLATE_CURSOR_MARKER = "$0";

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

export const CPP_BOILERPLATES: BoilerplateTemplate[] = [
  {
    id: "cf-boilerplate",
    label: "CF Boilerplate",
    description: "From the CompetitiveProgramming repo: standard CF template with helper macros.",
    code: `// CF Boilerplate

#include <bits/stdc++.h>
using namespace std;

#define endl '\n'
#define rep(i, a, b) for(int i = a; i < (b); ++i)
#define f(i, n) for (int i = 0; i < n; i++)
#define all(x) x.begin(), x.end()
#define sz(x) ((int)((x).size()))
#define pb push_back
#define ppb pop_back
#define ff first
#define ss second
#define cyes cout << "YES" << endl
#define cno cout << "NO" << endl
#define cans cout << ans << endl
#define minpq priority_queue <int, vector<int>, greater<int>>
#define mxe(v)  *max_element(v.begin(),v.end())
#define mne(v)  *min_element(v.begin(),v.end())
#define sumof(v) (ll)accumulate(v.begin(), v.end(), 0ll)

#define int long long
typedef long long ll;
typedef pair<int, int> pi;
typedef vector<int> vi;
typedef vector<vector<int>> vii;
typedef vector<pair<int, int>> vpi;

void solve() {
    int n;
    cin >> n;
    cout << n << endl;
}

int32_t main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t = 1;
    // cin >> t;
    while (t--) solve();
    return 0;
}`,
  },
  {
    id: "icpc-boilerplate",
    label: "ICPC Boilerplate",
    description: "From the CompetitiveProgramming repo: compact ICPC-style template.",
    code: `// ICPC Boilerplate

#include <bits/stdc++.h>
using namespace std;

#define endl '\n'
#define int long long
#define rep(i, a, b) for(int i = a; i < (b); ++i)
#define all(x) begin(x), end(x)
#define sz(x) ((int)((x).size()))
typedef long long ll;
typedef pair<int, int> pii;
typedef vector<int> vi;

void solve() {
    
}

signed main() {
    ios::sync_with_stdio(false); cin.tie(0); cout.tie(0);
    int t = 1;
    cin >> t;
    while (t--) solve();
}`,
  },
  {
    id: "tree-boilerplate",
    label: "Tree Boilerplate",
    description: "From the CompetitiveProgramming repo: tree-focused template with common macros.",
    code: `// Tree Boilerplate

#include <bits/stdc++.h>
using namespace std;

#define endl '\n'
#define rep(i, a, b) for(int i = a; i < (b); ++i)
#define f(i, n) for (int i = 0; i < n; i++)
#define all(x) x.begin(), x.end()
#define sz(x) ((int)((x).size()))
#define pb push_back
#define ppb pop_back
#define ff first
#define ss second
#define cyes cout << "YES" << endl
#define cno cout << "NO" << endl
#define cans cout << ans << endl
#define minpq priority_queue <int, vector<int>, greater<int>>
#define mxe(v)  *max_element(v.begin(),v.end())
#define mne(v)  *min_element(v.begin(),v.end())
#define sumof(v) (ll)accumulate(v.begin(), v.end(), 0ll)

#define int long long
typedef long long ll;
typedef pair<int, int> pi;
typedef vector<int> vi;
typedef vector<vector<int>> vii;
typedef vector<pair<int, int>> vpi;

struct Node {
    int val;
    Node *left, *right;
};

void solve() {
    int n;
    cin >> n;
    cout << n << endl;
}

int32_t main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t = 1;
    cin >> t;
    while (t--) solve();
    return 0;
}`,
  },
  {
    id: "graph-boilerplate",
    label: "graph Boilerplate",
    description: "From the CompetitiveProgramming repo: graph-oriented template.",
    code: `// graph Boilerplate

#include <bits/stdc++.h>
using namespace std;

#define endl '\n'
#define rep(i, a, b) for(int i = a; i < (b); ++i)
#define f(i, n) for (int i = 0; i < n; i++)
#define all(x) x.begin(), x.end()
#define sz(x) ((int)((x).size()))
#define pb push_back
#define ppb pop_back
#define ff first
#define ss second
#define cyes cout << "YES" << endl
#define cno cout << "NO" << endl
#define cans cout << ans << endl
#define minpq priority_queue <int, vector<int>, greater<int>>
#define mxe(v)  *max_element(v.begin(),v.end())
#define mne(v)  *min_element(v.begin(),v.end())
#define sumof(v) (ll)accumulate(v.begin(), v.end(), 0ll)

#define int long long
typedef long long ll;
typedef pair<int, int> pi;
typedef vector<int> vi;
typedef vector<vector<int>> vii;
typedef vector<pair<int, int>> vpi;

vector<vector<int>> graph;

void solve() {
    int n, m;
    cin >> n >> m;
    graph.assign(n + 1, {});
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        graph[u].push_back(v);
        graph[v].push_back(u);
    }
}

int32_t main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);
    cout.tie(nullptr);

    int t = 1;
    cin >> t;
    while (t--) solve();
    return 0;
}`,
  },
];

export const DEFAULT_CPP_BOILERPLATE_ID = "cf-boilerplate";

export const getCppBoilerplateById = (id: string) =>
  CPP_BOILERPLATES.find((template) => template.id === id) ?? CPP_BOILERPLATES[0];

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
