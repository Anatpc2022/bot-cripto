import ReactMarkdown from "react-markdown";

/**
 * props:
 * - message
 */
export default function ChatRow(props) {
  function getAlignmentClass() {
    return props.message.sender === "user" ? "text-end" : "text-start";
  }

  function getColorClasses() {
    return props.message.sender === "user"
      ? "bg-secondary text-white"
      : "bg-light border";
  }

  return (
    <div className={`mb-2 ${getAlignmentClass()}`}>
      <span
        className={`d-inline-block p-2 rounded ${getColorClasses()} spanChatRow`}
      >
        <ReactMarkdown skipHtml={true}>{props.message.text}</ReactMarkdown>
      </span>
      {props.message.attachments &&
        props.message.attachments.map((file, i) => (
          <div
            key={i}
            className="mt-1 text-muted fst-italic"
            style={{ fontSize: "10px" }}
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
                d="m18.375 12.739-7.693 7.693a4.5 4.5 0 0 1-6.364-6.364l10.94-10.94A3 3 0 1 1 19.5 7.372L8.552 18.32m.009-.01-.01.01m5.699-9.941-7.81 7.81a1.5 1.5 0 0 0 2.112 2.13"
              ></path>
            </svg>
            {file.name}
          </div>
        ))}
    </div>
  );
}
