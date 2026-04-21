import { useState } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

interface MenuProps {
  handleCurrencySelect: (currency: string) => void;
  handleModeSelect: (isEnabled: boolean) => void;
}

export default function Menu({
  handleCurrencySelect,
  handleModeSelect,
}: MenuProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [isUSD, setIsUSD] = useState(true);

  const themeStyles = {
    mode_switch_bg1: darkMode
      ? "bg-slate-800"
      : "bg-slate-200/50 border-2 border-slate-300",
    mode_switch_text_active: darkMode
      ? "bg-slate-900 text-white"
      : "bg-white text-black",
    mode_switch_text: darkMode
      ? "text-gray-500 hover:text-white"
      : "text-slate-500 hover:text-black",
    icon: darkMode ? "text-white" : "text-black",
    border: darkMode ? "border-slate-800" : "border-slate-300",
  };

  return (
    <menu
      className={`flex gap-5 justify-between items-center w-full h-40 border-2 ${themeStyles.border}`}
    >
      <h1 className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-5xl font-bold ml-5">
        AssetFinder
      </h1>
      <div className="flex items-center gap-10">
        <div
          className={`flex gap-2 p-2 rounded-md ${themeStyles.mode_switch_bg1}`}
        >
          <h2
            onClick={() => {
              handleCurrencySelect("usd");
              setIsUSD(true);
            }}
            className={`font-semibold text-2xl p-2 rounded-md cursor-pointer transition-all ${isUSD ? themeStyles.mode_switch_text_active : themeStyles.mode_switch_text}`}
          >
            USD
          </h2>
          <h2
            onClick={() => {
              handleCurrencySelect("eur");
              setIsUSD(false);
            }}
            className={`font-semibold text-2xl p-2 rounded-md cursor-pointer transition-all ${!isUSD ? themeStyles.mode_switch_text_active : themeStyles.mode_switch_text}`}
          >
            EUR
          </h2>
        </div>
        <div
          onClick={() => {
            setDarkMode((current) => !current);
            handleModeSelect(!darkMode);
          }}
          className={`text-4xl cursor-pointer mr-5 ${themeStyles.icon}`}
        >
          {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </div>
      </div>
    </menu>
  );
}
