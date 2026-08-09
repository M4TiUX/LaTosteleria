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
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";

import {
  Link,
  useParams,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import PedidoService from "../../services/PedidoService";
import { ResumenFactura } from "./ResumenFactura";


// ============================================================
// MONEDA
// ============================================================

function formatCurrency(value) {
  return new Intl.NumberFormat(
    "es-CR",
    {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }
  ).format(
    Number(value ?? 0)
  );
}


// ============================================================
// FECHA
// ============================================================

function formatDateTime(value) {
  if (!value) {
    return "-";
  }

  const date =
    new Date(
      String(value).replace(
        " ",
        "T"
      )
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "es-CR",
    {
      dateStyle: "medium",
      timeStyle: "short",
    }
  ).format(date);
}


// ============================================================
// FACTURA
// ============================================================

export function FacturaPedido() {

  const { id } =
    useParams();

  const [
    pedido,
    setPedido,
  ] = useState(null);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState(null);


  // ==========================================================
  // CARGAR PEDIDO
  // ==========================================================

  useEffect(() => {

    setLoading(true);
    setError(null);

    PedidoService
      .getOrderById(id)
      .then(
        (response) => {

          setPedido(
            response.data ??
            null
          );
        }
      )
      .catch(
        (requestError) => {

          setError(
            requestError
              ?.response
              ?.data
              ?.message ??
            requestError
              ?.response
              ?.data
              ?.result ??
            requestError
              ?.message ??
            "No fue posible cargar la factura."
          );
        }
      )
      .finally(() => {

        setLoading(false);
      });

  }, [id]);


  // ==========================================================
  // CARGANDO
  // ==========================================================

  if (loading) {

    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ py: 6 }}
      >
        <CircularProgress />

        <Typography>
          Cargando factura...
        </Typography>
      </Stack>
    );
  }


  // ==========================================================
  // ERROR
  // ==========================================================

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
        <Alert severity="error">
          {error}
        </Alert>
      </Box>
    );
  }


  // ==========================================================
  // NO ENCONTRADO
  // ==========================================================

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
        <Alert severity="warning">
          No se encontró la factura.
        </Alert>
      </Box>
    );
  }


  // ==========================================================
  // VISTA
  // ==========================================================

  return (
    <Box
      sx={{
        maxWidth: "850px",
        mx: "auto",
        px: 2,
        py: 3,
      }}
    >

      <Stack spacing={2.5}>

        {/* ===================================================
            ENCABEZADO PRINCIPAL
        =================================================== */}

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
          spacing={2}
        >

          <Box>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Factura #
              {pedido.id_pedido}
            </Typography>

            <Typography
              color="text.secondary"
            >
              La Tostelería
            </Typography>

          </Box>


          <Button
            component={Link}
            to={`/pedido/detalle/${pedido.id_pedido}`}
            variant="outlined"
            startIcon={
              <ArrowBackOutlinedIcon />
            }
          >
            Volver
          </Button>

        </Stack>


        {/* ===================================================
            INFORMACIÓN GENERAL
        =================================================== */}

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
                Información general
              </Typography>


              {/* =============================================
                  CLIENTE
              ============================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
              >

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Cliente
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      pedido
                        .cliente_nombre
                    }
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Correo
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      pedido
                        .cliente_correo
                    }
                  </Typography>

                </Box>

              </Stack>


              {/* =============================================
                  ENCARGADO
              ============================================= */}

              <Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Encargado
                </Typography>

                <Typography
                  fontWeight={600}
                >
                  {
                    pedido
                      .encargado_nombre ??
                    "No aplica"
                  }
                </Typography>

              </Box>


              {/* =============================================
                  FECHA / ENTREGA
              ============================================= */}

              <Stack
                direction={{
                  xs: "column",
                  sm: "row",
                }}
                justifyContent="space-between"
                spacing={2}
              >

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Fecha
                  </Typography>

                  <Typography>
                    {
                      formatDateTime(
                        pedido
                          .fecha_creacion
                      )
                    }
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Método de entrega
                  </Typography>

                  <Typography>
                    {
                      pedido
                        .metodo_entrega
                    }
                  </Typography>

                </Box>

              </Stack>


              {/* =============================================
                  MÉTODO DE PAGO / ESTADO
              ============================================= */}

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
                spacing={2}
              >

                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Método de pago
                  </Typography>

                  <Typography
                    fontWeight={600}
                  >
                    {
                      pedido
                        .metodo_pago ??
                      "No registrado"
                    }
                  </Typography>

                </Box>


                <Box>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Estado
                  </Typography>

                  <Box
                    sx={{
                      mt: 0.5,
                    }}
                  >
                    <Chip
                      label={
                        pedido
                          .estado_actual ??
                        "Sin seguimiento"
                      }
                      size="small"
                    />
                  </Box>

                </Box>

              </Stack>


              {/* =============================================
                  OBSERVACIONES GENERALES
              ============================================= */}

              <Divider />


              <Box>

                <Typography
                  variant="caption"
                  color="text.secondary"
                >
                  Observaciones
                </Typography>

                <Typography>
                  {
                    pedido
                      .observaciones
                      ? pedido
                          .observaciones
                      : "Sin observaciones."
                  }
                </Typography>

              </Box>

            </Stack>

          </CardContent>

        </Card>


        {/* ===================================================
            DETALLE
        =================================================== */}

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

              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
              >

                <ReceiptLongOutlinedIcon />


                <Typography
                  variant="h6"
                  fontWeight={700}
                >
                  Detalle de la factura
                </Typography>

              </Stack>


              {!pedido.items ||
              pedido.items.length ===
                0 ? (

                <Alert
                  severity="info"
                >
                  No hay elementos registrados.
                </Alert>

              ) : (

                <Stack
                  spacing={1.5}
                  divider={
                    <Divider />
                  }
                >

                  {
                    pedido.items.map(
                      (item) => (

                        <Stack
                          key={
                            item.id_detalle
                          }
                          spacing={1}
                        >

                          <Stack
                            direction={{
                              xs:
                                "column",

                              sm:
                                "row",
                            }}
                            justifyContent="space-between"
                            spacing={1}
                          >

                            <Box>

                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {
                                  item.nombre
                                }
                              </Typography>


                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {
                                  item
                                    .item_type ===
                                  "combo"
                                    ? "Combo"
                                    : "Producto"
                                }

                                {" · "}

                                Cantidad:{" "}
                                {
                                  item.cantidad
                                }
                              </Typography>

                            </Box>


                            <Box
                              sx={{
                                textAlign:
                                  {
                                    xs:
                                      "left",

                                    sm:
                                      "right",
                                  },
                              }}
                            >

                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {
                                  formatCurrency(
                                    item
                                      .precio_unitario
                                  )
                                }{" "}
                                c/u
                              </Typography>


                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {
                                  formatCurrency(
                                    item
                                      .subtotal
                                  )
                                }
                              </Typography>

                            </Box>

                          </Stack>


                          <Box>

                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Observaciones
                            </Typography>

                            <Typography
                              variant="body2"
                            >
                              {
                                item
                                  .observaciones
                                  ? item
                                      .observaciones
                                  : "Sin observaciones."
                              }
                            </Typography>

                          </Box>

                        </Stack>

                      )
                    )
                  }

                </Stack>

              )}

            </Stack>

          </CardContent>

        </Card>


        {/* ===================================================
            RESUMEN
        =================================================== */}

        <ResumenFactura
          pedido={pedido}
        />

      </Stack>

    </Box>
  );
}