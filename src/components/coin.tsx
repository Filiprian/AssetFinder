import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { fav_db } from "../db";

interface CoinProps {
  data: any;
  handleCoinSelect: (id: string) => void;
  refreshFavourites: () => void;
  isFavourite: boolean;
  currentCurrency: string;
  darkMode: boolean;
}

export default function Coin({
  data,
  handleCoinSelect,
  refreshFavourites,
  isFavourite,
  currentCurrency,
  darkMode,
}: CoinProps) {
  const coin = data;
  const handleClick = () => {
    handleCoinSelect(coin.id);
  };

  const themeStyles = {
    hover_bg: darkMode
      ? "hover:bg-gray-800 active:bg-gray-600"
      : "hover:bg-slate-200 active:bg-slate-300",
    price: darkMode ? "text-gray-300" : "text-gray-500",
    icon: darkMode ? "text-gray-400" : "text-gray-600",
  };

  const toggleFavourite = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent parent div from firing onClick

    try {
      if (isFavourite) {
        await fav_db.favourites.where("coinID").equals(coin.id).delete();
      } else {
        await fav_db.favourites.add({
          coinID: coin.id,
        });
      }
      refreshFavourites();
    } catch (error) {
      console.error("Failed to toggle favourite", error);
    }
  };

  return (
    <div
      className={`flex m-1 p-4 justify-left items-center cursor-pointer w-85 group rounded-xl ${themeStyles.hover_bg}`}
      onClick={handleClick}
    >
      <img className={`w-10 h-10 mr-4`} src={coin.image} alt={coin.id} />
      <div className={`flex justify-between items-center w-full mr-5`}>
        <div>
          <h2 className={`text-2xl font-bold text-left`}>
            {coin.symbol?.toUpperCase() || "N/A"}
          </h2>
          <h2 className={`text-md text-left ${themeStyles.price}`}>
            {coin.name || "N/A"}
          </h2>
        </div>
        <div className={`text-right`}>
          <h2 className={`font-semibold text-xl`}>
            {currentCurrency == "usd" ? "$" : "€"}
            {coin.current_price?.[currentCurrency] || "N/A"}
          </h2>
          <h2
            className={
              coin?.price_change_percentage_24h > 0
                ? `text-emerald-500 text-lg`
                : `text-red-600 text-lg`
            }
          >
            {coin?.price_change_percentage_24h?.toFixed(2) ?? "N/A"}%
          </h2>
        </div>
      </div>
      <div className={`text-2xl cursor-pointer`} onClick={toggleFavourite}>
        {isFavourite ? (
          <FaHeart className={`text-red-500`} />
        ) : (
          <FaRegHeart
            className={`opacity-0 group-hover:opacity-100 transition-opacity ${themeStyles.icon}`}
          />
        )}
      </div>
    </div>
  );
}
