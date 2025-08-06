import FormPage from "../FormPage";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMonitor } from "../../services/MonitorsService";
import SelectSymbol from "../../components/SelectSymbol";
import SelectInterval from "./SelectInterval";
import SwitchInput from "../../components/SwitchInput";

export default function NewMonitor() {
  const { id } = useParams();

  const [monitor, setMonitor] = useState({});
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
      {JSON.stringify(monitor)}
    </FormPage>
  );
}
