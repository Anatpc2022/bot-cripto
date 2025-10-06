import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getAutomations } from "../../services/AutomationsService";
import Pagination from "../../components/Pagination";

export default function AutomationsTable() {
  const defaultLocation = useLocation();

  const [automations, setAutomations] = useState([]);
  const [page, setPage] = useState(getPage());
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState("");

  function getPage(location) {
    if (!location) location = defaultLocation;
    return new URLSearchParams(location.search).get("page");
  }

  useEffect(() => {
    setPage(getPage(defaultLocation));
  }, [defaultLocation]);

  useEffect(() => {
    setMessage("Carregando Automações...");
    getAutomations(page || 1)
      .then((result) => {
        setAutomations(result.rows);
        setCount(result.count + 2);
        setMessage("");
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, [page]);

  function onStopClick(event) {
    const id = event.target.id.replace("stop", "");
    // stopMonitor(id)
    //     .then(monitor => { window.location.reload() })
    //     .catch(err => {
    //         console.error(err.response ? err.response.data : err);
    //         setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
    //     });
  }

  function onStartClick(event) {
    const id = event.target.id.replace("start", "");
    // startMonitor(id)
    //     .then(monitor => { window.location.reload() })
    //     .catch(err => {
    //         console.error(err.response ? err.response.data : err);
    //         setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
    //     });
  }

  function onDeleteClick(event) {
    const id = event.target.id.replace("delete", "");
    // deleteMonitor(id)
    //     .then(monitor => { window.location.reload() })
    //     .catch(err => {
    //         console.error(err.response ? err.response.data : err);
    //         setMessage(err.response ? JSON.stringify(err.response.data) : err.message);
    //     });
  }

  return (
    <div className="card card-body border-0 shadow table-wrapper table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="border-gray-200">Tipo</th>
            <th className="border-gray-200">Par/Moeda</th>
            <th className="border-gray-200">Nome</th>
            <th className="border-gray-200">Status</th>
            <th className="border-gray-200">Ações</th>
          </tr>
        </thead>
        <tbody>
          {/* {
                        !message
                            ? automations.map(monitor => (
                                <MonitorRow
                                    key={monitor.id}
                                    data={monitor}
                                    onStopClick={onStopClick}
                                    onStartClick={onStartClick}
                                    onDeleteClick={onDeleteClick} />
                            ))
                            : <tr><td colSpan={4}>{message}</td></tr>
                    } */}
          {JSON.stringify(automations)}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
