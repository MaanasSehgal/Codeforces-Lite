if (typeof isFirefox === 'undefined') {
    let isFirefox = typeof browser !== 'undefined';
    let browserAPI = isFirefox ? browser : chrome;
}

const currentURL = window.location.href;
let styleElement;
let customStyleElement;

const injectDarkModeCSS = () => {
    styleElement = document.createElement("style");
    styleElement.innerHTML = `
            html {
                background-color: #000000 !important;
            }
                
            body {
                filter: invert(1) hue-rotate(160deg) !important;
            }

            /* for undo filter */
            img, picture, video, iframe, canvas, .legendColorBox, #legend_unordered_list li svg, .welldone {
                filter: invert(1) hue-rotate(-160deg) !important;
            }

            .problems .accepted-problem td.act {
                background-color: #44ff44 !important;
            }

            .problems .accepted-problem td.id {
                border-left: 6px solid #44ff44 !important;
            }

            .problems .rejected-problem td.act {
                background-color: #ffff00 !important
            }

            .problems .rejected-problem td.id {
                border-left: 6px solid #ffff00 !important;
            }

            .red-link {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            .tex-font-style-tt {
                font-weight: 600 !important;
            }

            .user-gray, .user-green, .user-cyan, .user-violet, .user-orange, .user-red, .user-legendary {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            .user-blue {
                filter: invert(0.2) !important;
                color: #0000ff !important;
            }

            .user-legendary span, .user-4000 span {
                filter: invert(0.95) hue-rotate(-160deg) !important;
            }

            table {
                filter: brightness(0.99) !important;
            }

            img[title="Codeforces"], img[alt="ITMO University"], img.tex-formula, img.tex-graphics {
                filter: none !important;
            }

            .login-button-custom {
                background-color: #423dc8 !important;
            }

            input, textarea, select {
                background-color: #dadadd !important;
                color: #000000 !important;
                border: none !important;
                border-radius: 4px !important;
                padding-top: 4px !important;
                padding-bottom: 4px !important;
            }

            button {
                background-color: #2a2a2a !important;
                color: #e0e0e0 !important;
                border-color: #555 !important;
            }

            a {
                color: #122a70 !important;
            }

            .menu-list-container a, .second-level-menu-list a {
                color: #000000 !important;
            }

            ::-webkit-scrollbar {
                background: #2a2a2a !important;
            }

            ::-webkit-scrollbar-track {
                background: #2a2a2a;
            }

            ::-webkit-scrollbar-thumb {
                background: #555;
            }

            ::selection {
                background-color: #bb86fc;
                color: #121212;
            }
        `;
    document.addEventListener("DOMContentLoaded", () => {
        document.head.appendChild(styleElement);
    });

    if (document.head) {
        document.head.appendChild(styleElement);
    } else {
        const observer = new MutationObserver(() => {
            if (document.head) {
                document.head.appendChild(styleElement);
                observer.disconnect();
            }
        });
        observer.observe(document, { childList: true, subtree: true });
    }

    browserAPI.storage.local.get("themeCustomSettings", (result) => {
        if (result.themeCustomSettings) {
            applyCustomThemeSettings(result.themeCustomSettings);
        }
    });
};

const applyCustomThemeSettings = (settings) => {
    if (customStyleElement) {
        customStyleElement.remove();
    }

    customStyleElement = document.createElement("style");
    customStyleElement.innerHTML = `
      html {
        filter: 
          brightness(${settings.brightness}%) 
          contrast(${settings.contrast}%) 
          sepia(${settings.sepia}%) 
          grayscale(${settings.grayscale}%)
          invert(${settings.invert}%) !important;
      }
    `;

    if (document.head) {
        document.head.appendChild(customStyleElement);
    }
};

const sortToggleImgInvert = () => {
    if (!currentURL.includes("codeforces.com/problemset")) {
        return;
    }
    const anchorElements = document.querySelectorAll("a.non-decorated");

    anchorElements.forEach((anchor) => {
        const imgElements = anchor.querySelectorAll("img");
        if (imgElements && imgElements.length > 1) {
            imgElements[1].classList.add("custom-image");
        }
    });
};

const removeSortToggleImgInvert = () => {
    if (!currentURL.includes("codeforces.com/problemset")) {
        return;
    }
    const anchorElements = document.querySelectorAll("a.non-decorated");

    anchorElements.forEach((anchor) => {
        const imgElements = anchor.querySelectorAll("img");
        if (imgElements && imgElements.length > 1) {
            imgElements[1].classList.remove("custom-image");
        }
    });
};
