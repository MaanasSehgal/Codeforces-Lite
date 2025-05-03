import { EditorSettingsTypes } from "../types/types";

export const STORAGE_LIMIT_BYTES = 7 * 1024 * 1024; // local storage limit in bytes, 7MB
export const SINGLE_CODE_LIMIT_BYTES = 0.5 * 1024 * 1024; // single code limit in bytes, 0.5MB
export const MAX_PROBLEM_IO_SIZE = 15; // max number problem IO size
export const MAX_TEST_CASES = 5; // max number of test cases
export const EXECUTE_CODE_LIMIT = 3 * 1000; // max number of minutes to execute code

export const accessRestrictionMessage = `/* 
'''
Code Editor Access:
    -> The code editor is available only while solving
         a codeforces problem. Functioanlities are
         disabled on other pages.

    -> To access full functionality,
         Please visit: https://codeforces.com
         and navigate to a problem.

    -> If you find any issues, please feel free
         to report the issue at:
         https://github.com/MaanasSehgal/Codeforces-Lite/issues
'''
*/
`;

export const PREVIEW_CODE = 
`#include <bits/stdc++.h>
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
    if (isPrime(n)) cout << "YES\n";
    else cout << "NO\n";
    return 0;
}
`;

export const DEFAULT_EDITOR_SETTINGS: EditorSettingsTypes = {
     indentSize: 4,
     theme: 'vs-dark',
     lineWrapping: false,
     autoSuggestions: true,
     minimap: true,
     lineNumbers: true,
};

export const isProduction = false;