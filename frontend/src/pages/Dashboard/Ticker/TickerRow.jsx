import { useMemo } from "react";

/**
 * props:
 * - symbol
 * - data
 */
function TickerRow(props) {

    if (!props.data) return <></>;

    function getClass(){
        return parseFloat(props.data.c) > parseFloat(props.data.o)
         ? "text-success fw-bold"
         : "text-danger fw-bold";
    }

    return useMemo(() => (
        <tr>
            <td className="text-gray-900 fw-bold">
                {props.symbol}
            </td>
            <td className={getClass()}>
                {props.data.c.substring(0, 8)}
            </td>
            <td className="text-gray-900">
                {props.data.o.substring(0, 8)}
            </td>
            <td className="text-gray-900">
                {props.data.h.substring(0, 8)}
            </td>
            <td className="text-gray-900">
                {props.data.l.substring(0, 8)}
            </td>
        </tr>
    ), [props.data])
}

export default TickerRow;