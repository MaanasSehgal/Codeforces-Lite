import { useState } from 'react';
import './App.css';
import Options from './components/options/page';
import Main from './components/main/page';
import { useCFStore } from './zustand/useCFStore';

const App = () => {
  const [showOptions, setShowOptions] = useState<boolean>(false);
  const [theme, setTheme] = useState<"light" | "dark">((localStorage.getItem('theme') as "light" | "dark") || "dark");
  const tabIndent = useCFStore((state) => state.tabIndent);
  const setTabIndent = useCFStore((state) => state.setTabIndent);

  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className={`w-full h-full`}>
        <Main setShowOptions={setShowOptions} theme={theme} tabIndent={tabIndent}/>
      </div>

      <div
        className={`z-20 fixed top-0 right-0 h-full w-full max-w-full bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${
          showOptions ? 'translate-x-0' : 'translate-x-full'
        } dark:bg-[#111111]`}
      >
        <Options 
          setShowOptions={setShowOptions} 
          theme={theme} 
          setTheme={setTheme} 
          tabIndent={tabIndent} 
          setTabIndent={setTabIndent} 
        />
      </div>
    </div>
  );
};

export default App;