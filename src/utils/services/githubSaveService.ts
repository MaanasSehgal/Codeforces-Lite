import { toast } from "sonner";

export type GitHubSettings = {
  enabled: boolean;
  owner: string;
  repo: string;
  branch: string;
  token: string;
  defaultRatingBucket: number;
};

export const DEFAULT_GITHUB_SETTINGS: GitHubSettings = {
  enabled: false,
  owner: "",
  repo: "",
  branch: "main",
  token: "",
  defaultRatingBucket: 1000,
};

const extensionByLanguage: Record<string, string> = {
  cpp: "cpp",
  cplusplus: "cpp",
  c: "c",
  python: "py",
  python3: "py",
  java: "java",
  javascript: "js",
  js: "js",
  kotlin: "kt",
  go: "go",
  rust: "rs",
  ruby: "rb",
};

export const getGitHubSettings = (): GitHubSettings => {
  try {
    const raw = localStorage.getItem("githubSettings");
    if (!raw) {
      return DEFAULT_GITHUB_SETTINGS;
    }
    return {
      ...DEFAULT_GITHUB_SETTINGS,
      ...JSON.parse(raw),
    };
  } catch {
    return DEFAULT_GITHUB_SETTINGS;
  }
};

export const saveGitHubSettings = (settings: Partial<GitHubSettings>) => {
  const merged = {
    ...DEFAULT_GITHUB_SETTINGS,
    ...getGitHubSettings(),
    ...settings,
  };
  localStorage.setItem("githubSettings", JSON.stringify(merged));
  return merged;
};

export const sanitizeGithubPath = (value: string) =>
  value
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9._\- /]/g, "")
    .trim()
    .replace(/\s+/g, " ");

export const getRatingBucket = (rating?: number, fallback: number = 1000) => {
  if (rating === undefined || !Number.isFinite(rating) || rating <= 0) {
    return fallback;
  }
  return Math.floor(rating / 100) * 100;
};

export const getProblemRatingFromPage = async (): Promise<number | undefined> => {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab?.id) {
      return undefined;
    }

    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: () => {
        const text = document.body?.innerText ?? "";
        const ratingMatch = text.match(/(?:Rating|rating)[^\d]*(\d{3,4})/i);
        if (ratingMatch?.[1]) {
          return Number(ratingMatch[1]);
        }

        const maybeText = text.match(/(\d{3,4})/);
        return maybeText ? Number(maybeText[1]) : undefined;
      },
    });

    return result?.[0]?.result as number | undefined;
  } catch {
    return undefined;
  }
};

export const saveAcceptedSolutionToGitHub = async ({
  code,
  language,
  problemName,
  rating,
}: {
  code: string;
  language: string;
  problemName: string;
  rating?: number;
}) => {
  const settings = getGitHubSettings();
  if (!settings.enabled || !settings.owner || !settings.repo || !settings.token) {
    return false;
  }

  const bucket = getRatingBucket(rating, settings.defaultRatingBucket);
  const sanitizedName = sanitizeGithubPath(problemName || "unknown-problem");
  const extension = extensionByLanguage[language.toLowerCase()] ?? "txt";
  const filePath = `accepted/${bucket}/${sanitizedName}.${extension}`;

  const content = btoa(unescape(encodeURIComponent(code)));

  const response = await fetch(`https://api.github.com/repos/${settings.owner}/${settings.repo}/contents/${filePath}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${settings.token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      message: `Save accepted solution: ${sanitizedName}`,
      content,
      branch: settings.branch || "main",
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    toast.error(`GitHub save failed: ${response.status} ${errorText}`);
    return false;
  }

  toast.success(`Saved accepted solution to GitHub: ${filePath}`);
  return true;
};
