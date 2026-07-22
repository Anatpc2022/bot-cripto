/**
 * props:
 * - data
 */
export default function AutomationReport(props) {
  return (
    <div className="col-12">
      <div className="card border-0 shadow">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <h2 className="fs-5 fw-bold mb-0">Automações</h2>
            </div>
          </div>
        </div>
        <div className="table-responsive divScroll">
          <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
            <thead className="thead-light">
              <tr>
                <th className="border-bottom" scope="col">
                  NOME
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  EXECUÇÕES
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  VALOR
                </th>
              </tr>
            </thead>
            <tbody>
              {props.data &&
                props.data.map((item) => (
                  <tr key={item.id}>
                    <td className="text-gray-900">{item.name}</td>
                    <td className="text-gray-900 text-center">{item.executions}</td>
                    <td className="text-gray-900 text-center">{item.net.toFixed(2)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
