import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import UserProvider from "./components/User/UserProvider";
import { Unauthorized } from "./components/User/Unauthorized";
import { Login } from "./components/User/Login";
import { Logout } from "./components/User/Logout";
import { Signup } from "./components/User/Signup";
import { Auth } from "./components/User/Auth";
import { ListProduct } from "./components/Producto/ListProduct";
import { DetailProduct } from "./components/Producto/DetailProduct";
import { ListCombo } from "./components/Combo/ListCombo";
import { DetailCombo } from "./components/Combo/DetailCombo";
import { ProcesosList } from "./components/Procesos/ProcesosList";
import { ProcesosDetail } from "./components/Procesos/ProcesosDetail";
import { TableProduct } from "./components/Producto/TableProduct";
import { ListMenus } from "./components/Menu/ListMenus";
import { DetailMenu } from "./components/Menu/DetailMenu";
import { AvailableMenu } from "./components/Menu/AvailableMenu";
import { SeguimientoPedido } from "./components/Pedido/SeguimientoPedido";
import { CreateProduct } from "./components/Producto/CreateProduct";

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      //Grupos de rutas a autorizar
      //Grupo 1: Administrador
      //Grupo 2: Cliente
      //Grupo 3: Administrador y el Cliente
      {
        //Grupo 1
        path: "/",
        element: <Auth requiredRoles={["Administrador"]} />,
        children: [
          
        ],
      },
      {
        path: "/unauthorized",
        element: <Unauthorized />,
      },
      {
        path: "/user/login",
        element: <Login />,
      },
      {
        path: "/user/logout",
        element: <Logout />,
      },
      {
        path: "/user/create",
        element: <Signup />,
      },
      {
        path: "/producto/",
        element: <ListProduct />,
      },
      {
        path: "/producto/:id",
        element: <DetailProduct />,
      },
      {
        path: "/combo/",
        element: <ListCombo />,
      },
      {
        path: "/combo/:id",
        element: <DetailCombo />,
      },
      {
        path: "/procesos/",
        element: <ProcesosList />,
      },
      {
        path: "/procesos/:id",
        element: <ProcesosDetail />,
      },
      {
        path: "/producto-table",
        element: <TableProduct />,
      },
      {
        path: "/menu/",
        element: <ListMenus />,
      },
      {
        path: "/menu/disponible",
        element: <AvailableMenu />,
      },
      {
        path: "/menu/:id",
        element: <DetailMenu />,
      },
      {
        path: "*",
        element: <PageNotFound />,
      },
      {
        path: "/pedido/seguimiento/:id",
        element: <SeguimientoPedido />,
      },
      {
        path: "/producto/create",
        element: <CreateProduct />,
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />
    </UserProvider>
  </StrictMode>,
);
