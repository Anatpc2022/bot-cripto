import ListPage from "../ListPage";
import NewOrderButton from "./NewOrderButton";
import OrdersTable from "./OrdersTable";

export default function Orders() {
  return (
    <ListPage
      title="Ordens"
      button={<NewOrderButton />}
      table={<OrdersTable />}
    />
  );
}
