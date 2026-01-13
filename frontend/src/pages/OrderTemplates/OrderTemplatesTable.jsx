import OrderTemplateRow from "./OrderTemplateRow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getOrderTemplates,
  deleteOrderTemplate,
} from "../../services/OrderTemplatesService";
import Pagination from "../../components/Pagination";

export default function OrderTemplatesTable() {
  const defaultLocation = useLocation();

  const [orderTemplates, setOrderTemplates] = useState([]);
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
    setMessage("Carregando modelos de ordem...");
    getOrderTemplates(page || 1)
      .then((result) => {
        setOrderTemplates(result.rows);
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

  function onDeleteClick(event) {
    const id = event.target.id.replace("delete", "");
    deleteOrderTemplate(id)
      .then((ot) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  function translateSide(side) {
    switch (side) {
      case "BUY":
        return "COMPRA";
      case "SELL":
        return "VENDA";
      default:
        return side;
    }
  }

  return (
    <div className="card card-body border-0 shadow table-wrapper table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="border-gray-200">Par/Moeda</th>
            <th className="border-gray-200">Nome</th>
            <th className="border-gray-200">Lado</th>
            <th className="border-gray-200">Tipo</th>
            <th className="border-gray-200">Ações</th>
          </tr>
        </thead>
        <tbody>
          {!message ? (
            orderTemplates.map((ot) => {
              return (
                <OrderTemplateRow
                  key={ot.id}
                  data={{
                    ...ot,
                    side: translateSide(ot.side),
                  }}
                  onDeleteClick={onDeleteClick}
                />
              );
            })
          ) : (
            <tr>
              <td  colSpan={5}>{message}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
