declare const browser: typeof chrome;

// Chrome 148+ also defines `browser`, so its presence no longer identifies Firefox.
// The extension URL scheme does: moz-extension:// only ever comes from Firefox.
export const browserAPI = (globalThis as { browser?: typeof chrome }).browser ?? chrome;
export const isFirefox = browserAPI.runtime.getURL("/").startsWith("moz-extension://");
