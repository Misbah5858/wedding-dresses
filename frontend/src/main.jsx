import "bootstrap-icons/font/bootstrap-icons.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AddDress from "./AddDress";
import AddProduct from "./AddProduct";
import EditDress from "./EditDress";
import "./index.css";
import ManageDresses from "./ManageDresses";
import Orders from "./Orders";
import ShowAll from "./ShowAll";
import UpdateProduct from "./UpdateProduct";
import LandingPage from "./LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/shop",
    element: <ShowAll />,
  },
  {
    path: "/purchase-dress/:dressId",
    element: <AddProduct />,
  },
  {
    path: "/update-order/:id",
    element: <UpdateProduct />,
  },
  {
    path: "/manage-dresses",
    element: <ManageDresses />,
  },
  {
    path: "/add-dress",
    element: <AddDress />,
  },
  {
    path: "/edit-dress/:id",
    element: <EditDress />,
  },
  {
    path: "/orders",
    element: <Orders />,
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
