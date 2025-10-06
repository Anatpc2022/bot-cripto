import ListPage from "../ListPage";
import AutomationsTable from "./AutomationsTable";
import NewAutomationButton from "./NewAutomationButton";

export default function Automations() {
  return (
    <ListPage
      title="Automações"
      button={<NewAutomationButton />}
      table={<AutomationsTable />}
    />
  );
}
