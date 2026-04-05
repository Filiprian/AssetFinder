import { useEffect, useState } from "react";
import Coin from "./coin";
import { getCryptoData } from "../cryptoCache";

interface SideBarProps {
    handleClick: (id: string) => void
}


export default function SideBar({handleClick}: SideBarProps) {

    const [coins, setCoins] = useState([])
    const [page, setPage] = useState(1)

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

    const startIndex = (page-1) * COINS_PER_PAGE
    const endIndex = startIndex + COINS_PER_PAGE
    const showCoins = coins.slice(startIndex, endIndex)



    return (
        <div className="flex flex-col justify-left">
            <h2 className="text-left text-2xl font-bold">Filters:</h2>
            {/*filtering settings*/}
            <h2 className="text-left text-3xl font-bold">Results:</h2>
            {
                showCoins 
                    ? showCoins
                        .map(coin => <Coin data={coin} handleCoinSelect={handleClick}/>)
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