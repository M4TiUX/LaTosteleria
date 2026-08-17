import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { Box, Typography } from "@mui/material";

import { toast } from "react-toastify";

import ComboService from "../../services/ComboService";

import { ComboForm } from "./Form/ComboForm";

export function CreateCombo() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [guardando, setGuardando] = useState(false);

  const guardarCombo = async (combo) => {
    try {
      setGuardando(true);

      const formData = new FormData();

      formData.append("nombre_combo", combo.nombre_combo);

      formData.append("descripcion", combo.descripcion);

      formData.append("precio_especial", combo.precio_especial);

      formData.append("categoria_id", combo.categoria_id);

      /*
       * Los productos contienen
       * producto_id y cantidad.
       */
      formData.append("productos", JSON.stringify(combo.productos));

      if (combo.archivoImagen) {
        formData.append("imagen", combo.archivoImagen);
      }

      const response = await ComboService.createCombo(formData);

      toast.success(response.data?.message || t("combos.form.createSuccess"));

      navigate("/combo-table");
    } catch (error) {
      console.error("Error al guardar el combo:", error);

      const mensajeServidor = error.response?.data?.message;

      if (mensajeServidor === "Ya existe un combo registrado con ese nombre.") {
        toast.error(t("combos.form.validation.duplicateName"));
      } else if (error.response) {
        toast.error(mensajeServidor || t("combos.form.createError"));
      } else {
        toast.error(t("combos.form.serverError"));
      }
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
        {t("combos.form.createTitle")}
      </Typography>

      <ComboForm
        onSubmit={guardarCombo}
        guardando={guardando}
        textoBoton={t("combos.form.register")}
      />
    </Box>
  );
}
