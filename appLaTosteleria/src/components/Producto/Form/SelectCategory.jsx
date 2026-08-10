import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";

import {
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

import CategoryService from "../../../services/CategoryService";

export function SelectCategory({ control, errors }) {
  const { t } = useTranslation();

  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    CategoryService.getCategories()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategorias(response.data);
        } else {
          setCategorias([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar categorías:", error);
        setCategorias([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  return (
    <Controller
      name="categoria_id"
      control={control}
      render={({ field }) => (
        <FormControl
          fullWidth
          error={Boolean(errors.categoria_id)}
          disabled={cargando}
        >
          <InputLabel id="categoria-label">
            {t("products.form.category")}
          </InputLabel>

          <Select
            {...field}
            labelId="categoria-label"
            label={t("products.form.category")}
            value={field.value ?? ""}
          >
            {cargando ? (
              <MenuItem disabled>
                <CircularProgress size={20} sx={{ mr: 1 }} />
                {t("products.form.loadingCategories")}
              </MenuItem>
            ) : (
              categorias.map((categoria) => (
                <MenuItem
                  key={categoria.id_categoria}
                  value={Number(categoria.id_categoria)}
                >
                  {categoria.nombre_categoria}
                </MenuItem>
              ))
            )}
          </Select>

          <FormHelperText>
            {errors.categoria_id?.message}
          </FormHelperText>
        </FormControl>
      )}
    />
  );
}