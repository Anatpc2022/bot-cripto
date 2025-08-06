import FormPage from "../FormPage";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getMonitor } from "../../services/MonitorsService";
import SelectSymbol from "../../components/SelectSymbol";

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
      </div>
    </FormPage>
  );
}
