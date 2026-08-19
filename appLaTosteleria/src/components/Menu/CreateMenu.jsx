import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Alert, Container, Stack, Typography } from "@mui/material";

import { toast } from "react-toastify";

import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

export function CreateMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState("");

  const guardarMenu = async (data) => {
    setErrorMessage("");

    try {
      // ==========================================
      // CREAR FORMDATA
      // ==========================================

      const formData = new FormData();

      formData.append("nombre_menu", data.nombre_menu);

      formData.append("fecha_inicio", data.fecha_inicio);

      formData.append("fecha_fin", data.fecha_fin);

      formData.append("hora_inicio", data.hora_inicio);

      formData.append("hora_fin", data.hora_fin);

      formData.append("activo", data.activo ? 1 : 0);

      // ==========================================
      // PRODUCTOS
      // ==========================================

      formData.append("productos", JSON.stringify(data.productos ?? []));

      // ==========================================
      // COMBOS
      // ==========================================

      formData.append("combos", JSON.stringify(data.combos ?? []));

      // ==========================================
      // IMAGEN
      // ==========================================

      if (data.imagen) {
        formData.append("imagen", data.imagen);
      }

      // ==========================================
      // GUARDAR
      // ==========================================

      const response = await MenuService.createMenu(formData);

      toast.success(response?.data?.message || t("menus.create.success"));

      /*
       * Si el API devuelve el ID del menú,
       * vamos directamente al detalle.
       *
       * De lo contrario regresamos al
       * mantenimiento.
       */
      const createdMenuId = response?.data?.id_menu;

      navigate(
        createdMenuId ? `/menu/${createdMenuId}` : "/menu/mantenimiento",
      );
    } catch (error) {
      console.error("Error al registrar el menú:", error);

      const mensaje =
        error?.response?.data?.message ??
        error?.response?.data?.result ??
        t("menus.create.error");

      setErrorMessage(mensaje);

      toast.error(mensaje);
    }
  };

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
          {t("menus.create.title")}
        </Typography>

        <Typography color="text.secondary">
          {t("menus.create.description")}
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

      <MenuForm onSubmit={guardarMenu} submitText={t("menus.create.save")} />
    </Container>
  );
}
