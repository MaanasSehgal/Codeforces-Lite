import { browserAPI } from "./assets/scripts/browserDetect.js";

document.getElementById("submit-code").addEventListener("click", () => {
    const code = document.getElementById("code-input").value;
    browserAPI.runtime.sendMessage({action: "submitCode", code: code});
});
