import { useEffect, useState } from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
  Alert,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";

import ProcesoServices from "../../services/ProcesosServices";
import { ProcesoForm } from "./Form/ProcesoForm";

import { toast } from "react-toastify";

export function UpdateProceso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [proceso, setProceso] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // CARGAR PROCESO
  // =====================================================

  useEffect(() => {
    ProcesoServices.getProcesoById(id)
      .then((response) => {
        if (response.data?.status === 200) {
          setProceso({
            ...response.data.result,
            id_producto: Number(id),
          });
        } else {
          setError(
            t(
              "processMaintenance.update.loadError"
            )
          );
        }
      })
      .catch((err) => {
        console.error(err);

        setError(
          err?.response?.data?.result ??
            t(
              "processMaintenance.update.loadError"
            )
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, t]);

  // =====================================================
  // ACTUALIZAR
  // =====================================================

  const actualizarProceso = async (data) => {
    setError("");

    try {
      const response =
        await ProcesoServices.updateProceso(data);

      toast.success(
        response.data?.message ||
          t(
            "processMaintenance.form.updateSuccess"
          )
      );

      navigate("/procesos/mantenimiento");
    } catch (err) {
      console.error(
        "Error al actualizar el proceso:",
        err
      );

      let message;

      if (err.response) {
        message =
          err.response?.data?.message ||
          err.response?.data?.result ||
          t(
            "processMaintenance.form.updateError"
          );
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

  // =====================================================
  // CARGANDO
  // =====================================================

  if (loading) {
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

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Stack spacing={1} sx={{ mb: 3 }}>
        <Typography
          variant="h3"
          fontWeight="bold"
        >
          {t(
            "processMaintenance.update.title"
          )}
        </Typography>

        <Typography color="text.secondary">
          {t(
            "processMaintenance.update.description"
          )}
        </Typography>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {proceso && (
        <ProcesoForm
          initialData={proceso}
          onSubmit={actualizarProceso}
          submitText={t(
            "processMaintenance.update.button"
          )}
          editing
        />
      )}
    </Container>
  );
}