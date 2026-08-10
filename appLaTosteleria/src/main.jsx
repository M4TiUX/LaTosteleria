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
import { TableProduct } from "./components/Producto/TableProduct";
import { CreateProduct } from "./components/Producto/CreateProduct";
import { UpdateProduct } from "./components/Producto/UpdateProduct";

import { ListCombo } from "./components/Combo/ListCombo";
import { DetailCombo } from "./components/Combo/DetailCombo";
import { TableCombo } from "./components/Combo/TableCombo";
import { CreateCombo } from "./components/Combo/CreateCombo";
import { UpdateCombo } from "./components/Combo/UpdateCombo";

import { ProcesosList } from "./components/Procesos/ProcesosList";
import { ProcesosDetail } from "./components/Procesos/ProcesosDetail";

import { ListMenus } from "./components/Menu/ListMenus";
import { DetailMenu } from "./components/Menu/DetailMenu";
import { AvailableMenu } from "./components/Menu/AvailableMenu";
import { CreateMenu } from "./components/Menu/CreateMenu";
import { EditMenu } from "./components/Menu/EditMenu";
import { MenuMaintenance } from "./components/Menu/MenuMaintenance";

import { SeguimientoPedido } from "./components/Pedido/SeguimientoPedido";
import { ListPedidos } from "./components/Pedido/ListPedidos";
import { CreatePedido } from "./components/Pedido/CreatePedido";

import { ToastContainer } from "react-toastify";
import { DetailPedido } from "./components/Pedido/DetailPedido";
import { FacturaPedido } from "./components/Pedido/FacturaPedido";

import "./i18n";

import axios from "axios";

const rutas = createBrowserRouter([
  {
    element: <App />,

    children: [
      // =====================================================
      // RUTAS PÚBLICAS
      // =====================================================

      {
        path: "/",
        element: <Home />,
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

      // =====================================================
      // USUARIOS
      // =====================================================

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

      // =====================================================
      // ADMINISTRADOR
      // =====================================================

      {
        element: <Auth requiredRoles={["Administrador"]} />,

        children: [
          // Mantenimiento de productos

          {
            path: "/producto-table",
            element: <TableProduct />,
          },

          {
            path: "/producto/create",
            element: <CreateProduct />,
          },

          {
            path: "/producto/update/:id",
            element: <UpdateProduct />,
          },

          // Mantenimiento de combos

          {
            path: "/combo-table",
            element: <TableCombo />,
          },

          {
            path: "/combo/create",
            element: <CreateCombo />,
          },

          {
            path: "/combo/update/:id",
            element: <UpdateCombo />,
          },

          // Mantenimiento de menús

          {
            path: "/menu/mantenimiento",
            element: <MenuMaintenance />,
          },

          {
            path: "/menu/mantenimiento/crear",
            element: <CreateMenu />,
          },

          {
            path: "/menu/mantenimiento/editar/:id",
            element: <EditMenu />,
          },
        ],
      },

      // =====================================================
      // ADMINISTRADOR Y EMPLEADO
      // =====================================================

      {
        element: <Auth requiredRoles={["Administrador", "Empleado"]} />,

        children: [
          {
            path: "/procesos/",
            element: <ProcesosList />,
          },

          {
            path: "/procesos/:id",
            element: <ProcesosDetail />,
          },
        ],
      },

      // =====================================================
      // CLIENTE
      // =====================================================

      {
        element: <Auth requiredRoles={["Cliente"]} />,

        children: [
          {
            path: "/pedido/crear",
            element: <CreatePedido />,
          },

          {
            path: "/pedido/seguimiento/:id",
            element: <SeguimientoPedido />,
          },
        ],
      },

      // =====================================================
      // CLIENTE, EMPLEADO Y ADMINISTRADOR
      // =====================================================

      {
        element: (
          <Auth requiredRoles={["Cliente", "Empleado", "Administrador"]} />
        ),

        children: [
          {
            path: "/pedido",
            element: <ListPedidos />,
          },
          {
            path: "/pedido/detalle/:id",
            element: <DetailPedido />,
          },
          {
            path: "/pedido/factura/:id",
            element: <FacturaPedido />,
          },
        ],
      },

      // =====================================================
      // PÁGINA NO ENCONTRADA
      // =====================================================

      {
        path: "*",
        element: <PageNotFound />,
      },
    ],
  },
]);

axios.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      const token = JSON.parse(storedUser);

      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={rutas} />

      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </UserProvider>
  </StrictMode>,
);
