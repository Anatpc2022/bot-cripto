import { useEffect, useState } from "react";
import { getAnalysisIndexes } from "../../services/RiberBotService";
import SmartBadge from "../../components/SmartBadge";

/**
 * props:
 * - indexes
 * - onChange
 */
export default function MonitorIndex(props) {
  const [analysis, setAnalysis] = useState({});
  const [indexes, setIndexes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState({
    index: "NONE",
    value: "",
    params: "",
  });

  useEffect(() => {
    getAnalysisIndexes()
      .then((result) => setAnalysis(result))
      .catch((err) => console.error(err.response ? err.response.data : err));
  }, []);

  useEffect(() => {
    setIndexes(
      props.indexes ? props.indexes.split(",").filter((ix) => ix) : [],
    );
  }, [props.indexes]);

  function onIndexChange(event) {
    if (event.target.value === "NONE")
      return setSelectedIndex({ index: "NONE", value: "" });

    const index = analysis[event.target.value];
    setSelectedIndex({
      index: event.target.value,
      params: index.params,
    });
  }

  function btnRemoveIndex(event) {
    const id = event.target.id.replace("ix", "");
    const pos = indexes.findIndex((ix) => ix === id);
    indexes.splice(pos, 1);
    setIndexes(indexes);
    props.onChange({ target: { id: "indexes", value: indexes.join(",") } });
  }

  function onAddIndexClick() {
    if (selectedIndex === "NONE") return;
    const params = selectedIndex.value
      ? "_" + selectedIndex.value.replaceAll(",", "_")
      : "";
    indexes.push(selectedIndex.index + params);
    setIndexes(indexes);
    props.onChange({ target: { id: "indexes", value: indexes.join(",") } });

    setSelectedIndex({ index: "NONE", value: "" });
  }

  function onSelectedIndexChange(event) {
    setSelectedIndex((prevState) => ({
      ...prevState,
      value: event.target.value,
    }));
  }

  return (
    <>
      <div className="row mb-3">
        <div className="form-group">
          <label>Indexes:</label>
          <div className="input-group input-group-merge">
            <select
              id="index"
              className="form-select"
              onChange={onIndexChange}
              value={selectedIndex.index}
            >
              <option value="NONE">None</option>
              {Object.keys(analysis)
                .sort((a, b) => (a > b ? 1 : -1))
                .map((k) => (
                  <option key={k} value={k}>
                    {analysis[k].name}
                  </option>
                ))}
            </select>
            <input
              type="text"
              className={selectedIndex.params ? "form-control" : "d-none"}
              placeholder={selectedIndex.params}
              value={selectedIndex.value}
              onChange={onSelectedIndexChange}
            />
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onAddIndexClick}
            >
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
        </div>
      </div>
      <div className="divScrollBadges">
        <div className="d-inline-flex align-content-start">
          {indexes &&
            indexes.map((ix) => (
              <SmartBadge
                key={ix}
                id={"ix" + ix}
                text={ix}
                onClick={btnRemoveIndex}
              />
            ))}
        </div>
      </div>
    </>
  );
}
