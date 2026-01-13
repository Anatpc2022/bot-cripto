import { useState, useEffect } from "react";
import { getAllOrderTemplates } from "../../../services/OrderTemplatesService";

/**
 * props:
 * - id
 * - symbol
 * - onChange
 * - value
 */
export default function SelectOrderTemplate(props) {
  const [orderTemplates, setOrderTemplates] = useState([]);

  useEffect(() => {
    if (!props.symbol) return;
    getAllOrderTemplates(props.symbol)
      .then((result) => setOrderTemplates(result))
      .catch((err) => console.error(err.response ? err.response.data : err));
  }, [props.symbol]);

  return (
    <select
      id={props.id}
      className="form-select"
      onChange={props.onChange}
      value={props.value || "0"}
    >
      <option value="0">Selecione um...</option>
      {orderTemplates.map((ot) => (
        <option value={ot.id} key={ot.id}>
          {ot.name}
        </option>
      ))}
    </select>
  );
}
