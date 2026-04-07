import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa6";
import { fav_db } from "../db";

interface CoinProps {
    data: any
    handleCoinSelect: (id: string) => void
    refreshFavourites: () => void
    isFavourite: boolean
    currentCurrency: string
}

export default function Coin({data, handleCoinSelect, refreshFavourites, isFavourite, currentCurrency}: CoinProps) {

    const coin = data
    const handleClick = () => {
        handleCoinSelect(coin.id)
    }

    const toggleFavourite = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent parent div from firing onClick
        
        try {
            if (isFavourite) {
                await fav_db.favourites.where("coinID").equals(coin.id).delete()
            } else {
                await fav_db.favourites.add({
                    coinID: coin.id,
                })
            }
            refreshFavourites()
        } catch (error) {
            console.error("Failed to toggle favourite", error)
        }
    }

    return (
        <div className="flex m-1 p-2.5 justify-left items-center border border-gray-500 rounded-2xl cursor-pointer w-55"
            onClick={handleClick}>
            <img className="w-8 h-8 mr-3" src={coin.image} alt={coin.id}/>
            <div className="flex justify-between items-center w-full">
                <div>
                    <h2 className="text-amber-400 text-xl font-bold text-left">{coin.symbol?.toUpperCase() || "N/A"}</h2>
                    <h2>{coin.current_price?.[currentCurrency] || "N/A"} {currentCurrency == "usd" ? "USD" : "EUR"} </h2>
                </div>
                <div className="text-2xl" onClick={toggleFavourite}>
                    {isFavourite ? (
                        <FaHeart className="text-red-500" />
                    ) : (
                        <FaRegHeart className="text-gray-400" />
                    )}
                </div>
            </div>
        </div>
    )
}