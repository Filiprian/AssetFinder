import { coin_db } from "./db";

const CACHE_TIME = 10 * 60 * 1000 // how long to keep data before refreshing
let isFetching: boolean = false
let currentFetchPromise: any = null

export async function getCryptoData () {
    const now = Date.now()
    const meta = await coin_db.meta.get("last_updated")
    const cachedCoins = await coin_db.coins.toArray()

    if (meta && (now - meta.timestamp) < CACHE_TIME && cachedCoins.length > 0) {
        console.log("Data is fresh")
        return cachedCoins
    }

    if (isFetching) {
        console.log("Waiting for fetch to finish")
        return currentFetchPromise
    }

    console.log("Data is old, fetching again")
    isFetching = true
    currentFetchPromise = fetchData()

    try {
        const data = await currentFetchPromise
        return data
    } catch (error) {
        console.error("Fetch failed", error)
        if (cachedCoins.length > 0) {
            console.log("Using old data because fetch failed")
            return cachedCoins
        }
        return []
    } finally {
        isFetching = false
        currentFetchPromise = null
    }
}

async function fetchData() {

    const apiKey = import.meta.env.VITE_API_KEY
    const options = {method: 'GET', headers: {'x-cg-demo-api-key': apiKey}};

    const url = new URL('https://api.coingecko.com/api/v3/coins/markets');
    url.searchParams.append('vs_currency', 'usd');
    url.searchParams.append('order', 'market_cap_desc');
    url.searchParams.append('per_page', '250'); 
    url.searchParams.append('sparkline', 'false');

    const res = await fetch(url, options)

    if (!res.ok) {
        console.error("Error while fetching", res.status)
    }

    const data = await res.json()
    const now = Date.now()

    await coin_db.transaction("rw", coin_db.coins, coin_db.meta, async () => {
        await coin_db.coins.clear()

        await coin_db.coins.bulkAdd(data.map((coin: any) => ({
            ...coin,
            lastUpdated: now
        })))

        await coin_db.meta.put({key: "last_updated", timestamp: now})
    })
    return data
}