import { useState, useEffect } from "react";
import TemplatePage from "../TemplatePage";
import {
  getDayTradeReport,
  getOrdersReport,
} from "../../services/OrdersService";
import DateFilter from "../../components/DateFilter";
import LineChart from "./LineChart";

export default function Reports() {
  const [filter, setFilter] = useState({ symbol: "USDT" });
  const [report, setReport] = useState({});

  useEffect(() => {
    getOrdersReport(filter.symbol, filter.startDate, filter.endDate)
      .then((report) => setReport(report))
      .catch((err) => console.error(err));
  }, [filter]);

  function onFilterChange(evt) {
    setFilter((prevState) => ({
      ...prevState,
      [evt.target.id]: evt.target.value,
    }));
  }

  function onDateChange(evt) {
    setFilter((prevState) => ({
      ...prevState,
      startDate: evt.startDate,
      endDate: evt.endDate,
    }));
  }

  return (
    <TemplatePage>
      <div className="d-flex justify-content-between flex-nowrap align-items-center py-4">
        <div className="d-block mb-0">
          <h2 className="h4">Relatórios</h2>
        </div>
        <div className="btn-toolbar mb-0">
          <div className="me-2 mb-3">
            <select
              id="symbol"
              className="form-select me-4"
              value={filter.symbol}
              onChange={onFilterChange}
            >
              <option value="BNB">BNB</option>
              <option value="BRL">BRL</option>
              <option value="BTC">BTC</option>
              <option value="GBP">GBP</option>
              <option value="ETH">ETH</option>
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
              <option value="USDT">USDT</option>
            </select>
          </div>
          <div>
            <DateFilter onClick={onDateChange} />
          </div>
        </div>
      </div>
      <LineChart data={report} />
    </TemplatePage>
  );
}
