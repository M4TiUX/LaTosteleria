import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { createBrowserRouter } from "react-router-dom";
import { Home } from "./components/Home/Home";
import { RouterProvider } from "react-router";
import { PageNotFound } from "./components/Home/PageNotFound";
import { ListMovies } from "./components/Ventanas/ListMovies";
import { DetailMovie } from "./components/Ventanas/DetailMovie";
import ListRentals from "./components/Rental/ListRentals";
import DetailRental from "./components/Rental/DetailRental";
import TableMovies from "./components/Ventanas/TableMovies";
import { CreateMovie } from "./components/Ventanas/CreateMovie";
import { UpdateMovie } from "./components/Ventanas/UpdateMovie";
import { CatalogMovies } from "./components/Ventanas/CatalogMovies";
import { MovieUploadImage } from "./components/Ventanas/MovieUploadImage";
import { CreateMovieRental } from "./components/Rental/CreateMovieRental";
import { GraphRetal } from "./components/Rental/GraphRental";
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

const rutas = createBrowserRouter([
  {
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "*",
        element: <PageNotFound />,
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
          {
            path: "/movie-table",
            element: <TableMovies />,
          },
          {
            path: "/movie/crear/",
            element: <CreateMovie />,
          },
          {
            path: "/movie/update/:id",
            element: <UpdateMovie />,
          },
        ],
      },
      {
        path: "/movie/",
        element: <ListMovies />,
      },
      {
        path: "/catalog-movies/",
        element: <CatalogMovies />,
      },
      {
        path: "/movie/:id",
        element: <DetailMovie />,
      },
      {
        path: "movie/image/",
        element: <MovieUploadImage />,
      },

      {
        path: "/rental",
        element: <ListRentals />,
      },
      {
        path: "/retal/:id",
        element: <DetailRental />,
      },

      {
        path: "/rental/crear/",
        element: <CreateMovieRental />,
      },
      {
        path: "/rental/graph",
        element: <GraphRetal />,
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
