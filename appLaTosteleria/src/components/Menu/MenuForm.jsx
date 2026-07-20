import { useEffect, useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

  const [year, month, day] = String(value).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function parseMinutes(value) {
  if (!timePattern.test(value ?? "")) {
    return null;
  }

  const [hours, minutes] = String(value).split(":").map(Number);
  return hours * 60 + minutes;
}

const menuSchema = yup.object({
  nombre_menu: yup
    .string()
    .trim()
    .required("El nombre del menú es obligatorio.")
    .min(3, "El nombre del menú debe tener al menos 3 caracteres.")
    .max(100, "El nombre del menú no puede superar los 100 caracteres."),
  fecha_inicio: yup
    .string()
    .required("La fecha de inicio es obligatoria.")
    .matches(datePattern, "La fecha de inicio debe tener formato YYYY-MM-DD."),
  fecha_fin: yup
    .string()
    .required("La fecha de fin es obligatoria.")
    .matches(datePattern, "La fecha de fin debe tener formato YYYY-MM-DD.")
    .test(
      "fecha-rango",
      "La fecha de inicio no puede ser mayor que la fecha final.",
      function validarFechaFinal(value) {
        const fechaInicio = parseDateValue(this.parent.fecha_inicio);
        const fechaFin = parseDateValue(value);

        if (!fechaInicio || !fechaFin) {
          return true;
        }

        return fechaInicio <= fechaFin;
      },
    ),
  hora_inicio: yup
    .string()
    .required("La hora de inicio es obligatoria.")
    .matches(timePattern, "La hora de inicio debe tener formato HH:MM."),
  hora_fin: yup
    .string()
    .required("La hora de fin es obligatoria.")
    .matches(timePattern, "La hora de fin debe tener formato HH:MM.")
    .test(
      "hora-rango",
      "La hora de inicio no puede ser mayor que la hora final cuando las fechas son iguales.",
      function validarHoraFinal(value) {
        const fechaInicio = this.parent.fecha_inicio;
        const fechaFin = this.parent.fecha_fin;
        const horaInicio = parseMinutes(this.parent.hora_inicio);
        const horaFin = parseMinutes(value);

        if (!fechaInicio || !fechaFin || horaInicio === null || horaFin === null) {
          return true;
        }

        if (fechaInicio !== fechaFin) {
          return true;
        }

        return horaInicio <= horaFin;
      },
    ),
  productos: yup.array().of(yup.number().integer().positive()).default([]),
  combos: yup
    .array()
    .of(yup.number().integer().positive())
    .default([])
    .test(
      "menu-items",
      "Debe seleccionar al menos un producto o un combo.",
      function validarSeleccionCombos(value) {
        const productos = Array.isArray(this.parent.productos)
          ? this.parent.productos
          : [];
        const combos = Array.isArray(value) ? value : [];

        return productos.length > 0 || combos.length > 0;
      },
    ),
  activo: yup.boolean().default(true),
});

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

function normalizeCollection(data, fallbackKeys = []) {
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
}) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const selectedValues = Array.isArray(field.value)
          ? field.value.map(Number)
          : [];
        const sortedOptions = [...options].sort((left, right) => {
          if (left.group === right.group) {
            return String(left.label).localeCompare(String(right.label));
          }

          return String(left.group).localeCompare(String(right.group));
        });
        const selectedOptions = sortedOptions.filter((option) =>
          selectedValues.includes(Number(option.id)),
        );

        return (
          <Autocomplete
            multiple
            filterSelectedOptions
            loading={loading}
            options={sortedOptions}
            value={selectedOptions}
            groupBy={(option) => option.group}
            getOptionLabel={(option) => option.label ?? ""}
            isOptionEqualToValue={(option, value) =>
              Number(option.id) === Number(value.id)
            }
            onChange={(_, values) => {
              field.onChange(values.map((item) => Number(item.id)));
            }}
            renderOption={(props, option) => (
              <li {...props} key={`${name}-${option.id}`}>
                <Stack spacing={0.25} sx={{ py: 0.5 }}>
                  <Typography variant="body2" fontWeight={700}>
                    {option.label}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {option.subtitle}
                  </Typography>
                </Stack>
              </li>
            )}
            noOptionsText={`No hay ${label.toLowerCase()} disponibles`}
            loadingText={`Cargando ${label.toLowerCase()}...`}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={`Seleccione uno o varios ${label.toLowerCase()}`}
                error={Boolean(errors[name])}
                helperText={errors[name]?.message ?? helperText}
                InputProps={{
                  ...params.InputProps,
                }}
              />
            )}
          />
        );
      }}
    />
  );
}

