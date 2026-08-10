import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Typography,
} from "@mui/material";

import MenuService from "../../services/MenuService";
import { MenuForm } from "./MenuForm";

export function CreateMenu() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (data) => {
    try {
      setSaving(true);
      setError("");

      await MenuService.createMenu(data);

      navigate("/menu-maintenance");
    } catch (err) {
      console.error("Error al crear el menú:", err);

      setError(
        err.response?.data?.message ||
          t("menus.create.error")
      );
    } finally {
      setSaving(false);
    }
  };

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
        {t("menus.create.title")}
      </Typography>

      <Typography
        variant="body1"
        color="text.secondary"
        sx={{ mb: 3 }}
      >
        {t("menus.create.description")}
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
        onSubmit={handleSubmit}
        saving={saving}
        submitLabel={t("menus.create.save")}
      />
    </Box>
  );
}