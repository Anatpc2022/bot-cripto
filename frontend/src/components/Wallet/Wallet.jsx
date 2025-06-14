import { useState } from "react";
import WalletRow from "./WalletRow";

function Wallet() {
  const [fiat, setFiat] = useState("~USD 100");
  const [balances, setBalances] = useState([
    {
      symbol: "BTC",
      available: "0.001",
      onOrder: "0.000",
    },
    {
      symbol: "ETH",
      available: "1.001",
      onOrder: "0.100",
    },
    {
      symbol: "SOL",
      available: "17.0017",
      onOrder: "0.000",
    },
  ]);

  return (
    <div className="col-12">
      <div className="card border-0 shadow">
        <div className="card-header">
          <div className="row">
            <div className="col">
              <h2 className="fs-5 fw-bold mb-0">Carteira</h2>
            </div>
          </div>
        </div>
        <div className="table-responsive divScroll">
          <table className="table align-items-center table-flush table-sm table-hover tableFixHead">
            <thead className="thead-light">
              <tr>
                <th className="border-bottom" scope="col">
                  MOEDA
                </th>
                <th className="border-bottom col-3" scope="col">
                  Livre
                </th>
                <th className="border-bottom col-3" scope="col">
                  Bloqueada
                </th>
              </tr>
            </thead>
            <tbody>
              {balances && balances.length ? (
                balances.map((item) => (
                  <WalletRow
                    key={item.symbol}
                    symbol={item.symbol}
                    available={item.available}
                    onOrder={item.onOrder}
                  />
                ))
              ) : (
                <></>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-3 mb-3 ms-4">
          <b>Estimativa:</b> {fiat}
        </div>
      </div>
    </div>
  );
}

export default Wallet;
