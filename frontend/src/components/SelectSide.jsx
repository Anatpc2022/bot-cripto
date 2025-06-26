/**
 * props:
 * - side
 * - onChange
 */
export default function SelectSide(props){
    return (
        <div className="form-group">
            <label htmlFor="side">Operação:</label>
            <select id="side" className="form-select" value={props.side} onChange={props.onChange}>
                <option value="BUY">Compra</option>
                <option value="SELL">Venda</option>
            </select>
        </div>
    )
}