import { useState } from "react";
import { Toaster } from "sonner";
import "./App.css";
import Options from "./components/options/page";
import Main from "./components/main/page";

const App = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">(
    (localStorage.getItem("theme") as "light" | "dark") || "dark"
  );

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Sits outside the options panel below: that panel is transformed, which would
          make it the containing block for the toaster's fixed position and push every
          toast off-screen whenever the panel is closed. */}
      <Toaster theme={theme} position="top-left" />

      <div className={`w-full h-full`}>
        <Main showOptions={showOptions} setShowOptions={setShowOptions} theme={theme} />
      </div>

      <div
        className={`z-20 fixed top-0 right-0 h-full w-full max-w-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          showOptions ? "translate-x-0" : "translate-x-full"
        } dark:bg-[#111111]`}
      >
        <Options setShowOptions={setShowOptions} theme={theme} setTheme={setTheme} />
      </div>
    </div>
  );
};

export default App;
