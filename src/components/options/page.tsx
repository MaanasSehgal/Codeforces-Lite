import {
  applyBoilerplateToEditor,
  getSelectedBoilerplateId,
  handleSaveTemplate,
} from "src/utils/localStorageHelper";
import { useEffect, useRef, useState } from "react";
import { SettingsProps } from "src/types/types";
import Footer from "src/components/global/Footer";
import SettingsTopBar from "./ui/SettingsTopBar";
import Options from "./ui/Options";
import CodeEditor from "src/components/main/editor/CodeEditor";
import { useCFStore } from "src/zustand/useCFStore";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { browserAPI } from "src/utils/browser/browserDetect";
import { Save, Sparkles } from "lucide-react";
import { CPP_BOILERPLATES } from "src/data/constants";
import {
  getGitHubSettings,
  saveGitHubSettings,
} from "src/utils/services/githubSaveService";
// import ApiSettings from "src/components/global/ApiSettings";

const Settings: React.FC<SettingsProps> = ({ setShowOptions, theme, setTheme }) => {
  const monacoInstanceRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [changeUI, setChangeUI] = useState(localStorage.getItem("changeUI") || "true");
  const [selectedBoilerplateId, setSelectedBoilerplateId] = useState(getSelectedBoilerplateId());
  const [githubSettings, setGithubSettings] = useState(getGitHubSettings());
  const { language, fontSize } = useCFStore();

  useEffect(() => {
    const defaultThemeSettings = localStorage.getItem("defaultThemeSettings");
    if (!defaultThemeSettings) {
      const initialSettings = {
        brightness: 100,
        contrast: 100,
        sepia: 0,
        grayscale: 0,
      };
      localStorage.setItem("defaultThemeSettings", JSON.stringify(initialSettings));
      browserAPI.storage.local.set({ defaultThemeSettings: initialSettings });
    }

    const themeCustomSettings = localStorage.getItem("themeCustomSettings");
    if (!themeCustomSettings) {
      const initialSettings = JSON.parse(defaultThemeSettings || "{}");
      localStorage.setItem("themeCustomSettings", JSON.stringify(initialSettings));
      browserAPI.storage.local.set({ themeCustomSettings: initialSettings });
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    browserAPI.storage.local.set({ theme: theme });
    localStorage.setItem("theme", theme);
  }, [theme]);

  useEffect(() => {
    browserAPI.storage.local.set({ changeUI: changeUI });
    localStorage.setItem("changeUI", changeUI);
  }, [changeUI]);

  return (
    <>
      <div className="Settings-container w-full h-full flex flex-col items-center justify-center dark:bg-[#111111]">
        <SettingsTopBar theme={theme} setShowOptions={setShowOptions} />

        <div className="w-full h-full overflow-y-auto px-4">
          <Options
            theme={theme}
            setTheme={setTheme}
            changeUI={changeUI}
            setChangeUI={setChangeUI}
          />
          <div className="mx-auto w-full max-w-3xl border-t-2 border-zinc-800 pt-6 pb-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                GitHub Auto-Save
              </h3>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={githubSettings.enabled}
                  onChange={(event) => {
                    const next = saveGitHubSettings({ enabled: event.target.checked });
                    setGithubSettings(next);
                  }}
                />
                Enabled
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <input
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
                placeholder="GitHub owner"
                value={githubSettings.owner}
                onChange={(event) => {
                  const next = saveGitHubSettings({ owner: event.target.value });
                  setGithubSettings(next);
                }}
              />
              <input
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
                placeholder="Repo name"
                value={githubSettings.repo}
                onChange={(event) => {
                  const next = saveGitHubSettings({ repo: event.target.value });
                  setGithubSettings(next);
                }}
              />
              <input
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
                placeholder="Branch (main)"
                value={githubSettings.branch}
                onChange={(event) => {
                  const next = saveGitHubSettings({ branch: event.target.value });
                  setGithubSettings(next);
                }}
              />
              <input
                type="number"
                className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
                placeholder="Default bucket (1000)"
                value={githubSettings.defaultRatingBucket}
                onChange={(event) => {
                  const next = saveGitHubSettings({ defaultRatingBucket: Number(event.target.value) || 1000 });
                  setGithubSettings(next);
                }}
              />
            </div>

            <div className="mt-3">
              <input
                type="password"
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
                placeholder="GitHub personal access token"
                value={githubSettings.token}
                onChange={(event) => {
                  const next = saveGitHubSettings({ token: event.target.value });
                  setGithubSettings(next);
                }}
              />
            </div>
          </div>
          {/* <ApiSettings /> */}
          <div className="mx-auto w-full max-w-3xl flex flex-col items-center gap-2 border-t-2 border-zinc-800">
            <div className="self-center text-base text-zinc-700 font-semibold dark:text-zinc-200 flex justify-between w-full py-3">
              <div className="flex flex-col gap-1">
                <p className="text-xl font-semibold text-gray-800 dark:text-white">
                  Set your default template
                </p>
                <p className="text-[13px] font-semibold text-gray-900 dark:text-gray-300 pr-4">
                  Use symbol{" "}
                  <span className="font-[500] px-2 rounded-md bg-gray-300 dark:bg-gray-600">
                    $0
                  </span>{" "}
                  to set your default cursor position in template.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => applyBoilerplateToEditor(monacoInstanceRef.current, selectedBoilerplateId)}
                  aria-label="Apply selected boilerplate"
                  className="h-1/2 text-[#60a5fa] text-sm px-2 py-1 font-bold rounded-lg gap-1 mt-1 bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-all duration-200 flex justify-center items-center shadow-sm"
                >
                  <Sparkles color="#60a5fa" size={18} />
                  Apply
                </button>
                <button
                  onClick={() => handleSaveTemplate(monacoInstanceRef.current)}
                  aria-label="Save template"
                  className="h-1/2 text-[#22c55e] text-sm px-2 py-1 font-bold rounded-lg gap-1 mt-1  bg-gray-200 dark:bg-[#2a2a2a] hover:bg-gray-300 dark:hover:bg-[#3a3a3a] transition-all duration-200 flex justify-center items-center shadow-sm"
                >
                  <Save color="#22c55e" size={18} />
                  Save
                </button>
              </div>
            </div>
            <div className="w-full mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
                Choose C++ boilerplate
              </label>
              <select
                value={selectedBoilerplateId}
                onChange={(event) => {
                  setSelectedBoilerplateId(event.target.value);
                  localStorage.setItem("selectedBoilerplateId", event.target.value);
                }}
                className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm text-gray-800 shadow-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-[#1c1c1c] dark:text-gray-100"
              >
                {CPP_BOILERPLATES.map((template) => (
                  <option key={template.id} value={template.id}>
                    {template.label} - {template.description}
                  </option>
                ))}
              </select>
            </div>
            <div className="text-left mt-2 mb-20 w-full h-[28rem]">
              <CodeEditor
                monacoInstanceRef={monacoInstanceRef}
                language={language}
                fontSize={fontSize}
                templateCode={localStorage.getItem("template") || ""}
              />
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Settings;
