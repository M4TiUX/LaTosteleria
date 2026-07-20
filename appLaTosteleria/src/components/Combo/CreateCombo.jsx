import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography } from "@mui/material";
import { toast } from "react-toastify";

import ComboService from "../../services/ComboService";
import { ComboForm } from "./Form/ComboForm";

export function CreateCombo() {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const guardarCombo = async (combo) => {
    try {
      setGuardando(true);

      const response = await ComboService.createCombo(combo);

      toast.success(
        response.data?.message ||
          "Combo registrado correctamente."
      );

      navigate("/combo-table");
    } catch (error) {
      console.error("Error al guardar el combo:", error);

      toast.error(
        error.response?.data?.message ||
          "Ocurrió un error al registrar el combo."
      );
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box
      sx={{
        py: 5,
        px: 2,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          textAlign: "center",
          fontWeight: 700,
          color: "#4a1714",
          mb: 4,
        }}
      >
        Crear Combo
      </Typography>

      <ComboForm
        onSubmit={guardarCombo}
        guardando={guardando}
        textoBoton="Registrar Combo"
      />
    </Box>
  );
}