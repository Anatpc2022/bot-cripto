//import OrderRow from "./OrderRow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
//import { getOrders } from "../../services/OrdersService";
import Pagination from "../../components/Pagination";

export default function MonitorsTable() {
  const defaultLocation = useLocation();

  const [monitors, setMonitors] = useState([]);
  const [page, setPage] = useState(getPage());
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  function getPage(location) {
    if (!location) location = defaultLocation;
    return new URLSearchParams(location.search).get("page");
  }

  useEffect(() => {
    setPage(getPage(defaultLocation));
  }, [defaultLocation]);

  useEffect(() => {
    setMessage("Carregando Monitores...");
    // getOrders(page || 1)
    //     .then(result => {
    //         setMonitors(result.rows);
    //         setCount(result.count);
    //         setMessage("");
    //     })
    //     .catch(err => {
    //         console.error(err.response ? err.response.data : err);
    //         setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
    //     });
  }, [page]);

  return (
    <div className="card card-body border-0 shadow table-wrapper table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="border-gray-200">Tipo</th>
            <th className="border-gray-200">Par/Moeda</th>
            <th className="border-gray-200">Ativar</th>
            <th className="border-gray-200">Ações</th>
          </tr>
        </thead>
        <tbody>
          {!page || page === 1 ? (
            <>
              <tr>
                <td>TICKER</td>
                <td>*</td>
                <td>
                  <span className="text-success">EXECUTANDO</span>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>USER_DATA</td>
                <td>*</td>
                <td>
                  <span className="text-success">EXECUTANDO</span>
                </td>
                <td></td>
              </tr>
            </>
          ) : (
            <></>
          )}
          {!message ? (
            monitors.map((monitor) => <div>{JSON.stringify(monitor)}</div>)
          ) : (
            <tr>
              <td colSpan={4}>{message}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
