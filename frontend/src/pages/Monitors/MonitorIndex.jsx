import { useEffect, useState } from "react";
import { getAnalysisIndexes } from "../../services/RiberBotService";

/**
 * props:
 * - indexes
 * - onChange
 */
export default function MonitorIndex(props) {
  const [analysis, setAnalysis] = useState({});
  const [indexes, setIndexes] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState({});

  useEffect(() => {
    getAnalysisIndexes()
      .then((result) => setAnalysis(result))
      .catch((err) => console.error(err.response ? err.response.data : err));
  }, []);

  function onIndexChange(event) {
    if (event.target.value === "NONE") return setSelectedIndex({});

    const index = analysis[event.target.value];
    setSelectedIndex({
      index: event.target.value,
      params: index.params,
    });
  }
  return (
    <>
      <div className="row mb-3">
        <div className="form-group">
          <label>Indicadores:</label>
          <div className="input-group input-group-merge">
            <select id="index" className="form-select" onChange={onIndexChange}>
              <option value="NONE">Nenhum</option>
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
            />
            <button type="button" className="btn btn-secondary">
              <svg
                className="icon icon-xs"
                fill="none"
                stroke-width="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                ></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
