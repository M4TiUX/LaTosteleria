import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AddShoppingCartOutlinedIcon from "@mui/icons-material/AddShoppingCartOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PedidoService from "../../services/PedidoService";
import { UserContext } from "../../context/UserContext";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

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
    timeStyle: "short",
  }).format(date);
}

function parseOrderDate(value) {
  if (!value) {
    return null;
  }

  const date = new Date(String(value).replace(" ", "T"));

  return Number.isNaN(date.getTime()) ? null : date;
}

function parseDateFilter(value) {
  if (!value) {
    return null;
  }

  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function ListPedidos() {
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");

  useEffect(() => {
    PedidoService.getOrders(userData?.id)
      .then((response) => {
        setOrders(Array.isArray(response.data) ? response.data : []);
        setError(null);
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            "No fue posible cargar el historial de pedidos.",
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userData?.id]);

  const title = useMemo(() => {
    return userData?.name
      ? `Pedidos de ${userData.name}`
      : "Historial de pedidos";
  }, [userData?.name]);

  const statusOptions = useMemo(() => {
    const statuses = new Set();

    orders.forEach((order) => {
      if (order.estado_actual) {
        statuses.add(String(order.estado_actual));
      }
    });

    return ["TODOS", ...Array.from(statuses)];
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const startDate = parseDateFilter(startDateFilter);
    const endDate = parseDateFilter(endDateFilter);

    return orders.filter((order) => {
      const stateValue = String(order.estado_actual ?? "");

      if (
        statusFilter !== "TODOS" &&
        stateValue.toLowerCase() !== statusFilter.toLowerCase()
      ) {
        return false;
      }

      const orderDate = parseOrderDate(order.fecha_creacion);

      if ((startDate || endDate) && !orderDate) {
        return false;
      }

      if (startDate && orderDate < startDate) {
        return false;
      }

      if (endDate) {
        const inclusiveEnd = new Date(endDate);
        inclusiveEnd.setHours(23, 59, 59, 999);

        if (orderDate > inclusiveEnd) {
          return false;
        }
      }

      return true;
    });
  }, [orders, statusFilter, startDateFilter, endDateFilter]);

  const clearFilters = () => {
    setStatusFilter("TODOS");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
        <Typography>Cargando pedidos...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {title}
          </Typography>
          <Typography color="text.secondary">
            Consulta los pedidos registrados y accede al seguimiento automatico de cada uno.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/pedido/crear"
          variant="contained"
          startIcon={<AddShoppingCartOutlinedIcon />}
        >
          Nuevo pedido
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Card sx={{ borderRadius: 3, boxShadow: 1 }}>
        <CardContent>
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              Filtros del historial
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="pedido-status-filter-label">Estado</InputLabel>
                  <Select
                    labelId="pedido-status-filter-label"
                    value={statusFilter}
                    label="Estado"
                    onChange={(event) => setStatusFilter(String(event.target.value))}
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === "TODOS" ? "Todos" : status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Fecha inicial"
                  type="date"
                  fullWidth
                  value={startDateFilter}
                  onChange={(event) => setStartDateFilter(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={3}>
                <TextField
                  label="Fecha final"
                  type="date"
                  fullWidth
                  value={endDateFilter}
                  onChange={(event) => setEndDateFilter(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>

              <Grid item xs={12} md={2}>
                <Button variant="outlined" fullWidth sx={{ height: "100%" }} onClick={clearFilters}>
                  Limpiar
                </Button>
              </Grid>
            </Grid>

            <Typography color="text.secondary">
              Mostrando {filteredOrders.length} de {orders.length} pedidos.
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h6" fontWeight={700}>
                No hay pedidos que coincidan con los filtros actuales.
              </Typography>
              <Typography color="text.secondary">
                Ajusta el estado o el rango de fechas, o crea un nuevo pedido para generar mas historial.
              </Typography>
              <Button component={Link} to="/pedido/crear" variant="outlined">
                Crear pedido
              </Button>
            </Stack>
          </CardContent>
        </Card>
      ) : (
        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} md={6} key={order.id_pedido}>
              <Card sx={{ height: "100%", borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" spacing={2}>
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          Pedido #{order.id_pedido}
                        </Typography>
                        <Typography color="text.secondary">
                          {order.cliente_nombre} · {order.cliente_correo}
                        </Typography>
                      </Box>
                      <Chip
                        label={order.estado_actual ?? "Sin seguimiento"}
                        color={String(order.estado_actual).toLowerCase() === "entregado" ? "success" : "warning"}
                        size="small"
                      />
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalShippingOutlinedIcon fontSize="small" color="action" />
                        <Typography color="text.secondary">{order.metodo_entrega}</Typography>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReceiptLongOutlinedIcon fontSize="small" color="action" />
                        <Typography color="text.secondary">{order.total_items} items</Typography>
                      </Stack>
                    </Stack>

                    <Typography color="text.secondary">
                      Creado: {formatDateTime(order.fecha_creacion)}
                    </Typography>
                    <Typography color="text.secondary">
                      Ultimo movimiento: {formatDateTime(order.fecha_ultimo_estado)}
                    </Typography>
                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {formatCurrency(order.total)}
                    </Typography>

                    <Divider />

                    <Stack spacing={1}>
                      {order.items?.slice(0, 3).map((item) => (
                        <Typography key={item.id_detalle} color="text.secondary">
                          {item.cantidad}x {item.nombre}
                        </Typography>
                      ))}
                      {(order.items?.length ?? 0) > 3 && (
                        <Typography color="text.secondary">
                          y {(order.items?.length ?? 0) - 3} elementos mas...
                        </Typography>
                      )}
                    </Stack>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
                      <Button component={Link} to={`/pedido/seguimiento/${order.id_pedido}`} variant="contained" fullWidth>
                        Ver seguimiento
                      </Button>
                      <Button component={Link} to="/pedido/crear" variant="outlined" fullWidth>
                        Repetir pedido
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Stack>
  );
}