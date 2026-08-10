import {
  Box,
  Card,
  CardContent,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

export function ResumenFactura({ pedido }) {
  if (!pedido) {
    return null;
  }

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
          <Typography
            variant="h6"
            fontWeight={700}
          >
            Resumen de factura
          </Typography>

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Subtotal
              </Typography>

              <Typography>
                {formatCurrency(
                  pedido.subtotal
                )}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Impuestos
              </Typography>

              <Typography>
                {formatCurrency(
                  pedido.impuestos
                )}
              </Typography>
            </Stack>

            <Divider />

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography
                variant="h6"
                fontWeight={700}
              >
                Total
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                color="primary"
              >
                {formatCurrency(
                  pedido.total
                )}
              </Typography>
            </Stack>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Método de pago
              </Typography>

              <Typography fontWeight={600}>
                {pedido.metodo_pago ?? "-"}
              </Typography>
            </Stack>

            <Stack
              direction="row"
              justifyContent="space-between"
            >
              <Typography color="text.secondary">
                Monto pagado
              </Typography>

              <Typography>
                {formatCurrency(
                  pedido.monto_recibido ??
                    pedido.monto_pago
                )}
              </Typography>
            </Stack>

            {pedido.metodo_pago ===
              "Efectivo" && (
              <Stack
                direction="row"
                justifyContent="space-between"
              >
                <Typography color="text.secondary">
                  Vuelto
                </Typography>

                <Typography>
                  {formatCurrency(
                    pedido.vuelto
                  )}
                </Typography>
              </Stack>
            )}

            {pedido.metodo_pago ===
              "Tarjeta" && (
              <>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography color="text.secondary">
                    Marca
                  </Typography>

                  <Typography>
                    {pedido.marca_tarjeta ??
                      "-"}
                  </Typography>
                </Stack>

                <Stack
                  direction="row"
                  justifyContent="space-between"
                >
                  <Typography color="text.secondary">
                    Tarjeta
                  </Typography>

                  <Typography>
                    **** **** ****{" "}
                    {pedido.ultimos_cuatro_digitos ??
                      "----"}
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