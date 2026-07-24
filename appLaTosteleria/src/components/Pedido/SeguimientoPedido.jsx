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
import SeguimientoPedidoService from "../../services/SeguimientoPedidoService";

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
    }, 5000);

    return () => {
      isMounted = false;
      window.clearInterval(intervalId);
    };
  }, [id]);

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

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
          Seguimiento del pedido
        </Typography>
        <Typography color="text.secondary">
          El estado se actualiza automaticamente cada 5 segundos mientras el pedido siga en proceso.
        </Typography>
      </Box>

      {error && (
        <Alert
          severity="warning"
          action={
            <Button color="inherit" size="small" onClick={handleCreateDemo} disabled={creatingDemo}>
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
                    Cliente: {tracking.cliente?.nombre} ({tracking.cliente?.correo})
                  </Typography>
                  <Typography color="text.secondary">
                    Metodo de entrega: {tracking.metodo_entrega}
                  </Typography>
                  <Typography color="text.secondary">
                    Creado: {formatDateTime(tracking.fecha_creacion)}
                  </Typography>
                </Box>

                <Chip label={tracking.estado_actual} color={tracking.progreso === 100 ? "success" : "warning"} />
              </Stack>

              <Box>
                <Typography sx={{ mb: 1 }}>Progreso: {tracking.progreso}%</Typography>
                <LinearProgress variant="determinate" value={tracking.progreso} sx={{ height: 10, borderRadius: 999 }} />
              </Box>

              <Alert severity={tracking.progreso === 100 ? "success" : "info"}>
                {tracking.comentario_actual}
              </Alert>

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
                        <Typography fontWeight={700}>{item.estado_nombre}</Typography>
                        <Typography color="text.secondary">{formatDateTime(item.fecha_hora)}</Typography>
                      </Stack>
                      <Typography sx={{ mt: 0.75 }} color="text.secondary">
                        {item.comentario}
                      </Typography>
                    </Box>
                  ))}
                </Stack>
              </Box>

              <Typography color="text.secondary">
                Si necesitas otro pedido de prueba, usa el boton "Crear demo" desde un pedido inexistente o cambia la ruta manualmente.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      )}
    </Stack>
  );
}