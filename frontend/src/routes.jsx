import { Route, BrowserRouter, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard/Dashboard";
import Orders from "./pages/Orders/Orders";
import RiberBot from "./pages/RiberBot/RiberBot";
import NewOrder from "./pages/Orders/NewOrder";
import ViewOrder from "./pages/Orders/ViewOrder";
import Monitors from "./pages/Monitors/Monitors";
import NewMonitor from "./pages/Monitors/NewMonitor";
import Automations from "./pages/Automations/Automations";
import NewAutomation from "./pages/Automations/NewAutomation/NewAutomation";
import OrderTemplates from "./pages/OrderTemplates/OrderTemplates";

function Router() {
  function PrivateRoute({ children }) {
    const isAuth = localStorage.getItem("token") !== null;
    return isAuth ? children : <Navigate to="/" />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/view/:id"
          element={
            <PrivateRoute>
              <ViewOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders/new"
          element={
            <PrivateRoute>
              <NewOrder />
            </PrivateRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <PrivateRoute>
              <Orders />
            </PrivateRoute>
          }
        />
        <Route
          path="/ordertemplates"
          element={
            <PrivateRoute>
              <OrderTemplates />
            </PrivateRoute>
          }
        />
        <Route
          path="/automations/edit/:id"
          element={
            <PrivateRoute>
              <NewAutomation />
            </PrivateRoute>
          }
        />
        <Route
          path="/automations/new"
          element={
            <PrivateRoute>
              <NewAutomation />
            </PrivateRoute>
          }
        />
        <Route
          path="/automations"
          element={
            <PrivateRoute>
              <Automations />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitors/edit/:id"
          element={
            <PrivateRoute>
              <NewMonitor />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitors/new"
          element={
            <PrivateRoute>
              <NewMonitor />
            </PrivateRoute>
          }
        />
        <Route
          path="/monitors"
          element={
            <PrivateRoute>
              <Monitors />
            </PrivateRoute>
          }
        />
        <Route
          path="/riberBot"
          element={
            <PrivateRoute>
              <RiberBot />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Router;
