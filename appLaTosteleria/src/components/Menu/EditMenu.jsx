import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, CircularProgress, Container, Stack, Typography } from "@mui/material";
import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

function normalizeTime(value) {
  if (!value) {
    return "";
  }

  return String(value).slice(0, 5);
}

function buildDefaultValues(menu) {
  const productos = [];
  const combos = [];

  menu.categorias?.forEach((category) => {
    category.productos?.forEach((item) => {
      productos.push(Number(item.id));
    });

    category.combos?.forEach((item) => {
      combos.push(Number(item.id));
    });
  });

  return {
    id_menu: Number(menu.id_menu),
    nombre_menu: menu.nombre_menu ?? "",
    fecha_inicio: menu.fecha_inicio ?? "",
    fecha_fin: menu.fecha_fin ?? "",
    hora_inicio: normalizeTime(menu.hora_inicio),
    hora_fin: normalizeTime(menu.hora_fin),
    productos: Array.from(new Set(productos)),
    combos: Array.from(new Set(combos)),
    activo: Number(menu.activo) === 1,
  };
}

export function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [menu, setMenu] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    MenuService.getMenuById(id)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        setErrorMessage(
          error?.response?.data?.message ??
            error?.response?.data ??
            "No fue posible cargar el menú solicitado.",
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const actualizarMenu = async (data) => {
    setErrorMessage("");

    try {
      const payload = {
        ...data,
        id_menu: Number(id),
        activo: data.activo ? 1 : 0,
      };

      const response = await MenuService.updateMenu(payload);
      const updatedMenuId = response?.data?.id_menu ?? Number(id);

      navigate(updatedMenuId ? `/menu/${updatedMenuId}` : "/menu/mantenimiento");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          error?.response?.data ??
          "No fue posible actualizar el menú.",
      );
    }
  };

  if (cargando) {
    return (
      <Container maxWidth="lg" sx={{ py: 6, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Modificar menú
        </Typography>
        <Typography color="text.secondary">
          Actualice la disponibilidad y los elementos incluidos en el menú.
        </Typography>
      </Stack>

      {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

      {menu ? (
        <MenuForm
          defaultValues={buildDefaultValues(menu)}
          onSubmit={actualizarMenu}
          submitText="Actualizar menú"
        />
      ) : (
        <Alert severity="warning">No se encontró el menú solicitado.</Alert>
      )}
    </Container>
  );
}
