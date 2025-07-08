export default function OrdersTable() {
    return (
        <div className="card card-body border-0 shadow table-wrapper table-responsive">
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th className="border-gray-200">Ordem</th>
                        <th className="border-gray-200">Data</th>
                        <th className="border-gray-200">Qtd</th>
                        <th className="border-gray-200">Val/Líquido</th>
                        <th className="border-gray-200">Status</th>
                        <th className="border-gray-200">Ver</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colSpan={6}>Teste</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}