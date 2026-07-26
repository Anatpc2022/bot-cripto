import { useState } from "react";

export default function RiberBotChat() {
  const [show, setShow] = useState(false);

  function closeChat() {
    setShow(false);
    //limpar a conversa
  }

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
            <div className="text-muted mt-3 divDefaultMessage">
              👋 Olá! Como posso te ajudar? Que tal...
              <ul className="mt-2">
                <li>
                  me perguntar sobre uma criptomoeda ou indicador técnico?
                </li>
                <li>
                  me enviar uma imagem de um gráfico de velas para eu analisar?
                </li>
                <li>
                  me passar os requisitos de uma grid que deseja construir?
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
