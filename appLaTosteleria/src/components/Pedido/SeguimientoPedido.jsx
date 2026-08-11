import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

import SeguimientoPedidoService from "../../services/SeguimientoPedidoService";
import UbicacionRepartidorService from "../../services/UbicacionRepartidorService";

// ============================================================
// FIX ICONO POR DEFECTO DE LEAFLET
// ============================================================

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

// ============================================================
// ICONOS DIFERENCIADOS PARA CADA MARCADOR
// ============================================================

const iconoTienda = new L.Icon({
  iconUrl: "/images/Logo2.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "marker-tienda",
});

const iconoDestino = new L.Icon({
  iconUrl: "/images/Destino.png",
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  className: "marker-destino",
});

const iconoRepartidor = new L.Icon({
  iconUrl: "/images/Delivery.png",
  shadowUrl: iconShadow,
  iconSize: [30, 48],
  iconAnchor: [15, 48],
  className: "marker-repartidor",
});

// ============================================================
// UBICACION DE LA TIENDA (debe coincidir con el backend)
// ============================================================

const TIENDA_LAT = 9.928069;
const TIENDA_LNG = -84.090725;

// ============================================================
// INTERVALOS DE POLLING (en milisegundos)
// ============================================================

const INTERVALO_TRACKING_MS = 5000; // historial / progreso / estado
const INTERVALO_UBICACION_MS = 3000; // posicion del repartidor en el mapa

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

