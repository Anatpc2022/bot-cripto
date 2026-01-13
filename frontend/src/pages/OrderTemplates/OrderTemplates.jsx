import ListPage from "../ListPage";
import OrderTemplatesTable from "./OrderTemplatesTable";
import NewOrderTemplateButton from "./NewOrderTemplateButton";

export default function OrderTemplates() {
  return (
    <ListPage
      title="Modelos de Ordem"
      table={<OrderTemplatesTable />}
      button={<NewOrderTemplateButton />}
    />
  );
}
