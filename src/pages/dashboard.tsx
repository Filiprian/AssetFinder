import { useEffect, useState } from "react";
import Menu from "../components/menu";
import SideBar from "../components/sideBar";
import { FaDollarSign } from "react-icons/fa";
import { FaDatabase } from "react-icons/fa6";
import { FaArrowTrendDown } from "react-icons/fa6";
import { FaArrowTrendUp } from "react-icons/fa6";
import { FaArrowRotateRight } from "react-icons/fa6";
import { FaArrowDownUpAcrossLine } from "react-icons/fa6";
import { FaHashtag } from "react-icons/fa";
import { FaAsterisk } from "react-icons/fa";

export default function Dashboard() {
  const [coinID, setCoinID] = useState("bitcoin");
  const [coinData, setCoinData] = useState([]);

  const coinStatsCardsStyle = {
    container:
      "bg-slate-800/80 p-5 flex flex-col gap-6 rounded-xl border-2 border-slate-700 py-10",
    div: "flex justify-between",
    heading: "text-slate-300 text-2xl",
    img_frame:
      "px-2 rounded-xl bg-slate-700/50 flex justify-center items-center py-2",
    value: "text-4xl font-semibold",
  };

  const handleCoinSelect = (id: string) => {
    setCoinID(id);
  };

  const apiKey = import.meta.env.VITE_API_KEY;
  const options = { method: "GET", headers: { "x-cg-demo-api-key": apiKey } };

  const [currentCurrency, setCurrentCurreny] = useState("usd");
  const handleCurrencySelect = (currency: string) => {
    setCurrentCurreny(currency);
  };

  const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinID}`);
  url.searchParams.append("localization", "false");
  url.searchParams.append("tickers", "true");
  url.searchParams.append("market_data", "true");
  url.searchParams.append("community_data", "true");
  url.searchParams.append("developer_data", "true");
  url.searchParams.append("sparkline", "false");

  async function getCoinData() {
    const res = await fetch(url, options);
    const data = await res.json();
    try {
      if (data) {
        setCoinData(data);
      }
    } catch {
      console.error("Couldnt fetch the data");
    }
  }

  const formatPrices = (num: number | null) => {
    if (num === null || num === undefined) return "N/A";
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  useEffect(() => {
    if (coinID != "") {
      getCoinData();
    }
  }, [coinID]);

  const md = coinData.market_data;

  return (
    <div className="flex flex-col justify-left items-start bg-slate-900 text-white w-full h-screen">
      <Menu handleCurrencySelect={handleCurrencySelect} />
      <div className="flex overflow-hidden">
        <SideBar
          handleClick={handleCoinSelect}
          currentCurrency={currentCurrency}
        />

        {/* Coin details */}
        <div className="p-10 px-30 border-2 border-slate-700 overflow-y-auto">
          <div className="flex gap-8 mb-5 overflow-y-auto">
            <div className="bg-indigo-950 rounded-xl p-1">
              <img
                className="w-30 h-30"
                src={coinData?.image?.large}
                alt={coinData?.id}
              />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex gap-6">
                <h1 className="text-6xl font-bold">
                  {coinData?.name ?? "N/A"}
                </h1>
                <h2 className="bg-gray-800 text-2xl rounded-lg flex items-center font-bold px-2">
                  {coinData?.symbol?.toUpperCase() ?? "N/A"}
                </h2>
                <h3 className="text-indigo-500 bg-indigo-900/50 text-2xl rounded-lg flex items-center font-bold px-2">
                  Rank #{coinData.market_cap_rank ?? "N/A"}
                </h3>
              </div>
              <div className="flex gap-5">
                <h2 className="text-5xl font-bold">
                  {currentCurrency == "usd" ? "$" : "€"}
                  {formatPrices(md?.current_price?.[currentCurrency]) ?? "N/A"}
                </h2>
                <p
                  className={`font-bold text-xl flex justify-center items-center rounded-xl px-2 ${md?.price_change_percentage_24h > 0 ? "text-emerald-500 bg-emerald-800/50" : "text-red-500 bg-red-900/50"}`}
                >
                  {md?.price_change_percentage_24h > 0 ? (
                    <FaArrowTrendUp className="w-6 h-6 text-emerald-500 m-1" />
                  ) : (
                    <FaArrowTrendDown className="w-6 h-6 text-red-500 m-1" />
                  )}
                  {md?.price_change_percentage_24h.toFixed(2) ?? "N/A"}%
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-5 gap-x-15 gap-y-5 my-10">
            {coinData?.categories ? ( // Access the array from the fetched data
              coinData.categories.map((cat, index) => (
                <div className="p-1 bg-slate-800/80 rounded-xl border-2 border-slate-700 flex justify-center items-center">
                  <p
                    className="text-xl text-slate-300 font-semibold"
                    key={index}
                  >
                    {cat}
                  </p>
                </div>
              ))
            ) : (
              <p>No categories</p>
            )}
          </div>

          <div className="grid grid-cols-4 gap-12 my-10">
            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>Market Cap</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaDollarSign className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {currentCurrency == "usd" ? "$" : "€"}
                {formatPrices(md?.market_cap?.[currentCurrency]) ?? "N/A"}
              </p>
            </div>
            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>24h Volume</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaArrowDownUpAcrossLine className="w-8 h-8 text-blue-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {currentCurrency == "usd" ? "$" : "€"}
                {formatPrices(md?.total_volume?.[currentCurrency]) ?? "N/A"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>24h High</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaArrowTrendUp className="w-8 h-8 text-emerald-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {currentCurrency == "usd" ? "$" : "€"}
                {formatPrices(md?.high_24h?.[currentCurrency]) ?? "N/A"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>24h Low</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaArrowTrendDown className="w-8 h-8 text-red-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {currentCurrency == "usd" ? "$" : "€"}
                {formatPrices(md?.low_24h?.[currentCurrency]) ?? "N/A"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>All Time High</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaAsterisk className="w-8 h-8 text-amber-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {currentCurrency == "usd" ? "$" : "€"}
                {formatPrices(md?.ath?.[currentCurrency]) ?? "N/A"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>
                  Circulating Supply
                </h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaArrowRotateRight className="w-8 h-8 text-purple-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {formatPrices(md?.circulating_supply) ?? "N/A"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>Max Supply</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaDatabase className="w-8 h-8 text-orange-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                {formatPrices(md?.max_supply) || "Unlimited"}
              </p>
            </div>

            <div className={coinStatsCardsStyle.container}>
              <div className={coinStatsCardsStyle.div}>
                <h3 className={coinStatsCardsStyle.heading}>Market Cap Rank</h3>
                <div className={coinStatsCardsStyle.img_frame}>
                  <FaHashtag className="w-8 h-8 text-indigo-500" />
                </div>
              </div>
              <p className={coinStatsCardsStyle.value}>
                #{coinData.market_cap_rank ?? "N/A"}
              </p>
            </div>
          </div>

          <div className="bg-slate-800/80 rounded-xl border-2 border-slate-700 p-8 flex flex-col gap-2">
            <h3 className="text-4xl font-semibold">
              About {coinData?.name ?? "N/A"}
            </h3>
            <p className="text-slate-300 text-2xl">
              {coinData?.description?.en ?? "N/A"}
            </p>
            <p className="text-slate-300 text-2xl font-semibold mt-5">
              Last updated:{"  "}
              {coinData?.last_updated
                ? new Intl.DateTimeFormat("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  }).format(new Date(coinData.last_updated))
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
