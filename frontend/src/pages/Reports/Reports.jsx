import { useState, useEffect } from "react";
import TemplatePage from "../TemplatePage";
import {
  getDayTradeReport,
  getOrdersReport,
} from "../../services/OrdersService";
import DateFilter from "../../components/DateFilter";
import LineChart from "./LineChart";
import InfoBlock from "../../components/InfoBlock";

export default function Reports() {
  const [filter, setFilter] = useState({ symbol: "USDT" });
  const [report, setReport] = useState({});

  useEffect(() => {
    let promise;
    if (
      filter.startDate &&
      filter.endDate &&
      filter.startDate.getTime() === filter.endDate.getTime()
    )
      promise = getDayTradeReport(filter.symbol, filter.startDate);
    else
      promise = getOrdersReport(
        filter.symbol,
        filter.startDate,
        filter.endDate,
      );

    promise
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
      <div className="row">
        <InfoBlock
          title="Volume de Compra"
          value={report.buyVolume}
          background="secondary"
        >
          <svg
            className="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
            ></path>
          </svg>
        </InfoBlock>
        <InfoBlock
          title="Volume de Venda"
          value={report.sellVolume}
          background="success"
        >
          <svg
            className="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            ></path>
          </svg>
        </InfoBlock>
        <InfoBlock
          title="Ordens"
          value={report.orders}
          background="primary"
          precision={0}
        >
          <svg
            className="icon"
            fill="none"
            strokeWidth="1.5"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
            ></path>
          </svg>
        </InfoBlock>
      </div>
    </TemplatePage>
  );
}
