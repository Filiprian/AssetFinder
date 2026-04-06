import Dexie from "dexie";

const fav_db = new Dexie("Favourites")

fav_db.version(1).stores({
    favourites: "++id, coinID"
})

const coin_db = new Dexie("Coins")

coin_db.version(1).stores({
    coins: "++id, symbol, name, current_price, market_cap, image, coinID",
    meta: "key" // Stores metadata like last_updated
})

export {fav_db}
export {coin_db}