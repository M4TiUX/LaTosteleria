import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

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

    hora_inicio: normalizeTime(
      menu.hora_inicio
    ),

    hora_fin: normalizeTime(
      menu.hora_fin
    ),

    productos: Array.from(
      new Set(productos)
    ),

    combos: Array.from(
      new Set(combos)
    ),

    activo:
      Number(menu.activo) === 1,
  };
}

export function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [menu, setMenu] =
    useState(null);

  const [cargando, setCargando] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    MenuService.getMenuById(id)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.error(
          "Error al cargar el menú:",
          error
        );

        setErrorMessage(
          error?.response?.data?.message ??
            error?.response?.data ??
            t("menus.edit.loadError")
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id, t]);

  const actualizarMenu = async (
    data
  ) => {
    setErrorMessage("");

    try {
      const payload = {
        ...data,
        id_menu: Number(id),
        activo: data.activo ? 1 : 0,
      };

      const response =
        await MenuService.updateMenu(
          payload
        );

      const updatedMenuId =
        response?.data?.id_menu ??
        Number(id);

      navigate(
        updatedMenuId
          ? `/menu/${updatedMenuId}`
          : "/menu/mantenimiento"
      );
    } catch (error) {
      console.error(
        "Error al actualizar el menú:",
        error
      );

      setErrorMessage(
        error?.response?.data?.message ??
          error?.response?.data ??
          t("menus.edit.updateError")
      );
    }
  };

  if (cargando) {
    return (
      <Container
        maxWidth="lg"
        sx={{
          py: 6,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container
      maxWidth="lg"
      sx={{
        mt: 4,
        mb: 4,
      }}
    >
      <Stack
        spacing={1.5}
        sx={{ mb: 3 }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
        >
          {t("menus.edit.title")}
        </Typography>

        <Typography color="text.secondary">
          {t(
            "menus.edit.description"
          )}
        </Typography>
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {errorMessage}
        </Alert>
      )}

      {menu ? (
        <MenuForm
          defaultValues={buildDefaultValues(
            menu
          )}
          onSubmit={actualizarMenu}
          submitText={t(
            "menus.edit.update"
          )}
        />
      ) : (
        <Alert severity="warning">
          {t("menus.edit.notFound")}
        </Alert>
      )}
    </Container>
  );
}