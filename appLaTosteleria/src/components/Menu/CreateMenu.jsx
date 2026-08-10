import { useNavigate } from "react-router-dom";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

export function CreateMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [errorMessage, setErrorMessage] = useState("");

  const guardarMenu = async (data) => {
    setErrorMessage("");

    try {
      // Mantiene la lógica original:
      // el formulario utiliza boolean y el API recibe 1 / 0.
      const payload = {
        ...data,
        activo: data.activo ? 1 : 0,
      };

      const response = await MenuService.createMenu(payload);

      // Recuperar el ID creado como hacía el archivo original.
      const createdMenuId = response?.data?.id_menu;

      // Si existe el ID, ir al detalle.
      // Si no, regresar al mantenimiento.
      navigate(
        createdMenuId
          ? `/menu/${createdMenuId}`
          : "/menu/mantenimiento"
      );
    } catch (error) {
      console.error("Error al registrar el menú:", error);

      setErrorMessage(
        error?.response?.data?.message ??
          error?.response?.data ??
          t("menus.create.error")
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          {t("menus.create.title")}
        </Typography>

        <Typography color="text.secondary">
          {t("menus.create.description")}
        </Typography>
      </Stack>

      {errorMessage && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {errorMessage}
        </Alert>
      )}

      <MenuForm
        onSubmit={guardarMenu}
        submitText={t("menus.create.save")}
      />
    </Container>
  );
}