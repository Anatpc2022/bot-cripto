/**
 * props:
 * - data
 */
export default function GridTable(props) {
  function getItem(condition) {
    return condition.split(" && ")[0].split(/[><]/)[1];
  }

  return (
    <div className="row">
      <div className="col-3">
        <ul className="list-group">
          <li className="list-group-item list-group-item-warning">
            Níveis de COMPRA
          </li>
          {props.data &&
            props.data.length &&
            props.data
              .filter((g) => g.side === "BUY")
              .map((g) => (
                <li key={g.id} className="list-group-item">
                  {getItem(g.condition)}
                </li>
              ))}
        </ul>
      </div>
      <div className="col-3">
        <ul className="list-group">
          <li className="list-group-item list-group-item-success">
            Níveis de VENDA
          </li>
          {props.data &&
            props.data.length &&
            props.data
              .filter((g) => g.side === "SELL")
              .map((g) => (
                <li key={g.id} className="list-group-item">
                  {getItem(g.condition)}
                </li>
              ))}
        </ul>
      </div>
    </div>
  );
}
