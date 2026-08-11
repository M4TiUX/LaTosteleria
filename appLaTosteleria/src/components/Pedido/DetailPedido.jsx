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

  const [pedido, setPedido] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

  const [unauthorized, setUnauthorized] = useState(false);

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
  }, [id, isCliente, userData?.id]);

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
          <Alert severity="error">
            {t("orders.detail.unauthorized")}
          </Alert>

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
                      {t("orders.common.createdAt")}
                    </Typography>

                    <Typography fontWeight={600} variant="body2">
                      {formatDateTime(pedido.fecha_creacion)}
                    </Typography>
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

              {!pedido.items || pedido.items.length === 0 ? (
                <Alert severity="info">
                  {t("orders.detail.noItems")}
                </Alert>
              ) : (
                <Stack spacing={1.5} divider={<Divider />}>
                  {pedido.items.map((item) => (
                    <Stack key={item.id_detalle} spacing={0.8}>
                      <Stack
                        direction={{
                          xs: "column",
                          sm: "row",
                        }}
                        justifyContent="space-between"
                        spacing={1}
                      >
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <Typography fontWeight={700} variant="body2">
                              {item.nombre}
                            </Typography>

                            <Chip
                              size="small"
                              variant="outlined"
                              label={
                                item.item_type === "combo"
                                  ? t("orders.common.combo")
                                  : t("orders.common.product")
                              }
                            />
                          </Stack>

                          <Typography variant="body2" color="text.secondary">
                            {t("orders.common.quantity", { count: item.cantidad })}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            textAlign: {
                              xs: "left",
                              sm: "right",
                            },
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            {t("orders.detail.unitPrice")}
                          </Typography>

                          <Typography variant="body2" fontWeight={600}>
                            {formatCurrency(item.precio_unitario)}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="primary"
                            fontWeight={700}
                          >
                            {t("orders.common.subtotal")}: {formatCurrency(item.subtotal)}
                          </Typography>
                        </Box>
                      </Stack>

                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          {t("orders.common.notes")}
                        </Typography>

                        <Typography variant="body2">
                          {item.observaciones
                            ? item.observaciones
                            : t("orders.common.noNotes")}
                        </Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* ======================================
            RESUMEN
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
            <Stack spacing={1.5}>
              <Typography variant="h6" fontWeight={700}>
                {t("orders.common.summary")}
              </Typography>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{t("orders.common.subtotal")}</Typography>

                <Typography variant="body2">
                  {formatCurrency(pedido.subtotal)}
                </Typography>
              </Stack>

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2">{t("orders.common.taxes")}</Typography>

                <Typography variant="body2">
                  {formatCurrency(pedido.impuestos)}
                </Typography>
              </Stack>

              <Divider />

              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" fontWeight={700}>
                  {t("orders.common.total")}
                </Typography>

                <Typography variant="h6" color="primary" fontWeight={700}>
                  {formatCurrency(pedido.total)}
                </Typography>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}
