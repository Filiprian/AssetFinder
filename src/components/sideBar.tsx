import { useEffect, useMemo, useState, useRef } from "react";
import Coin from "./coin";
import { getCryptoData } from "../cryptoCache";
import { fav_db } from "../db";

interface SideBarProps {
  currentCurrency: string;
  handleClick: (id: string) => void;
}

export default function SideBar({
  handleClick,
  currentCurrency,
}: SideBarProps) {
  const [coins, setCoins] = useState([]);
  const [favourites, setFavourties] = useState([]);

  const [pinFavourties, setPinFavourites] = useState(true);
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState("highest_market_cap");

  const scrollRef = useRef<HTMLDivElement>(null);

  const [visibleCount, setVisibleCount] = useState(20);

  const scrollToTop = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await getCryptoData();
        setCoins(data);
      } catch (error) {
        console.error(error);
      }
    };
    loadData();
  }, []);

  const loadFavourites = async () => {
    try {
      const data = await fav_db.favourites.toArray();
      setFavourties(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadFavourites();
  }, []);

  const filteredCoins = useMemo(() => {
    loadFavourites();
    let result = [...coins];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (coin) =>
          coin.name.toLowerCase().includes(term) ||
          coin.symbol.toLowerCase().includes(term),
      );
    }

    result.sort((a, b) => {
      // Pin favourites
      if (pinFavourties) {
        const favIds = new Set(favourites.map((f) => f.coinID));
        const aIsFav = favIds.has(a.id);
        const bIsFav = favIds.has(b.id);
        if (aIsFav && !bIsFav) return -1;
        if (!aIsFav && bIsFav) return 1;
      }

      if (sorting === "highest_market_cap")
        return (
          (b.market_cap?.[currentCurrency] ?? 0) -
          (a.market_cap?.[currentCurrency] ?? 0)
        );
      if (sorting === "lowest_market_cap")
        return (
          (a.market_cap?.[currentCurrency] ?? 0) -
          (b.market_cap?.[currentCurrency] ?? 0)
        );
      if (sorting === "highest_price")
        return (
          (b.current_price?.[currentCurrency] ?? 0) -
          (a.current_price?.[currentCurrency] ?? 0)
        );
      if (sorting === "lowest_price")
        return (
          (a.current_price?.[currentCurrency] ?? 0) -
          (b.current_price?.[currentCurrency] ?? 0)
        );
      if (sorting === "a-z") return a.name.localeCompare(b.name);
      if (sorting === "z-a") return b.name.localeCompare(a.name);
      return 0;
    });
    return result;
  }, [coins, search, sorting, pinFavourties, favourites]);

  const showCoins = filteredCoins.slice(visibleCount - 20, visibleCount);

  return (
    <div className="flex flex-col justify-left bg-slate-950 h-screen min-h-0 border-2 border-slate-700">
      <h2 className="text-left text-5xl font-bold m-5">Coins:</h2>
      <form className="flex flex-col gap-5 justify-center items-center w-full">
        <div className="flex">
          <input
            className="rounded-xl py-1 px-4 text-xl outline-none border-2 border-gray-800 bg-gray-800 hover:bg-slate-700"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex font-semibold justify-between text-2xl gap-8">
          <label>Pin favourties:</label>
          <div
            className={`w-16 h-8 rounded-full transition-all duration-300 cursor-pointer relative shadow-inner" ${pinFavourties ? "bg-indigo-700" : "bg-slate-500"}`}
            onClick={() => setPinFavourites((current) => !current)}
          >
            <div
              className={`w-6 h-6 bg-white rounded-full top-1 shadow-md absolute transition-all duration-300 ${pinFavourties ? "left-[35px]" : "left-[2px]"}`}
            ></div>
          </div>
        </div>
        <div className="flex gap-3.5">
          <select
            className="rounded-xl py-2 px-4 text-2xl outline-none border-2 border-gray-800 bg-gray-800 cursor-pointer"
            value={sorting}
            onChange={(e) => setSorting(e.target.value)}
          >
            <option value="highest_market_cap">Highest market cap</option>
            <option value="lowest_market_cap">Lowest market cap</option>
            <option value="highest_price">Highest price</option>
            <option value="lowest_price">Lowest price</option>
            <option value="a-z">A-Z</option>
            <option value="z-a">Z-A</option>
          </select>
        </div>
      </form>
      <div className="grow min-h-0">
        <div
          ref={scrollRef}
          className="overflow-y-auto h-full flex flex-col pb-45 pt-5 mx-2"
        >
          <div className="flex flex-1 justify-center gap-10">
            {visibleCount != 20 && (
              <button
                className="text-2xl p-2 px-5 font-bold rounded-xl bg-slate-900 cursor-pointer hover:bg-slate-700 active:bg-indigo-500 active:text-black"
                onClick={() => setVisibleCount((prev) => prev - 20)}
              >
                Load Prev
              </button>
            )}
            {visibleCount > 20 && (
              <button
                onClick={() => {
                  scrollToTop();
                  setVisibleCount(20);
                }}
                className="rounded-xl text-2xl p-2 bg-slate-900 font-bold cursor-pointer hover:bg-slate-700 active:bg-indigo-500 active:text-black"
              >
                ↑
              </button>
            )}
          </div>
          {showCoins ? (
            showCoins.map((coin) => (
              <Coin
                currentCurrency={currentCurrency}
                data={coin}
                handleCoinSelect={handleClick}
                refreshFavourites={loadFavourites}
                isFavourite={new Set(favourites.map((f) => f.coinID)).has(
                  coin.id,
                )}
              />
            ))
          ) : (
            <div className="text-2xl font-bold">Nothing found...</div>
          )}
          <button
            className="text-2xl p-2 font-bold w-full rounded-xl bg-slate-900 cursor-pointer hover:bg-slate-700 active:bg-indigo-500 active:text-black"
            onClick={() => {
              scrollToTop();
              setVisibleCount((prev) => prev + 20);
            }}
          >
            Load Next
          </button>
        </div>
      </div>
    </div>
  );
}
