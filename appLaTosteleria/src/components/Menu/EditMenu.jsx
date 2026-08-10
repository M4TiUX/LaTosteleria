import { useEffect, useState } from "react";
import {
  useNavigate,
  useParams,
} from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  CircularProgress,
  Typography,
} from "@mui/material";

import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

export function EditMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [menu, setMenu] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    MenuService.getMenuById(id)
      .then((response) => {
        setMenu(response.data);
      })
      .catch((err) => {
        console.error(
          "Error al cargar el menú:",
          err
        );

        setError(
          err.response?.data?.message ||
            t("menus.edit.loadError")
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, t]);

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await MenuService.updateMenu({
        id_menu: Number(id),
        ...data,
      });

      navigate("/menu-maintenance");
    } catch (err) {
      console.error(
        "Error al actualizar el menú:",
        err
      );

      setError(
        err.response?.data?.message ||
          t("menus.edit.updateError")
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
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

  if (!menu) {
    return (
      <Box
        sx={{
          maxWidth: 1000,
          mx: "auto",
          py: 4,
        }}
      >
        <Alert severity="warning">
          {error || t("menus.edit.notFound")}
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1000,
        mx: "auto",
        py: 4,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          mb: 1,
        }}
      >
        {t("menus.edit.title")}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {t("menus.edit.description")}
      </Typography>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <MenuForm
        defaultValues={menu}
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={t("menus.edit.update")}
      />
    </Box>
  );
}