/**
 * props:
 * - data
 * - onStopClick
 * - onStartClick
 * - onDeleteClick
 */
export default function AutomationRow(props) {
  function getActiveClass(automation) {
    return automation.isActive ? "text-success" : "text-danger";
  }

  function getActiveText(automation) {
    if (!automation.isActive) return "PARADO";
    if (automation.type === "GRID") return "RODANDO";
    return automation.isOpened ? "VENDENDO" : "COMPRANDO";
  }

  function getEditUrl() {
    if (!props.data) return "";
    return props.data.type === "GRID"
      ? "/grids/edit/" + props.data.id
      : "/automations/edit/" + props.data.id;
  }

  return (
    <tr>
      <td>{props.data.type}</td>
      <td>{props.data.symbol}</td>
      <td>{props.data.name}</td>
      <td>
        <span className={getActiveClass(props.data)}>
          {getActiveText(props.data)}
        </span>
      </td>
      <td>
        <a
          className="btn btn-secondary btn-xs ms-2"
          href={getEditUrl()}
          title="Editar esta Automação"
        >
          <svg
            className="icon icon-xs"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
            ></path>
          </svg>
        </a>
        {props.data.isActive ? (
          <button
            type="button"
            id={"stop" + props.data.id}
            className="btn btn-danger btn-xs ms-2"
            title="Parar esta Automação"
            onClick={props.onStopClick}
          >
            <svg
              className="icon icon-xs"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 9.563C9 9.252 9.252 9 9.563 9h4.874c.311 0 .563.252.563.563v4.874c0 .311-.252.563-.563.563H9.564A.562.562 0 0 1 9 14.437V9.564Z"
              ></path>
            </svg>
          </button>
        ) : (
          <></>
        )}
        {!props.data.isActive ? (
          <button
            type="button"
            id={"start" + props.data.id}
            className="btn btn-success btn-xs ms-2"
            title="Iniciar esta Automação"
            onClick={props.onStartClick}
          >
            <svg
              className="icon icon-xs"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              ></path>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z"
              ></path>
            </svg>
          </button>
        ) : (
          <></>
        )}
        {!props.data.isActive ? (
          <button
            type="button"
            id={"delete" + props.data.id}
            className="btn btn-danger btn-xs ms-2"
            title="Excluir esta Automação"
            onClick={props.onDeleteClick}
          >
            <svg
              className="icon icon-xs"
              fill="none"
              strokeWidth="1.5"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
              ></path>
            </svg>
          </button>
        ) : (
          <></>
        )}
      </td>
    </tr>
  );
}
