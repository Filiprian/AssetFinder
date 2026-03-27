interface CoinProps {
    data: any
    handleCoinSelect: (id: string) => void
}

export default function Coin({data, handleCoinSelect}: CoinProps) {

    const coin = data
    const handleClick = () => {
        handleCoinSelect(coin.id)
    }

    return (
        <div className="flex m-1 p-2.5 justify-left items-center border border-gray-500 rounded-2xl cursor-pointer w-50"
            onClick={handleClick}>
            <img className="w-8 h-8 mr-3" src={coin.image} alt={coin.id}/>
            <div className="flex">
                <div>
                    <h2 className="text-amber-400 text-xl font-bold text-left">{coin.symbol?.toUpperCase() || "N/A"}</h2>
                    <h2>{coin.current_price || "N/A"} USD </h2>
                </div>
            </div>
        </div>
    )
}