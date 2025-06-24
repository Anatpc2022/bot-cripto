import { useState } from "react";

/**
 * props:
 * - id
 * - data
 * - hasSearch
 */
function RiberBotTab(props) {

    const [search, setSearch] = useState("");

    function onSearchChange(evt) {
        setSearch(evt.target.value.toUpperCase());
    }

    return (
        <>
            {
                props.hasSearch
                    ? (
                        <div className="row">
                            <div className="col-3 my-3">
                                <div className="form-group">
                                    <label htmlFor="search">Procurar:</label>
                                    <input type="text" id="search" className="form-control" value={search} onChange={onSearchChange} />
                                </div>
                            </div>
                        </div>
                    )
                    : <></>
            }
            <div className="table-responsive divScrollRiberBot">
                <table className="table table-flush table-sm table-hover">
                    <thead>
                        <tr>
                            <th className="border-gray-200">Chave</th>
                            <th className="border-gray-200">Valor</th>
                        </tr>
                    </thead>
                    <tbody>
                        {JSON.stringify(props.data)}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default RiberBotTab;