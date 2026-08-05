// Inlined rather than fetched: Codeforces' page CSP restricts img-src, and any
// third-party CDN can start 404ing without us noticing.
const GOOGLE_LOGO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M45.12 24.5c0-1.56-.14-3.06-.4-4.5H24v8.51h11.84c-.51 2.75-2.06 5.08-4.39 6.64v5.52h7.11c4.16-3.83 6.56-9.47 6.56-16.17z"/>
    <path fill="#34A853" d="M24 46c5.94 0 10.92-1.97 14.56-5.33l-7.11-5.52c-1.97 1.32-4.49 2.1-7.45 2.1-5.73 0-10.58-3.87-12.31-9.07H4.34v5.7C7.96 41.07 15.4 46 24 46z"/>
    <path fill="#FBBC05" d="M11.69 28.18C11.25 26.86 11 25.45 11 24s.25-2.86.69-4.18v-5.7H4.34C2.85 17.09 2 20.45 2 24s.85 6.91 2.34 9.88l7.35-5.7z"/>
    <path fill="#EA4335" d="M24 10.75c3.23 0 6.13 1.11 8.41 3.29l6.31-6.31C34.91 4.18 29.93 2 24 2 15.4 2 7.96 6.93 4.34 14.12l7.35 5.7c1.73-5.2 6.58-9.07 12.31-9.07z"/>
