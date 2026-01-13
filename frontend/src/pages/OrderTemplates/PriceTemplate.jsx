import { useState, useEffect } from "react";

/**
 * props:
 * - id
 * - text
 * - symbol
 * - price
 * - multiplier
 * - onChange
 */
export default function PriceTemplate(props) {
  const [mode, setMode] = useState("1");
  const [priceTemplate, setPriceTemplate] = useState({
    price: "",
    multiplier: "",
  });

  function onModeChange(evt) {
    props.onChange({ target: { id: props.id, value: "" } });
    setMode(evt.target.value);
  }

  useEffect(() => {
    setPriceTemplate({ price: props.price, multiplier: props.multiplier });
    setMode(!props.price || /^[0-9\.]+$/.test(props.price) ? "1" : "2");
  }, [props.price, props.multiplier]);

  return (
    <div className="form-group">
      <label htmlFor={props.id}>{props.text}</label>
      <div className="input-group">
        <select className="form-select" value={mode} onChange={onModeChange}>
          <option value="1">Por valor Fixo</option>
          <option value="2">Por valor Dinâmico</option>
        </select>

        {mode === "1" ? (
          <input
            type="number"
            className="form-control"
            id={props.id}
            onChange={props.onChange}
            placeholder="0"
            value={priceTemplate.price || "0"}
          />
        ) : (
          <>
            <select
              className="form-select"
              id={props.id}
              onChange={props.onChange}
              value={priceTemplate.price || ""}
            >
              <option value="">Selecione...</option>
              <option value="TICKER_PRICE">Preço atual do mercado</option>
              <option value="TICKER_HIGH">Maior preço do período de 24h</option>
              <option value="TICKER_LOW">Menor preço do período de 24h</option>
              <option value="LAST_ORDER_AVG">
                Preço médio da última ordem
              </option>
              <option value="LAST_ORDER_LIMIT">
                Preço limite da última ordem
              </option>
              <option value="LAST_ORDER_STOP">
                Preço stop da última ordem
              </option>
              <option value="AUTO_ORDER_AVG">Preço médio da última ordem(auto)</option>
              <option value="AUTO_ORDER_LIMIT">Preço limite da última ordem(auto)</option>
              <option value="AUTO_ORDER_STOP">Preço stop da última ordem(auto)</option>
            </select>

            <span className="input-group-text bg-secondary">X</span>

            <input
              id={props.id + "Multiplier"}
              type="number"
              className="form-control"
              onChange={props.onChange}
              placeholder="1"
              value={priceTemplate.multiplier || "1"}
            />
          </>
        )}
      </div>
    </div>
  );
}