export function MenuForm({ defaultValues, onSubmit, submitText = "Guardar menú" }) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(menuSchema),
    defaultValues: defaultValues ?? {
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
        nombre_menu: defaultValues.nombre_menu ?? "",
        fecha_inicio: defaultValues.fecha_inicio ?? "",
        fecha_fin: defaultValues.fecha_fin ?? "",
        hora_inicio: defaultValues.hora_inicio ?? "",
        hora_fin: defaultValues.hora_fin ?? "",
        productos: defaultValues.productos ?? [],
        combos: defaultValues.combos ?? [],
        activo: defaultValues.activo ?? true,
      });
    }
  }, [defaultValues, reset]);

  const [productos, setProductos] = useState([]);
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([ProductService.getProducts(), ComboService.getCombos()])
      .then(([productsResponse, combosResponse]) => {
        const productsData = normalizeCollection(productsResponse.data, ["productos"]);
        const combosData = normalizeCollection(combosResponse.data, ["combos"]);

        setProductos(
          productsData.map((producto) => ({
            id: producto.id_producto,
            label: producto.nombre_producto,
            group: producto.nombre_categoria ?? "Sin categoría",
            subtitle: formatCurrency(producto.precio),
          })),
        );

        setCombos(
          combosData.map((combo) => ({
            id: combo.id_combo,
            label: combo.nombre_combo,
            group: combo.nombre_categoria ?? "Sin categoría",
            subtitle: formatCurrency(combo.precio_especial),
          })),
        );
      })
      .catch((error) => {
        console.error("Error al cargar productos o combos:", error);
        setProductos([]);
        setCombos([]);
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const itemHint = useMemo(
    () => "Los elementos se agrupan por categoría para facilitar la selección.",
    [],
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
      <CardContent sx={{ p: { xs: 2.5, md: 4 } }}>
        <Typography variant="h5" component="h2" fontWeight="bold" sx={{ mb: 3 }}>
          Información del menú
        </Typography>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
          <Grid container spacing={2.5}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register("nombre_menu")}
                label="Nombre del menú"
                fullWidth
                error={Boolean(errors.nombre_menu)}
                helperText={errors.nombre_menu?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                {...register("fecha_inicio")}
                label="Fecha de inicio"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.fecha_inicio)}
                helperText={errors.fecha_inicio?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                {...register("fecha_fin")}
                label="Fecha de fin"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.fecha_fin)}
                helperText={errors.fecha_fin?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                {...register("hora_inicio")}
                label="Hora de inicio"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.hora_inicio)}
                helperText={errors.hora_inicio?.message}
              />
            </Grid>

            <Grid item xs={12} md={3}>
              <TextField
                {...register("hora_fin")}
                label="Hora de fin"
                type="time"
                fullWidth
                InputLabelProps={{ shrink: true }}
                error={Boolean(errors.hora_fin)}
                helperText={errors.hora_fin?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <FormControlLabel
                control={
                  <Controller
                    name="activo"
                    control={control}
                    render={({ field }) => (
                      <Switch
                        checked={Boolean(field.value)}
                        onChange={(event) => field.onChange(event.target.checked)}
                      />
                    )}
                  />
                }
                label="Menú activo"
              />
            </Grid>

            <Grid item xs={12}>
              <MenuItemSelector
                name="productos"
                label="Productos"
                helperText={itemHint}
                options={productos}
                loading={cargando}
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <MenuItemSelector
                name="combos"
                label="Combos"
                helperText="Si el menú no incluye combos, puede dejar esta selección vacía mientras exista al menos un producto."
                options={combos}
                loading={cargando}
                control={control}
                errors={errors}
              />
            </Grid>

            <Grid item xs={12}>
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                <Button
                  type="submit"
                  variant="contained"
                  startIcon={<SaveOutlinedIcon />}
                  disabled={isSubmitting || cargando}
                  sx={{
                    minWidth: 190,
                    py: 1.1,
                    textTransform: "none",
                    fontWeight: "bold",
                  }}
                >
                  {isSubmitting ? "Guardando..." : submitText}
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
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      group: PropTypes.string.isRequired,
      subtitle: PropTypes.string,
    }),
  ).isRequired,
  loading: PropTypes.bool,
  control: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired,
};

MenuForm.propTypes = {
  defaultValues: PropTypes.shape({
    nombre_menu: PropTypes.string,
    fecha_inicio: PropTypes.string,
    fecha_fin: PropTypes.string,
    hora_inicio: PropTypes.string,
    hora_fin: PropTypes.string,
    productos: PropTypes.arrayOf(PropTypes.number),
    combos: PropTypes.arrayOf(PropTypes.number),
    activo: PropTypes.bool,
  }),
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
};
