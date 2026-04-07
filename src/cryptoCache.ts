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

    const urlUSD = new URL('https://api.coingecko.com/api/v3/coins/markets');
    urlUSD.searchParams.append('vs_currency', 'usd');
    urlUSD.searchParams.append('order', 'market_cap_desc');
    urlUSD.searchParams.append('per_page', '250'); 
    urlUSD.searchParams.append('sparkline', 'false');

    const urlEUR = new URL('https://api.coingecko.com/api/v3/coins/markets');
    urlEUR.searchParams.append('vs_currency', 'eur');
    urlEUR.searchParams.append('order', 'market_cap_desc');
    urlEUR.searchParams.append('per_page', '250'); 
    urlEUR.searchParams.append('sparkline', 'false');

    // Process both urls
    const [usdRes, eurRes] = await Promise.all([
        fetch(urlUSD, options),
        fetch(urlEUR, options)
    ]);
    if (!usdRes.ok || !eurRes.ok) {
        console.error(`❌ API Error: USD ${usdRes.status}, EUR ${usdRes.status}`);
    }
    const [usdData, eurData] = await Promise.all([
        usdRes.json(),
        eurRes.json()
    ]);

    // Merge them
    const mergedData = usdData.map((usdCoin: { id: any; current_price: any; market_cap: any; }) => {
        const eurCoin = eurData.find((e: { id: any; }) => e.id === usdCoin.id);
        return {
            ...usdCoin,
            current_price: {
                usd: usdCoin.current_price,
                eur: eurCoin?.current_price
            },
            market_cap: {
                usd: usdCoin.market_cap,
                eur: eurCoin?.market_cap
            }
        };
    });


    const now = Date.now()

    await coin_db.transaction("rw", coin_db.coins, coin_db.meta, async () => {
        await coin_db.coins.clear()
        await coin_db.coins.bulkAdd(mergedData.map((coin: any) => ({
            ...coin,
            lastUpdated: now
        })))

        await coin_db.meta.put({key: "last_updated", timestamp: now})
    })
    return mergedData
}