import { useState, useEffect } from "react";
import { getSymbol } from "../services/SymbolsService";

/**
 * props:
 * - text
 * - symbol
 * - quantity
 * - isQuote
 * - allowQuote
 * - onChange
 */
export default function QuantityInput(props) {
  const [symbol, setSymbol] = useState({ base: "", quote: "" });

  useEffect(() => {
    if (!props.symbol) return;

    getSymbol(props.symbol)
      .then((symbolObj) => setSymbol(symbolObj))
      .catch((err) => console.error(err.response ? err.response.data : err));
  }, [props.symbol]);

  function isQuote() {
    return props.isQuote || props.isQuote === "true";
  }

  function btnQuoteClick() {
    props.onChange({ target: { id: "isQuote", value: !props.isQuote } });
  }

  return (
    <div className="form-group">
      <label htmlFor="quantity">{props.text || "Quantidade:"}</label>
      <div className="input-group">
        {props.allowQuote && symbol && symbol.base ? (
          <button
            type="button"
            className="btn btn-secondary d-inline-flex align-items-center"
            onClick={btnQuoteClick}
          >
            {isQuote() ? symbol.quote : symbol.base}
          </button>
        ) : (
          <></>
        )}
        <input
          id="quantity"
          type="number"
          value={props.quantity || ""}
          className="form-control"
          placeholder="0"
          onChange={props.onChange}
        />
      </div>
    </div>
  );
}
