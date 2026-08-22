// Safe function fallbacks for standalone script execution
if (typeof changeLoginPageUI === "undefined") { window.changeLoginPageUI = function () {}; }
if (typeof changeProblemSetPageUI === "undefined") { window.changeProblemSetPageUI = function () {}; }
if (typeof removeChangeLoginPageUI === "undefined") { window.removeChangeLoginPageUI = function () {}; }
if (typeof removeChangeProblemSetPageUI === "undefined") { window.removeChangeProblemSetPageUI = function () {}; }
if (typeof injectDarkModeCSS === "undefined") { window.injectDarkModeCSS = function () {}; }
if (typeof sortToggleImgInvert === "undefined") { window.sortToggleImgInvert = function () {}; }
if (typeof applyCustomThemeSettings === "undefined") { window.applyCustomThemeSettings = function () {}; }
if (typeof removeSortToggleImgInvert === "undefined") { window.removeSortToggleImgInvert = function () {}; }
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

// ---- LeetCode-Style Split Screen Focus Mode ----
if (!window.__cflFocusModeRegistered) {
  window.__cflFocusModeRegistered = true;

  let pageContentPlaceholder = null;
  let savedScrollTop = 0;

  let onMouseMoveResizer = null;
  let onMouseUpResizer = null;
  let onTouchMoveResizer = null;
  let onTouchEndResizer = null;

  const getSavedSplitWidth = () => {
    try {
      const saved = localStorage.getItem("cfl_split_width");
      if (saved) {
        const val = parseFloat(saved);
        if (!isNaN(val) && val >= 15 && val <= 85) return val;
      }
    } catch (e) {}
    return 50;
  };

  const enterFocusSplitView = () => {
    if (document.getElementById("cfl-focus-container")) return;
    document.body.classList.add("cfl-in-focus-mode");

    const pageContent =
      document.getElementById("pageContent") ||
      document.querySelector(".problem-statement") ||
      document.getElementById("body") ||
      document.querySelector(".content-with-sidebar") ||
      document.querySelector("#content") ||
      document.querySelector("main");
    if (!pageContent) return;

    savedScrollTop = window.scrollY || document.documentElement.scrollTop || 0;

    const parentNode = pageContent.parentNode;
    pageContentPlaceholder = document.createElement("div");
    pageContentPlaceholder.id = "cfl-placeholder";
    pageContentPlaceholder.style.display = "none";
    parentNode.insertBefore(pageContentPlaceholder, pageContent);

    const container = document.createElement("div");
    container.id = "cfl-focus-container";
    container.style.cssText = `
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      z-index: 2147483647 !important;
      display: flex !important;
      flex-direction: row !important;
      background-color: #111111 !important;
      overflow: hidden !important;
      box-sizing: border-box !important;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif !important;
    `;

    const leftPane = document.createElement("div");
    leftPane.id = "cfl-left-pane";
    leftPane.style.cssText = `
      width: 50%;
      height: 100% !important;
      overflow-y: auto !important;
      overflow-x: auto !important;
      padding: 0 24px 24px 24px !important;
      box-sizing: border-box !important;
      background-color: #18181b !important;
      color: #f4f4f5 !important;
      font-size: 1rem !important;
      line-height: 1.6 !important;
    `;

    // Sleek header bar inside left pane
    const headerBar = document.createElement("div");
    headerBar.id = "cfl-left-pane-header";
    headerBar.style.cssText = `
      position: sticky !important;
      top: 0 !important;
      z-index: 20 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: space-between !important;
      padding: 12px 0 !important;
      margin-bottom: 16px !important;
      background-color: #18181b !important;
      border-bottom: 1px solid #27272a !important;
    `;
    
    const titleEl = pageContent.querySelector(".title") || pageContent.querySelector(".header .title");
    const problemTitleText = titleEl ? titleEl.textContent.trim() : "Problem Description";

    headerBar.innerHTML = `
      <div class="cfl-header-title" title="${problemTitleText}">${problemTitleText}</div>
      <div class="cfl-header-actions">
        <button id="cfl-reset-split-btn" class="cfl-header-btn" title="Reset Split 50/50">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12H3M12 3v18"/></svg>
        </button>
        <button id="cfl-exit-focus-btn" class="cfl-header-btn cfl-exit-btn" title="Exit Focus Mode (Esc)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      </div>
    `;

    const resizer = document.createElement("div");
    resizer.id = "cfl-resizer";
    resizer.style.cssText = `
      width: 6px !important;
      height: 100% !important;
      background-color: #27272a !important;
      cursor: col-resize !important;
      user-select: none !important;
      touch-action: none !important;
      position: relative !important;
      z-index: 10 !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      flex-shrink: 0 !important;
    `;

    const rightPane = document.createElement("div");
    rightPane.id = "cfl-right-pane";
    rightPane.style.cssText = `
      flex-grow: 1 !important;
      height: 100% !important;
      overflow: hidden !important;
    `;

    const iframe = document.createElement("iframe");
    iframe.src = browserAPI.runtime.getURL("index.html?focus=true");
    iframe.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      border: none !important;
      filter: none !important;
    `;

    leftPane.appendChild(headerBar);
    leftPane.appendChild(pageContent);
    rightPane.appendChild(iframe);

    container.appendChild(leftPane);
    container.appendChild(resizer);
    container.appendChild(rightPane);
    document.body.appendChild(container);

    // Apply saved split ratio
    const initialWidth = getSavedSplitWidth();
    leftPane.style.width = initialWidth + "%";
    rightPane.style.width = "calc(" + (100 - initialWidth) + "% - 6px)";

    // Setup Header Action Handlers
    const resetBtn = headerBar.querySelector("#cfl-reset-split-btn");
    if (resetBtn) {
      resetBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        leftPane.style.width = "50%";
        rightPane.style.width = "calc(50% - 6px)";
        try {
          localStorage.setItem("cfl_split_width", "50");
        } catch (e) {}
      });
    }

    const exitBtn = headerBar.querySelector("#cfl-exit-focus-btn");
    if (exitBtn) {
      exitBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        exitFocusSplitView();
        try { if (browserAPI?.runtime?.sendMessage) browserAPI.runtime.sendMessage({ type: "EXIT_FOCUS_MODE" }).catch(() => {}); } catch(e) {}
      });
    }

    // Resizer Dragging Logic with Mouse & Touch & Pointer Fallbacks
    let isDragging = false;

    const stopDragging = () => {
      if (isDragging) {
        isDragging = false;
        resizer.classList.remove("cfl-dragging");
        iframe.style.pointerEvents = "auto";
        const currentWidth = parseFloat(leftPane.style.width);
        if (!isNaN(currentWidth)) {
          try {
            localStorage.setItem("cfl_split_width", currentWidth.toString());
          } catch (e) {}
        }
      }
    };

    const startDragging = (e) => {
      isDragging = true;
      resizer.classList.add("cfl-dragging");
      iframe.style.pointerEvents = "none";
      if (e.preventDefault) e.preventDefault();
    };

    resizer.addEventListener("mousedown", startDragging);
    resizer.addEventListener("touchstart", startDragging, { passive: false });

    onMouseMoveResizer = (e) => {
      if (!isDragging) return;
      const containerWidth = container.clientWidth;
      const clientX = e.clientX || (e.touches && e.touches[0] ? e.touches[0].clientX : 0);
      let newLeftPercent = (clientX / containerWidth) * 100;
      if (newLeftPercent < 15) newLeftPercent = 15;
      if (newLeftPercent > 85) newLeftPercent = 85;

      leftPane.style.width = newLeftPercent + "%";
      rightPane.style.width = "calc(" + (100 - newLeftPercent) + "% - 6px)";
    };

    onMouseUpResizer = () => stopDragging();
    onTouchMoveResizer = (e) => onMouseMoveResizer(e);
    onTouchEndResizer = () => stopDragging();

    document.addEventListener("mousemove", onMouseMoveResizer);
    document.addEventListener("mouseup", onMouseUpResizer);
    document.addEventListener("touchmove", onTouchMoveResizer, { passive: true });
    document.addEventListener("touchend", onTouchEndResizer);
    window.addEventListener("blur", stopDragging);
  };

  const exitFocusSplitView = () => {
    document.body.classList.remove("cfl-in-focus-mode");
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
    if (onTouchMoveResizer) {
      document.removeEventListener("touchmove", onTouchMoveResizer);
      onTouchMoveResizer = null;
    }
    if (onTouchEndResizer) {
      document.removeEventListener("touchend", onTouchEndResizer);
      onTouchEndResizer = null;
    }

    const pageContent =
      container.querySelector("#pageContent") || container.querySelector(".problem-statement");
    if (pageContent && pageContentPlaceholder && pageContentPlaceholder.parentNode) {
      pageContentPlaceholder.parentNode.insertBefore(pageContent, pageContentPlaceholder);
      pageContentPlaceholder.remove();
      pageContentPlaceholder = null;
      window.scrollTo({ top: savedScrollTop, behavior: "instant" });
    }

    container.remove();
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

  // Handle Escape Key safely on parent page
  document.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "Escape" && document.getElementById("cfl-focus-container")) {
        const activeEl = document.activeElement;
        if (
          activeEl &&
          (activeEl.tagName === "INPUT" ||
            activeEl.tagName === "TEXTAREA" ||
            activeEl.isContentEditable)
        ) {
          return;
        }
        exitFocusSplitView();
        try { if (browserAPI?.runtime?.sendMessage) browserAPI.runtime.sendMessage({ type: "EXIT_FOCUS_MODE" }).catch(() => {}); } catch(e) {}
      }
    },
    true
  );

  // Monitor native browser fullscreen exit
  const handleFullscreenChange = () => {
    const isFullscreen = !!(
      document.fullscreenElement ||
      document.webkitFullscreenElement ||
      document.mozFullScreenElement
    );
    if (!isFullscreen && document.getElementById("cfl-focus-container")) {
      exitFocusSplitView();
      try { if (browserAPI?.runtime?.sendMessage) browserAPI.runtime.sendMessage({ type: "EXIT_FOCUS_MODE" }).catch(() => {}); } catch(e) {}
    }
  };

  document.addEventListener("fullscreenchange", handleFullscreenChange);
  document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
  document.addEventListener("mozfullscreenchange", handleFullscreenChange);
}