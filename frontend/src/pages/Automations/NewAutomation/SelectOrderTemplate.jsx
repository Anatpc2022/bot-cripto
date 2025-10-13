/**
 * props:
 * - id
 * - symbol
 * - onChange
 * - value
 */
export default function SelectOrderTemplate(props) {
  return (
    <select
      id={props.id}
      className="form-select"
      onChange={props.onChange}
      value={props.value || "0"}
    >
      <option value="0">Selecione um...</option>
    </select>
  );
}
