# Codeforces Lite
#### A sidebar Chrome extension that enhances Codeforces, making it a more productive platform for competitive programmers.

[![Chrome Web Store](https://i.imgur.com/iswHnpJ.png)](https://chromewebstore.google.com/detail/codeforces-lite/hgcgfmgjkfjmhoebifgmbfipinkkjgco)
[![Firefox Add-ons](https://i.imgur.com/kMH6r1a.png)](https://addons.mozilla.org/en-US/firefox/addon/codeforces-lite/)

---

### Table of Contents
* [Overview](#overview)
* [Features](#features)
* [How to get API Key?](#how-to-get-api-key)
* [Browser Compatibility](#browser-compatibility)
* [Local Setup for Developers](#local-setup-for-developers)
* [How to Contribute?](#how-to-contribute)
* [Know the Developers](#developers)

# Overview

![Hero Section](/public/assets/images/preview1.png)

#### **Codeforces Lite** brings a more refined experience for competitive programmers on Codeforces.
#### From enhanced UI elements and dark theme, to a fully functional code editor, this extension provides everything you need for a seamless coding experience on Codeforces.

---

# Features
## 1. Advanced Monaco Code Editor with Execution & Storage Capabilities

![Code Editor](/public/assets/images/preview2.png)

#### Write, test, and submit code directly from the problem page with our feature-rich Monaco editor. No more switching tabs or manual file uploads.

Key features include:
- Default language selector supporting multiple languages (C++, Python, Java, JavaScript, Kotlin, Go, Rust, Ruby)
- Rich editor features:
  - Syntax highlighting with multiple theme options
  - Intelligent autosuggestions and code completion
  - Customizable indentation and line wrapping
  - Minimap navigation for quick code overview
  - Line numbers and editor customization
- Built-in code execution system with real-time results
  - Test against sample cases instantly
  - View execution time and memory usage
  - Custom test case input support
  - Detailed compilation and runtime error messages
- Adjustable font size and automatic tab indentation
- Built-in timer for practice sessions
- Smart code storage system
  - Local save of submitted codes
  - Automatic retrieval when revisiting problems
  - Efficient storage management handling 1000+ files (200+ lines each)
  - Automatic cleanup using HashMap and Queue for optimal performance
- Code formatting with language-specific rules

This comprehensive system combines coding, testing, and submission in one seamless interface, making your competitive programming workflow more efficient.

## 2. Code Execution
### API CONFIGURATION
![API Config](/public/assets/images/v1.1preview1.png)

### COMPILATION RESULTS HANDLING
![Compilation Results](/public/assets/images/v1.1preview2.png)

### LIMITATIONS AND FUTURE ENHANCEMENTS
![Limitations](/public/assets/images/v1.1preview3.png)


## 3. Dark Theme with Advanced Customization

![Dark Theme Support](/public/assets/images/preview3.png)

#### Codeforces Lite offers a highly optimized dark theme designed to provide a more visually comfortable experience, especially during extended coding sessions. The dark theme ensures a consistent look throughout the entire platform.

#### Key features of the dark theme include:

- **Eye Comfort:** The dark theme reduces eye strain by minimizing the contrast between the screen and the environment, particularly in low-light conditions.
- **Battery Efficiency:** On devices with OLED or AMOLED screens, the dark theme can help conserve battery life by reducing the energy used to display brighter pixels.
- **Code Readability:** Syntax highlighting is optimized for better readability in dark mode, ensuring that different elements in the code—such as keywords, variables, and comments—stand out clearly without causing visual fatigue.
- **User Control:** You can toggle the dark theme on or off based on your preferences, allowing you to switch between light and dark modes seamlessly.
- **Theme Customizer:** Fine-tune your dark theme experience with adjustable settings for:
  - Brightness
  - Contrast
  - Sepia tone
  - Grayscale
  - Invert colors
- **Theme Presets:** Choose from predefined theme presets for quick visual adjustments

## 4. Editor Theme Selection & Advanced Editor Settings

#### Codeforces Lite now includes a comprehensive editor settings panel with extensive customization options to match your coding style and preferences:

**Theme Selection:**
- Classic themes: Default, Dark, Light, High Contrast
- Popular coding themes: Monokai, Dracula, GitHub, Nord, Solarized, and many more
- Seamless theme switching without disrupting your workflow
- Theme preview to help you choose the perfect look

**Advanced Editor Configuration:**
- **Keybinding Modes:** Choose between Standard editor shortcuts or Vim keybindings for power users
  - Standard mode: Traditional editor shortcuts
  - Vim mode: Full Vim keybinding support with status line integration
- **Line Numbers Display:** Customize line number appearance
  - On: Standard line numbers
  - Relative: Relative line numbering (popular with Vim users)
  - Off: Hide line numbers completely
- **Cursor Customization:** 
  - Multiple cursor styles: Line, Block, Underline, Line Thin, Block Outline, Underline Thin
  - Smooth caret animation controls (On/Off/Explicit) for enhanced visual feedback
- **Editor Appearance:** Fine-tune indentation, minimap, line wrapping, and auto-suggestions
- **Real-time Preview:** See your settings applied instantly in the live preview editor

**Vim Integration:**
- Full Vim keybinding support powered by monaco-vim
- Dedicated Vim status line showing current mode and commands
- Seamless switching between Standard and Vim modes
- Maintains Vim muscle memory for experienced users

This comprehensive settings system allows you to create the perfect coding environment tailored to your preferences and workflow.

## 5. Customizable Keyboard Shortcuts

Tailor your coding workflow with customizable keyboard shortcuts. Codeforces Lite allows you to assign your preferred key combinations for essential actions, reducing mouse dependency and speeding up your CP.

- **Configurable Actions**: Set custom shortcuts for:
  - **Run Code**: Execute your code against test cases.
  - **Submit Code**: Submit your solution.
  - **Reset Code**: Clear the editor back to the default template.
  - **Format Code**: Apply language-specific formatting.
- **Easy Configuration**: Access all shortcut settings in a dedicated panel within the extension's options.
- **Dynamic Tooltips**: Button tooltips automatically update to reflect your custom shortcuts, helping you learn and remember them.

## 6. Custom Templates and Default Cursor Placement

#### With Codeforces Lite, you can set up custom templates that automatically load whenever you start solving a new problem. This feature helps you avoid the repetitive task of setting up your environment or writing boilerplate code from scratch.

#### By predefining your commonly used template (such as input/output functions, imports, or debugging statements), you can focus directly on problem-solving, improving your speed and efficiency during contests or practice sessions.

#### Additionally, you can specify the exact position for your cursor using the `$0` symbol in your template, allowing you to start typing right where you need. The extension also remembers the cursor's position when switching tabs and revisiting problems, ensuring you pick up exactly where you left off—saving valuable time during contests.

## 7. UI Enhancements

![UI Enhancements](/public/assets/images/preview4.png)

#### Codeforces Lite enhances the overall UI of Codeforces by making it more accessible, visually appealing, and user-friendly.

#### Elements are optimized for better positioning, creating a clean and intuitive interface for seamless navigation.

- Improved alignment of the problemset page for a more structured look.
- Redesigned login and register pages for a smoother user experience.
- Customized dark theme for various extension components to ensure consistency with our dark theme design.
- **User Control:** You can easily toggle the `Change UI` option on or off according to your preferences, allowing you to switch seamlessly between the default user interface and the enhanced version.

## 8. Code Formatting

#### Codeforces Lite now includes a powerful code formatting feature that helps maintain clean, consistent code:

- One-click formatting for all supported languages
- Language-specific formatting rules
- Customizable indentation settings

## 9. Auto-save & Network Status

Codeforces Lite is designed to be reliable, even with unstable internet connections.

- **Automatic Code Saving**: Your code is automatically saved in the background as you type, so you never have to worry about losing your progress.
- **Network Status Indicator**: A real-time indicator in the top bar shows your current network status (online or offline), providing immediate feedback on your connection.
- **Smart Error Handling**: The extension provides clear alerts if you try to run or submit code while offline, preventing accidental errors.

---

## Browser Compatibility

#### Codeforces Lite now works seamlessly across multiple browsers:

- [Google Chrome](https://chromewebstore.google.com/detail/hgcgfmgjkfjmhoebifgmbfipinkkjgco?utm_source=item-share-cb)
- [Mozilla Firefox](https://addons.mozilla.org/en-US/firefox/addon/codeforces-lite/)
- [Brave Browser](https://chromewebstore.google.com/detail/hgcgfmgjkfjmhoebifgmbfipinkkjgco?utm_source=item-share-cb)
- [Microsoft Edge](https://www.microsoft.com/edge)

This cross-browser compatibility ensures you can enjoy the enhanced Codeforces experience regardless of your preferred browser.

---

## How to Get API Key?

#### To use the run code feature, you'll need to set up an API key. Follow these steps:

1. Sign up or log in to [RapidAPI](https://rapidapi.com/)
2. Visit [Judge0 CE (GET a Submission) on RapidAPI](https://rapidapi.com/judge0-official/api/judge0-ce/playground/apiendpoint_70574edc-a45b-41f3-8960-3a652b81404a)
3. Look for the **"Subscribe to Test"** button.
   - If you see it, click it and choose a plan (a free plan is available). After subscribing, you will see the **"Test Endpoint"** button, and your API key will be active.
     ![Subscribe to Test button](/public/assets/images/subscribe_btn.png)
   - If you don't see the "Subscribe to Test" button, your API key is already active.
   - You will see the "Test Endpoint" button. You can use it to test your API key.
   - If you receive a 404 error, or if CF Lite reports the key as invalid, try using a different account.

     ![Test Endpoint button](/public/assets/images/test_btn.png)
4. You'll find your API key in the "Header Parameters" section. Copy the `X-RapidAPI-Key` value.
   
   ![Copy API Key](/public/assets/images/api-guide2.png)

5. Open Codeforces Lite extension and go to "API Settings" section
6. Click the "Edit" button and paste your API keys

   ![Paste API Key](/public/assets/images/api-guide3.png)
7. Save the key to enable the run code feature

🚀 You're all set! The code execution feature is now ready to use.

---

## Local Setup for Developers

#### To set up Codeforces Lite locally, follow these steps:

1. Fork the repository through github

    ```bash
    git clone <Your Forked Repo>
    ```

2. Install the dependencies:

    ```bash
    npm i
    ```

3. Build the project whenever you want to see the changes you made:

    ```bash
    npm run build
    ```

4. To add the extension to Chrome:

    - Open Chrome and navigate to [chrome extensions](chrome://extensions/) or Manage extensions
    - Enable "Developer mode" in the top right corner.
    - Click "Load unpacked" and select the `dist` folder from the project.

![Core Developers](/public/assets/images/extensionguide.png)

---

## How To Contribute?

#### Contributions are what make the open source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**. Follow the steps below to get involved:

1. Check for issues or features that need work [here](https://github.com/MaanasSehgal/Codeforces-Lite/issues) if you want to improve existing features. If you wish to implement a feature of your own, raise an issue and start working on it to keep track of your progress.

2. In your forked repo, create a branch for the feature or bug fix you're working on.
    ```bash
    git checkout -b bug/<bug-name>
    ```
    ```bash
    git checkout -b feature/<feature-name>
    ```
3. Make sure to properly handle any errors and ensure the feature is production-ready.
4. Write down proper commit messages which explain what you have fixed or what you have implemented.

    ```bash
    git commit -m "feat: Implemented real-time code submission status to display submission updates without page redirects, improving user experience"

    git push origin <your-branch-name>
    ```

5. Once you are ready, create a pull request (PR) for review:
    - Go to the repository on GitHub.
    - Click on "Pull requests" and create a new PR for your branch.
    - Properly list down the changes in your PR message.
6. Your PR will be reviewed and merged upon approval.

## Developers

![UI Improvement Example](/public/assets/images/preview5.png)

This extension was primarily developed by **Maanas Sehgal** and **Devendra Suryavanshi**.

| Developer                | LinkedIn                                                     | GitHub                                           |
| ------------------------ | ------------------------------------------------------------ | ------------------------------------------------ |
| **Maanas Sehgal**        | [LinkedIn](https://www.linkedin.com/in/maanassehgal/)        | [GitHub](https://github.com/MaanasSehgal)        |
| **Devendra Suryavanshi** | [LinkedIn](https://www.linkedin.com/in/devendrasuryavanshi/) | [GitHub](https://github.com/devendrasuryavanshi) |

<a href="https://github.com/MaanasSehgal/Codeforces-Lite/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=MaanasSehgal/Codeforces-Lite" />
</a>

# Thanks for using our extension!
