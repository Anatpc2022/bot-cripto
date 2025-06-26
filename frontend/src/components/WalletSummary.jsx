import { useState, useEffect } from "react"
import { getSymbol } from "../services/SymbolsService";
import { getBalance } from "../services/ExchangeService";

/**
 * props:
 * - symbol
 */
export default function WalletSummary(props) {

    const [wallet, setWallet] = useState({ base: { coin: "", qty: "0" }, quote: { coin: "", qty: "0" } });

    async function loadWalletSummary(symbolObj) {
        try {
            const balances = await getBalance();
            setWallet({
                base: { qty: balances[symbolObj.base].available, coin: symbolObj.base },
                quote: { qty: balances[symbolObj.quote].available, coin: symbolObj.quote }
            })
        }
        catch (err) {
            console.error(err.response ? err.response.data : err);
        }
    }

    useEffect(() => {
        if (!props.symbol) return;
        getSymbol(props.symbol)
            .then(symbolObj => loadWalletSummary(symbolObj))
            .catch(err => console.error(err.response ? err.response.data : err));
    }, [props.symbol])

    return (
        <div className="row mb-3">
            <div className="col-6">
                <div className="form-group">
                    <div className="alert alert-success py-1">
                        {`${wallet.base.coin}:${wallet.base.qty.substring(0, 10)}`}
                    </div>
                </div>
            </div>
            <div className="col-6">
                <div className="form-group">
                    <div className="alert alert-info py-1">
                        {`${wallet.quote.coin}:${wallet.quote.qty.substring(0, 10)}`}
                    </div>
                </div>
            </div>
        </div>
    )
}