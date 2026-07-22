/**
 * props:
 * - title
 * - value
 * - precision
 * - background
 */
export default function InfoBlock(props) {
  function getBackground() {
    if (!props.background) return "icon-shape icon-shape-primary rounded me-4";
    return `icon-shape icon-shape-${props.background} rounded me-4`;
  }

  function getValueText() {
    const precision =
      props.precision !== undefined ? parseInt(props.precision) : 2;

    if (!props.value) return 0;
    const value = parseFloat(props.value);
    if (!value) return 0;

    if (value > 1000000) return `${(value / 1000000).toFixed(precision)}M`;
    if (value > 1000) return `${(value / 1000).toFixed(precision)}k`;
    return value.toFixed(precision);
  }

  return (
    <div className="col-4 mb-4">
      <div className="card border-0 shadow">
        <div className="card-body">
          <div className="row d-block align-items-center">
            <div className="col-12 d-flex">
              <div className={getBackground()}>{props.children}</div>
              <div className="ms-3">
                <h2 className="h5">{props.title}</h2>
                <h3 className="fw-extrabold">{getValueText()}</h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
