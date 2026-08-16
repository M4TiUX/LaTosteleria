import { Alert, Box, Divider, Stack, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function FacturaDetalleItems({ items }) {
  const { t } = useTranslation();

  if (!items || items.length === 0) {
    return <Alert severity="info">{t("orders.invoice.noItems")}</Alert>;
  }

  return (
    <Stack spacing={1.5} divider={<Divider />}>
      {items.map((item) => (
        <Stack key={item.id_detalle} spacing={1}>
          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            justifyContent="space-between"
            spacing={1}
          >
            <Box>
              <Typography fontWeight={700}>{item.nombre}</Typography>

              <Typography variant="body2" color="text.secondary">
                {item.item_type === "combo"
                  ? t("orders.common.combo")
                  : t("orders.common.product")}
                {" · "}
                {t("orders.common.quantityLabel")}: {item.cantidad}
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
              <Typography variant="body2" color="text.secondary">
                {t("orders.invoice.linePrice")}: {formatCurrency(item.precio_unitario)}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                {t("orders.invoice.lineSubtotal")}: {formatCurrency(item.subtotal)}
              </Typography>

              <Typography fontWeight={700} color="primary.main">
                {t("orders.invoice.lineTax")}: {formatCurrency(item.impuesto)}
              </Typography>
            </Box>
          </Stack>

          <Box>
            <Typography variant="caption" color="text.secondary">
              {t("orders.common.notes")}
            </Typography>

            <Typography variant="body2">
              {item.observaciones ? item.observaciones : t("orders.common.noNotes")}
            </Typography>
          </Box>
        </Stack>
      ))}
    </Stack>
  );
}