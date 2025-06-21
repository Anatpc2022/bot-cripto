import FormPage from "../FormPage";

function RiberBot() {
    return (
        <FormPage title="RiberBot">
            <ul className="nav nav-tabs" id="tabs" role="tablist">
                <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link active" id="memory-tab" role="tab" data-bs-toggle="tab" data-bs-target="#memory">
                        Memória
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link" id="brain-tab" role="tab" data-bs-toggle="tab" data-bs-target="#brain">
                        Cérebro
                    </button>
                </li>
                <li className="nav-item" role="presentation">
                    <button type="button" className="nav-link" id="tests-tab" role="tab" data-bs-toggle="tab" data-bs-target="#tests">
                        Testes
                    </button>
                </li>
            </ul>
            <div className="tab-content px-3 mb-3" id="tabContent">
                <div className="tab-pane fade show active" id="memory" role="tabpanel">
                    Memória
                </div>
                <div className="tab-pane fade" id="brain" role="tabpanel">
                    Cérebro
                </div>
                <div className="tab-pane fade" id="tests" role="tabpanel">
                    Testes
                </div>
            </div>
        </FormPage>
    )
}

export default RiberBot;