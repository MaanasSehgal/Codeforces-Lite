// Chrome 148+ also defines `browser`, so its presence no longer identifies Firefox.
// The extension URL scheme does: moz-extension:// only ever comes from Firefox.
const browserAPI = globalThis.browser ?? globalThis.chrome;
const isFirefox = browserAPI.runtime.getURL("/").startsWith("moz-extension://");

importScripts("background.js");
importScripts("extractTestcases/extractTestcases.js");
