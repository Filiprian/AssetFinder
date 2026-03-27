import { useEffect, useState } from "react"
import Menu from "../components/menu"
import SideBar from "../components/sideBar"


export default function Dashboard() {

  const [coinID, setCoinID] = useState("bitcoin")
  const [coinData, setCoinData] = useState([])

  const handleCoinSelect = (id: string) => {
    setCoinID(id)
  }

  const apiKey = import.meta.env.VITE_API_KEY
  const options = {method: 'GET', headers: {'x-cg-demo-api-key': apiKey}};

  const url = new URL(`https://api.coingecko.com/api/v3/coins/${coinID}`);
    url.searchParams.append('localization', 'false'); 
    url.searchParams.append('tickers', 'true');      
    url.searchParams.append('market_data', 'true');    
    url.searchParams.append('community_data', 'true'); 
    url.searchParams.append('developer_data', 'true');   
    url.searchParams.append('sparkline', 'false');  

  async function getCoinData() {
      const res = await fetch(url, options)
      const data = await res.json()
      try {
          if (data) {
            console.log("Data fetched", data)
              setCoinData(data)
              console.log(data)
          }
      } catch {
          console.error("Couldnt fetch the data")
      }
  }

  useEffect(() => {
    if (coinID != "") {
        getCoinData()
    }
  }, [coinID]);

  const md = coinData.market_data
  console.log(coinData.id)

  return (
    <div className="flex flex-col justify-left items-start">
        <Menu />
        <div className="flex">
          <SideBar handleClick={handleCoinSelect}/>
          <div>
            <img src={coinData?.image?.small} alt={coinData?.id}/>
            <div>
                <h1>{coinData?.id ?? "N/A"}</h1>
                <h2>{coinData?.symbol ?? "N/A"}</h2>
                <h2>{md?.current_price.usd ?? "N/A"} USD</h2>
            </div>
            <h1>Rank: {coinData.market_cap_rank ?? "N/A"}</h1>
            <div className="flex gap-25">
                <div>
                    <h3>24h change:</h3>
                    <p>{md?.price_change_percentage_24h ?? "N/A"}%</p>
                </div>
                <div>
                    <h3>All time high:</h3>
                    <p>{md?.ath?.usd ?? "N/A"} USD</p>
                </div>
                <div>
                    <h3>24h volume:</h3>
                    <p>{md?.total_volume?.usd ?? "N/A"}</p>
                </div>
            </div>
            <div className="flex gap-25">
                <div>
                    <h3>Circuling supply:</h3>
                    <p>{md?.circulating_supply ?? "N/A"}</p>
                </div>
                <div>
                    <h3>Market cap:</h3>
                    <p>{md?.market_cap?.usd ?? "N/A"} USD</p>
                </div>
                <div>
                    <h3>Max supply:</h3>
                    <p>{md?.max_supply || "Unlimited"}</p>
                </div>
            </div>
            <h3>Categories:</h3>
            <div className="grid grid-cols-5 gap-5">
                {
                    coinData?.categories  // Access the array from the fetched data
                        ? coinData.categories.map((cat, index) => <p key={index}>{cat}</p>)
                        : <p>No categories</p>
                }
            </div>
            <h3>Description:</h3>
            <p>{coinData?.description?.en ?? "N/A"}</p>
            <p>Last updated: {coinData?.last_updated ?? "N/A"}</p>
          </div>
        </div>
    </div>

    )   
}