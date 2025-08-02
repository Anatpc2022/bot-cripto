import ListPage from "../ListPage";
import MonitorsTable from "./MonitorsTable";
import NewMonitorButton from "./NewMonitorButton";

export default function Monitors() {
  return (
    <ListPage
      title="Monitores"
      table={<MonitorsTable />}
      button={<NewMonitorButton />}
    />
  );
}
