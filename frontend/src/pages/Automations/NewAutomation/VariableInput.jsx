import { useState, useEffect } from "react";
import Select from "react-select/creatable";

/**
 * props:
 * - symbol
 * - selectedIndex
 * - indexes
 * - onAddClick
 */
export default function VariableInput(props) {
  const [index, setIndex] = useState({});
  const [variable, setVariable] = useState("");
  const [operator, setOperator] = useState("==");
  const [option, setOption] = useState({
    label: "Digite ou selecione...",
    value: "",
  });

  useEffect(() => {
    setIndex(props.selectedIndex);
    setVariable(props.selectedIndex.example);
  }, [props.selectedIndex]);

  function onOperatorChange(event) {
    setOperator(event.target.value);
  }

  function onVariableChange(event) {}

  function getVariables() {}

  function onAddClick() {}

  const customStyles = {
    control: (baseStyles, state) => ({
      ...baseStyles,
      width: "100%",
      border: 0,
      paddingRight: 5,
    }),
  };

  return (
    <div className="input-group input-group-merge mb-2">
      <span className="input-group-text bg-secondary">é</span>
      <select
        id="operator"
        className="form-select"
        onChange={onOperatorChange}
        value={operator}
      >
        {typeof index.example === "number" ? (
          <>
            <option value=">">maior que</option>
            <option value=">=">maior ou igual</option>
            <option value="<">menor que</option>
            <option value="<=">menor ou igual</option>
          </>
        ) : (
          <></>
        )}
        <option value="==">igual</option>
        <option value="!=">não é igual</option>
      </select>
      <Select
        id="variable"
        className="form-control"
        value={option}
        isDisabled={false}
        styles={customStyles}
        onChange={onVariableChange}
        options={
          props.indexes && Array.isArray(props.indexes)
            ? getVariables()
            : { label: "NO OPTIONS", value: "" }
        }
      />
      <button type="button" className="btn btn-secondary" onClick={onAddClick}>
        <svg
          className="icon icon-xs"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
