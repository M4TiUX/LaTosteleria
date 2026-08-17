import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Alert, Box, CircularProgress, Typography } from "@mui/material";

import { toast } from "react-toastify";

import ComboService from "../../services/ComboService";

import { ComboForm } from "./Form/ComboForm";

export function UpdateCombo() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { t } = useTranslation();

  const [combo, setCombo] = useState(null);

  const [cargando, setCargando] = useState(true);

  const [guardando, setGuardando] = useState(false);

  const [error, setError] = useState(false);

  useEffect(() => {
    ComboService.getComboById(id)
      .then((response) => {
        const datos = response.data?.data || response.data;

        setCombo(datos);
      })
      .catch((error) => {
        console.error("Error al cargar el combo:", error);

        setError(true);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const actualizarCombo = async (datos) => {
    try {
      setGuardando(true);

      const formData = new FormData();

      formData.append("id_combo", Number(id));

      formData.append("nombre_combo", datos.nombre_combo);

      formData.append("descripcion", datos.descripcion);

      formData.append("precio_especial", datos.precio_especial);

      formData.append("categoria_id", datos.categoria_id);

      formData.append("productos", JSON.stringify(datos.productos));

      /*
       * Solo se envía imagen si
       * el usuario seleccionó
       * una nueva.
       */
      if (datos.archivoImagen) {
        formData.append("imagen", datos.archivoImagen);
      }

      const response = await ComboService.updateCombo(formData);

      toast.success(response.data?.message || t("combos.form.updateSuccess"));

      navigate("/combo-table");
    } catch (error) {
      console.error("Error al actualizar el combo:", error);

      const mensajeServidor = error.response?.data?.message;

      if (
        mensajeServidor === "Ya existe otro combo registrado con ese nombre."
      ) {
        toast.error(t("combos.form.validation.duplicateName"));
      } else if (error.response) {
        toast.error(mensajeServidor || t("combos.form.updateError"));
      } else {
        toast.error(t("combos.form.serverError"));
      }
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
      <Box
        sx={{
          maxWidth: 850,
          mx: "auto",
          py: 5,
        }}
      >
        <Alert severity="error">{t("combos.form.loadError")}</Alert>
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
        {t("combos.form.updateTitle")}
      </Typography>

      <ComboForm
        defaultValues={combo}
        onSubmit={actualizarCombo}
        guardando={guardando}
        textoBoton={t("combos.form.update")}
      />
    </Box>
  );
}
