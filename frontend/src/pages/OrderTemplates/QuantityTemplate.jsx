import { useState, useEffect } from "react";

/**
 * props:
 * - id
 * - text
 * - quantity
 * - multiplier
 * - onChange
 */
export default function QuantityTemplate(props) {
  const [mode, setMode] = useState("1");
  const [quantityTemplate, setQuantityTemplate] = useState({
    quantity: "",
    multiplier: "",
  });

  function onModeChange(evt) {
    props.onChange({ target: { id: props.id, value: "" } });
    setMode(evt.target.value);
  }

  useEffect(() => {
    setQuantityTemplate({
      quantity: props.quantity,
      multiplier: props.multiplier,
    });
    setMode(!props.quantity || /^[0-9\.]+$/.test(props.quantity) ? "1" : "2");
  }, [props.quantity, props.multiplier]);

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
            id={props.id}
            type="number"
            className="form-control"
            onChange={props.onChange}
            placeholder="0"
            value={quantityTemplate.quantity || "0"}
          />
        ) : (
          <>
            <select
              className="form-select"
              id={props.id}
              onChange={props.onChange}
              value={quantityTemplate.quantity || ""}
            >
              <option value="">Selecione...</option>
              <option value="AUTO_ORDER_QTY">Quantidade da última ordem (auto)</option>
              <option value="LAST_ORDER_QTY">Quantidade da última ordem</option>
              <option value="MIN_NOTIONAL">Valor mínimo permitido</option>
              <option value="MAX_WALLET">Usar saldo disponível</option>
              <option value="QUOTE_QTY">Quantidade pelo valor gasto</option>
            </select>

            <span className="input-group-text bg-secondary">X</span>
            <input
              id={props.id + "Multiplier"}
              type="number"
              className="form-control"
              onChange={props.onChange}
              placeholder="1"
              value={quantityTemplate.multiplier || "1"}
            />
          </>
        )}
      </div>
    </div>
  );
}
