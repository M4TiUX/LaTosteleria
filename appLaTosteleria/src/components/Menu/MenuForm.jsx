import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import * as yup from "yup";
import PropTypes from "prop-types";

import {
  Autocomplete,
  Box,
  Button,
  Card,
  CardContent,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";

import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";

import ProductService from "../../services/ProductService";
import ComboService from "../../services/ComboService";

const datePattern = /^\d{4}-\d{2}-\d{2}$/;
const timePattern = /^\d{2}:\d{2}$/;

function parseDateValue(value) {
  if (!datePattern.test(value ?? "")) {
    return null;
  }

  const [year, month, day] = String(value)
    .split("-")
    .map(Number);

  return new Date(year, month - 1, day);
}

function parseMinutes(value) {
  if (!timePattern.test(value ?? "")) {
    return null;
  }

  const [hours, minutes] = String(value)
    .split(":")
    .map(Number);

  return hours * 60 + minutes;
}

function crearMenuSchema(t) {
  return yup.object({
    nombre_menu: yup
      .string()
      .trim()
      .required(
        t("menus.form.validation.nameRequired")
      )
      .min(
        3,
        t("menus.form.validation.nameMin")
      )
      .max(
        100,
        t("menus.form.validation.nameMax")
      ),

    fecha_inicio: yup
      .string()
      .required(
        t("menus.form.validation.startDateRequired")
      )
      .matches(
        datePattern,
        t("menus.form.validation.startDateFormat")
      ),

    fecha_fin: yup
      .string()
      .required(
        t("menus.form.validation.endDateRequired")
      )
      .matches(
        datePattern,
        t("menus.form.validation.endDateFormat")
      )
      .test(
        "fecha-rango",
        t("menus.form.validation.dateRange"),
        function validarFechaFinal(value) {
          const fechaInicio = parseDateValue(
            this.parent.fecha_inicio
          );

          const fechaFin = parseDateValue(value);

          if (!fechaInicio || !fechaFin) {
            return true;
          }

          return fechaInicio <= fechaFin;
        }
      ),

    hora_inicio: yup
      .string()
      .required(
        t("menus.form.validation.startTimeRequired")
      )
      .matches(
        timePattern,
        t("menus.form.validation.startTimeFormat")
      ),

    hora_fin: yup
      .string()
      .required(
        t("menus.form.validation.endTimeRequired")
      )
      .matches(
        timePattern,
        t("menus.form.validation.endTimeFormat")
      )
      .test(
        "hora-rango",
        t("menus.form.validation.timeRange"),
        function validarHoraFinal(value) {
          const fechaInicio =
            this.parent.fecha_inicio;

          const fechaFin =
            this.parent.fecha_fin;

          const horaInicio = parseMinutes(
            this.parent.hora_inicio
          );

          const horaFin = parseMinutes(value);

          if (
            !fechaInicio ||
            !fechaFin ||
            horaInicio === null ||
            horaFin === null
          ) {
            return true;
          }

          if (fechaInicio !== fechaFin) {
            return true;
          }

          return horaInicio <= horaFin;
        }
      ),

    productos: yup
      .array()
      .of(
        yup
          .number()
          .integer()
          .positive()
      )
      .default([]),

    combos: yup
      .array()
      .of(
        yup
          .number()
          .integer()
          .positive()
      )
      .default([])
      .test(
        "menu-items",
        t("menus.form.validation.itemsRequired"),
        function validarSeleccionCombos(value) {
          const productos = Array.isArray(
            this.parent.productos
          )
            ? this.parent.productos
            : [];

          const combos = Array.isArray(value)
            ? value
            : [];

          return (
            productos.length > 0 ||
            combos.length > 0
          );
        }
      ),

    activo: yup.boolean().default(true),
  });
}

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function normalizeCollection(
  data,
  fallbackKeys = []
) {
  if (Array.isArray(data)) {
    return data;
  }

  if (data && Array.isArray(data.data)) {
    return data.data;
  }

  for (const key of fallbackKeys) {
    if (data && Array.isArray(data[key])) {
      return data[key];
    }
  }

  return [];
}

function MenuItemSelector({
  name,
  label,
  helperText,
  options,
  loading,
  control,
  errors,
  noOptionsText,
  loadingText,
  placeholder,
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues = Array.isArray(
          field.value
        )
          ? field.value.map(Number)
          : [];

        const sortedOptions = [...options].sort(
          (left, right) => {
            if (left.group === right.group) {
              return String(
                left.label
              ).localeCompare(
                String(right.label)
              );
            }

            return String(
              left.group
            ).localeCompare(
              String(right.group)
            );
          }
        );

        const selectedOptions =
          sortedOptions.filter((option) =>
            selectedValues.includes(
              Number(option.id)
            )
          );

        return (
          <Autocomplete
            multiple
            filterSelectedOptions
            loading={loading}
            options={sortedOptions}
            value={selectedOptions}
            groupBy={(option) =>
              option.group
            }
            getOptionLabel={(option) =>
              option.label ?? ""
            }
            isOptionEqualToValue={(
              option,
              value
            ) =>
              Number(option.id) ===
              Number(value.id)
            }
            onChange={(_, values) => {
              field.onChange(
                values.map((item) =>
                  Number(item.id)
                )
              );
            }}
            renderOption={(
              props,
              option
            ) => (
              <li
                {...props}
                key={`${name}-${option.id}`}
              >
                <Stack
                  spacing={0.25}
                  sx={{ py: 0.5 }}
                >
                  <Typography
                    variant="body2"
                    fontWeight={700}
                  >
                    {option.label}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {option.subtitle}
                  </Typography>
                </Stack>
              </li>
            )}
            noOptionsText={noOptionsText}
            loadingText={loadingText}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={Boolean(
                  errors[name]
                )}
                helperText={
                  errors[name]?.message ??
                  helperText
                }
              />
            )}
          />
        );
      }}
    />
  );
}

