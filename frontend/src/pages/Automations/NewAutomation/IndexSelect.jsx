import { useEffect } from "react";

/**
 * props:
 * - indexes
 * - onChange
 */
export default function IndexSelect(props) {
  useEffect(() => {
    if (props.indexes && Array.isArray(props.indexes) && props.indexes.length)
      props.onChange({ target: { id: "eval", value: props.indexes[0].eval } });
  }, [props.indexes]);

  function getOptionText(symbol, variable) {
    return /^WALLET_\d+$/.test(variable) ? `${symbol}:${variable}` : variable;
  }

  return (
    <div className="input-group input-group-merge mb-2">
      <span className="input-group-text bg-secondary">Quando</span>
      <select id="eval" className="form-select" onChange={props.onChange}>
        {props.indexes && props.indexes.length ? (
          props.indexes.map((item) => (
            <option key={`${item.symbol}:${item.variable}`} value={item.eval}>
              {getOptionText(item.symbol, item.variable)}
            </option>
          ))
        ) : (
          <option>Sem chaves</option>
        )}
      </select>
    </div>
  );
}
