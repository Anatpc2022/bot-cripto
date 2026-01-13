import FormPage from "../FormPage";
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import {
  getOrderTemplate,
  saveOrderTemplate,
} from "../../services/OrderTemplatesService";
import SymbolInfo from "../../components/SymbolInfo";
import SelectSide from "../../components/SelectSide";
import OrderType from "../../components/OrderType";
import { MARKET_TYPES, STOP_TYPES } from "../../services/ExchangeService";
import PriceTemplate from "./PriceTemplate";
import QuantityTemplate from "./QuantityTemplate";

export default function NewOrderTemplate() {
  const navigate = useNavigate();

  const { id } = useParams();

  const [orderTemplate, setOrderTemplate] = useState({
    name: "",
    symbol: "",
    type: "MARKET",
    side: "BUY",
    limitPrice: "",
    limitPriceMultiplier: 1,
    stopPrice: "",
    stopPriceMultiplier: 1,
    quantity: "",
    quantityMultiplier: 1,
    trailingDelta: null,
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return;
    getOrderTemplate(id)
      .then((ot) => setOrderTemplate(ot))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }, [id]);

  function onInputChange(event) {
    setOrderTemplate((prevState) => ({
      ...prevState,
      [event.target.id]: event.target.value,
    }));
  }

  function btnSaveClick() {
    saveOrderTemplate(orderTemplate.id, orderTemplate)
      .then((result) => navigate("/ordertemplates"))
      .catch((err) => {
        console.error(err.response ? err.response.data : err);
        setMessage(
          err.response ? JSON.stringify(err.response.data) : err.message
        );
      });
  }

  function isStopOrder(orderType) {
    return STOP_TYPES.includes(orderType);
  }

  function isMarketOrder(orderType) {
    return MARKET_TYPES.includes(orderType);
  }

  return (
    <FormPage title={`${id ? "Editar" : "Novo"} Pedido de Ordem`}>
      <div className="row mb-3">
        <div className="col-3">
          <div className="form-group">
            <label htmlFor="symbol">Par/Moeda:</label>
            <SelectSymbol
              symbol={orderTemplate.symbol}
              disabled={orderTemplate.id > 0}
              onChange={onInputChange}
            />
          </div>
        </div>
        <div className="col-3">
          <SymbolInfo symbol={orderTemplate.symbol} />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-4">
          <label htmlFor="name">Nome:</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={orderTemplate.name || ""}
            placeholder="Nome do meu modelo"
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className="row mb-3">
        <div className="col-2">
          <SelectSide side={orderTemplate.side} onChange={onInputChange} />
        </div>
        <div className="col-2">
          <OrderType type={orderTemplate.type} onChange={onInputChange} />
        </div>
      </div>
      {isStopOrder(orderTemplate.type) ? (
        <>
          <div className="row mb-3">
            <div className="col-6">
              <PriceTemplate
                id="stopPrice"
                text="Preço de Parada:"
                symbol={orderTemplate.symbol}
                onChange={onInputChange}
                price={orderTemplate.stopPrice}
                multiplier={orderTemplate.stopPriceMultiplier}
              />
            </div>
            <div className="col-2">
              <label
                htmlFor="trailingDelta"
                data-bs-toggle="tooltip"
                data-bs-placement="top"
                title="Quantidade em BIPS (0,01%) que o preço pode recuar antes da ordem ser acionada."
              >
                Trailing Delta (BIPS):
              </label>
              <input
                type="number"
                className="form-control"
                id="trailingDelta"
                value={orderTemplate.trailingDelta || ""}
                onChange={onInputChange}
              />
            </div>
          </div>
        </>
      ) : (
        <></>
      )}
      {!isMarketOrder(orderTemplate.type) ? (
        <div className="row mb-3">
          <div className="col-6">
            <PriceTemplate
              id="limitPrice"
              text="Preço Limite:"
              symbol={orderTemplate.symbol}
              onChange={onInputChange}
              price={orderTemplate.limitPrice}
              multiplier={orderTemplate.limitPriceMultiplier}
            />
          </div>
        </div>
      ) : (
        <></>
      )}
      <div className="row mb-4">
        <div className="col-6">
          <QuantityTemplate
            id="quantity"
            text="Quantidade:"
            quantity={orderTemplate.quantity}
            multiplier={orderTemplate.quantityMultiplier}
            onChange={onInputChange}
          />
        </div>
      </div>
      <div className="row">
        <div className="col-3">
          <button
            type="button"
            className="btn btn-primary"
            onClick={btnSaveClick}
          >
            Salvar pedido de Ordem
          </button>
          <a href="/ordertemplates" className="btn btn-light">
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
