import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";

import ProcesoServices from "../../../services/ProcesosServices";

export function ProcesoForm({
  initialData = null,
  onSubmit,
  submitText,
  editing = false,
}) {
  const { t } = useTranslation();

  const [productoId, setProductoId] = useState("");

  const [pasos, setPasos] = useState([
    {
      estacion_id: "",
      tiempo_estimado_minutos: "",
    },
  ]);

  const [productos, setProductos] = useState([]);
  const [estaciones, setEstaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // =====================================================
  // CARGAR PRODUCTOS Y ESTACIONES
  // =====================================================

  useEffect(() => {
    const cargarOpciones = async () => {
      try {
        setLoading(true);
        setError("");

        const [
          productosResponse,
          estacionesResponse,
        ] = await Promise.all([
          ProcesoServices.getProductos(),
          ProcesoServices.getEstaciones(),
        ]);

        setProductos(
          productosResponse.data?.result ?? []
        );

        setEstaciones(
          estacionesResponse.data?.result ?? []
        );
      } catch (err) {
        console.error(err);

        setError(
          t(
            "processMaintenance.form.loadOptionsError"
          )
        );
      } finally {
        setLoading(false);
      }
    };

    cargarOpciones();
  }, [t]);

  // =====================================================
  // CARGAR DATOS CUANDO SE ESTÁ EDITANDO
  // =====================================================

  useEffect(() => {
    if (!initialData) {
      return;
    }

    if (initialData.id_producto) {
      setProductoId(
        Number(initialData.id_producto)
      );
    }

    if (
      Array.isArray(initialData.estaciones) &&
      initialData.estaciones.length > 0
    ) {
      const estacionesIniciales = [
        ...initialData.estaciones,
      ]
        .sort(
          (a, b) =>
            Number(a.orden_paso) -
            Number(b.orden_paso)
        )
        .map((estacion) => ({
          estacion_id: Number(
            estacion.id_estacion
          ),

          tiempo_estimado_minutos: Number(
            estacion.tiempo_estimado_minutos
          ),
        }));

      setPasos(estacionesIniciales);
    }
  }, [initialData]);

  // =====================================================
  // AGREGAR PASO
  // =====================================================

  const agregarPaso = () => {
    setError("");

    setPasos((actuales) => [
      ...actuales,
      {
        estacion_id: "",
        tiempo_estimado_minutos: "",
      },
    ]);
  };

  // =====================================================
  // ELIMINAR PASO
  // =====================================================

  const eliminarPaso = (index) => {
    if (pasos.length === 1) {
      setError(
        t(
          "processMaintenance.form.validation.minimumStep"
        )
      );

      return;
    }

    setError("");

    setPasos((actuales) =>
      actuales.filter(
        (_, indice) => indice !== index
      )
    );
  };

  // =====================================================
  // CAMBIAR INFORMACIÓN DE UN PASO
  // =====================================================

  const cambiarPaso = (
    index,
    campo,
    valor
  ) => {
    setError("");

    setPasos((actuales) =>
      actuales.map((paso, indice) =>
        indice === index
          ? {
              ...paso,
              [campo]: valor,
            }
          : paso
      )
    );
  };

  // =====================================================
  // VALIDACIONES
  // =====================================================

  const validar = () => {
    if (!productoId) {
      setError(
        t(
          "processMaintenance.form.validation.product"
        )
      );

      return false;
    }

    if (pasos.length === 0) {
      setError(
        t(
          "processMaintenance.form.validation.minimumStep"
        )
      );

      return false;
    }

    for (const paso of pasos) {
      if (!paso.estacion_id) {
        setError(
          t(
            "processMaintenance.form.validation.station"
          )
        );

        return false;
      }

      if (
        !paso.tiempo_estimado_minutos ||
        Number(
          paso.tiempo_estimado_minutos
        ) <= 0
      ) {
        setError(
          t(
            "processMaintenance.form.validation.time"
          )
        );

        return false;
      }
    }

    return true;
  };

  // =====================================================
  // GUARDAR
  // =====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!validar()) {
      return;
    }

    const payload = {
      producto_id: Number(productoId),

      estaciones: pasos.map(
        (paso, index) => ({
          estacion_id: Number(
            paso.estacion_id
          ),

          orden_paso: index + 1,

          tiempo_estimado_minutos: Number(
            paso.tiempo_estimado_minutos
          ),
        })
      ),
    };

    try {
      setSaving(true);

      await onSubmit(payload);
    } catch (err) {
      console.error(err);

      setError(
        err?.response?.data?.result ??
          t(
            "processMaintenance.form.saveError"
          )
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // CARGANDO
  // =====================================================

  if (loading) {
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

  // =====================================================
  // FORMULARIO
  // =====================================================

  return (
    <Card
      sx={{
        maxWidth: 950,
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
        {error && (
          <Alert
            severity="error"
            sx={{ mb: 3 }}
          >
            {error}
          </Alert>
        )}

        <Box
          component="form"
          onSubmit={handleSubmit}
          noValidate
        >
          <Stack spacing={3}>
            {/* ========================================= */}
            {/* PRODUCTO */}
            {/* ========================================= */}

            <FormControl fullWidth>
              <InputLabel>
                {t(
                  "processMaintenance.form.product"
                )}
              </InputLabel>

              <Select
                value={productoId}
                label={t(
                  "processMaintenance.form.product"
                )}
                disabled={editing}
                onChange={(event) => {
                  setProductoId(
                    event.target.value
                  );

                  setError("");
                }}
              >
                {productos.map(
                  (producto) => (
                    <MenuItem
                      key={
                        producto.id_producto
                      }
                      value={
                        producto.id_producto
                      }
                    >
                      {
                        producto.nombre_producto
                      }
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* ========================================= */}
            {/* PASOS DEL PROCESO */}
            {/* ========================================= */}

            <Box>
              <Typography
                variant="h5"
                fontWeight="bold"
                sx={{ mb: 0.5 }}
              >
                {t(
                  "processMaintenance.form.stepsTitle"
                )}
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                {t(
                  "processMaintenance.form.stepsDescription"
                )}
              </Typography>

              <Stack spacing={2}>
                {pasos.map(
                  (paso, index) => (
                    <Card
                      variant="outlined"
                      key={index}
                    >
                      <CardContent>
                        <Stack
                          direction={{
                            xs: "column",
                            md: "row",
                          }}
                          spacing={2}
                          alignItems={{
                            xs: "stretch",
                            md: "center",
                          }}
                        >
                          {/* NÚMERO DEL PASO */}

                          <Typography
                            fontWeight="bold"
                            sx={{
                              minWidth: 75,
                            }}
                          >
                            {t(
                              "processMaintenance.form.step",
                              {
                                number:
                                  index +
                                  1,
                              }
                            )}
                          </Typography>

                          {/* ESTACIÓN */}

                          <FormControl
                            fullWidth
                          >
                            <InputLabel>
                              {t(
                                "processMaintenance.form.station"
                              )}
                            </InputLabel>

                            <Select
                              value={
                                paso.estacion_id
                              }
                              label={t(
                                "processMaintenance.form.station"
                              )}
                              onChange={(
                                event
                              ) =>
                                cambiarPaso(
                                  index,
                                  "estacion_id",
                                  event
                                    .target
                                    .value
                                )
                              }
                            >
                              {estaciones.map(
                                (
                                  estacion
                                ) => (
                                  <MenuItem
                                    key={
                                      estacion.id_estacion
                                    }
                                    value={
                                      estacion.id_estacion
                                    }
                                  >
                                    {
                                      estacion.nombre_estacion
                                    }
                                  </MenuItem>
                                )
                              )}
                            </Select>
                          </FormControl>

                          {/* TIEMPO */}

                          <TextField
                            fullWidth
                            type="number"
                            label={t(
                              "processMaintenance.form.estimatedTime"
                            )}
                            value={
                              paso.tiempo_estimado_minutos
                            }
                            inputProps={{
                              min: 1,
                            }}
                            onChange={(
                              event
                            ) =>
                              cambiarPaso(
                                index,
                                "tiempo_estimado_minutos",
                                event
                                  .target
                                  .value
                              )
                            }
                          />

                          {/* ELIMINAR */}

                          <IconButton
                            color="error"
                            onClick={() =>
                              eliminarPaso(
                                index
                              )
                            }
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </CardContent>
                    </Card>
                  )
                )}
              </Stack>

              {/* AGREGAR PASO */}

              <Button
                type="button"
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={agregarPaso}
                sx={{
                  mt: 2,
                  textTransform: "none",
                }}
              >
                {t(
                  "processMaintenance.form.addStep"
                )}
              </Button>
            </Box>

            {/* ========================================= */}
            {/* GUARDAR */}
            {/* ========================================= */}

            <Button
              type="submit"
              variant="contained"
              size="large"
              startIcon={<SaveIcon />}
              disabled={saving}
              sx={{
                textTransform: "none",
                fontWeight: "bold",
              }}
            >
              {saving
                ? t(
                    "processMaintenance.form.saving"
                  )
                : submitText ??
                  t(
                    "processMaintenance.form.save"
                  )}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}

ProcesoForm.propTypes = {
  initialData: PropTypes.object,
  onSubmit: PropTypes.func.isRequired,
  submitText: PropTypes.string,
  editing: PropTypes.bool,
};