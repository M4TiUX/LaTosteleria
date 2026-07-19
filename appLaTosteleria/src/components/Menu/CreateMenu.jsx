import { useNavigate } from "react-router-dom";
import { Alert, Container, Stack, Typography } from "@mui/material";
import { useState } from "react";
import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

export function CreateMenu() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const guardarMenu = async (data) => {
    setErrorMessage("");

    try {
      const payload = {
        ...data,
        activo: data.activo ? 1 : 0,
      };

      const response = await MenuService.createMenu(payload);
      const createdMenuId = response?.data?.id_menu;

      navigate(createdMenuId ? `/menu/${createdMenuId}` : "/menu/mantenimiento");
    } catch (error) {
      setErrorMessage(
        error?.response?.data?.message ??
          error?.response?.data ??
          "No fue posible registrar el menú.",
      );
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Stack spacing={1.5} sx={{ mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Crear menú
        </Typography>
        <Typography color="text.secondary">
          Registre la disponibilidad, los productos y los combos que formarán parte del menú.
        </Typography>
      </Stack>

      {errorMessage && <Alert severity="error" sx={{ mb: 3 }}>{errorMessage}</Alert>}

      <MenuForm onSubmit={guardarMenu} submitText="Guardar menú" />
    </Container>
  );
}
