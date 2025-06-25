/**
 * props:
 * - id
 * - data
 * - type
 * - disabled
 * - onChange
 */
export default function MemoryInput(props) {
const labels = {
  averagePrice: "Preço Médio",
  bestAsk: "Melhor Venda",
  bestAskQty: "Qtd. Venda",
  bestBid: "Melhor Compra",
  bestBidQty: "Qtd. Compra",
  close: "Fechamento",
  closeQty: "Qtd. Fechamento",
  high: "Máximo",
  low: "Mínimo",
  balance: "Saldo",
  open: "Abertura",
  percentChange: "% Preço",
  prevClose: "Fech. Anterior",
  priceChange: "Var. Preço",
  quoteVolume: "Vol. Cotado",
  volume: "Volume",
};


    return (
        <div className="row mb-3">
            <div className="col-4 ms-3">
                {labels[props.id] || props.id}
            </div>
            <div className="col-6">
                <input
                    type={props.type || "text"}
                    id={props.id}
                    disabled={props.disabled}
                    className="form-control form-control-sm"
                    onChange={props.onChange}
                    value={props.data || ""}
                />
            </div>
        </div>
    );
}
