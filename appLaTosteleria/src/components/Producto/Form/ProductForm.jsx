import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import * as yup from "yup";

import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import { SelectCategory } from "./SelectCategory";
import { SelectIngredients } from "./SelectIngredients";

const productSchema = yup.object({
  nombre_producto: yup
    .string()
    .trim()
    .required("El nombre del producto es obligatorio.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),

  descripcion: yup
    .string()
    .trim()
    .required("La descripción es obligatoria.")
    .min(10, "La descripción debe tener al menos 10 caracteres."),

  precio: yup
    .number()
    .typeError("El precio debe ser un valor numérico.")
    .required("El precio es obligatorio.")
    .positive("El precio debe ser mayor que cero.")
    .max(99999999.99, "El precio supera el máximo permitido."),

  categoria_id: yup
    .number()
    .typeError("Debe seleccionar una categoría.")
    .required("Debe seleccionar una categoría.")
    .positive("Debe seleccionar una categoría válida."),

  ingredientes: yup
    .array()
    .of(yup.number())
    .min(1, "Debe seleccionar al menos un ingrediente.")
    .required("Debe seleccionar al menos un ingrediente."),

  imagen: yup.string().nullable(),
});

export function ProductForm({
  defaultValues,
  onSubmit,
  submitText = "Guardar producto",
}) {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: defaultValues ?? {
      nombre_producto: "",
      descripcion: "",
      precio: "",
      categoria_id: "",
      ingredientes: [],
      imagen: "",
    },
  });

  return (
    <Card
      sx={{
        maxWidth: 900,
        mx: "auto",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          Información del producto
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register("nombre_producto")}
                label="Nombre del producto"
                fullWidth
                error={Boolean(errors.nombre_producto)}
                helperText={errors.nombre_producto?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register("precio")}
                label="Precio"
                type="number"
                fullWidth
                inputProps={{
                  min: 0,
                  step: "0.01",
                }}
                error={Boolean(errors.precio)}
                helperText={errors.precio?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("descripcion")}
                label="Descripción"
                multiline
                rows={3}
                fullWidth
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectCategory
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <SelectIngredients
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("imagen")}
                label="Nombre de la imagen"
                fullWidth
                placeholder="ejemplo.jpg"
                error={Boolean(errors.imagen)}
                helperText={
                  errors.imagen?.message ??
                  "La carga real del archivo se agregará en el siguiente paso."
                }
              />
            </Grid>

            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  disabled={isSubmitting}
                  sx={{
                    minWidth: 190,
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {isSubmitting
                    ? "Guardando..."
                    : submitText}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}