export function SeguimientoPedido() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [creatingDemo, setCreatingDemo] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================================
  // UBICACION DEL REPARTIDOR (mapa)
  // ==========================================================

  const [ubicacionRepartidor, setUbicacionRepartidor] = useState(null);
  const [mapaError, setMapaError] = useState(null);

  // ==========================================================
  // POLLING: HISTORIAL / ESTADO / PROGRESO
  // ==========================================================

  useEffect(() => {
    let isMounted = true;

    const loadTracking = async ({ keepLoading = false } = {}) => {
      if (!id) {
        if (isMounted) {
          setError("Debe indicar un pedido para consultar el seguimiento.");
          setLoading(false);
        }
        return;
      }

      if (!keepLoading && isMounted) {
        setLoading(true);
      }

      try {
        const response = await SeguimientoPedidoService.getTrackingById(id);

        if (isMounted) {
          setTracking(response.data);
          setError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setTracking(null);
          setError(
            requestError?.response?.data?.message ??
              requestError?.message ??
              "No fue posible consultar el seguimiento.",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTracking();

    const intervalId = window.setInterval(() => {
      loadTracking({ keepLoading: true });
    }, INTERVALO_TRACKING_MS);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [id]);

  // ==========================================================
  // POLLING: POSICION DEL REPARTIDOR (mapa)
  // Solo corre mientras el pedido este "En camino"
  // ==========================================================

  useEffect(() => {
    let isMounted = true;
    let intervalId = null;

    const esDomicilioEnCamino =
      tracking?.metodo_entrega === "Domicilio" &&
      (tracking?.estado_actual === "En camino" ||
        tracking?.estado_actual === "Entregado");

    if (!id || !esDomicilioEnCamino) {
      return undefined;
    }

    const loadUbicacion = async () => {
      try {
        const response = await UbicacionRepartidorService.getUbicacion(id);

        if (isMounted) {
          setUbicacionRepartidor(
            response.data?.ubicacion_repartidor ?? null,
          );
          setMapaError(null);
        }
      } catch (requestError) {
        if (isMounted) {
          setMapaError(
            requestError?.response?.data?.message ??
              requestError?.message ??
              "No fue posible consultar la ubicacion del repartidor.",
          );
        }
      }
    };

    loadUbicacion();

    intervalId = window.setInterval(loadUbicacion, INTERVALO_UBICACION_MS);

    return () => {
      isMounted = false;
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [id, tracking?.metodo_entrega, tracking?.estado_actual]);

  // ==========================================================
  // CREAR PEDIDO DEMO
  // ==========================================================

  const handleCreateDemo = async () => {
    try {
      setCreatingDemo(true);
      const response = await SeguimientoPedidoService.createDemoOrder();
      const pedidoId = response?.data?.pedido_id;

      if (pedidoId) {
        navigate(`/pedido/seguimiento/${pedidoId}`);
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "No fue posible crear el pedido demo.",
      );
    } finally {
      setCreatingDemo(false);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
        <Typography>Cargando seguimiento del pedido...</Typography>
      </Stack>
    );
  }

  // ==========================================================
  // DATOS DEL MAPA
  // ==========================================================

  const direccion = tracking?.direccion_entrega ?? null;

  const mostrarMapa =
    tracking?.metodo_entrega === "Domicilio" &&
    direccion?.latitud &&
    direccion?.longitud;

  const centroMapa = mostrarMapa
    ? [
        (TIENDA_LAT + Number(direccion.latitud)) / 2,
        (TIENDA_LNG + Number(direccion.longitud)) / 2,
      ]
    : [TIENDA_LAT, TIENDA_LNG];

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Seguimiento del pedido
        </Typography>
        <Typography color="text.secondary">
          El estado se actualiza automaticamente cada 5 segundos mientras el
          pedido siga en proceso.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="warning"
          action={
            <Button
              color="inherit"
              size="small"
              onClick={handleCreateDemo}
              disabled={creatingDemo}
            >
              {creatingDemo ? "Creando..." : "Crear demo"}
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      {tracking && (
        <Card>
          <CardContent>
            <Stack spacing={2.5}>
              <Stack
                direction={{ xs: "column", md: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="h5" fontWeight={700}>
                    Pedido #{tracking.pedido_id}
                  </Typography>
                  <Typography color="text.secondary">
                    Cliente: {tracking.cliente?.nombre} (
                    {tracking.cliente?.correo})
                  </Typography>
                  <Typography color="text.secondary">
                    Metodo de entrega: {tracking.metodo_entrega}
                  </Typography>
                  <Typography color="text.secondary">
                    Creado: {formatDateTime(tracking.fecha_creacion)}
                  </Typography>
                </Box>

                <Chip
                  label={tracking.estado_actual}
                  color={tracking.progreso === 100 ? "success" : "warning"}
                />
              </Stack>

              <Box>
                <Typography sx={{ mb: 1 }}>
                  Progreso: {tracking.progreso}%
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={tracking.progreso}
                  sx={{ height: 10, borderRadius: 999 }}
                />
              </Box>

              <Alert severity={tracking.progreso === 100 ? "success" : "info"}>
                {tracking.comentario_actual}
              </Alert>

              {/* =====================================================
                  MAPA: TIENDA + DESTINO + REPARTIDOR EN VIVO
              ===================================================== */}

              {mostrarMapa && (
                <>
                  <Divider />

                  <Box>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                      Ubicacion en el mapa
                    </Typography>

                    {mapaError && (
                      <Alert severity="warning" sx={{ mb: 1.5 }}>
                        {mapaError}
                      </Alert>
                    )}

                    <Box
                      sx={{
                        height: 350,
                        borderRadius: 2,
                        overflow: "hidden",
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <MapContainer
                        center={centroMapa}
                        zoom={13}
                        style={{ height: "100%", width: "100%" }}
                      >
                        <TileLayer
                          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />

                        {/* TIENDA (fija) */}
                        <Marker
                          position={[TIENDA_LAT, TIENDA_LNG]}
                          icon={iconoTienda}
                        >
                          <Popup>La Tosteleria (tienda)</Popup>
                        </Marker>

                        {/* DESTINO / CLIENTE (fijo) */}
                        <Marker
                          position={[
                            Number(direccion.latitud),
                            Number(direccion.longitud),
                          ]}
                          icon={iconoDestino}
                        >
                          <Popup>
                            {direccion.detalles || "Direccion de entrega"}
                          </Popup>
                        </Marker>

                        {/* REPARTIDOR (se mueve con el polling) */}
                        {ubicacionRepartidor && (
                          <Marker
                            position={[
                              ubicacionRepartidor.latitud,
                              ubicacionRepartidor.longitud,
                            ]}
                            icon={iconoRepartidor}
                          >
                            <Popup>
                              Repartidor — {ubicacionRepartidor.progreso_ruta}
                              % del trayecto
                            </Popup>
                          </Marker>
                        )}
                      </MapContainer>
                    </Box>

                    {tracking.estado_actual === "En camino" && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{ mt: 1, display: "block" }}
                      >
                        La posicion del repartidor se actualiza cada{" "}
                        {INTERVALO_UBICACION_MS / 1000} segundos.
                      </Typography>
                    )}
                  </Box>
                </>
              )}

              <Divider />

              <Box>
                <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                  Historial del pedido
                </Typography>

                <Stack spacing={1.5}>
                  {tracking.historial?.map((item) => (
                    <Box
                      key={item.id_seguimiento}
                      sx={{
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                        p: 2,
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", md: "row" }}
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Typography fontWeight={700}>
                          {item.estado_nombre}
                        </Typography>
                        <Typography color="text.secondary">
                          {formatDateTime(item.fecha_hora)}
                        </Typography>
                      </Stack>
                      <Typography sx={{ mt: 0.75 }} color="text.secondary">
                        {item.comentario}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Typography color="text.secondary">
                Si necesitas otro pedido de prueba, usa el boton "Crear demo"
                desde un pedido inexistente o cambia la ruta manualmente.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}