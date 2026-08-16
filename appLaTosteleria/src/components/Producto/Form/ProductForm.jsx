import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

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

const crearProductSchema = (t, esActualizacion) =>
  yup.object({
    nombre_producto: yup
      .string()
      .required(t("products.form.validation.nameRequired"))
      .min(3, t("products.form.validation.nameMin"))
      .matches(
        /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/,
        t("products.form.validation.nameLetters"),
      ),

    descripcion: yup
      .string()
      .required(t("products.form.validation.descriptionRequired"))
      .min(5, t("products.form.validation.descriptionMin")),

    precio: yup
      .number()
      .typeError(t("products.form.validation.priceNumber"))
      .positive(t("products.form.validation.pricePositive"))
      .required(t("products.form.validation.priceRequired")),

    categoria_id: yup
      .number()
      .typeError(t("products.form.validation.categorySelect"))
      .positive(t("products.form.validation.categorySelect"))
      .required(t("products.form.validation.categoryRequired")),

    ingredientes: yup
      .array()
      .min(1, t("products.form.validation.ingredientRequired"))
      .required(t("products.form.validation.ingredientRequired")),

    archivoImagen: esActualizacion
      ? yup
          .mixed()
          .nullable()
          .test(
            "fileType",
            t("products.form.validation.invalidImage"),
            (archivo) => {
              if (!archivo) {
                return true;
              }

              return ["image/png", "image/jpeg", "image/webp"].includes(
                archivo.type,
              );
            },
          )
      : yup
          .mixed()
          .required(t("products.form.validation.imageRequired"))
          .test(
            "fileType",
            t("products.form.validation.invalidImage"),
            (archivo) => {
              if (!archivo) {
                return true;
              }

              return ["image/png", "image/jpeg", "image/webp"].includes(
                archivo.type,
              );
            },
          ),
  });

export default function ProductForm({
  defaultValues,
  onSubmit,
  buttonText,
  loading = false,
}) {
  const { t, i18n } = useTranslation();

  const esActualizacion = Boolean(defaultValues);

  const productSchema = useMemo(
    () => crearProductSchema(t, esActualizacion),
    [t, i18n.language, esActualizacion],
  );

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
    archivoImagen: null,
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

  useEffect(() => {
    register("archivoImagen");
  }, [register]);

  const cargarDatosFormulario = async () => {
    try {
      setCargandoDatos(true);

      const [respuestaCategorias, respuestaIngredientes] = await Promise.all([
        CategoryService.getCategories(),
        IngredientService.getIngredients(),
      ]);

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

    /*
     * Guardamos el archivo en React Hook Form.
     * Yup se encarga de validar si el formato es válido.
     */
    setValue("archivoImagen", archivo, {
      shouldValidate: true,
      shouldDirty: true,
    });

    /*
     * Solo mostramos la vista previa cuando
     * realmente es un formato permitido.
     */
    const tiposPermitidos = ["image/png", "image/jpeg", "image/webp"];

    if (!tiposPermitidos.includes(archivo.type)) {
      setArchivoImagen(null);
      setNombreImagen("");
      setVistaPrevia(null);
      return;
    }

    const urlTemporal = URL.createObjectURL(archivo);

    setArchivoImagen(archivo);
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
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" fontWeight={700} gutterBottom>
            {esActualizacion
              ? t("products.form.updateTitle")
              : t("products.form.createTitle")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {esActualizacion
              ? t("products.form.updateDescription")
              : t("products.form.createDescription")}
          </Typography>
        </Box>

        <Box
          component="form"
          noValidate
          onSubmit={handleSubmit(enviarFormulario)}
        >
          <Grid container spacing={3}>
            {/* Nombre */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("products.form.name")}
                {...register("nombre_producto")}
                error={Boolean(errors.nombre_producto)}
                helperText={errors.nombre_producto?.message}
              />
            </Grid>

            {/* Precio */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label={t("products.form.price")}
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

            {/* Descripción */}
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label={t("products.form.description")}
                {...register("descripcion")}
                error={Boolean(errors.descripcion)}
                helperText={errors.descripcion?.message}
              />
            </Grid>

            {/* Categoría */}
            <Grid item xs={12} md={6}>
              <Controller
                name="categoria_id"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    select
                    fullWidth
                    label={t("products.form.category")}
                    error={Boolean(errors.categoria_id)}
                    helperText={errors.categoria_id?.message}
                    slotProps={{
                      inputLabel: {
                        shrink: true,
                      },
                      select: {
                        native: true,
                      },
                    }}
                  >
                    <option value="">
                      {t("products.form.selectCategory")}
                    </option>

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

            {/* Ingredientes */}
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
                        label={t("products.form.ingredients")}
                        placeholder={t("products.form.selectIngredients")}
                        error={Boolean(errors.ingredientes)}
                        helperText={errors.ingredientes?.message}
                      />
                    )}
                  />
                )}
              />
            </Grid>

            {/* Imagen */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: "1px dashed",
                  borderColor: errors.archivoImagen ? "error.main" : "divider",
                  borderRadius: 3,
                  p: 3,
                }}
              >
                <Typography variant="subtitle1" fontWeight={600} gutterBottom>
                  {t("products.form.productImage")}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mb: 2 }}
                >
                  {t("products.form.imageDescription")}
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
                  {t("products.form.selectImage")}
                </Button>

                {nombreImagen && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mt: 1.5 }}
                  >
                    {t("products.form.selectedFile", {
                      name: nombreImagen,
                    })}
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
                      alt={t("products.form.imagePreview")}
                      sx={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                      }}
                    />
                  </Box>
                )}

                {/* Validación Yup de la imagen */}
                {errors.archivoImagen && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{
                      display: "block",
                      mt: 1,
                    }}
                  >
                    {errors.archivoImagen.message}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Botón Guardar */}
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
                  {loading
                    ? t("products.form.saving")
                    : buttonText || t("products.form.save")}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}
