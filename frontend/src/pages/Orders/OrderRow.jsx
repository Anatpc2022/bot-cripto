import { ORDER_STATUS } from "../../services/ExchangeService";

/**
 * props:
 * - data
 */
export default function OrderRow(props) {
  function getDate(timestamp) {
    if(!timestamp) return "";
    const date = new Date(Number(timestamp));
    return new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "short",
    }).format(date);
  }

  function getStatus(status) {
    const statusTranslations = {
      NEW: "Nova",
      FILLED: "Concluída",
      PARTIALLY_FILLED: "Parc/Concluída",
      EXPIRED: "Expirada",
      CANCELED: "Cancelada",
      REJECTED: "Rejeitada",
    };

    const statusColors = {
      NEW: "bg-warning",
      FILLED: "bg-success",
      PARTIALLY_FILLED: "bg-info",
      EXPIRED: "bg-danger",
      CANCELED: "bg-danger",
      REJECTED: "bg-danger",
    };

    const translatedStatus = statusTranslations[status] || status;
    const colorClass = statusColors[status] || "bg-secondary";

    return (
      <span className={"py-1 badge " + colorClass}>{translatedStatus}</span>
    );
  }

  return (
    <tr>
      <td>
        {props.data.automationId ? (
          <svg
            className="icon icon-xs me-2"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
          </svg>
        ) : (
          <svg
            className="icon icon-xs me-2"
            fill="currentColor"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M10.05 4.575a1.575 1.575 0 1 0-3.15 0v3m3.15-3v-1.5a1.575 1.575 0 0 1 3.15 0v1.5m-3.15 0 .075 5.925m3.075.75V4.575m0 0a1.575 1.575 0 0 1 3.15 0V15M6.9 7.575a1.575 1.575 0 1 0-3.15 0v8.175a6.75 6.75 0 0 0 6.75 6.75h2.018a5.25 5.25 0 0 0 3.712-1.538l1.732-1.732a5.25 5.25 0 0 0 1.538-3.712l.003-2.024a.668.668 0 0 1 .198-.471 1.575 1.575 0 1 0-2.228-2.228 3.818 3.818 0 0 0-1.12 2.687M6.9 7.575V12m6.27 4.318A4.49 4.49 0 0 1 16.35 15m.002 0h-.002"
            ></path>
          </svg>
        )}
        {props.data.side === "BUY" ? (
          <span className="badge bg-warning py-1 me-2">Compra</span>
        ) : (
          <span className="badge bg-warning py-1 me-2">Venda</span>
        )}
        {props.data.symbol}
      </td>
      <td>
        <span className="fw-normal">{getDate(props.data.transactTime)}</span>
      </td>
      <td>
        <span className="fw-normal">{props.data.quantity}</span>
      </td>
      <td>
        <span className="fw-bold">{props.data.net}</span>
      </td>
      <td>
        <span className="fw-normal">{getStatus(props.data.status)}</span>
      </td>
      <td>
        <a
          className="btn btn-info btn-xs"
          href={"/orders/view/" + props.data.id}
        >
          <svg
            className="icon icon-xs"
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
              d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
            ></path>
          </svg>
        </a>
      </td>
    </tr>
  );
}
