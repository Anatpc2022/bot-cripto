import FormPage from "../../FormPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSymbol from "../../../components/SelectSymbol";
import SwitchInput from "../../../components/SwitchInput";
import {
  getAutomation,
  saveAutomation,
} from "../../../services/AutomationsService";

export default function NewAutomation() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [automation, setAutomation] = useState({
    id: 0,
    type: "REGULAR",
    symbol: "",
    openIndexes: "",
    openCondition: "",
    openTemplateId: null,
    closeIndexes: "",
    closeCondition: "",
    closeTemplateId: null,
    isActive: false,
    logs: false,
    isOpened: false,
    sendNotifications: false,
  });
  const [message, setMessage] = useState("");
  const [symbol, setSymbol] = useState({});
  const [indexes, setIndexes] = useState([]);

  useEffect(() => {
    if (!id) return;
    getAutomation(id)
      .then((automation) => setAutomation(automation))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, [id]);

  function onInputChange(event) {
    setAutomation((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  function btnSaveClick() {
    saveAutomation(automation.id, automation)
      .then((result) => navigate("/automations"))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  return (
    <FormPage title={`${id ? "Editar" : "Nova"} Automação Regular`}>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="symbol">Par/Moeda:</label>
            <SelectSymbol
              symbol={automation.symbol}
              disabled={automation.id > 0}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <div className="form-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              className="form-control"
              id="name"
              placeholder="Nome da automação"
              value={automation.name || ""}
              required={true}
              onChange={onInputChange}
            />
          </div>
        </div>
      </div>

      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="isActive"
              text="Está ativo?"
              onChange={onInputChange}
              isChecked={automation.isActive}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="logs"
              text="Ativar registros?"
              onChange={onInputChange}
              isChecked={automation.logs}
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="sendNotification"
              text="Enviar notificações?"
              onChange={onInputChange}
              isChecked={automation.sendNotification}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="isOpened"
              text="Está aberto?"
              onChange={onInputChange}
              isChecked={automation.isOpened}
            />
          </div>
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={btnSaveClick}
          >
            Salvar Automação
          </button>
          <a href="/automations" className="btn btn-light">
            Cancelar
          </a>
        </div>
        {message ? (
          <div className="alert alert-danger mt-1 col-9 py-1">{message}</div>
        ) : (
          <></>
        )}
      </div>
    </FormPage>
  );
}
