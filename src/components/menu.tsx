import { useState } from "react";


export default function Menu() {

    const [darkMode, setDarkMode] = useState(false);
    const [currency, setCurrency] = useState("usd");


    return (
        <menu className="flex gap-5">
            <h1 className="text-4xl font-bold">AssetFinder</h1>
            <div className="flex gap-2.5">
                <label>Dark Mode</label>
                <input type="checkbox" checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
            </div>
            <div className="flex gap-2.5">
                <label>Currency:</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                    <option value="usd">USD</option>
                    <option value="eur">EUR</option>
                </select>
            </div>
        </menu>
    );
}