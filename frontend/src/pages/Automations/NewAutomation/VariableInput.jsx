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

  function getValueExpression(value) {
    const firstDotIndex = value.indexOf(".");
    return value.substring(firstDotIndex + 1);
  }

  function onVariableChange(option) {
    const value = option.value;
    setOption(option);

    const index = props.indexes.find((ix) => value.endsWith(ix.variable));
    if (index && value.indexOf("WALLET_") === -1) setVariable(index.eval);
    else if (/[\+\-\*\/]/.test(value))
      setVariable(
        `(MEMORY['${props.symbol}:${value.split(".")[0]}'].${getValueExpression(
          value
        )})`
      );
    else setVariable(value);
  }

  function getOptionText(symbol, variable) {
    return variable.startsWith("WALLET_") ? `${symbol}:${variable}` : variable;
  }

  function getVariables() {
    let options = [];
    if (props.indexes && Array.isArray(props.indexes)) {
      options = props.indexes
        .filter((ix) => ix.eval !== index.eval)
        .map((item) => {
          return {
            label: getOptionText(item.symbol, item.variable),
            value: getOptionText(item.symbol, item.variable),
          };
        });
    }

    const userId = localStorage.getItem("id");
    options.push(
      ...[
        {
          value: getOptionText(
            props.symbol,
            `LAST_ORDER_${userId}.avgPrice*1.01`
          ),
          label: `LAST_ORDER_${userId}.avgPrice + 1%`,
        },
        {
          value: getOptionText(
            props.symbol,
            `LAST_ORDER_${userId}.avgPrice*0.95`
          ),
          label: `LAST_ORDER_${userId}.avgPrice - 5%`,
        },
        {
          value: getOptionText(props.symbol, `TICKER.current.open*1.1`),
          label: `TICKER.open + 10%`,
        },
      ]
    );

    return options;
  }

  function getExpressionText() {
    const value =
      typeof index.example === "string" ? `'${variable}'` : variable;
    return `${index.symbol}:${index.variable} ${operator.replace(
      "==",
      "="
    )} ${value}`;
  }

  function onAddClick() {
    const value =
      typeof index.example === "string" ? `'${variable}'` : variable;
    const condition = {
      eval: `${index.eval}${operator}${value}`,
      text: getExpressionText(),
    };
    props.onAddClick({ target: { id: "condition", value: condition } });

    setOperator("==");
    setVariable("");
  }

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
