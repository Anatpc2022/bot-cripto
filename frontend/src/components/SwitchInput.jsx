/**
 * props:
 * - id
 * - text
 * - isChecked
 * - onChange
 */
export default function SwitchInput(props) {
  function onChange(event) {
    props.onChange({ target: { id: props.id, value: event.target.checked } });
  }

  return (
    <div className="form-check form-switch">
      <input
        type="checkbox"
        className="form-check-input"
        id={props.id}
        onChange={onChange}
        checked={props.isChecked}
      />
      <label htmlFor={props.id} className="form-check-label">
        {props.text}
      </label>
    </div>
  );
}
