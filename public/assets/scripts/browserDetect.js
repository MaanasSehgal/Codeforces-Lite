const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

if (typeof self !== 'undefined') {
  self.isFirefox = isFirefox;
  self.browserAPI = browserAPI;
}

if (typeof exports !== 'undefined') {
  exports.isFirefox = isFirefox;
  exports.browserAPI = browserAPI;
}