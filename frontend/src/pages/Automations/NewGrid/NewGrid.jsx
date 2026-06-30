import FormPage from "../../FormPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSymbol from "../../../components/SelectSymbol";
import SwitchInput from "../../../components/SwitchInput";
import {
  getAutomation,
  saveAutomation,
} from "../../../services/AutomationsService";
import { getSymbol } from "../../../services/SymbolsService";
import SymbolInfo from "../../../components/SymbolInfo";
import WalletSummary from "../../../components/WalletSummary";
import QuantityInput from "../../../components/QuantityInput";

export default function NewGrid() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [grid, setGrid] = useState({
    lowerLimit: "",
    upperLimit: "",
    levels: "",
    quantity: "",
  });
  const [automation, setAutomation] = useState({
    id: 0,
    type: "GRID",
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

  useEffect(() => {
    if (!automation.symbol) return;
    getSymbol(automation.symbol.toUpperCase())
      .then((symbolObj) => setSymbol(symbolObj))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message,
        );
      });
  }, [automation.symbol]);

  useEffect(() => {
    if (!id) return;
    getAutomation(id)
      .then((automation) => {
        setAutomation(automation);

        //carregar state grid
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message,
        );
      });
  }, [id]);

  function onAutomationChange(event) {
    setAutomation((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  function btnSaveClick() {
    setMessage("");

    automation.name = `GRID ${automation.symbol} #${grid.levels}`;
    automation.openIndexes = `${automation.symbol}:TICKER`;
    automation.openCondition = `MEMORY['${automation.symbol}:TICKER'].current.close>${grid.lowerLimit} && MEMORY['${automation.symbol}:TICKER'].current.close<${grid.upperLimit}`;
    automation.closeIndexes = automation.openIndexes;
    automation.closeCondition = automation.openCondition;
    automation.isOpened = false;

    // saveAutomation(automation.id, automation)
    //     .then(result => navigate("/automations"))
    //     .catch(err => {
    //         console.error(err.response ? err.response.data : err);
    //         setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
    //     })
  }

  return (
    <FormPage title={`${id ? "Editar" : "Nova"} Automação de Grid`}>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="symbol">Par/Moeda:</label>
            <SelectSymbol
              symbol={automation.symbol}
              disabled={automation.id > 0}
              onChange={onAutomationChange}
            />
          </div>
        </div>
        <div className="col-3">
          {automation.symbol ? (
            <SymbolInfo symbol={automation.symbol} />
          ) : (
            <></>
          )}
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <WalletSummary symbol={automation.symbol} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="lowerLimit">Limite inferior:</label>
            <input
              type="number"
              className="form-control"
              id="lowerLimit"
              placeholder="0"
              value={grid.lowerLimit || ""}
              required={true}
              onChange={onAutomationChange}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="upperLimit">Limite superior:</label>
            <input
              type="number"
              className="form-control"
              id="upperLimit"
              placeholder="0"
              value={grid.upperLimit || ""}
              required={true}
              onChange={onAutomationChange}
            />
          </div>
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="levels">Faixas:</label>
            <input
              type="number"
              className="form-control"
              id="levels"
              placeholder="10"
              value={grid.levels || ""}
              required={true}
              onChange={onAutomationChange}
            />
          </div>
        </div>
        <div className="col-3">
          <QuantityInput
            id="quantity"
            quantity={grid.quantity || 0}
            isQuote={true}
            text="Quantidade da Cotação:"
            symbol={symbol}
            allowQuote={true}
            onChange={onAutomationChange}
          />
        </div>
      </div>

      <div className="row mb-3 mt-4">
        <div className="col-2">
          <div className="form-group">
            <SwitchInput
              id="isActive"
              text="Está ativo?"
              onChange={onAutomationChange}
              isChecked={automation.isActive}
            />
          </div>
        </div>
        <div className="col-2">
          <div className="form-group">
            <SwitchInput
              id="sendNotification"
              text="Enviar notificações?"
              onChange={onAutomationChange}
              isChecked={automation.sendNotification}
            />
          </div>
        </div>
        <div className="col-2">
          <div className="form-group">
            <SwitchInput
              id="logs"
              text="Ativar registros?"
              onChange={onAutomationChange}
              isChecked={automation.logs}
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
            Salvar Grid
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
