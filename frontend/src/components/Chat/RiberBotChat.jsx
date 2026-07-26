import { useState, useRef, useEffect } from "react";
import ChatRow from "./ChatRow";
import ChatFile from "./ChatFile";
import { cleanChat, sendChat } from "../../services/RiberBotService";

export default function RiberBotChat() {
  const [show, setShow] = useState(false);
  const [newText, setNewText] = useState("");
  const [newFiles, setNewFiles] = useState([]);
  const [messages, setMessages] = useState([]);

  const fileInputRef = useRef(null);
  const textInputRef = useRef(null);
  const dummyRef = useRef(null);

  useEffect(() => {
    if (dummyRef.current)
      dummyRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages, show]);

  function closeChat() {
    setShow(false);
    cleanChat();
    setNewText("");
    setNewFiles([]);
    setMessages([]);
  }

  function onFilesChange(event) {
    const files = Array.from(event.target.files);
    setNewFiles((prevState) => [...prevState, ...files]);
  }

  function startTimeouts() {
    const timeout = setTimeout(() => {
      const botResponse = {
        text: "Estou analisando a sua mensagem, aguarde um instante...",
        sender: "bot",
        temp: true,
      };
      setMessages((prevState) => [...prevState, botResponse]);
    }, 2000);

    const timeout2 = setTimeout(() => {
      const botResponse = {
        text: "Ainda analisando, aguarde mais um pouco..",
        sender: "bot",
        temp: true,
      };
      setMessages((prevState) => [...prevState, botResponse]);
    }, 5000);

    return [timeout, timeout2];
  }

  function btnSendClick() {
    const text = newText.trim();
    const files = newFiles ? [...newFiles] : [];
    if (!text && !newFiles.length) return;

    const newMessage = { text, attachments: newFiles, sender: "user" };
    setMessages((prevState) => [...prevState, newMessage]);

    setNewText("");
    setNewFiles([]);
    fileInputRef.current.value = "";
    textInputRef.current.focus();

    const timeouts = startTimeouts();

    sendChat(text, files)
      .then((result) => {
        timeouts.map((t) => clearTimeout(t));
        const botResponse = { text: result.answer, sender: "bot" };
        setMessages((prevState) => [
          ...prevState.filter((m) => !m.temp),
          botResponse,
        ]);
      })
      .catch((err) => {
        timeouts.map((t) => clearTimeout(t));
        console.error(err);
        const botResponse = {
          text: err.response ? JSON.stringify(err.response.data) : err.message,
          sender: "bot",
        };
        setMessages((prevState) => [...prevState, botResponse]);
      });
  }

  function btnRemoveClick(index) {
    const copy = [...newFiles];
    copy.splice(index, 1);
    setNewFiles(copy);
  }

  const defaultMessage = (
    <div className="text-muted mt-3 divDefaultMessage">
      👋 Olá! Como posso te ajudar? Que tal...
      <ul className="mt-2">
        <li>me perguntar sobre uma criptomoeda ou indicador técnico?</li>
        <li>me enviar uma imagem de um gráfico de velas para eu analisar?</li>
        <li>me passar os requisitos de uma grid que deseja construir?</li>
      </ul>
    </div>
  );

  return (
    <>
      <button type="button" className="float" onClick={() => setShow(true)}>
        <img src="/img/favicon/favicon-150x150.png" width={42} />
      </button>

      <div className={`offcanvas-custom ${show ? "show" : ""}`}>
        <button
          type="button"
          className="btn-close btn-close-white position-absolute btnCloseChat"
          onClick={closeChat}
        ></button>
        <div className="offcanvas-header bg-primary text-white rounded-top">
          <h5 className="offcanvas-title mb-0 p-3">
            <img src="/img/favicon/favicon-32x32.png" className="me-2" />
            RiberBot IA
          </h5>
        </div>
        <div className="offcanvas-body p-3">
          <div className="messages-container mb-2 divMessages">
            {!messages || !messages.length
              ? defaultMessage
              : messages.map((msg, index) => (
                  <ChatRow key={index} message={msg} />
                ))}
            <div ref={dummyRef} />
          </div>

          <div className="offcanvas-footer p-3 border-top bg-white divChatInput">
            {newFiles.length > 0 && (
              <div className="mb-2">
                <div
                  className="small text-muted mb-1"
                  style={{ fontSize: "10px" }}
                >
                  Anexos:
                </div>
                {newFiles.map((file, index) => (
                  <ChatFile
                    key={index}
                    index={index}
                    file={file}
                    onRemove={btnRemoveClick}
                  />
                ))}
              </div>
            )}

            <textarea
              ref={textInputRef}
              className="form-control mb-2"
              placeholder="Digite sua mensagem..."
              rows="2"
              style={{ resize: "none" }}
              value={newText}
              onChange={(evt) => setNewText(evt.target.value)}
            ></textarea>
            <div className="d-flex justify-content-end gap-2">
              <input
                ref={fileInputRef}
                type="file"
                className="d-none"
                multiple
                onChange={onFilesChange}
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => fileInputRef.current.click()}
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
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={btnSendClick}
              >
                Enviar
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
