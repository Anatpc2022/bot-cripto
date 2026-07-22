import { useState } from "react";

/**
 * props:
 * - onClick
 */
export default function DateFilter(props) {
  const [filter, setFilter] = useState({});

  function parseDate(str) {
    const split = str.split("/");
    return new Date(`${split[1]}/${split[0]}/${split[2]}`);
  }

  function btnFilterClick() {
    const startDate = parseDate(filter.startDate);
    const endDate = parseDate(filter.endDate);
    props.onClick({ startDate, endDate });
  }

  function onInputChange(evt) {
    let value = evt.target.value;

    const chars = value.split("");
    const lastChar = chars[chars.length - 1];
    if (value.length === 3 && !value.endsWith("/"))
      value = value.substring(0, 2) + "/" + lastChar;
    else if (value.length === 6 && !value.endsWith("/"))
      value = value.substring(0, 5) + "/" + lastChar;
    else if (value.length >= 10) value = value.substring(0, 10);

    setFilter((prevState) => ({ ...prevState, [evt.target.id]: value }));
  }

  return (
    <div className="input-group input-group-merge">
      <span className="input-group-text">
        <svg
          className="icon icon-xs"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
          ></path>
        </svg>
      </span>
      <input
        type="text"
        placeholder="dd/mm/yyyy"
        id="startDate"
        className="form-control"
        onChange={onInputChange}
        value={filter.startDate}
      />
      <input
        type="text"
        placeholder="dd/mm/yyyy"
        id="endDate"
        className="form-control"
        onChange={onInputChange}
        value={filter.endDate}
      />
      <button
        type="button"
        className="btn btn-primary"
        onClick={btnFilterClick}
      >
        <svg
          className="icon icon-xs"
          fill="none"
          strokeWidth="1.5"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
          ></path>
        </svg>
      </button>
    </div>
  );
}
