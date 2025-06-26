import { useState } from "react";
import SelectSymbol from "../../components/SelectSymbol";
import FormPage from "../FormPage";

function NewOrder(){

    const [order, setOrder] = useState({});

    function onSymbolChange(evt){

    }

    return (
        <FormPage title="Nova Ordem Spot">
            <div className="row">
                <div className="col-3 mb-3">
                    <div className="form-group">
                        <label>Par de Moeda:</label>
                        <SelectSymbol symbol={order.symbol} disabled={false} onChange={onSymbolChange} />
                    </div>
                </div>
            </div>
        </FormPage>
    )
}

export default NewOrder;