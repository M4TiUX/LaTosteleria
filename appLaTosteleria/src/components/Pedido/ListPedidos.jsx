import { useContext, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();
  // ==========================================
  // USUARIO Y ROL
  // ==========================================

  const { decodeToken } = useContext(UserContext);

  const userData = decodeToken();

  const roleName = userData?.rol?.name ?? "";

  const isCliente = roleName === "Cliente";

  const isEmpleado = roleName === "Empleado";

  const isAdministrador = roleName === "Administrador";

  const canCreateOrder = isCliente || isEmpleado || isAdministrador;

  // ==========================================
  // ESTADOS
  // ==========================================

  const [orders, setOrders] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [statusFilter, setStatusFilter] = useState("TODOS");

  const [startDateFilter, setStartDateFilter] = useState("");

  const [endDateFilter, setEndDateFilter] = useState("");

  // ==========================================
  // CARGAR PEDIDOS SEGÚN EL ROL
  // ==========================================

  useEffect(() => {
    if (!roleName) {
      setOrders([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    /*
      Cliente:
      Se envía su ID para obtener
      únicamente sus pedidos.

      Empleado / Administrador:
      No se envía cliente_id para
      obtener todos los pedidos.
    */

    const request = isCliente
      ? PedidoService.getOrders(userData?.id)
      : PedidoService.getOrders();

    request
      .then((response) => {
        setOrders(Array.isArray(response.data) ? response.data : []);

        setError(null);
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.response?.data?.result ??
            requestError?.message ??
            t("orders.list.loadError"),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isCliente, roleName, userData?.id]);

  // ==========================================
  // TÍTULO SEGÚN ROL
  // ==========================================

  const title = useMemo(() => {
    if (isCliente) {
      return t("orders.list.titles.client");
    }

    if (isEmpleado || isAdministrador) {
      return t("orders.list.titles.staff");
    }

    return t("orders.list.titles.default");
  }, [isCliente, isEmpleado, isAdministrador, t]);

  const description = useMemo(() => {
    if (isCliente) {
      return t("orders.list.descriptions.client");
    }

    if (isEmpleado || isAdministrador) {
      return t("orders.list.descriptions.staff");
    }

    return t("orders.list.descriptions.default");
  }, [isCliente, isEmpleado, isAdministrador, t]);

  // ==========================================
  // ESTADOS DISPONIBLES PARA FILTRAR
  // ==========================================

  const statusOptions = useMemo(() => {
    const statuses = new Set();

    orders.forEach((order) => {
      if (order.estado_actual) {
        statuses.add(String(order.estado_actual));
      }
    });

    return ["TODOS", ...Array.from(statuses)];
  }, [orders]);

  // ==========================================
  // FILTRADO
  // ==========================================

  const filteredOrders = useMemo(() => {
    const startDate = parseDateFilter(startDateFilter);

    const endDate = parseDateFilter(endDateFilter);

    return orders.filter((order) => {
      const stateValue = String(order.estado_actual ?? "");

      // Filtro por estado
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

      // Fecha inicial
      if (startDate && orderDate < startDate) {
        return false;
      }

      // Fecha final
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

  // ==========================================
  // LIMPIAR FILTROS
  // ==========================================

  const clearFilters = () => {
    setStatusFilter("TODOS");
    setStartDateFilter("");
    setEndDateFilter("");
  };

  // ==========================================
  // CARGANDO
  // ==========================================

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />

        <Typography>{t("orders.list.loading")}</Typography>
      </Stack>
    );
  }

  // ==========================================
  // VISTA
  // ==========================================

  return (
    <Stack spacing={3}>
      {/* ======================================
          ENCABEZADO
      ====================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {title}
          </Typography>

          <Typography color="text.secondary">{description}</Typography>
        </Box>

        {/* Nuevo pedido para roles habilitados */}

        {canCreateOrder && (
          <Button
            component={Link}
            to="/pedido/crear"
            variant="contained"
            startIcon={<AddShoppingCartOutlinedIcon />}
          >
            {t("orders.list.newOrder")}
          </Button>
        )}
      </Stack>

      {/* ======================================
          ERROR
      ====================================== */}

      {error && <Alert severity="error">{error}</Alert>}

      {/* ======================================
          FILTROS
      ====================================== */}

      <Card
        sx={{
          borderRadius: 3,
          boxShadow: 1,
        }}
      >
        <CardContent
          sx={{
            px: { xs: 2.5, md: 3 },
            py: 3,
          }}
        >
          <Stack spacing={2}>
            <Typography variant="h6" fontWeight={700}>
              {t("orders.list.filters.title")}
            </Typography>

            <Grid
              container
              spacing={2}
              sx={{
                width: "100%",
                m: 0,
                alignItems: "stretch",
              }}
            >
              {/* Estado */}

              <Grid item xs={12} md={4}>
                <FormControl fullWidth>
                  <InputLabel id="pedido-status-filter-label">
                    {t("orders.common.status")}
                  </InputLabel>

                  <Select
                    labelId="pedido-status-filter-label"
                    value={statusFilter}
                    label={t("orders.common.status")}
                    onChange={(event) =>
                      setStatusFilter(String(event.target.value))
                    }
                  >
                    {statusOptions.map((status) => (
                      <MenuItem key={status} value={status}>
                        {status === "TODOS" ? t("orders.list.filters.all") : status}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Fecha inicial */}

              <Grid item xs={12} md={3}>
                <TextField
                  label={t("orders.list.filters.startDate")}
                  type="date"
                  fullWidth
                  value={startDateFilter}
                  onChange={(event) => setStartDateFilter(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Fecha final */}

              <Grid item xs={12} md={3}>
                <TextField
                  label={t("orders.list.filters.endDate")}
                  type="date"
                  fullWidth
                  value={endDateFilter}
                  onChange={(event) => setEndDateFilter(event.target.value)}
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>

              {/* Limpiar */}

              <Grid item xs={12} md={2} sx={{ display: "flex" }}>
                <Button
                  variant="outlined"
                  fullWidth
                  sx={{
                    height: "100%",
                    minHeight: 56,
                  }}
                  onClick={clearFilters}
                >
                  {t("orders.list.filters.clear")}
                </Button>
              </Grid>
            </Grid>

            <Typography color="text.secondary">
              {t("orders.list.filters.showing", { filtered: filteredOrders.length, total: orders.length })}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* ======================================
          SIN RESULTADOS
      ====================================== */}

      {filteredOrders.length === 0 ? (
        <Card>
          <CardContent>
            <Stack spacing={2} alignItems="flex-start">
              <Typography variant="h6" fontWeight={700}>
                {t("orders.list.noResults.title")}
              </Typography>

              <Typography color="text.secondary">
                {t("orders.list.noResults.description")}
              </Typography>

              {/* Crear pedido para roles habilitados */}

              {canCreateOrder && (
                <Button component={Link} to="/pedido/crear" variant="outlined">
                  {t("orders.list.noResults.create")}
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>
      ) : (
        // ======================================
        // LISTADO
        // ======================================

        <Grid container spacing={3}>
          {filteredOrders.map((order) => (
            <Grid item xs={12} md={6} key={order.id_pedido}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                }}
              >
                <CardContent>
                  <Stack spacing={2}>
                    {/* Pedido y estado */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      spacing={2}
                    >
                      <Box>
                        <Typography variant="h6" fontWeight={700}>
                          {t("orders.common.orderNumber", { id: order.id_pedido })}
                        </Typography>

                        <Typography color="text.secondary">
                          {order.cliente_nombre} · {order.cliente_correo}
                        </Typography>
                      </Box>

                      <Chip
                        label={order.estado_actual ?? t("orders.common.noTracking")}
                        color={
                          String(order.estado_actual).toLowerCase() ===
                          "entregado"
                            ? "success"
                            : "warning"
                        }
                        size="small"
                      />
                    </Stack>

                    {/* Entrega e items */}

                    <Stack
                      direction={{
                        xs: "column",
                        sm: "row",
                      }}
                      spacing={2}
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <LocalShippingOutlinedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography color="text.secondary">
                          {order.metodo_entrega}
                        </Typography>
                      </Stack>

                      <Stack direction="row" spacing={1} alignItems="center">
                        <ReceiptLongOutlinedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography color="text.secondary">
                          {t("orders.list.items", { count: order.total_items })}
                        </Typography>
                      </Stack>
                    </Stack>

                    {/* Fechas */}

                    <Typography color="text.secondary">
                      {t("orders.list.created")}: {formatDateTime(order.fecha_creacion)}
                    </Typography>

                    <Typography color="text.secondary">
                      {t("orders.list.lastMovement")}:{" "}
                      {formatDateTime(order.fecha_ultimo_estado)}
                    </Typography>

                    {/* Total */}

                    <Typography variant="h6" color="primary" fontWeight={700}>
                      {formatCurrency(order.total)}
                    </Typography>

                    <Divider />

                    {/* Items */}

                    <Stack spacing={1}>
                      {order.items?.slice(0, 3).map((item) => (
                        <Typography
                          key={item.id_detalle}
                          color="text.secondary"
                        >
                          {item.cantidad}x {item.nombre}
                        </Typography>
                      ))}

                      {(order.items?.length ?? 0) > 3 && (
                        <Typography color="text.secondary">
                          {t("orders.list.moreItems", { count: (order.items?.length ?? 0) - 3 })}
                        </Typography>
                      )}
                    </Stack>

                    <Button
                      component={Link}
                      to={`/pedido/detalle/${order.id_pedido}`}
                      variant="outlined"
                      fullWidth
                    >
                      {t("orders.list.actions.detail")}
                    </Button>

                    {/* ==================================
                          ACCIONES DEL CLIENTE
                      ================================== */}

                    {canCreateOrder && (
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        spacing={1.5}
                      >
                        <Button
                          component={Link}
                          to={`/pedido/seguimiento/${order.id_pedido}`}
                          variant="contained"
                          fullWidth
                        >
                          {t("orders.list.actions.tracking")}
                        </Button>

                        <Button
                          component={Link}
                          to="/pedido/crear"
                          variant="outlined"
                          fullWidth
                        >
                          {t("orders.list.actions.repeat")}
                        </Button>
                      </Stack>
                    )}

                    {/* Los roles habilitados pueden iniciar un nuevo pedido desde aquí. */}
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
