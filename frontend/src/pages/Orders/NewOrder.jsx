import { useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import FormPage from "../FormPage";
import SymbolInfo from "../../components/SymbolInfo";

function NewOrder() {

    const [order, setOrder] = useState({});

    function onSymbolChange(evt) {
        setOrder(prevState => ({ ...prevState, symbol: evt.target.value }));
    }

    return (
        <FormPage title="Nova Ordem Spot">
            <div className="row mb-3">
                <div className="col-3">
                    <div className="form-group">
                        <label>Par de Moeda:</label>
                        <SelectSymbol symbol={order.symbol} disabled={false} onChange={onSymbolChange} />
                    </div>
                </div>
                <div className="col-3">
                    {
                        order.symbol
                            ? <SymbolInfo symbol={order.symbol} />
                            : <></>
                    }
                </div>
            </div>
        </FormPage>
    )
}

export default NewOrder;