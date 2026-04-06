import { useEffect, useMemo, useState } from "react";
import Coin from "./coin";
import { getCryptoData } from "../cryptoCache";
import { fav_db } from "../db";

interface SideBarProps {
    handleClick: (id: string) => void
}


export default function SideBar({handleClick}: SideBarProps) {

    const [coins, setCoins] = useState([])
    const [page, setPage] = useState(1)
    const [favourites, setFavourties] = useState([])

    const [pinFavourties, setPinFavourites] = useState(true)
    const [search, setSearch] = useState("")
    const [sorting, setSorting] = useState("highest")

    const COINS_PER_PAGE = 8
    const totalPages = Math.ceil(coins.length/COINS_PER_PAGE)

    const previousPage = () => {
        if (page != 1) {
            setPage(prevPage => prevPage - 1);
        } else {
            setPage(totalPages)
        }
    }

    const nextPage = () => {
        if (page != totalPages) {
            setPage(prevPage => prevPage + 1);
        } else {
            setPage(1)
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

            if (sorting === "highest_market_cap") return (b.market_cap ?? 0) - (a.market_cap ?? 0)
            if (sorting === "lowest_market_cap") return (a.market_cap ?? 0) - (b.market_cap ?? 0)
            if (sorting === "highest_price") return (b.current_price ?? 0) - (a.current_price ?? 0)
            if (sorting === "lowest_price") return (a.current_price ?? 0) - (b.current_price ?? 0)
            if (sorting === "a-z") return a.name.localeCompare(b.name)
            if (sorting === "z-a") return b.name.localeCompare(a.name)
            return 0
        })
        return result
    }, [coins, search, sorting, pinFavourties, favourites])

    const startIndex = (page-1) * COINS_PER_PAGE
    const endIndex = startIndex + COINS_PER_PAGE
    const showCoins = filteredCoins.slice(startIndex, endIndex)

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
            {
                showCoins 
                    ? showCoins
                        .map(coin => <Coin data={coin} handleCoinSelect={handleClick} refreshFavourites={loadFavourites}/>)
                    : <div className="text-2xl font-bold">Nothing found...</div>
            }
            <div className="flex gap-3 justify-center items-center">
                <button onClick={previousPage}>
                    Prev
                </button>
                <p>{page}</p>
                <button onClick={nextPage}>
                    Next
                </button>
            </div>
        </div>
    )
}