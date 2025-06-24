import { useEffect, useState } from "react";
import RiberBotTab from "./RiberBotTab";
import RiberBotTest from "./RiberBotTest";
import FormPage from "../FormPage";
import { getBrain, getMemory } from "../../services/RiberBotService";

function RiberBot() {
  const [memory, setMemory] = useState({});
  const [brain, setBrain] = useState({});

  useEffect(() => {
    getMemory()
      .then((memory) => setMemory(memory))
      .catch((err) =>
        setMemory({ error: err.response ? err.response.data : err.message })
      );

    getBrain()
      .then((brain) => setBrain(brain))
      .catch((err) =>
        setBrain({ error: err.response ? err.response.data : err.message })
      );
  }, []);

  return (
    <FormPage title="RiberBot">
      <ul className="nav nav-tabs" id="tabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className="nav-link active"
            id="memory-tab"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#memory"
          >
            Memória
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className="nav-link"
            id="brain-tab"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#brain"
          >
            Cérebro
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            type="button"
            className="nav-link"
            id="tests-tab"
            role="tab"
            data-bs-toggle="tab"
            data-bs-target="#tests"
          >
            Testes
          </button>
        </li>
      </ul>
      <div className="tab-content px-3 mb-3" id="tabContent">
        <div className="tab-pane fade show active" id="memory" role="tabpanel">
          <RiberBotTab id="memory" hasSearch={true} data={memory} />
        </div>
        <div className="tab-pane fade" id="brain" role="tabpanel">
          <RiberBotTab id="brain" hasSearch={false} data={brain} />
        </div>
        <div className="tab-pane fade" id="tests" role="tabpanel">
          <RiberBotTest data={memory} />
        </div>
      </div>
    </FormPage>
  );
}

export default RiberBot;
