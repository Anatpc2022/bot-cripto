import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormPage from "../FormPage";
import { getOrder } from "../../services/OrdersService";
import { ORDER_STATUS } from "../../services/ExchangeService";

const translations = {
  status: {
    NEW: "Nova",
    FILLED: "Concluída",
    PARTIALLY_FILLED: "Parc/Concluída",
    CANCELED: "Cancelada",
    REJECTED: "Rejeitada",
    EXPIRED: "Expirada",
  },
  side: {
    BUY: "Compra",
    SELL: "Venda",
  },
};

function translate(category, value) {
  return translations[category]?.[value] || value;
}

function ViewOrder() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [order, setOrder] = useState({});

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return navigate("/orders");
    getOrder(id)
      .then((order) => setOrder(order))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setError(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, []);

  function getStatusClass(status) {
    switch (status) {
      case ORDER_STATUS.PARTIALLY_FILLED:
        return "badge bg-info";
      case ORDER_STATUS.FILLED:
        return "badge bg-success";
      case ORDER_STATUS.EXPIRED:
      case ORDER_STATUS.REJECTED:
      case ORDER_STATUS.CANCELED:
        return "badge bg-danger";
      default:
        return "badge bg-primary";
    }
  }

  function getDate(timestamp) {
    if (!timestamp) return "";

    const time = Number(timestamp);
    if (isNaN(time)) return "";

    const date = new Date(time);
    if (isNaN(date.getTime())) return "";

    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "medium",
      timeStyle: "medium",
    }).format(date);
  }

  return (
    <FormPage title="Detalhes da Ordem">
      <div className="row mb-3">
        <div className="col-3">
          <b>Par/Moeda:</b> {order.symbol}
        </div>
        <div className="col-3">
          <span className={getStatusClass(order.status)}>
            {translate("status", order.status)}
          </span>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <b>RiberBot ID da Ordem:</b> {order.id}
        </div>
        {order.automationId ? (
          <div className="col-3">
            <b>Automação:</b> {order.automation.name}
          </div>
        ) : (
          <></>
        )}
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <b>Binance ID da Ordem:</b> {order.orderId}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <b>Data:</b> {getDate(order.transactTime)}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <b>Lado:</b> {translate("side", order.side)}
        </div>
        <div className="col-3">
          <b>Tipo:</b> {order.type}
        </div>
      </div>
    </FormPage>
  );
}

export default ViewOrder;
