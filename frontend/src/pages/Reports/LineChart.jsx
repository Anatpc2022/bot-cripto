import { useEffect } from "react";

/**
 * props:
 * - data
 */
export default function LineChart(props) {
  useEffect(() => {
    if (!props.data || !props.data.series) return;

    const mod = props.data.subs.length > 20 ? 2 : 1;
    let flag = 0;
    const subs = props.data.subs.map((s) => {
      return flag++ % mod === 0 ? s : "";
    });

    new window.Chartist.Line(
      ".ct-chart-sales-value",
      {
        labels: subs,
        series: [props.data.series],
      },
      {
        showArea: true,
        fullWidth: true,
        chartPadding: { right: 20 },
        axisX: { showGrid: true },
        axisY: { showGrid: true, showLabel: true },
      },
    );
  }, [props.data]);

  function getText(value) {
    const signal = value > 0 ? "+" : "";
    return signal + (value ? value.toFixed(2) : value);
  }

  function getTextClass(value) {
    return parseFloat(value) >= 0 ? "text-success" : "text-danger";
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="card bg-yellow-100 border-0 shadow">
          <div className="card-header d-flex flex-row align-items-center flex-0">
            <div className="d-block mb-0">
              <h2 className="fs-3 fw-extrabold">
                {props.data.quote}{" "}
                {getText(props.data.sellVolume - props.data.buyVolume)}
              </h2>
            </div>
            <div className="d-block ms-3">
              <div className="small">
                <span
                  className={getTextClass(props.data.profitPerc) + " fw-bold"}
                >
                  ({getText(props.data.profitPerc)}%)
                </span>
              </div>
            </div>
          </div>
          <div className="card-body p-2">
            <div className="ct-chart-sales-value ct-double-octave"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
