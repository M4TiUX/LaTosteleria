import { useTranslation } from "react-i18next";
import { Card, CardContent, Divider, Stack, Typography } from "@mui/material";
import PropTypes from "prop-types";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function ResumenFactura({ pedido }) {
  const { t } = useTranslation();
  if (!pedido) {
    return null;
  }

  const shippingCost = Number(pedido.costo_envio ?? 0);
  const showShipping = shippingCost > 0;
  const receivedLabel =
    pedido.metodo_pago === "Efectivo"
      ? t("orders.summary.amountReceived")
      : t("orders.summary.amountPaid");

  return (
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
            {t("orders.summary.title")}
          </Typography>

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t("orders.summary.totalBeforeTax")}
              </Typography>

              <Typography>{formatCurrency(pedido.subtotal)}</Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t("orders.common.taxes")}
              </Typography>

              <Typography>{formatCurrency(pedido.impuestos)}</Typography>
            </Stack>

            {showShipping && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  {t("orders.summary.shippingCost")}
                </Typography>

                <Typography>{formatCurrency(shippingCost)}</Typography>
              </Stack>
            )}

            <Divider />

            <Stack direction="row" justifyContent="space-between">
              <Typography variant="h6" fontWeight={700}>
                {t("orders.summary.totalWithTax")}
              </Typography>

              <Typography variant="h6" fontWeight={700} color="primary">
                {formatCurrency(pedido.total)}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">
                {t("orders.common.paymentMethod")}
              </Typography>

              <Typography fontWeight={600}>
                {pedido.metodo_pago ?? "-"}
              </Typography>
            </Stack>

            <Stack direction="row" justifyContent="space-between">
              <Typography color="text.secondary">{receivedLabel}</Typography>

              <Typography>
                {formatCurrency(pedido.monto_recibido ?? pedido.monto_pago)}
              </Typography>
            </Stack>

            {pedido.metodo_pago === "Efectivo" && (
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">
                  {t("orders.summary.change")}
                </Typography>

                <Typography>{formatCurrency(pedido.vuelto)}</Typography>
              </Stack>
            )}

            {pedido.metodo_pago === "Tarjeta" && (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t("orders.summary.brand")}
                  </Typography>

                  <Typography>{pedido.marca_tarjeta ?? "-"}</Typography>
                </Stack>

                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">
                    {t("orders.summary.card")}
                  </Typography>

                  <Typography>
                    **** **** **** {pedido.ultimos_cuatro_digitos ?? "----"}
                  </Typography>
                </Stack>
              </>
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

ResumenFactura.propTypes = {
  pedido: PropTypes.object,
};
