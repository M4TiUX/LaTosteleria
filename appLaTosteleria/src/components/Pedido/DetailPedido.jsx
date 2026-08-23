import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import NotesOutlinedIcon from "@mui/icons-material/NotesOutlined";

import PedidoService from "../../services/PedidoService";
import { FacturaDetalleItems } from "./FacturaDetalleItems";
import { ResumenFactura } from "./ResumenFactura";
import { UserContext } from "../../context/UserContext";

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(String(value).replace(" ", "T"));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("es-CR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

export function DetailPedido() {
  const { t } = useTranslation();
  const { id } = useParams();

  const { decodeToken } = useContext(UserContext);

  const userData = decodeToken();

  const roleName = userData?.rol?.name ?? "";

  const isCliente = roleName === "Cliente";
  const isAdministrador = roleName === "Administrador";
  const canValidateStations = [
    "Administrador",
    "Empleado",
    "Encargado",
  ].includes(roleName);

  const [pedido, setPedido] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [unauthorized, setUnauthorized] = useState(false);
  const [preparation, setPreparation] = useState([]);
  const [loadingPreparation, setLoadingPreparation] = useState(false);
  const [advancingStation, setAdvancingStation] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    setUnauthorized(false);

    PedidoService.getOrderById(id)
      .then((response) => {
        const data = response.data;

        /*
          Si el usuario es Cliente,
          verificamos que el pedido
          realmente le pertenezca.
        */

        if (isCliente && Number(data?.cliente_id) !== Number(userData?.id)) {
          setUnauthorized(true);
          setPedido(null);
          return;
        }

        setPedido(data);
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.response?.data?.result ??
            requestError?.message ??
            t("orders.detail.loadError"),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, isCliente, t, userData?.id]);

  useEffect(() => {
    if (!canValidateStations || pedido?.metodo_entrega !== "Tienda") {
      setPreparation([]);
      return;
    }

    setLoadingPreparation(true);
    PedidoService.getPreparation(id)
      .then((response) =>
        setPreparation(Array.isArray(response.data) ? response.data : []),
      )
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            t("orders.detail.preparationLoadError"),
        );
      })
      .finally(() => setLoadingPreparation(false));
  }, [canValidateStations, id, pedido?.metodo_entrega, t]);

  const advanceStation = async (stationId) => {
    try {
      setAdvancingStation(stationId);
      const response = await PedidoService.advancePreparation(id, stationId);
      setPreparation(Array.isArray(response.data) ? response.data : []);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          t("orders.detail.preparationUpdateError"),
      );
    } finally {
      setAdvancingStation(null);
    }
  };

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />

        <Typography>{t("orders.detail.loading")}</Typography>
      </Stack>
    );
  }

  if (unauthorized) {
    return (
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Stack spacing={2}>
          <Alert severity="error">{t("orders.detail.unauthorized")}</Alert>

          <Box>
            <Button
              component={Link}
              to="/pedido"
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
            >
              {t("orders.detail.backToOrders")}
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Stack spacing={2}>
          <Alert severity="error">{error}</Alert>

          <Box>
            <Button
              component={Link}
              to="/pedido"
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
            >
              {t("orders.detail.backToOrders")}
            </Button>
          </Box>
        </Stack>
      </Box>
    );
  }

  if (!pedido) {
    return (
      <Box
        sx={{
          maxWidth: "900px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Alert severity="warning">{t("orders.detail.notFound")}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: "900px",
        mx: "auto",
        px: 2,
        py: 3,
      }}
    >
      <Stack spacing={2.5}>
        {/* ======================================
            ENCABEZADO
        ====================================== */}

        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
          justifyContent="space-between"
          alignItems={{
            xs: "flex-start",
            sm: "center",
          }}
          spacing={1.5}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              {t("orders.common.orderNumber", { id: pedido.id_pedido })}
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {t("orders.detail.description")}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              component={Link}
              to={`/pedido/factura/${pedido.id_pedido}`}
              variant="contained"
              size="small"
            >
              {t("orders.detail.viewInvoice")}
            </Button>

            {isAdministrador && (
              <Button
                component={Link}
                to={`/pedido/seguimiento/${pedido.id_pedido}`}
                variant="contained"
                size="small"
              >
                {t("orders.list.actions.tracking")}
              </Button>
            )}

            <Button
              component={Link}
              to="/pedido"
              variant="outlined"
              size="small"
              startIcon={<ArrowBackOutlinedIcon />}
            >
              {t("orders.common.back")}
            </Button>
          </Stack>
        </Stack>

        {/* ======================================
            INFORMACIÓN GENERAL
        ====================================== */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: 2.5,
              "&:last-child": {
                pb: 2.5,
              },
            }}
          >
            <Stack spacing={2}>
              <Typography variant="h6" fontWeight={700}>
                {t("orders.detail.orderInfo")}
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <PersonOutlineOutlinedIcon
                      color="action"
                      fontSize="small"
                    />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t("orders.common.client")}
                      </Typography>

                      <Typography fontWeight={600} variant="body2">
                        {pedido.cliente_nombre}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <EmailOutlinedIcon color="action" fontSize="small" />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t("orders.common.email")}
                      </Typography>

                      <Typography fontWeight={600} variant="body2">
                        {pedido.cliente_correo}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Stack direction="row" spacing={1.2} alignItems="center">
                    <LocalShippingOutlinedIcon
                      color="action"
                      fontSize="small"
                    />

                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        {t("orders.common.deliveryMethod")}
                      </Typography>

                      <Typography fontWeight={600} variant="body2">
                        {pedido.metodo_entrega}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("orders.common.paymentMethod")}
                    </Typography>

                    <Typography fontWeight={600} variant="body2">
                      {pedido.metodo_pago ?? t("orders.invoice.notRegistered")}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("orders.common.createdAt")}
                    </Typography>

                    <Typography fontWeight={600} variant="body2">
                      {formatDateTime(pedido.fecha_creacion)}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("orders.invoice.manager")}
                    </Typography>

                    <Typography fontWeight={600} variant="body2">
                      {pedido.encargado_nombre ??
                        t("orders.invoice.notApplicable")}
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      {t("orders.common.status")}
                    </Typography>

                    <Box sx={{ mt: 0.5 }}>
                      <Chip
                        size="small"
                        label={
                          pedido.estado_actual ?? t("orders.common.noTracking")
                        }
                      />
                    </Box>
                  </Box>
                </Grid>
              </Grid>

              <Divider />

              <Stack direction="row" spacing={1.2} alignItems="flex-start">
                <NotesOutlinedIcon color="action" fontSize="small" />

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.detail.generalNotes")}
                  </Typography>

                  <Typography variant="body2">
                    {pedido.observaciones
                      ? pedido.observaciones
                      : t("orders.common.noNotes")}
                  </Typography>
                </Box>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {canValidateStations && pedido.metodo_entrega === "Tienda" && (
          <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
            <CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}>
              <Stack spacing={2}>
                <Typography variant="h6" fontWeight={700}>
                  {t("orders.detail.preparationTitle")}
                </Typography>

                {loadingPreparation ? (
                  <CircularProgress size={24} />
                ) : preparation.length === 0 ? (
                  <Typography color="text.secondary">
                    {t("orders.detail.noPreparationStations")}
                  </Typography>
                ) : (
                  Array.from(
                    preparation
                      .reduce((groups, station) => {
                        const key = `${station.detalle_id}-${station.producto_id}`;
                        const group = groups.get(key) ?? [];
                        group.push(station);
                        groups.set(key, group);
                        return groups;
                      }, new Map())
                      .values(),
                  ).map((stations) => {
                    const nextStation = stations.find(
                      (station) => !Number(station.validada),
                    );
                    return (
                      <Box
                        key={`${stations[0].detalle_id}-${stations[0].producto_id}`}
                      >
                        <Typography fontWeight={600}>
                          {stations[0].nombre_producto}
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          flexWrap="wrap"
                          sx={{ mt: 1 }}
                        >
                          {stations.map((station) => (
                            <Button
                              key={station.id_pedido_estacion}
                              size="small"
                              variant={
                                Number(station.validada)
                                  ? "contained"
                                  : "outlined"
                              }
                              color={
                                Number(station.validada) ? "success" : "primary"
                              }
                              disabled={
                                Boolean(
                                  nextStation &&
                                    station.id_pedido_estacion !==
                                      nextStation.id_pedido_estacion,
                                ) ||
                                !nextStation ||
                                advancingStation !== null
                              }
                              onClick={() =>
                                advanceStation(station.id_pedido_estacion)
                              }
                            >
                              {station.orden_paso}. {station.nombre_estacion}
                            </Button>
                          ))}
                        </Stack>
                      </Box>
                    );
                  })
                )}
              </Stack>
            </CardContent>
          </Card>
        )}

        {/* ======================================
            PRODUCTOS Y COMBOS
        ====================================== */}

        <Card
          sx={{
            borderRadius: 3,
            boxShadow: 2,
          }}
        >
          <CardContent
            sx={{
              p: 2.5,
              "&:last-child": {
                pb: 2.5,
              },
            }}
          >
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <ReceiptLongOutlinedIcon fontSize="small" />

                <Typography variant="h6" fontWeight={700}>
                  {t("orders.common.productsAndCombos")}
                </Typography>
              </Stack>

              <FacturaDetalleItems items={pedido.items} />
            </Stack>
          </CardContent>
        </Card>

        {/* ======================================
            RESUMEN
        ====================================== */}

        <ResumenFactura pedido={pedido} />
      </Stack>
    </Box>
  );
}
