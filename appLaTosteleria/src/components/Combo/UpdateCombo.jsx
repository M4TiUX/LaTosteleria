import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Box, CircularProgress, Typography } from "@mui/material";
import { toast } from "react-toastify";

import ComboService from "../../services/ComboService";
import { ComboForm } from "./Form/ComboForm";

export function UpdateCombo() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [combo, setCombo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    ComboService.getComboById(id)
      .then((response) => {
        const datos = response.data?.data || response.data;

        setCombo(datos);
      })
      .catch((error) => {
        console.error("Error al cargar el combo:", error);
        setError("No fue posible cargar el combo.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const actualizarCombo = async (datos) => {
    try {
      setGuardando(true);

      const response = await ComboService.updateCombo({
        id_combo: Number(id),
        ...datos,
      });

      toast.success(
        response.data?.message ||
          "Combo actualizado correctamente."
      );

      navigate("/combo-table");
    } catch (error) {
      console.error("Error al actualizar el combo:", error);

      toast.error(
        error.response?.data?.message ||
          "Ocurrió un error al actualizar el combo."
      );
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 8,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 850, mx: "auto", py: 5 }}>
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }

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
        Editar Combo
      </Typography>

      <ComboForm
        defaultValues={combo}
        onSubmit={actualizarCombo}
        guardando={guardando}
        textoBoton="Actualizar Combo"
      />
    </Box>
  );
}