// Functions in respective folders
// changeLoginPageUI, changeProblemSetPageUI, removeLoginPageUI, removeProblemSetPageUI-> changeUIFunctions
// injectDarkModeCSS, sortToggleImgInvert, removeSortToggleImgInvert -> darkModeFunctions
// Chrome 148+ also defines `browser`, so its presence no longer identifies Firefox.
// The extension URL scheme does: moz-extension:// only ever comes from Firefox.
const browserAPI = globalThis.browser ?? globalThis.chrome;
const isFirefox = browserAPI.runtime.getURL("/").startsWith("moz-extension://");

const whenDomReady = (callback) => {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", callback);
    return;
  }
  callback();
};

browserAPI.storage.local
  .get(["changeUI", "theme", "themeCustomSettings", "defaultThemeSettings"])
  .then((result) => {
    if (result.changeUI === "true") {
      whenDomReady(() => {
        changeLoginPageUI();
        changeProblemSetPageUI();
      });
    }

    if (result.theme === "dark") {
      injectDarkModeCSS();
      sortToggleImgInvert();

      if (result.themeCustomSettings) {
        applyCustomThemeSettings(result.themeCustomSettings);
      } else if (result.defaultThemeSettings) {
        applyCustomThemeSettings(result.defaultThemeSettings);
      }
    }
  });

browserAPI.storage.onChanged.addListener((changes, areaName) => {
  if (areaName === "local") {
    if (changes.theme) {
      if (changes.theme.newValue === "dark") {
        injectDarkModeCSS();
        sortToggleImgInvert();

        browserAPI.storage.local.get(["themeCustomSettings", "defaultThemeSettings"], (result) => {
          if (result.themeCustomSettings) {
            applyCustomThemeSettings(result.themeCustomSettings);
          } else if (result.defaultThemeSettings) {
            applyCustomThemeSettings(result.defaultThemeSettings);
          }
        });
      } else {
        if (typeof styleElement !== "undefined" && styleElement) {
          styleElement.remove();
        }
        if (typeof customStyleElement !== "undefined" && customStyleElement) {
          customStyleElement.remove();
        }
        removeSortToggleImgInvert();
      }
    } else if (changes.themeCustomSettings) {
      if (
        document.documentElement.classList.contains("dark") ||
        document.querySelector('html[data-theme="dark"]')
      ) {
        applyCustomThemeSettings(changes.themeCustomSettings.newValue);
      }
    } else if (changes.changeUI) {
      if (changes.changeUI.newValue === "true") {
        changeLoginPageUI();
        changeProblemSetPageUI();
      } else {
        removeChangeLoginPageUI();
        removeChangeProblemSetPageUI();
      }
    }
  }
});

// ---- LeetCode-Style 50/50 Split Screen Focus Mode ----
if (!window.__cflFocusModeRegistered) {
  window.__cflFocusModeRegistered = true;

  let pageContentPlaceholder = null;

  let onMouseMoveResizer = null;
  let onMouseUpResizer = null;

  const enterFocusSplitView = () => {
    if (document.getElementById("cfl-focus-container")) return;

    const pageContent =
      document.getElementById("pageContent") || document.querySelector(".problem-statement");
    if (!pageContent) return;

    const parentNode = pageContent.parentNode;
    pageContentPlaceholder = document.createElement("div");
    pageContentPlaceholder.id = "cfl-placeholder";
    pageContentPlaceholder.style.display = "none";
    parentNode.insertBefore(pageContentPlaceholder, pageContent);

    const container = document.createElement("div");
    container.id = "cfl-focus-container";

    const leftPane = document.createElement("div");
    leftPane.id = "cfl-left-pane";

    const resizer = document.createElement("div");
    resizer.id = "cfl-resizer";

    const rightPane = document.createElement("div");
    rightPane.id = "cfl-right-pane";

    const iframe = document.createElement("iframe");
    iframe.src = browserAPI.runtime.getURL("index.html?focus=true");

    leftPane.appendChild(pageContent);
    rightPane.appendChild(iframe);

    container.appendChild(leftPane);
    container.appendChild(resizer);
    container.appendChild(rightPane);
    document.body.appendChild(container);

    // Draggable middle resizer logic
    let isDragging = false;

    resizer.addEventListener("mousedown", (e) => {
      isDragging = true;
      resizer.classList.add("cfl-dragging");
      iframe.style.pointerEvents = "none";
      e.preventDefault();
    });

    onMouseMoveResizer = (e) => {
      if (!isDragging) return;
      const containerWidth = container.clientWidth;
      let newLeftPercent = (e.clientX / containerWidth) * 100;
      if (newLeftPercent < 15) newLeftPercent = 15;
      if (newLeftPercent > 85) newLeftPercent = 85;

      leftPane.style.width = newLeftPercent + "%";
      rightPane.style.width = "calc(" + (100 - newLeftPercent) + "% - 6px)";
    };

    onMouseUpResizer = () => {
      if (isDragging) {
        isDragging = false;
        resizer.classList.remove("cfl-dragging");
        iframe.style.pointerEvents = "auto";
      }
    };

    document.addEventListener("mousemove", onMouseMoveResizer);
    document.addEventListener("mouseup", onMouseUpResizer);

    if (document.documentElement.requestFullscreen && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const exitFocusSplitView = () => {
    const container = document.getElementById("cfl-focus-container");
    if (!container) return;

    if (onMouseMoveResizer) {
      document.removeEventListener("mousemove", onMouseMoveResizer);
      onMouseMoveResizer = null;
    }
    if (onMouseUpResizer) {
      document.removeEventListener("mouseup", onMouseUpResizer);
      onMouseUpResizer = null;
    }

    const pageContent =
      container.querySelector("#pageContent") || container.querySelector(".problem-statement");
    if (pageContent && pageContentPlaceholder && pageContentPlaceholder.parentNode) {
      pageContentPlaceholder.parentNode.insertBefore(pageContent, pageContentPlaceholder);
      pageContentPlaceholder.remove();
      pageContentPlaceholder = null;
    }

    container.remove();

    if (document.fullscreenElement && document.exitFullscreen) {
      document.exitFullscreen().catch(() => {});
    }
  };

  browserAPI.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "APPLY_CUSTOM_THEME") {
      applyCustomThemeSettings(message.settings);
      if (sendResponse) sendResponse({ success: true });
    } else if (message.type === "TOGGLE_FOCUS_MODE") {
      if (message.isFocusMode) {
        enterFocusSplitView();
      } else {
        exitFocusSplitView();
      }
      if (sendResponse) sendResponse({ success: true });
    }
    return true;
  });

  document.addEventListener("fullscreenchange", () => {
    if (!document.fullscreenElement && document.getElementById("cfl-focus-container")) {
      exitFocusSplitView();
      browserAPI.runtime.sendMessage({ type: "EXIT_FOCUS_MODE" }).catch(() => {});
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && document.getElementById("cfl-focus-container")) {
      exitFocusSplitView();
      browserAPI.runtime.sendMessage({ type: "EXIT_FOCUS_MODE" }).catch(() => {});
    }
  });
}
