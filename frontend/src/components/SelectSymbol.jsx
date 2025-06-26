import { useState, useEffect } from "react";
import Select from "react-select";
import { getSymbols } from "../services/SymbolsService";

/**
 * props:
 * - symbol
 * - disabled
 * - onChange
 */
function SelectSymbol(props) {
  const [symbols, setSymbols] = useState([]);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue({ value: props.symbol, label: props.symbol });
  }, [props.symbol]);

  useEffect(() => {
    getSymbols().then((symbolObjects) => {
      const symbolNames = symbolObjects.map((s) => s.symbol).sort();
      setSymbols(
        symbolNames.map((s) => {
          return {
            value: s,
            label: s,
          };
        })
      );
    });
  }, []);

  function onSymbolChange(evt) {
    props.onChange({ target: { id: "symbol", value: evt.value } });
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 220,
    }),
  };

  return (
    <Select
      value={value}
      isDisabled={props.disabled}
      styles={customStyles}
      onChange={onSymbolChange}
      options={symbols}
    />
  );
}

export default SelectSymbol;
