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

export const isProduction = false;