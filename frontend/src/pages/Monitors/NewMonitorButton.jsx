export default function NewMonitorButton() {
  return (
    <a className="btn btn-primary animate-up-2" href="/monitors/new">
      <svg
        className="icon icon-xs me-2"
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
          d="M6 20.25h12m-7.5-3v3m3-3v3m-10.125-3h17.25c.621 0 1.125-.504 1.125-1.125V4.875c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125Z"
        ></path>
      </svg>
      Novo Monitor
    </a>
  );
}
