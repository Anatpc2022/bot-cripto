export default function NewAutomationButton() {
  return (
    <>
      <button
        className="btn btn-primary dropdown-toggle"
        data-bs-toggle="dropdown"
      >
        <svg
          className="icon icon-xs me-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path>
        </svg>
        Nova Automação
      </button>
      <ul className="dropdown-menu">
        <li>
          <a href="/automations/new" className="dropdown-item">
            Regular
          </a>
        </li>
        <li>
          <a href="/grids/new" className="dropdown-item">
            Grid
          </a>
        </li>
      </ul>
    </>
  );
}
