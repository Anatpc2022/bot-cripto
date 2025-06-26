import { useState } from "react";
import Select from "react-select";

/**
 * props:
 * - symbol
 * - disabled
 * - onChange
 */
function SelectSymbol(props) {

    const [symbols, setSymbols] = useState([]);
    const [value, setValue] = useState("");

    function onSymbolChange(evt) {

    }

    const customStyles = {
        control: (provided) => ({
            ...provided,
            width: 220
        })
    }

    return (
        <Select
            value={value}
            isDisabled={props.disabled}
            styles={customStyles}
            onChange={onSymbolChange}
            options={symbols}
        />
    )
}

export default SelectSymbol;