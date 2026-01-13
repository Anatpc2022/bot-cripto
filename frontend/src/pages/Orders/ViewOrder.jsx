import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import FormPage from "../FormPage";
import { cancelOrder, getOrder, syncOrder } from "../../services/OrdersService";
import { ORDER_STATUS, FINISHED_STATUS } from "../../services/ExchangeService";

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

  function btnSyncClick() {
    syncOrder(order.id)
      .then((result) => setOrder(result))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setError(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  function btnCancelClick() {
    cancelOrder(order.symbol, order.orderId)
      .then((result) => setOrder(result))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setError(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
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
      <div className="row mb-3">
        <div className="col-3">
          <b>Quantidade:</b> {order.quantity}
        </div>
        {order.limitPrice ? (
          <div className="col-3">
            <b>Limit Price:</b> {order.limitPrice}
          </div>
        ) : (
          <></>
        )}
      </div>
      {order.stopPrice || order.trailingDelta ? (
        <div className="row mb-3">
          {order.stopPrice ? (
            <div className="col-3">
              <b>Stop Price:</b> {order.stopPrice}
            </div>
          ) : (
            <></>
          )}
          {order.trailingDelta ? (
            <div className="col-3">
              <b>Trailing Delta:</b> {order.trailingDelta} (
              {order.trailingDelta / 100}%)
            </div>
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
      {order.avgPrice ? (
        <div className="row mb-3">
          <div className="col-3">
            <b>Preço médio:</b> {order.avgPrice}
          </div>
        </div>
      ) : (
        <></>
      )}
      {order.status === ORDER_STATUS.FILLED ? (
        <div className="row mb-3">
          <div className="col-3">
            <b>Comissão:</b> {order.commission}
          </div>
          <div className="col-3">
            <b>Val/Líquido:</b> {order.net}
          </div>
        </div>
      ) : (
        <></>
      )}
      {order.obs ? (
        <div className="row mb-3">
          <div className="col-12">
            <b>Obs.:</b> {order.obs}
          </div>
        </div>
      ) : (
        <></>
      )}
      {error ? (
        <div className="alert alert-danger mt-1 col-12 py-1">{error}</div>
      ) : (
        <></>
      )}
      <div className="row">
        <div className="col-4">
          {FINISHED_STATUS.includes(order.status) ? (
            <></>
          ) : (
            <button
              type="button"
              className="btn btn-info me-2"
              onClick={btnSyncClick}
            >
              <svg
                className="icon icon-xs me-1"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99"
                ></path>
              </svg>
              Sincronizar
            </button>
          )}
          {order.status === ORDER_STATUS.NEW ? (
            <button
              type="button"
              className="btn btn-danger me-2"
              onClick={btnCancelClick}
            >
              <svg
                className="icon icon-xs me-1"
                fill="none"
                strokeWidth="1.5"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                ></path>
              </svg>
              Cancelar
            </button>
          ) : (
            <></>
          )}
        </div>
      </div>
    </FormPage>
  );
}

export default ViewOrder;
