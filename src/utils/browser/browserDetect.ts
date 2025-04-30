declare const browser: typeof chrome;

export const isFirefox = typeof browser !== 'undefined';
export const browserAPI = isFirefox ? browser : chrome;