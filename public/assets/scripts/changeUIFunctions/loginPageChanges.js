const changeLoginPageUI = () => {
    const mainContent = document.createElement('main');
    mainContent.setAttribute('role', 'main');
    mainContent.setAttribute('aria-label', 'Codeforces Login');
    
    const metaDescription = document.createElement('meta');
    metaDescription.setAttribute('name', 'description');
    metaDescription.setAttribute('content', 'Login to Codeforces with enhanced UI and features through Codeforces-Lite extension');
    document.head.appendChild(metaDescription);
    
    const currentURL = window.location.href;
    if (!currentURL.includes("codeforces.com/enter") && !currentURL.includes("codeforces.com/register")) {
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

    const fields = document.querySelectorAll(".enterForm .field-name");
    fields.forEach((field) => {
        field.classList.add("field-label-custom");
    });

    const loginButton = document.querySelector(".submit");
    if (loginButton) {
        loginButton.classList.add("login-button-custom");
    }

    const bottomLinks = document.querySelector(".bottom-links");
    if (bottomLinks) {
        bottomLinks.classList.add("bottom-links-custom");
    }

    const forgotPasswordLink = document.querySelector("a[href='/passwordRecovery']");
    if (forgotPasswordLink) {
        forgotPasswordLink.classList.add("forgot-password-custom");
    }

    const gmailLinkDiv = document.querySelector(".useGmailLink");
    if (gmailLinkDiv) {
        const anchorTag = document.createElement("a");

        anchorTag.style.width = "200px";

        anchorTag.href = "/enter/Gmail";
        anchorTag.classList.add("login-google-custom");

        const googleIcon = document.createElement("img");
        googleIcon.src = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png";

        const loginText = document.createElement("span");
        loginText.textContent = "Login with Google";

        anchorTag.appendChild(googleIcon);
        anchorTag.appendChild(loginText);

        gmailLinkDiv.replaceWith(anchorTag);
    }
};

const removeChangeLoginPageUI = () => {
    const currentURL = window.location.href;
    if (!currentURL.includes("codeforces.com/enter") && !currentURL.includes("codeforces.com/register")) {
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

    const fields = document.querySelectorAll(".enterForm .field-name");
    fields.forEach((field) => {
        field.classList.remove("field-label-custom");
    });

    const inputFields = document.querySelectorAll("#handleOrEmail, #password");
    inputFields.forEach((inputField) => {
        inputField.classList.remove("input-field-custom");
    });

    const loginButton = document.querySelector(".submit");
    if (loginButton) {
        loginButton.classList.remove("login-button-custom");
    }

    const bottomLinks = document.querySelector(".bottom-links");
    if (bottomLinks) {
        bottomLinks.classList.remove("bottom-links-custom");
    }

    const forgotPasswordLink = document.querySelector("a[href='/passwordRecovery']");
    if (forgotPasswordLink) {
        forgotPasswordLink.classList.remove("forgot-password-custom");
    }

    const googleLoginButton = document.querySelector(".login-google-custom");
    if (googleLoginButton) {
        const originalGmailLink = document.createElement("div");
        originalGmailLink.className = "useGmailLink";
        originalGmailLink.textContent = "Use Gmail";

        googleLoginButton.replaceWith(originalGmailLink);
    }
};
