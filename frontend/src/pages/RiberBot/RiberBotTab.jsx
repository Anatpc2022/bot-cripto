import { useState, useEffect } from "react";

/**
 * props:
 * - id
 * - data
 * - hasSearch
 */
function RiberBotTab(props) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);

  useEffect(() => {
    if (!props.data) return;

    let arr = Object.entries(props.data).map((prop) => {
      return {
        key: prop[0],
        value: prop[1],
      };
    });

    if (search) arr = arr.filter((item) => item.key.indexOf(search) !== -1);

    arr.sort((a, b) => {
      if (a.key > b.key) return 1;
      if (a.key < b.key) return -1;
      return 0;
    });

    setData(arr);
  }, [props.data, search]);

  function onSearchChange(evt) {
    setSearch(evt.target.value.toUpperCase());
  }

  return (
    <>
      {props.hasSearch ? (
        <div className="row">
          <div className="col-3 my-3">
            <div className="form-group">
              <label htmlFor="search">Procurar:</label>
              <input
                type="text"
                id="search"
                className="form-control"
                value={search}
                onChange={onSearchChange}
              />
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="table-responsive divScrollRiberBot">
        <table className="table table-flush table-sm table-hover">
          <thead>
            <tr>
              <th className="border-gray-200">Chave</th>
              <th className="border-gray-200">Valor</th>
            </tr>
          </thead>
          <tbody>
            {data.map((obj) => (
              <tr key={props.id + obj.key}>
                <td>{obj.key}</td>
                <td>{JSON.stringify(obj.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default RiberBotTab;
