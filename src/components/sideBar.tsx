import { useEffect, useMemo, useState, useRef } from "react";
import Coin from "./coin";
import { getCryptoData } from "../cryptoCache";
import { fav_db } from "../db";

interface SideBarProps {
    currentCurrency: string,
    handleClick: (id: string) => void
}

export default function SideBar({handleClick, currentCurrency}: SideBarProps) {

    const [coins, setCoins] = useState([])
    const [favourites, setFavourties] = useState([])

    const [pinFavourties, setPinFavourites] = useState(true)
    const [search, setSearch] = useState("")
    const [sorting, setSorting] = useState("highest_market_cap")

    const scrollRef = useRef<HTMLDivElement>(null)

    const [visibleCount, setVisibleCount] = useState(20)

    const scrollToTop = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTo({
                top: 0,
                behavior: "smooth"
            })
        }
    }

    useEffect(() => {
        const loadData = async () => {
            try {
                const data = await getCryptoData()
                setCoins(data)
            } catch (error) {
                console.error(error)
            }
        }
        loadData()
    }, []);

    const loadFavourites = async () => {
            try {
                const data = await fav_db.favourites.toArray()
                setFavourties(data)
            } catch (error) {
                console.error(error)
            }
        }

    useEffect(() => {
        loadFavourites()
    }, []);

    const filteredCoins = useMemo(() => {
        loadFavourites()
        let result = [...coins]

        if (search.trim()) {
            const term = search.toLowerCase()
            result = result.filter(coin => 
                coin.name.toLowerCase().includes(term) ||
                coin.symbol.toLowerCase().includes(term)
            )
        }

        result.sort((a, b) => {

            // Pin favourites
            if (pinFavourties) {
                const favIds = new Set(favourites.map(f => f.coinID))
                const aIsFav = favIds.has(a.id);
                const bIsFav = favIds.has(b.id);
                if (aIsFav && !bIsFav) return -1;
                if (!aIsFav && bIsFav) return 1; 
            }

            if (sorting === "highest_market_cap") return (b.market_cap?.[currentCurrency] ?? 0) - (a.market_cap?.[currentCurrency] ?? 0)
            if (sorting === "lowest_market_cap") return (a.market_cap?.[currentCurrency] ?? 0) - (b.market_cap?.[currentCurrency] ?? 0)
            if (sorting === "highest_price") return (b.current_price?.[currentCurrency] ?? 0) - (a.current_price?.[currentCurrency] ?? 0)
            if (sorting === "lowest_price") return (a.current_price?.[currentCurrency] ?? 0) - (b.current_price?.[currentCurrency] ?? 0)
            if (sorting === "a-z") return a.name.localeCompare(b.name)
            if (sorting === "z-a") return b.name.localeCompare(a.name)
            return 0
        })
        return result
    }, [coins, search, sorting, pinFavourties, favourites])

    const showCoins = filteredCoins.slice(visibleCount-20, visibleCount)

    return (
        <div className="flex flex-col justify-left">
            <h2 className="text-left text-2xl font-bold">Filters:</h2>
            <form>
                <div className="flex">
                    <input placeholder="Search" value={search} onChange={(e) => setSearch(e.target.value)}/>
                </div>
                <div className="flex gap-3.5">
                    <label>Pin favourties:</label>
                    <input type="checkbox" checked={pinFavourties} onChange={(e) => setPinFavourites(e.target.checked)}/>
                </div>
                <div className="flex gap-3.5">
                    <label>Sort by:</label>
                    <select value={sorting} onChange={(e) => setSorting(e.target.value)}>
                        <option value="highest_market_cap">Highest market cap</option>
                        <option value="lowest_market_cap">Lowest market cap</option>
                        <option value="highest_price">Highest price</option>
                        <option value="lowest_price">Lowest price</option>
                        <option value="a-z">A-Z</option>
                        <option value="z-a">Z-A</option>
                    </select>
                </div>
            </form>
            <h2 className="text-left text-3xl font-bold">Results:</h2>
            <div className="relative">
                <div ref={scrollRef} className="h-[60vh] overflow-y-auto pr-2 border-gray-300 outline-2 outline-gray-300 rounded-2xl">
                    {
                        visibleCount != 20 && (
                            <button onClick={() => setVisibleCount(prev => prev-20)}>Load Prev</button>
                        )
                    }
                    {
                        showCoins 
                            ? showCoins
                                .map(coin => <Coin currentCurrency={currentCurrency} data={coin} handleCoinSelect={handleClick} refreshFavourites={loadFavourites} isFavourite={new Set(favourites.map(f => f.coinID)).has(coin.id)}/>)
                            : <div className="text-2xl font-bold">Nothing found...</div>
                    }
                    <button onClick={() => {scrollToTop(); setVisibleCount(prev => prev+20)}}>Load Next</button>
                </div>
                {
                    visibleCount > 20 && (
                        <button onClick={() => {scrollToTop(); setVisibleCount(20)}} className="absolute bottom--32 left-22">↑</button>
                    )
                }
            </div>
        </div>
    )
}