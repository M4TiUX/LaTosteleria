import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import ProcesoServices from "../../services/ProcesosServices";
import { ProcesoForm } from "./Form/ProcesoForm";

import { toast } from "react-toastify";

export function CreateProceso() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [error, setError] = useState("");

  const guardarProceso = async (data) => {
    setError("");

    try {
      const response =
        await ProcesoServices.createProceso(data);

      toast.success(
        response.data?.message ||
          t("processMaintenance.form.createSuccess")
      );

      navigate("/procesos/mantenimiento");
    } catch (err) {
      console.error(
        "Error al guardar el proceso:",
        err
      );

      let message;

      if (err.response) {
        message =
          err.response?.data?.message ||
          err.response?.data?.result ||
          t("processMaintenance.form.createError");
      } else {
        message = t(
          "processMaintenance.form.serverError"
        );
      }

      setError(message);
      toast.error(message);

      throw err;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
        >
          {t("processMaintenance.create.title")}
        </Typography>

        <Typography color="text.secondary">
          {t(
            "processMaintenance.create.description"
          )}
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <ProcesoForm
        onSubmit={guardarProceso}
        submitText={t(
          "processMaintenance.create.button"
        )}
      />
    </Container>
  );
}