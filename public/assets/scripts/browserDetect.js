// Chrome 148+ also defines `browser`, so its presence no longer identifies Firefox.
// The extension URL scheme does: moz-extension:// only ever comes from Firefox.
const browserAPI = globalThis.browser ?? globalThis.chrome;
const isFirefox = browserAPI.runtime.getURL("/").startsWith("moz-extension://");

if (typeof self !== "undefined") {
  self.isFirefox = isFirefox;
  self.browserAPI = browserAPI;
}

if (typeof exports !== "undefined") {
  exports.isFirefox = isFirefox;
  exports.browserAPI = browserAPI;
}
