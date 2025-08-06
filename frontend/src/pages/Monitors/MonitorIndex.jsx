/**
 * props:
 * - indexes
 * - onChange
 */
export default function MonitorIndex(props) {
  return (
    <>
      <div className="row mb-3">
        <div className="form-group">
          <label>Indicadores:</label>
          <div className="input-group input-group-merge">
            <select id="index" className="form-select">
              <option>Nenhum</option>
            </select>
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