export function MenuForm({
  defaultValues,
  onSubmit,
  submitText,
}) {
  const { t, i18n } = useTranslation();

  const menuSchema = useMemo(
    () => crearMenuSchema(t),
    [t, i18n.language]
  );

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    resolver: yupResolver(menuSchema),

    defaultValues:
      defaultValues ?? {
        nombre_menu: "",
        fecha_inicio: "",
        fecha_fin: "",
        hora_inicio: "",
        hora_fin: "",
        productos: [],
        combos: [],
        activo: true,
      },
  });

  useEffect(() => {
    if (defaultValues) {
      reset({
        nombre_menu:
          defaultValues.nombre_menu ?? "",

        fecha_inicio:
          defaultValues.fecha_inicio ?? "",

        fecha_fin:
          defaultValues.fecha_fin ?? "",

        hora_inicio:
          defaultValues.hora_inicio ?? "",

        hora_fin:
          defaultValues.hora_fin ?? "",

        productos:
          defaultValues.productos ?? [],

        combos:
          defaultValues.combos ?? [],

        activo:
          defaultValues.activo ?? true,
      });
    }
  }, [defaultValues, reset]);

  const [productos, setProductos] =
    useState([]);

  const [combos, setCombos] =
    useState([]);

  const [cargando, setCargando] =
    useState(true);

  useEffect(() => {
    Promise.all([
      ProductService.getProducts(),
      ComboService.getCombos(),
    ])
      .then(
        ([
          productsResponse,
          combosResponse,
        ]) => {
          const productsData =
            normalizeCollection(
              productsResponse.data,
              ["productos"]
            );

          const combosData =
            normalizeCollection(
              combosResponse.data,
              ["combos"]
            );

          setProductos(
            productsData.map(
              (producto) => ({
                id: producto.id_producto,
                label:
                  producto.nombre_producto,

                group:
                  producto.nombre_categoria ??
                  t(
                    "menus.common.noCategory"
                  ),

                subtitle: formatCurrency(
                  producto.precio
                ),
              })
            )
          );

          setCombos(
            combosData.map((combo) => ({
              id: combo.id_combo,

              label:
                combo.nombre_combo,

              group:
                combo.nombre_categoria ??
                t(
                  "menus.common.noCategory"
                ),

              subtitle: formatCurrency(
                combo.precio_especial
              ),
            }))
          );
        }
      )
      .catch((error) => {
        console.error(
          "Error al cargar productos o combos:",
          error
        );

        setProductos([]);
        setCombos([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, [t]);

  const itemHint = t(
    "menus.form.itemHint"
  );

  return (
    <Card
      sx={{
        maxWidth: 1100,
        mx: "auto",
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      <CardContent
        sx={{
          p: {
            xs: 2.5,
            md: 4,
          },
        }}
      >
        <Typography
          variant="h5"
          component="h2"
          fontWeight="bold"
          sx={{ mb: 3 }}
        >
          {t("menus.form.title")}
        </Typography>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid
            container
            spacing={2.5}
          >
            {/* Nombre */}
            <Grid
              item
              xs={12}
              md={6}
            >
              <TextField
                {...register(
                  "nombre_menu"
                )}
                label={t(
                  "menus.form.name"
                )}
                fullWidth
                error={Boolean(
                  errors.nombre_menu
                )}
                helperText={
                  errors.nombre_menu
                    ?.message
                }
              />
            </Grid>

            {/* Fecha inicio */}
            <Grid
              item
              xs={12}
              md={3}
            >
              <TextField
                {...register(
                  "fecha_inicio"
                )}
                label={t(
                  "menus.form.startDate"
                )}
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  errors.fecha_inicio
                )}
                helperText={
                  errors.fecha_inicio
                    ?.message
                }
              />
            </Grid>

            {/* Fecha fin */}
            <Grid
              item
              xs={12}
              md={3}
            >
              <TextField
                {...register(
                  "fecha_fin"
                )}
                label={t(
                  "menus.form.endDate"
                )}
                type="date"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  errors.fecha_fin
                )}
                helperText={
                  errors.fecha_fin
                    ?.message
                }
              />
            </Grid>

            {/* Hora inicio */}
            <Grid
              item
              xs={12}
              md={3}
            >
              <TextField
                {...register(
                  "hora_inicio"
                )}
                label={t(
                  "menus.form.startTime"
                )}
                type="time"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  errors.hora_inicio
                )}
                helperText={
                  errors.hora_inicio
                    ?.message
                }
              />
            </Grid>

            {/* Hora fin */}
            <Grid
              item
              xs={12}
              md={3}
            >
              <TextField
                {...register(
                  "hora_fin"
                )}
                label={t(
                  "menus.form.endTime"
                )}
                type="time"
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                error={Boolean(
                  errors.hora_fin
                )}
                helperText={
                  errors.hora_fin
                    ?.message
                }
              />
            </Grid>

            {/* Activo */}
            <Grid
              item
              xs={12}
              md={6}
            >
              <FormControlLabel
                control={
                  <Controller
                    name="activo"
                    control={control}
                    render={({
                      field,
                    }) => (
                      <Switch
                        checked={Boolean(
                          field.value
                        )}
                        onChange={(
                          event
                        ) =>
                          field.onChange(
                            event.target
                              .checked
                          )
                        }
                      />
                    )}
                  />
                }
                label={t(
                  "menus.form.active"
                )}
              />
            </Grid>

            {/* Productos */}
            <Grid item xs={12}>
              <MenuItemSelector
                name="productos"
                label={t(
                  "menus.form.products"
                )}
                helperText={itemHint}
                options={productos}
                loading={cargando}
                control={control}
                errors={errors}
                noOptionsText={t(
                  "menus.form.noAvailable",
                  {
                    items: t(
                      "menus.form.products"
                    ).toLowerCase(),
                  }
                )}
                loadingText={t(
                  "menus.form.loadingItems",
                  {
                    items: t(
                      "menus.form.products"
                    ).toLowerCase(),
                  }
                )}
                placeholder={t(
                  "menus.form.selectMultiple",
                  {
                    items: t(
                      "menus.form.products"
                    ).toLowerCase(),
                  }
                )}
              />
            </Grid>

            {/* Combos */}
            <Grid item xs={12}>
              <MenuItemSelector
                name="combos"
                label={t(
                  "menus.form.combos"
                )}
                helperText={t(
                  "menus.form.comboHint"
                )}
                options={combos}
                loading={cargando}
                control={control}
                errors={errors}
                noOptionsText={t(
                  "menus.form.noAvailable",
                  {
                    items: t(
                      "menus.form.combos"
                    ).toLowerCase(),
                  }
                )}
                loadingText={t(
                  "menus.form.loadingItems",
                  {
                    items: t(
                      "menus.form.combos"
                    ).toLowerCase(),
                  }
                )}
                placeholder={t(
                  "menus.form.selectMultiple",
                  {
                    items: t(
                      "menus.form.combos"
                    ).toLowerCase(),
                  }
                )}
              />
            </Grid>

            {/* Guardar */}
            <Grid item xs={12}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent:
                    "flex-end",
                }}
              >
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={
                    isSubmitting ? null : (
                      <SaveOutlinedIcon />
                    )
                  }
                  disabled={
                    isSubmitting ||
                    cargando
                  }
                  sx={{
                    minWidth: 190,
                    py: 1.1,
                    textTransform:
                      "none",
                    fontWeight: "bold",
                  }}
                >
                  {isSubmitting
                    ? t(
                        "menus.form.saving"
                      )
                    : submitText ||
                      t(
                        "menus.form.save"
                      )}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </CardContent>
    </Card>
  );
}

MenuItemSelector.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
  options: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,

      label:
        PropTypes.string.isRequired,

      group:
        PropTypes.string.isRequired,

      subtitle: PropTypes.string,
    })
  ).isRequired,

  loading: PropTypes.bool,

  control:
    PropTypes.object.isRequired,

  errors:
    PropTypes.object.isRequired,

  noOptionsText:
    PropTypes.string.isRequired,

  loadingText:
    PropTypes.string.isRequired,

  placeholder:
    PropTypes.string.isRequired,
};

MenuForm.propTypes = {
  defaultValues: PropTypes.shape({
    nombre_menu: PropTypes.string,
    fecha_inicio: PropTypes.string,
    fecha_fin: PropTypes.string,
    hora_inicio: PropTypes.string,
    hora_fin: PropTypes.string,

    productos: PropTypes.arrayOf(
      PropTypes.number
    ),

    combos: PropTypes.arrayOf(
      PropTypes.number
    ),

    activo: PropTypes.bool,
  }),

  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};