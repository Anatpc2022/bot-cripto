import { useState } from "react";
import MemoryForm from "./MemoryForm";
import Select from "react-select";

/**
 * props:
 * - data
 */
function RiberBotTest(props) {
  const [select, setSelect] = useState("");
  const [index, setIndex] = useState("");
  const [indexValue, setIndexValue] = useState({});

  function onIndexChange(evt) {
    setSelect({ label: evt.value, value: evt.value });
    setIndex(evt.value);
    setIndexValue(props.data[evt.value]);
  }

  function btnUpdateClick() {
    console.log(indexValue);
  }

  function onIndexValueChange(hasCurrent, evt) {
    const value = /^[\d\.\,]+$/.test(evt.target.value)
      ? parseFloat(evt.target.value)
      : evt.target.value;
    if (!hasCurrent) {
      if (typeof indexValue === "object")
        setIndexValue((prevState) => ({
          ...prevState,
          [evt.target.id]: value,
        }));
      else setIndexValue(value);
    } else {
      const currentValue = { ...indexValue.current };
      currentValue[evt.target.id] = value;
      setIndexValue({ previous: indexValue.previous, current: currentValue });
    }
  }

  const customStyles = {
    control: (provided) => ({
      ...provided,
      width: 300,
    }),
  };
  return (
    <>
      {" "}
      <div className="row">
        <div className="row mb-3 pt-3">
          <Select
            value={select}
            styles={customStyles}
            onChange={onIndexChange}
            options={Object.keys(props.data).map((item) => {
              return { label: item, value: item };
            })}
          />
        </div>
      </div>
      <div
        className="mb-3"
        style={{ overflow: "auto", overflowX: "hidden", maxHeight: 500 }}
      >
        <div className="row mb-3">
          {indexValue && indexValue.previous ? (
            <div className="col-6">
              <h1 className="h5 mb-3">Valor Anterior:</h1>
              <MemoryForm disabled={true} data={props.data[index].previous} />
            </div>
          ) : (
            <></>
          )}
          {index ? (
            <div className="col-6">
              <h1 className="h5 mb-3">Valor Atual:</h1>
              {indexValue.current ? (
                <MemoryForm
                  id={index}
                  disabled={false}
                  data={indexValue.current}
                  onChange={(evt) => onIndexValueChange(true, evt)}
                />
              ) : (
                <MemoryForm
                  id={index}
                  disabled={false}
                  data={indexValue}
                  onChange={(evt) => onIndexValueChange(false, evt)}
                />
              )}
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={btnUpdateClick}
          >
            Atualizar Memória
          </button>
        </div>
      </div>
    </>
  );
}

export default RiberBotTest;
