import { useState } from "react";
import useWebSocket from "react-use-websocket";
import TickerRow from "./TickerRow";

function Ticker() {
  const TOP_COINS = [
    "BTCUSDT",
    "ETHUSDT",
    "SOLUSDT",
    "XRPUSDT",
    "PEPEUSDT",
    "DOGEUSDT",
    "BNBUSDT",
    "ADAUSDT",
    "TRXUSDT",
    "SUIUSDT",
  ];

  const streams = TOP_COINS.map((coin) => coin.toLowerCase() + "@ticker").join(
    "/"
  );

  const [ticker, setTicker] = useState({});

  const { lastJsonMessage } = useWebSocket(
    import.meta.env.VITE_BWS_URL + "/stream",
    {
      onOpen: () => console.log("Connected to Binance WS"),
      onMessage: () => {
        if (!lastJsonMessage) return;
        setTicker((prevState) => ({
          ...prevState,
          [lastJsonMessage.data.s]: lastJsonMessage.data,
        }));
      },
      queryParams: { streams },
      onError: (error) => console.error(error),
      shouldReconnect: (error) => true,
      reconnectInterval: 60000,
    }
  );

  return (
    <div className="col-12">
      <div className="card border-0 shadow">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <h2 className="fs-5 fw-bold mb-0">Mercado 24h</h2>
            </div>
          </div>
        </div>
        <div className="table-responsive divScroll">
          <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
            <thead className="thead-light">
              <tr>
                <th className="border-bottom" scope="col">
                  PAR/MOEDA
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  Preço
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  Ontem
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  Máximo
                </th>
                <th className="border-bottom col-2 text-center" scope="col">
                  Mínimo
                </th>
              </tr>
            </thead>
            <tbody>
              {TOP_COINS.map((item) => (
                <TickerRow key={item} symbol={item} data={ticker[item]} />
              ))}
            </tbody>
          </table>
        </div>
        <div className="m-4 mt-3">
          Resumo de dados das últimas 24h até agora.
        </div>
      </div>
    </div>
  );
}

export default Ticker;
