const isFirefox = typeof browser !== 'undefined';
const browserAPI = isFirefox ? browser : chrome;

importScripts('background.js');
importScripts('extractTestcases/extractTestcases.js');