</svg>`;

// Both entry points guard on the same two pages, and the content script runs everywhere.
const isLoginOrRegisterPage = () => {
  const currentURL = window.location.href;
  return (
    currentURL.includes("codeforces.com/enter") || currentURL.includes("codeforces.com/register")
  );
};

/** Builds the "or" rule that separates the credential form from the social sign-in. */
const createSocialDivider = () => {
  const divider = document.createElement("div");
  divider.className = "social-divider-custom";

  const dividerLabel = document.createElement("span");
  dividerLabel.textContent = "or";
  divider.appendChild(dividerLabel);

  return divider;
};

const changeLoginPageUI = () => {
  const mainContent = document.createElement("main");
  mainContent.setAttribute("role", "main");
  mainContent.setAttribute("aria-label", "Codeforces Login");

  const metaDescription = document.createElement("meta");
  metaDescription.setAttribute("name", "description");
  metaDescription.setAttribute(
    "content",
    "Login to Codeforces with enhanced UI and features through Codeforces-Lite extension"
  );
  document.head.appendChild(metaDescription);

  if (!isLoginOrRegisterPage()) {
    return;
  }

  const loginBox = document.querySelector(".enterPage > .borderTopRound");
  if (loginBox) {
    loginBox.classList.add("login-box-custom");
  }

  const registerBox = document.querySelector(".registrationForm");
  if (registerBox) {
    registerBox.classList.add("register-box-custom");
  }

  const loginToCodeForcesTitle = document.querySelector(".caption.titled");
  if (loginToCodeForcesTitle) {
    loginToCodeForcesTitle.classList.add("title-custom");
  }

  // Codeforces names the form by id, so the old `.enterForm` class selector matched
  // nothing on either page. `.table-form` is the class both forms actually carry.
  const fields = document.querySelectorAll(".table-form .field-name");
  fields.forEach((field) => {
    field.classList.add("field-label-custom");
  });

  const loginButton = document.querySelector(".submit");
  if (loginButton) {
    loginButton.classList.add("login-button-custom");
  }

  const rememberMeLabel = document.querySelector("label[for='remember']");
  if (rememberMeLabel) {
    rememberMeLabel.classList.add("remember-me-label-custom");
  }

  const bottomLinks = document.querySelector(".bottom-links");
  if (bottomLinks) {
    bottomLinks.classList.add("bottom-links-custom");
    // The divider is ours, so teardown deletes it outright instead of unstyling it.
    if (!bottomLinks.querySelector(".social-divider-custom")) {
      bottomLinks.prepend(createSocialDivider());
    }
  }

  const forgotPasswordLink = document.querySelector("a[href='/passwordRecovery']");
  if (forgotPasswordLink) {
    forgotPasswordLink.classList.add("forgot-password-custom");
    // Styling the wrapper needs a class of its own: a div:has() selector would also match
    // every ancestor div up to the page container and drag their alignment with it.
    const forgotPasswordRow = forgotPasswordLink.parentElement;
    forgotPasswordRow.classList.add("forgot-password-row-custom");

    // Recovery is a footnote rather than a step, so it reads better below the social
    // action than wedged between the two sign-in buttons.
    if (bottomLinks) {
      bottomLinks.appendChild(forgotPasswordRow);
    }
  }

  const gmailLink = document.querySelector(".useGmailLink");
  if (gmailLink) {
    const anchorTag = document.createElement("a");
    anchorTag.href = "/enter/Gmail";
    anchorTag.classList.add("login-google-custom");

    const googleIcon = document.createElement("span");
    googleIcon.classList.add("login-google-icon");
    googleIcon.innerHTML = GOOGLE_LOGO_SVG;

    const googleActionLabel = document.createElement("span");
    // Codeforces serves the same /enter/Gmail flow from both pages, but calling it
    // "Login" while the user is filling in a registration form reads as the wrong button.
    googleActionLabel.textContent = registerBox ? "Register with Google" : "Login with Google";

    anchorTag.appendChild(googleIcon);
    anchorTag.appendChild(googleActionLabel);

    gmailLink.replaceWith(anchorTag);
  }
};

const removeChangeLoginPageUI = () => {
  if (!isLoginOrRegisterPage()) {
    return;
  }

  const loginBox = document.querySelector(".enterPage > .borderTopRound");
  if (loginBox) {
    loginBox.classList.remove("login-box-custom");
  }

  const registerBox = document.querySelector(".registrationForm");
  if (registerBox) {
    registerBox.classList.remove("register-box-custom");
  }

  const loginToCodeForcesTitle = document.querySelector(".caption.titled");
  if (loginToCodeForcesTitle) {
    loginToCodeForcesTitle.classList.remove("title-custom");
  }

  const fields = document.querySelectorAll(".table-form .field-name");
  fields.forEach((field) => {
    field.classList.remove("field-label-custom");
  });

  const loginButton = document.querySelector(".submit");
  if (loginButton) {
    loginButton.classList.remove("login-button-custom");
  }

  const rememberMeLabel = document.querySelector("label[for='remember']");
  if (rememberMeLabel) {
    rememberMeLabel.classList.remove("remember-me-label-custom");
  }

  const bottomLinks = document.querySelector(".bottom-links");
  if (bottomLinks) {
    bottomLinks.classList.remove("bottom-links-custom");
  }

  const socialDivider = document.querySelector(".social-divider-custom");
  if (socialDivider) {
    socialDivider.remove();
  }

  const forgotPasswordLink = document.querySelector("a[href='/passwordRecovery']");
  if (forgotPasswordLink) {
    forgotPasswordLink.classList.remove("forgot-password-custom");
    const forgotPasswordRow = forgotPasswordLink.parentElement;
    forgotPasswordRow.classList.remove("forgot-password-row-custom");

    // Codeforces ships this row as the last child of the submit cell, so appending it
    // back there restores the original order without having to remember where it was.
    if (loginButton) {
      loginButton.parentElement.parentElement.appendChild(forgotPasswordRow);
    }
  }

  const googleLoginButton = document.querySelector(".login-google-custom");
  if (googleLoginButton) {
    // Codeforces ships this as an anchor to /enter/Gmail. Restoring it as a plain div
    // left the text in place but killed the link for anyone turning the custom UI off.
    const originalGmailLink = document.createElement("a");
    originalGmailLink.className = "useGmailLink";
    originalGmailLink.href = "/enter/Gmail";
    originalGmailLink.textContent = "Use Gmail";

    googleLoginButton.replaceWith(originalGmailLink);
  }
};
