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

import { toast } from "react-toastify";

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

    /*
     * Se envía el nombre de la imagen
     * actual al MenuForm para que pueda
     * mostrar la vista previa.
     */
    imagen: menu.imagen ?? null,

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

  const { t } = useTranslation();

  const [menu, setMenu] = useState(null);

  const [cargando, setCargando] = useState(true);

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    MenuService.getMenuById(id)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((error) => {
        console.error("Error al cargar el menú:", error);

        setErrorMessage(
          error?.response?.data?.message ??
            error?.response?.data?.result ??
            t("menus.edit.loadError"),
        );
        
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id, t]);

  const actualizarMenu = async (data) => {
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("id_menu", Number(id));

      formData.append("nombre_menu", data.nombre_menu);

      formData.append("fecha_inicio", data.fecha_inicio);

      formData.append("fecha_fin", data.fecha_fin);

      formData.append("hora_inicio", data.hora_inicio);

      formData.append("hora_fin", data.hora_fin);

      formData.append("activo", data.activo ? 1 : 0);

      formData.append("productos", JSON.stringify(data.productos ?? []));

      formData.append("combos", JSON.stringify(data.combos ?? []));

      /*
       * Solo se envía una imagen si
       * el usuario seleccionó una nueva.
       *
       * Si data.imagen es null,
       * MenuModel conserva la anterior.
       */
      if (data.imagen instanceof File) {
        formData.append("imagen", data.imagen);
      }

      const response = await MenuService.updateMenu(formData);

      toast.success(response?.data?.message || t("menus.edit.success"));

      const updatedMenuId = response?.data?.id_menu ?? Number(id);

      navigate(
        updatedMenuId ? `/menu/${updatedMenuId}` : "/menu/mantenimiento",
      );
    } catch (error) {
      console.error("Error al actualizar el menú:", error);

      const mensaje =
        error?.response?.data?.message ??
        error?.response?.data?.result ??
        t("menus.edit.updateError");

      setErrorMessage(mensaje);

      toast.error(mensaje);
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
        sx={{
          mb: 3,
        }}
      >
        <Typography variant="h4" fontWeight="bold">
          {t("menus.edit.title")}
        </Typography>

        <Typography color="text.secondary">
          {t("menus.edit.description")}
        </Typography>
      </Stack>

      {errorMessage && (
        <Alert
          severity="error"
          sx={{
            mb: 3,
          }}
        >
          {errorMessage}
        </Alert>
      )}

      {menu ? (
        <MenuForm
          defaultValues={buildDefaultValues(menu)}
          onSubmit={actualizarMenu}
          submitText={t("menus.edit.update")}
        />
      ) : (
        <Alert severity="warning">{t("menus.edit.notFound")}</Alert>
      )}
    </Container>
  );
}
