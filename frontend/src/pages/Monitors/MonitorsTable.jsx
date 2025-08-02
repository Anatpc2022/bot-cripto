import MonitorRow from "./MonitorRow";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import {
  getMonitors,
  startMonitor,
  stopMonitor,
  deleteMonitor,
} from "../../services/MonitorsService";
import Pagination from "../../components/Pagination";

export default function MonitorsTable() {
  const defaultLocation = useLocation();

  const [monitors, setMonitors] = useState([]);
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
    setMessage("Carregando Monitores...");
    getMonitors(page || 1)
      .then((result) => {
        setMonitors(result.rows);
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
    stopMonitor(id)
      .then((monitor) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  function onStartClick(event) {
    const id = event.target.id.replace("start", "");
    startMonitor(id)
      .then((monitor) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  function onDeleteClick(event) {
    const id = event.target.id.replace("delete", "");
    deleteMonitor(id)
      .then((monitor) => {
        window.location.reload();
      })
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  return (
    <div className="card card-body border-0 shadow table-wrapper table-responsive">
      <table className="table table-hover">
        <thead>
          <tr>
            <th className="border-gray-200">Tipo</th>
            <th className="border-gray-200">Par/Moeda</th>
            <th className="border-gray-200">Status</th>
            <th className="border-gray-200">Ações</th>
          </tr>
        </thead>
        <tbody>
          {!page || page === 1 ? (
            <>
              <tr>
                <td>TICKER</td>
                <td>*</td>
                <td>
                  <span className="text-success">EXECUTANDO</span>
                </td>
                <td></td>
              </tr>
              <tr>
                <td>USER_DATA</td>
                <td>*</td>
                <td>
                  <span className="text-success">EXECUTANDO</span>
                </td>
                <td></td>
              </tr>
            </>
          ) : (
            <></>
          )}
          {!message ? (
            monitors.map((monitor) => (
              <MonitorRow
                key={monitor.id}
                data={monitor}
                onStopClick={onStopClick}
                onStartClick={onStartClick}
                onDeleteClick={onDeleteClick}
              />
            ))
          ) : (
            <tr>
              <td colSpan={4}>{message}</td>
            </tr>
          )}
        </tbody>
      </table>
      <Pagination count={count} />
    </div>
  );
}
