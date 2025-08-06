import FormPage from "../FormPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMonitor, saveMonitor } from "../../services/MonitorsService";
import SelectSymbol from "../../components/SelectSymbol";
import SelectInterval from "./SelectInterval";
import SwitchInput from "../../components/SwitchInput";
import MonitorIndex from "./MonitorIndex";

export default function NewMonitor() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [monitor, setMonitor] = useState({
    type: "CANDLES",
    indexes: "",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getMonitor(id)
      .then((monitor) => setMonitor(monitor))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, [id]);

  function onInputChange(event) {
    setMonitor((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  function btnSaveClick() {
    saveMonitor(monitor.id, monitor)
      .then((result) => navigate("/monitors"))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  return (
    <FormPage title={`${id ? "Editar" : "Novo"} Monitor de Vela`}>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="symbol">Par/Moeda:</label>
            <SelectSymbol
              symbol={monitor.symbol}
              disabled={monitor.id > 0}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="col-3">
          <SelectInterval
            onChange={onInputChange}
            interval={monitor.interval}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-6">
          <MonitorIndex onChange={onInputChange} indexes={monitor.indexes} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="isActive"
              text="Está Ativo?"
              onChange={onInputChange}
              isChecked={monitor.isActive}
            />
          </div>
        </div>
        <div className="col-3">
          <div className="form-group">
            <SwitchInput
              id="logs"
              text="Habilitar Logs?"
              onChange={onInputChange}
              isChecked={monitor.logs}
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
            Salvar Monitor
          </button>
          <a href="/monitors" className="btn btn-light">
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
