import { Route, Routes } from "react-router-dom";

import Orders from "../pages/Orders";
import OrderDetail from "../pages/Orders/detail";

export function OrdersRoute() {
  return (
    <Routes>
      <Route path="/:id" element={<OrderDetail />} />
      <Route path="/" element={<Orders />} />
    </Routes>
  );
}