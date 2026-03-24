interface CoinProps {
    data: any
}

export default function Coin(data: CoinProps) {

    const coin = data.data

    return (
        <div>
            <img src={coin.image}/>
            <div>
                <div>
                    <h2>{coin.id}</h2>
                    <h2>{coin.symbol}</h2>
                </div>
                <h2>{coin.current_price} USD</h2>
            </div>
        </div>
    )
}