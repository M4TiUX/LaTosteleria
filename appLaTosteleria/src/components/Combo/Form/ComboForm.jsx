import { useEffect, useMemo, useState } from "react";
import {
  Controller,
  useForm,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";

import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

import * as yup from "yup";

const crearComboSchema = (t) =>
  yup.object({
    nombre_combo: yup
      .string()
      .required(
        t("combos.form.validation.nameRequired")
      )
      .min(
        3,
        t("combos.form.validation.nameMin")
      ),

    descripcion: yup
      .string()
      .required(
        t("combos.form.validation.descriptionRequired")
      )
      .min(
        5,
        t("combos.form.validation.descriptionMin")
      ),

    precio_especial: yup
      .number()
      .typeError(
        t("combos.form.validation.priceNumber")
      )
      .positive(
        t("combos.form.validation.pricePositive")
      )
      .required(
        t("combos.form.validation.priceRequired")
      ),

    categoria_id: yup
      .number()
      .typeError(
        t("combos.form.validation.categorySelect")
      )
      .positive(
        t("combos.form.validation.categorySelect")
      )
      .required(
        t("combos.form.validation.categoryRequired")
      ),

    productos: yup
      .array()
      .min(
        1,
        t("combos.form.validation.productsRequired")
      )
      .required(
        t("combos.form.validation.productsRequired")
      ),
  });

export function ComboForm({
  defaultValues = {},
  onSubmit,
  guardando = false,
  textoBoton,
}) {
  const { t, i18n } = useTranslation();

  const comboSchema = useMemo(
    () => crearComboSchema(t),
    [t, i18n.language]
  );

  const [categorias, setCategorias] = useState([]);
  const [productosDisponibles, setProductosDisponibles] =
    useState([]);
  const [cargando, setCargando] = useState(true);

  const productosIniciales =
    defaultValues.productos?.map((producto) => ({
      producto_id: Number(producto.id_producto),
      cantidad: Number(producto.cantidad),
    })) || [];

  const valoresIniciales = {
    nombre_combo: defaultValues.nombre_combo || "",
    descripcion: defaultValues.descripcion || "",
    precio_especial:
      defaultValues.precio_especial || "",
    categoria_id:
      defaultValues.categoria_id
        ? Number(defaultValues.categoria_id)
        : "",
    productos: productosIniciales,
  };

  const {
    control,
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: valoresIniciales,
    resolver: yupResolver(comboSchema),
  });

  const productosSeleccionados =
    watch("productos") || [];

  useEffect(() => {
    Promise.all([
      CategoryService.getCategories(),
      ProductService.getProducts(),
    ])
      .then(
        ([categoriasResponse, productosResponse]) => {
          setCategorias(
            categoriasResponse?.data || []
          );

          setProductosDisponibles(
            productosResponse?.data || []
          );
        }
      )
      .catch((error) => {
        console.error(
          "Error al cargar datos del formulario:",
          error
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const manejarSeleccionProductos = (
    idsSeleccionados
  ) => {
    const ids = idsSeleccionados.map(Number);

    const nuevosProductos = ids.map((id) => {
      const existente =
        productosSeleccionados.find(
          (producto) =>
            Number(producto.producto_id) === id
        );

      return (
        existente || {
          producto_id: id,
          cantidad: 1,
        }
      );
    });

    setValue(
      "productos",
      nuevosProductos,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const cambiarCantidad = (
    productoId,
    cantidad
  ) => {
    const nuevaCantidad = Math.max(
      1,
      Number(cantidad)
    );

    const productosActualizados =
      productosSeleccionados.map((producto) =>
        Number(producto.producto_id) ===
        Number(productoId)
          ? {
              ...producto,
              cantidad: nuevaCantidad,
            }
          : producto
      );

    setValue(
      "productos",
      productosActualizados,
      {
        shouldValidate: true,
        shouldDirty: true,
      }
    );
  };

  const enviarFormulario = (datos) => {
    onSubmit({
      ...datos,
      precio_especial: Number(
        datos.precio_especial
      ),
      categoria_id: Number(
        datos.categoria_id
      ),
      productos: datos.productos.map(
        (producto) => ({
          producto_id: Number(
            producto.producto_id
          ),
          cantidad: Number(
            producto.cantidad
          ),
        })
      ),
    });
  };

  if (cargando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 850,
        mx: "auto",
        p: {
          xs: 3,
          md: 4,
        },
        borderRadius: 4,
      }}
    >
      <Box
        component="form"

        // MUY IMPORTANTE:
        // evita las validaciones nativas
        // de Chrome como:
        // "Please fill out this field"
        noValidate

        onSubmit={handleSubmit(
          enviarFormulario
        )}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Nombre */}
        <TextField
          label={t("combos.form.name")}
          fullWidth
          {...register("nombre_combo")}
          error={Boolean(
            errors.nombre_combo
          )}
          helperText={
            errors.nombre_combo?.message
          }
        />

        {/* Descripción */}
        <TextField
          label={t(
            "combos.form.description"
          )}
          fullWidth
          multiline
          rows={3}
          {...register("descripcion")}
          error={Boolean(
            errors.descripcion
          )}
          helperText={
            errors.descripcion?.message
          }
        />

        {/* Precio especial */}
        <TextField
          label={t(
            "combos.form.specialPrice"
          )}
          type="number"
          fullWidth
          {...register("precio_especial")}
          error={Boolean(
            errors.precio_especial
          )}
          helperText={
            errors.precio_especial?.message
          }
          slotProps={{
            htmlInput: {
              min: 0,
              step: "0.01",
            },
          }}
        />

        {/* Categoría */}
        <Controller
          name="categoria_id"
          control={control}
          render={({ field }) => (
            <FormControl
              fullWidth
              error={Boolean(
                errors.categoria_id
              )}
            >
              <InputLabel id="combo-categoria-label">
                {t(
                  "combos.form.category"
                )}
              </InputLabel>

              <Select
                {...field}
                labelId="combo-categoria-label"
                label={t(
                  "combos.form.category"
                )}
                value={field.value ?? ""}
              >
                <MenuItem value="">
                  <em>
                    {t(
                      "combos.form.selectCategory"
                    )}
                  </em>
                </MenuItem>

                {categorias.map(
                  (categoria) => (
                    <MenuItem
                      key={
                        categoria.id_categoria
                      }
                      value={Number(
                        categoria.id_categoria
                      )}
                    >
                      {
                        categoria.nombre_categoria
                      }
                    </MenuItem>
                  )
                )}
              </Select>

              <FormHelperText>
                {
                  errors.categoria_id
                    ?.message
                }
              </FormHelperText>
            </FormControl>
          )}
        />

        {/* Productos incluidos */}
        <FormControl
          fullWidth
          error={Boolean(errors.productos)}
        >
          <InputLabel id="combo-productos-label">
            {t(
              "combos.form.includedProducts"
            )}
          </InputLabel>

          <Select
            labelId="combo-productos-label"
            multiple
            value={productosSeleccionados.map(
              (producto) =>
                Number(
                  producto.producto_id
                )
            )}
            onChange={(event) =>
              manejarSeleccionProductos(
                event.target.value
              )
            }
            label={t(
              "combos.form.includedProducts"
            )}
            renderValue={(seleccionados) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {seleccionados.map((id) => {
                  const producto =
                    productosDisponibles.find(
                      (item) =>
                        Number(
                          item.id_producto
                        ) === Number(id)
                    );

                  return (
                    <Chip
                      key={id}
                      label={
                        producto?.nombre_producto ||
                        t(
                          "combos.form.productWithId",
                          {
                            id,
                          }
                        )
                      }
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {productosDisponibles.map(
              (producto) => {
                const seleccionado =
                  productosSeleccionados.some(
                    (item) =>
                      Number(
                        item.producto_id
                      ) ===
                      Number(
                        producto.id_producto
                      )
                  );

                return (
                  <MenuItem
                    key={
                      producto.id_producto
                    }
                    value={Number(
                      producto.id_producto
                    )}
                  >
                    <Checkbox
                      checked={
                        seleccionado
                      }
                    />

                    <ListItemText
                      primary={
                        producto.nombre_producto
                      }
                    />
                  </MenuItem>
                );
              }
            )}
          </Select>

          <FormHelperText>
            {errors.productos?.message}
          </FormHelperText>
        </FormControl>

        {/* Cantidades */}
        {productosSeleccionados.length >
          0 && (
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              {t(
                "combos.form.productQuantity"
              )}
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {productosSeleccionados.map(
                (
                  productoSeleccionado
                ) => {
                  const producto =
                    productosDisponibles.find(
                      (item) =>
                        Number(
                          item.id_producto
                        ) ===
                        Number(
                          productoSeleccionado.producto_id
                        )
                    );

                  return (
                    <Box
                      key={
                        productoSeleccionado.producto_id
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent:
                          "space-between",
                        gap: 2,
                        p: 2,
                        border:
                          "1px solid",
                        borderColor:
                          "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems:
                            "center",
                          gap: 2,
                        }}
                      >
                        {producto?.imagen && (
                          <Box
                            component="img"
                            src={`/images/${producto.imagen}`}
                            alt={
                              producto.nombre_producto
                            }
                            sx={{
                              width: 55,
                              height: 55,
                              objectFit:
                                "cover",
                              borderRadius: 2,
                            }}
                          />
                        )}

                        <Typography
                          fontWeight={600}
                        >
                          {producto?.nombre_producto ||
                            t(
                              "combos.form.product"
                            )}
                        </Typography>
                      </Box>

                      <TextField
                        label={t(
                          "combos.form.quantity"
                        )}
                        type="number"
                        size="small"
                        value={
                          productoSeleccionado.cantidad
                        }
                        onChange={(
                          event
                        ) =>
                          cambiarCantidad(
                            productoSeleccionado.producto_id,
                            event.target
                              .value
                          )
                        }
                        slotProps={{
                          htmlInput: {
                            min: 1,
                          },
                        }}
                        sx={{
                          width: 120,
                        }}
                      />
                    </Box>
                  );
                }
              )}
            </Box>
          </Box>
        )}

        {/* Guardar */}
        <Button
          type="submit"
          variant="contained"
          startIcon={
            guardando ? (
              <CircularProgress
                size={20}
                color="inherit"
              />
            ) : (
              <SaveIcon />
            )
          }
          disabled={guardando}
          sx={{
            mt: 1,
            py: 1.3,
            backgroundColor: "#9b1209",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",

            "&:hover": {
              backgroundColor:
                "#7d0e07",
            },
          }}
        >
          {guardando
            ? t("combos.form.saving")
            : textoBoton ||
              t("combos.form.save")}
        </Button>
      </Box>
    </Paper>
  );
}