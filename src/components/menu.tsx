import { useState } from "react";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdOutlineLightMode } from "react-icons/md";

interface MenuProps {
  handleCurrencySelect: (currency: string) => void;
}

export default function Menu({ handleCurrencySelect }: MenuProps) {
  const [darkMode, setDarkMode] = useState(true);
  const [isUSD, setIsUSD] = useState(true);

  return (
    <menu className="flex gap-5 justify-between items-center w-full h-40 border-2 border-slate-800">
      <h1 className="bg-linear-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text text-5xl font-bold ml-5">
        AssetFinder
      </h1>
      <div className="flex items-center gap-10">
        <div className="flex gap-2 p-2 bg-slate-800 rounded-md">
          <h2
            onClick={() => {
              handleCurrencySelect("usd");
              setIsUSD(true);
            }}
            className={`font-semibold text-2xl p-2 rounded-md cursor-pointer transition-all ${isUSD ? "bg-slate-900 text-white" : "bg-slate-800 text-gray-500 hover:text-white"}`}
          >
            USD
          </h2>
          <h2
            onClick={() => {
              handleCurrencySelect("eur");
              setIsUSD(false);
            }}
            className={`font-semibold text-2xl p-2 rounded-md cursor-pointer transition-all ${!isUSD ? "bg-slate-900 text-white" : "bg-slate-800 text-gray-500 hover:text-white"}`}
          >
            EUR
          </h2>
        </div>
        <div
          onClick={() => setDarkMode((current) => !current)}
          className=" text-4xl cursor-pointer mr-5"
        >
          {darkMode ? <MdOutlineLightMode /> : <MdOutlineDarkMode />}
        </div>
      </div>
    </menu>
  );
}
