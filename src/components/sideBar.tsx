import { useEffect, useState } from "react";
import Coin from "./coin";

interface SideBarProps {
    handleClick: (id: string) => void
}


export default function SideBar({handleClick}: SideBarProps) {

    const [coins, setCoins] = useState([])

    const apiKey = import.meta.env.VITE_API_KEY
    const options = {method: 'GET', headers: {'x-cg-demo-api-key': apiKey}};

    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
        url.searchParams.append('vs_currency', 'usd');
        url.searchParams.append('order', 'market_cap_desc');
        url.searchParams.append('per_page', "50");
        url.searchParams.append('page', "1");
        url.searchParams.append('sparkline', 'false');

    async function getCoins() {
        const res = await fetch(url, options)
        const data = await res.json()
        try {
            if (data) {
                setCoins(data)
            }
        } catch {
            console.error("Couldnt fetch the data")
        }
    }

    useEffect(() => {
        getCoins()
    }, []);


    return (
        <div className="flex flex-col justify-left">
            <h2 className="text-left text-2xl font-bold">Filters:</h2>
            {/*filtering settings*/}
            <h2 className="text-left text-3xl font-bold">Results:</h2>
            {
                coins 
                    ? coins
                        .map(coin => <Coin data={coin} handleCoinSelect={handleClick}/>)
                    : <div className="text-2xl font-bold">Nothing found...</div>
            }
        </div>
    )
}