import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  TextField,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";

import * as yup from "yup";

import CategoryService from "../../../services/CategoryService";
import IngredientService from "../../../services/IngredientService";

const productSchema = yup.object({
  nombre_producto: yup
    .string()
    .required("El nombre del producto es obligatorio")
    .min(3, "El nombre debe tener al menos 3 caracteres"),

  descripcion: yup
    .string()
    .required("La descripción es obligatoria")
    .min(5, "La descripción debe tener al menos 5 caracteres"),

  precio: yup
    .number()
    .typeError("El precio debe ser un número")
    .positive("El precio debe ser mayor que cero")
    .required("El precio es obligatorio"),

  categoria_id: yup
    .number()
    .typeError("Debe seleccionar una categoría")
    .positive("Debe seleccionar una categoría")
    .required("La categoría es obligatoria"),

  ingredientes: yup
    .array()
    .min(1, "Debe seleccionar al menos un ingrediente")
    .required("Debe seleccionar al menos un ingrediente"),

  imagen: yup.string().nullable(),
});

export default function ProductForm({
  defaultValues,
  onSubmit,
  buttonText = "Guardar producto",
  loading = false,
}) {
  const [categorias, setCategorias] = useState([]);
  const [ingredientesDisponibles, setIngredientesDisponibles] = useState([]);
  const [cargandoDatos, setCargandoDatos] = useState(true);

  const [nombreImagen, setNombreImagen] = useState(defaultValues?.imagen || "");

  const [vistaPrevia, setVistaPrevia] = useState(
    defaultValues?.imagen ? `/images/${defaultValues.imagen}` : null,
  );
  const [archivoImagen, setArchivoImagen] = useState(null);

  const valoresIniciales = {
    nombre_producto: "",
    descripcion: "",
    precio: "",
    categoria_id: "",
    ingredientes: [],
    imagen: "",
    ...defaultValues,
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: valoresIniciales,
    resolver: yupResolver(productSchema),
  });

  useEffect(() => {
    cargarDatosFormulario();
  }, []);

  const cargarDatosFormulario = async () => {
    try {
      setCargandoDatos(true);

      const [respuestaCategorias, respuestaIngredientes] = await Promise.all([
        CategoryService.getCategories(),
        IngredientService.getIngredients(),
      ]);

      /*
       * Ajusta estas líneas si tus servicios devuelven directamente
       * el arreglo y no utilizan la propiedad data.
       */
      setCategorias(respuestaCategorias?.data || respuestaCategorias || []);

      setIngredientesDisponibles(
        respuestaIngredientes?.data || respuestaIngredientes || [],
      );
    } catch (error) {
      console.error("Error al cargar el formulario:", error);
    } finally {
      setCargandoDatos(false);
    }
  };

  const seleccionarImagen = (event) => {
    const archivo = event.target.files?.[0];

    if (!archivo) {
      return;
    }

    if (!archivo.type.startsWith("image/")) {
      alert("Debe seleccionar un archivo de imagen.");
      return;
    }

    const urlTemporal = URL.createObjectURL(archivo);

    // Guardar el archivo real
    setArchivoImagen(archivo);

    // Mostrar información y vista previa
    setNombreImagen(archivo.name);
    setVistaPrevia(urlTemporal);
  };

  const enviarFormulario = (datos) => {
    onSubmit({
      ...datos,
      precio: Number(datos.precio),
      categoria_id: Number(datos.categoria_id),
      archivoImagen: archivoImagen,
    });
  };

  if (cargandoDatos) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Card
      sx={{
        width: "100%",
        maxWidth: 950,
        mx: "auto",
        borderRadius: 4,
        boxShadow: 8,
        overflow: "visible",
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 3,
            md: 5,
          },
        }}
      >
        {/* Mejora 2: título y descripción */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            Crear producto
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Complete la información necesaria para registrar un nuevo producto
            en el catálogo.
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(enviarFormulario)}
        >
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nombre del producto"
                {...register("nombre_producto")}
                error={Boolean(errors.nombre_producto)}
                helperText={errors.nombre_producto?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Precio"
                type="number"
                slotProps={{
                  htmlInput: {
                    min: 0,
                    step: "0.01",
                  },
                }}
                {...register("precio")}
                error={Boolean(errors.precio)}
                helperText={errors.precio?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Descripción"
                {...register("descripcion")}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="categoria_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label="Categoría"
                    error={Boolean(errors.categoria_id)}
                    helperText={errors.categoria_id?.message}
                    slotProps={{
                      select: {
                        native: true,
                      },
                    }}
                  >
                    <option value="">Seleccione una categoría</option>

                    {categorias.map((categoria) => (
                      <option
                        key={categoria.id_categoria}
                        value={categoria.id_categoria}
                      >
                        {categoria.nombre_categoria}
                      </option>
                    ))}
                  </TextField>
                )}
              />
            </Grid>

            {/* Mejora 6: ingredientes como chips */}
            <Grid item xs={12} md={6}>
              <Controller
                name="ingredientes"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    multiple
                    options={ingredientesDisponibles}
                    value={ingredientesDisponibles.filter((ingrediente) =>
                      field.value
                        ?.map(Number)
                        .includes(Number(ingrediente.id_ingrediente)),
                    )}
                    getOptionLabel={(ingrediente) =>
                      ingrediente.nombre_ingrediente || ""
                    }
                    isOptionEqualToValue={(option, value) =>
                      Number(option.id_ingrediente) ===
                      Number(value.id_ingrediente)
                    }
                    onChange={(_, seleccionados) => {
                      field.onChange(
                        seleccionados.map((ingrediente) =>
                          Number(ingrediente.id_ingrediente),
                        ),
                      );
                    }}
                    renderTags={(seleccionados, getTagProps) =>
                      seleccionados.map((ingrediente, index) => {
                        const { key, ...tagProps } = getTagProps({
                          index,
                        });

                        return (
                          <Chip
                            key={key}
                            label={ingrediente.nombre_ingrediente}
                            {...tagProps}
                            variant="filled"
                            color="primary"
                          />
                        );
                      })
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Ingredientes"
                        placeholder="Seleccione ingredientes"
                        error={Boolean(errors.ingredientes)}
                        helperText={errors.ingredientes?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Mejora 3: selección y vista previa de imagen */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: errors.imagen ? "error.main" : "divider",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  Imagen del producto
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  Seleccione una imagen para representar el producto.
                </Typography>

                <input
                  id="imagen-producto"
                  type="file"
                  accept="image/png, image/jpeg, image/webp"
                  hidden
                  onChange={seleccionarImagen}
                />

                <input type="hidden" {...register("imagen")} />

                <Button
                  component="label"
                  htmlFor="imagen-producto"
                  variant="outlined"
                  startIcon={<ImageOutlinedIcon />}
                >
                  Seleccionar imagen
                </Button>

                {nombreImagen && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
                    Archivo seleccionado: {nombreImagen}
                  </Typography>
                )}

                {vistaPrevia && (
                  <Box
                    sx={{
                      mt: 3,
                      width: "100%",
                      maxWidth: 320,
                      height: 200,
                      borderRadius: 3,
                      overflow: "hidden",
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "background.default",
                    }}
                  >
                    <Box
                      component="img"
                      src={vistaPrevia}
                      alt="Vista previa del producto"
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                {errors.imagen && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ display: "block", mt: 1 }}
                  >
                    {errors.imagen.message}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Mejora 4: botón más ancho */}
            <Grid item xs={12}>
              <Box
                sx={{
                  mt: 2,
                  display: "flex",
                  justifyContent: {
                    xs: "stretch",
                    sm: "flex-end",
                  },
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  startIcon={
                    loading ? (
                      <CircularProgress size={20} color="inherit" />
                    ) : (
                      <SaveOutlinedIcon />
                    )
                  }
                  sx={{
                    minWidth: {
                      xs: "100%",
                      sm: 230,
                    },
                    py: 1.4,
                    borderRadius: 2.5,
                    fontWeight: 700,
                    textTransform: "none",
                  }}
                >
                  {loading ? "Guardando..." : buttonText}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
