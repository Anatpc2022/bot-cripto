import OrderRow from "./OrderRow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getOrders } from "../../services/OrdersService";
import Pagination from "../../components/Pagination";

export default function OrdersTable() {
  const defaultLocation = useLocation();
  const [orders, setOrders] = useState([]);
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
    setPage(getPage(defaultLocation));
  }, [defaultLocation]);

  useEffect(() => {
    setMessage("Carregando Ordens...");
    getOrders(page || 1)
      .then((result) => {
        setOrders(result.rows);
        setCount(result.count);
        setMessage("");
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, [page]);

  return (
    <div className="card card-body border-0 shadow table-wrapper table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="border-gray-200">Ordem</th>
            <th className="border-gray-200">Data</th>
            <th className="border-gray-200">Qtd</th>
            <th className="border-gray-200">Val/Líquido</th>
            <th className="border-gray-200">Status</th>
            <th className="border-gray-200">Ver</th>
          </tr>
        </thead>
        <tbody>
          {!message ? (
            orders.map((order) => <OrderRow key={order.id} data={order} />)
          ) : (
            <tr>
              <td colSpan={6}>{message}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
