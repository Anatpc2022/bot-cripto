import { useState, useEffect } from "react";
import useWebSocket from "react-use-websocket";
import { getSymbol } from "../services/SymbolsService";

/**
 * props:
 * - symbol
 */
function SymbolInfo(props) {
  const [info, setInfo] = useState({
    yesterday: 0,
    now: 0,
    minNotional: 10,
    minLotSize: 10,
  });

  useEffect(() => {
    if (!props.symbol) return;

    getSymbol(props.symbol)
      .then((symbolObject) =>
        setInfo((prevState) => ({
          ...prevState,
          minLotSize: symbolObject.minLotSize,
          minNotional: symbolObject.minNotional,
        }))
      )
      .catch((err) =>
        console.error(err.response ? err.response.data : err.message)
      );
  }, [props.symbol]);

  function getBinanceWSUrl() {
    if (!props.symbol) return "";
    return `${
      import.meta.env.VITE_BWS_URL
    }/ws/${props.symbol.toLowerCase()}@ticker`;
  }

  useWebSocket(getBinanceWSUrl(), {
    onOpen: () =>
      console.log(`Connected to Binance Stream ${props.symbol}@ticker`),
    onMessage: (message) => {
      if (!message) return;
      const data = JSON.parse(message.data);
      if (data)
        setInfo((prevState) => ({
          ...prevState,
          yesterday: data.o,
          now: data.c,
        }));
    },
    onError: (err) => console.error(err),
    shouldReconnect: (err) => true,
    reconnectInterval: 10000,
  });

  return (
    <div className="row">
      <div className="col-6">
        <div className="form-group">
          <label>Preço/Mercado:</label>
          <br />
          Ontem:
          <br />
          {`${info.yesterday}`.substring(0, 10)}
          <br />
          Agora:
          <br />
          {`${info.now}`.substring(0, 10)}
        </div>
      </div>
      <div className="col-6">
        <div className="form-group">
          <label>Dados/Ordem:</label>
          <br />
          Valor mínimo:
          <br />
          {info.minNotional}
          <br />
          Qtd. mínima:
          <br />
          {info.minLotSize}
        </div>
      </div>
    </div>
  );
}

export default SymbolInfo;
