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
  Stack,
  Typography,
} from "@mui/material";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";
import PrintOutlinedIcon from "@mui/icons-material/PrintOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

import PedidoService from "../../services/PedidoService";
import { FacturaDetalleItems } from "./FacturaDetalleItems";
import { ResumenFactura } from "./ResumenFactura";

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

export function FacturaPedido() {
  const { t } = useTranslation();
  const { id } = useParams();

  const [pedido, setPedido] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    PedidoService.getOrderById(id)
      .then((response) => {
        setPedido(response.data ?? null);
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.response?.data?.result ??
            requestError?.message ??
            t("orders.invoice.loadError"),
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, t]);

  if (loading) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 6 }}>
        <CircularProgress />
        <Typography>{t("orders.invoice.loading")}</Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: "850px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!pedido) {
    return (
      <Box
        sx={{
          maxWidth: "850px",
          mx: "auto",
          px: 2,
          py: 3,
        }}
      >
        <Alert severity="warning">{t("orders.invoice.notFound")}</Alert>
      </Box>
    );
  }

  return (
    <Box
      className="invoice-print-area"
      sx={{
        maxWidth: "850px",
        mx: "auto",
        px: 2,
        py: 3,
      }}
    >
      <Stack spacing={2.5}>
        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          spacing={2}
        >
          <Box>
            <Typography variant="h4" fontWeight={700}>
              {t("orders.invoice.title", { id: pedido.id_pedido })}
            </Typography>

            <Typography color="text.secondary">La Tostelería</Typography>
          </Box>

          <Stack
            className="no-print"
            direction="row"
            spacing={1.5}
          >
            <Button
              component={Link}
              to={`/pedido/detalle/${pedido.id_pedido}`}
              variant="outlined"
              startIcon={<ArrowBackOutlinedIcon />}
            >
              {t("orders.common.back")}
            </Button>

            <Button
              variant="contained"
              startIcon={<PrintOutlinedIcon />}
              onClick={() => window.print()}
            >
              {t("orders.invoice.print")}
            </Button>
          </Stack>
        </Stack>

        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
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
                {t("orders.invoice.generalInfo")}
              </Typography>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.client")}
                  </Typography>

                  <Typography fontWeight={600}>{pedido.cliente_nombre}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.email")}
                  </Typography>

                  <Typography fontWeight={600}>{pedido.cliente_correo}</Typography>
                </Box>
              </Stack>

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("orders.invoice.manager")}
                </Typography>

                <Typography fontWeight={600}>
                  {pedido.encargado_nombre ?? t("orders.invoice.notApplicable")}
                </Typography>
              </Box>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.date")}
                  </Typography>

                  <Typography>{formatDateTime(pedido.fecha_creacion)}</Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.deliveryMethod")}
                  </Typography>

                  <Typography>{pedido.metodo_entrega}</Typography>
                </Box>
              </Stack>

              <Stack
                direction={{ xs: "column", sm: "row" }}
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.paymentMethod")}
                  </Typography>

                  <Typography fontWeight={600}>
                    {pedido.metodo_pago ?? t("orders.invoice.notRegistered")}
                  </Typography>
                </Box>

                <Box>
                  <Typography variant="caption" color="text.secondary">
                    {t("orders.common.status")}
                  </Typography>

                  <Box sx={{ mt: 0.5 }}>
                    <Chip
                      label={pedido.estado_actual ?? t("orders.common.noTracking")}
                      size="small"
                    />
                  </Box>
                </Box>
              </Stack>

              <Divider />

              <Box>
                <Typography variant="caption" color="text.secondary">
                  {t("orders.common.notes")}
                </Typography>

                <Typography>
                  {pedido.observaciones ? pedido.observaciones : t("orders.common.noNotes")}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
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
                <ReceiptLongOutlinedIcon />
                <Typography variant="h6" fontWeight={700}>
                  {t("orders.invoice.detailTitle")}
                </Typography>
              </Stack>

              <FacturaDetalleItems items={pedido.items} />
            </Stack>
          </CardContent>
        </Card>

        <ResumenFactura pedido={pedido} />
      </Stack>
    </Box>
  );
}
