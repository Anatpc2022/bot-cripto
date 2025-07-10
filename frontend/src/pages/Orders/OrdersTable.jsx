import OrderRow from "./OrderRow";
import { useState, useEffect } from "react";
import { getOrders } from "../../services/OrdersService";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    getOrders()
      .then((result) => {
        setOrders(result.rows);
      })
      .catch((err) => console.error(err));
  }, []);

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
          {orders ? (
            orders.map((order) => <OrderRow key={order.id} data={order} />)
          ) : (
            <tr>
              <td colSpan={6}>No orders found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
