import Dexie from "dexie";

const fav_db = new Dexie("Favourites")

fav_db.version(1).stores({
    favourites: "++id, coinID"
})

export {fav_db}