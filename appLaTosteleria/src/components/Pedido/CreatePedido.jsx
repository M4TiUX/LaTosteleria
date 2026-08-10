import { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

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

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

import MenuService from "../../services/MenuService";
import PedidoService from "../../services/PedidoService";

import { UserContext } from "../../context/UserContext";
import { useCart } from "../../hooks/useCart";


// ============================================================
// FORMATO DE MONEDA
// ============================================================

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}


// ============================================================
// NORMALIZAR PRODUCTOS Y COMBOS DEL MENÚ
// ============================================================

function normalizeMenuItems(menu) {
  const normalized = [];

  menu?.categorias?.forEach((category) => {

    // PRODUCTOS
    category.productos?.forEach((item) => {
      normalized.push({
        id: `producto-${item.id}`,
        itemId: Number(item.id),
        itemType: "producto",
        title: item.nombre,
        description: item.descripcion,
        price: Number(item.precio),
        category: category.categoria_nombre,
      });
    });

    // COMBOS
    category.combos?.forEach((item) => {
      normalized.push({
        id: `combo-${item.id}`,
        itemId: Number(item.id),
        itemType: "combo",
        title: item.nombre,
        description: item.descripcion,
        price: Number(item.precio),
        category: category.categoria_nombre,
      });
    });
  });

  return normalized;
}


// ============================================================
// COMPONENTE
// ============================================================

export function CreatePedido() {

  const navigate = useNavigate();

  const { decodeToken } =
    useContext(UserContext);

  const userData =
    decodeToken();

  const {
    cart,
    addItem,
    decreaseItem,
    removeItem,
    cleanCart,
    getTotal,
    getCountItems,
  } = useCart();

  const isAuthenticated =
    Boolean(userData?.id);


  // ==========================================================
  // MENÚ
  // ==========================================================

  const [menus, setMenus] =
    useState([]);

  const [
    selectedMenuId,
    setSelectedMenuId,
  ] = useState("");

  const [
    selectedMenu,
    setSelectedMenu,
  ] = useState(null);


  // ==========================================================
  // OBSERVACIONES
  // ==========================================================

  const [
    orderNotes,
    setOrderNotes,
  ] = useState("");

  const [
    itemNotes,
    setItemNotes,
  ] = useState({});


  // ==========================================================
  // MÉTODO DE PAGO
  // ==========================================================

  const [
    paymentMethod,
    setPaymentMethod,
  ] = useState("");

  const [
    amountReceived,
    setAmountReceived,
  ] = useState("");

  const [
    cardBrand,
    setCardBrand,
  ] = useState("");

  const [
    cardLastFour,
    setCardLastFour,
  ] = useState("");


  // ==========================================================
  // CARGA Y ERRORES
  // ==========================================================

  const [
    loadingMenus,
    setLoadingMenus,
  ] = useState(true);

  const [
    loadingMenuDetail,
    setLoadingMenuDetail,
  ] = useState(false);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState(null);


  // ==========================================================
  // CARGAR MENÚS
  // ==========================================================

  useEffect(() => {

    MenuService.getMenus()
      .then((response) => {

        const catalog =
          Array.isArray(response.data)
            ? response.data
            : [];

        const visibleMenus =
          catalog.filter(
            (menu) =>
              Number(menu.activo) === 1
          );

        setMenus(visibleMenus);

        if (visibleMenus.length > 0) {
          setSelectedMenuId(
            String(
              visibleMenus[0].id_menu
            )
          );
        }
      })
      .catch((requestError) => {

        setError(
          requestError?.response?.data
            ?.message ??
          requestError?.message ??
          "No fue posible cargar los menus disponibles."
        );
      })
      .finally(() => {
        setLoadingMenus(false);
      });

  }, []);


  // ==========================================================
  // CARGAR DETALLE DEL MENÚ
  // ==========================================================

  useEffect(() => {

    if (!selectedMenuId) {
      setSelectedMenu(null);
      return;
    }

    setLoadingMenuDetail(true);
    setError(null);

    MenuService
      .getMenuById(
        selectedMenuId
      )
      .then((response) => {

        setSelectedMenu(
          response.data ?? null
        );

        cleanCart();

        setItemNotes({});
      })
      .catch((requestError) => {

        setError(
          requestError?.response?.data
            ?.message ??
          requestError?.message ??
          "No fue posible cargar el menu seleccionado."
        );

        setSelectedMenu(null);
      })
      .finally(() => {
        setLoadingMenuDetail(false);
      });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenuId]);


  // ==========================================================
  // ITEMS DISPONIBLES
  // ==========================================================

  const availableItems =
    useMemo(
      () =>
        normalizeMenuItems(
          selectedMenu
        ),
      [selectedMenu]
    );


  // ==========================================================
  // MAPA DEL CARRITO
  // ==========================================================

  const cartMap =
    useMemo(() => {

      return new Map(
        cart.map(
          (item) => [
            item.id,
            item,
          ]
        )
      );

    }, [cart]);


  // ==========================================================
  // TOTALES
  // ==========================================================

  const subtotalAmount =
    useMemo(
      () => getTotal(cart),
      [cart, getTotal]
    );

  const taxAmount = 0;

  const totalAmount =
    subtotalAmount + taxAmount;


  // ==========================================================
  // VUELTO
  // ==========================================================

  const changeAmount =
    useMemo(() => {

      if (
        paymentMethod !==
        "Efectivo"
      ) {
        return 0;
      }

      const received =
        Number(amountReceived);

      if (
        Number.isNaN(received) ||
        received < totalAmount
      ) {
        return 0;
      }

      return (
        received -
        totalAmount
      );

    }, [
      paymentMethod,
      amountReceived,
      totalAmount,
    ]);


  // ==========================================================
  // LIMPIAR OBSERVACIONES DE ITEMS ELIMINADOS
  // ==========================================================

  useEffect(() => {

    setItemNotes(
      (previousNotes) => {

        const cartIds =
          new Set(
            cart.map(
              (item) =>
                item.id
            )
          );

        const nextNotes = {};

        Object
          .entries(previousNotes)
          .forEach(
            ([itemId, note]) => {

              if (
                cartIds.has(
                  itemId
                )
              ) {
                nextNotes[
                  itemId
                ] = note;
              }
            }
          );

        return nextNotes;
      }
    );

  }, [cart]);


  // ==========================================================
  // CAMBIAR MÉTODO DE PAGO
  // ==========================================================

  const handlePaymentMethodChange =
    (event) => {

      const method =
        event.target.value;

      setPaymentMethod(method);

      // Limpiar datos que
      // pertenecen al otro método
      setAmountReceived("");
      setCardBrand("");
      setCardLastFour("");

      setError(null);
    };


  // ==========================================================
  // CONFIRMAR PEDIDO
  // ==========================================================

  const handleSubmit =
    async () => {

      // ------------------------------------------------------
      // AUTENTICACIÓN
      // ------------------------------------------------------

      if (!isAuthenticated) {
        setError(
          "Debe iniciar sesion para registrar un pedido."
        );

        return;
      }


      // ------------------------------------------------------
      // MENÚ
      // ------------------------------------------------------

      if (!selectedMenuId) {
        setError(
          "Debe seleccionar un menu antes de crear el pedido."
        );

        return;
      }


      // ------------------------------------------------------
      // CARRITO
      // ------------------------------------------------------

      if (cart.length === 0) {
        setError(
          "Debe agregar al menos un producto o combo al pedido."
        );

        return;
      }


      // ------------------------------------------------------
      // MÉTODO DE PAGO
      // ------------------------------------------------------

      if (!paymentMethod) {
        setError(
          "Debe seleccionar un metodo de pago."
        );

        return;
      }


      // ------------------------------------------------------
      // VALIDACIÓN EFECTIVO
      // ------------------------------------------------------

      if (
        paymentMethod ===
        "Efectivo"
      ) {

        const received =
          Number(
            amountReceived
          );

        if (
          !amountReceived ||
          Number.isNaN(received) ||
          received <= 0
        ) {
          setError(
            "Debe indicar el monto recibido."
          );

          return;
        }

        if (
          received <
          totalAmount
        ) {
          setError(
            "El monto recibido es insuficiente para pagar el pedido."
          );

          return;
        }
      }


      // ------------------------------------------------------
      // VALIDACIÓN TARJETA
      // ------------------------------------------------------

      if (
        paymentMethod ===
        "Tarjeta"
      ) {

        if (!cardBrand) {
          setError(
            "Debe seleccionar la marca de la tarjeta."
          );

          return;
        }

        if (
          !/^[0-9]{4}$/.test(
            cardLastFour
          )
        ) {
          setError(
            "Debe ingresar exactamente los ultimos 4 digitos de la tarjeta."
          );

          return;
        }
      }


      // ------------------------------------------------------
      // CREAR PAGO
      // ------------------------------------------------------

      let paymentData;

      if (
        paymentMethod ===
        "Efectivo"
      ) {

        paymentData = {
          metodo_pago:
            "Efectivo",

          monto_recibido:
            Number(
              amountReceived
            ),
        };

      } else {

        paymentData = {
          metodo_pago:
            "Tarjeta",

          marca_tarjeta:
            cardBrand,

          ultimos_cuatro_digitos:
            cardLastFour,
        };
      }


      // ------------------------------------------------------
      // CREAR PEDIDO
      // ------------------------------------------------------

      try {

        setSubmitting(true);

        setError(null);


        // ----------------------------------------------------
        // PAYLOAD
        // ----------------------------------------------------

        const payload = {

          cliente_id:
            Number(
              userData?.id
            ),

          menu_id:
            Number(
              selectedMenuId
            ),

          metodo_entrega:
            "Tienda",

          observaciones:
            orderNotes,

          pago:
            paymentData,

          items:
            cart.map(
              (item) => ({
                item_type:
                  item.itemType,

                item_id:
                  item.itemId,

                cantidad:
                  item.quantity,

                observaciones:
                  itemNotes[
                    item.id
                  ] ?? "",
              })
            ),
        };


        // ----------------------------------------------------
        // ENVIAR AL BACKEND
        // ----------------------------------------------------

        const response =
          await PedidoService
            .createOrder(
              payload
            );


        const orderId =
          response?.data
            ?.pedido_id;


        // ----------------------------------------------------
        // LIMPIAR FORMULARIO
        // ----------------------------------------------------

        cleanCart();

        setOrderNotes("");

        setItemNotes({});

        setPaymentMethod("");

        setAmountReceived("");

        setCardBrand("");

        setCardLastFour("");


        // ----------------------------------------------------
        // REDIRECCIÓN
        // ----------------------------------------------------

        if (orderId) {

          navigate(
            `/pedido/seguimiento/${orderId}`
          );

        } else {

          navigate(
            "/pedido"
          );
        }

      } catch (
        requestError
      ) {

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
          "No fue posible registrar el pedido."
        );

      } finally {

        setSubmitting(false);
      }
    };


  // ==========================================================
  // CARGANDO
  // ==========================================================

  if (loadingMenus) {

    return (
      <Stack
        spacing={2}
        alignItems="center"
        sx={{ py: 8 }}
      >
        <CircularProgress />

        <Typography>
          Cargando menus para crear el pedido...
        </Typography>
      </Stack>
    );
  }


  // ==========================================================
  // VISTA
  // ==========================================================

  return (

    <Stack spacing={3}>

      {/* =====================================================
          ENCABEZADO
      ===================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        justifyContent="space-between"
        spacing={2}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={700}
            sx={{ mb: 1 }}
          >
            Nuevo pedido
          </Typography>

          <Typography
            color="text.secondary"
          >
            Selecciona un menu activo y arma el pedido agregando o quitando productos y combos.
          </Typography>

        </Box>


        <Button
          component={Link}
          to="/pedido"
          variant="outlined"
        >
          Ver historial
        </Button>

      </Stack>


      {/* =====================================================
          ERROR
      ===================================================== */}

      {error && (
        <Alert severity="error">
          {error}
        </Alert>
      )}


      {/* =====================================================
          CONTENIDO
      ===================================================== */}

      <Grid
        container
        spacing={3}
      >

        {/* ===================================================
            CATÁLOGO
        =================================================== */}

        <Grid
          item
          xs={12}
          lg={8}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
            }}
          >

            <CardContent>

              <Stack spacing={3}>

                {/* ===========================================
                    MENÚ Y ENTREGA
                =========================================== */}

                <Stack
                  direction={{
                    xs: "column",
                    md: "row",
                  }}
                  spacing={2}
                >

                  <FormControl
                    fullWidth
                  >

                    <InputLabel
                      id="menu-select-label"
                    >
                      Menu
                    </InputLabel>

                    <Select
                      labelId="menu-select-label"
                      value={
                        selectedMenuId
                      }
                      label="Menu"
                      onChange={
                        (event) =>
                          setSelectedMenuId(
                            String(
                              event
                                .target
                                .value
                            )
                          )
                      }
                    >

                      {menus.map(
                        (menu) => (

                          <MenuItem
                            key={
                              menu.id_menu
                            }
                            value={
                              String(
                                menu.id_menu
                              )
                            }
                          >
                            {
                              menu.nombre_menu
                            }
                          </MenuItem>

                        )
                      )}

                    </Select>

                  </FormControl>


                  <Box
                    sx={{
                      minWidth: {
                        xs: "100%",
                        md: 260,
                      },
                    }}
                  >

                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      Metodo de entrega
                    </Typography>

                    <Alert
                      severity="info"
                      sx={{
                        alignItems:
                          "center",
                      }}
                    >
                      Retiro en tienda
                    </Alert>

                  </Box>

                </Stack>


                {/* ===========================================
                    OBSERVACIONES GENERALES
                =========================================== */}

                <TextField
                  label="Observaciones del pedido"
                  placeholder="Ejemplo: sin cebolla, empacar por separado, retirar a nombre de Ana"
                  value={orderNotes}
                  onChange={
                    (event) =>
                      setOrderNotes(
                        event.target
                          .value
                      )
                  }
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{
                    maxLength: 500,
                  }}
                  helperText={`${orderNotes.length}/500 caracteres`}
                />


                {/* ===========================================
                    INFORMACIÓN DEL MENÚ
                =========================================== */}

                {selectedMenu && (

                  <Box>

                    <Typography
                      variant="h5"
                      fontWeight={700}
                      sx={{ mb: 0.75 }}
                    >
                      {
                        selectedMenu
                          .nombre_menu
                      }
                    </Typography>

                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{
                        mb: 2,
                        flexWrap:
                          "wrap",
                      }}
                    >

                      <Chip
                        label={`Inicio ${selectedMenu.fecha_inicio}`}
                        size="small"
                      />

                      <Chip
                        label={`Fin ${selectedMenu.fecha_fin}`}
                        size="small"
                      />

                    </Stack>

                  </Box>
                )}


                {/* ===========================================
                    PRODUCTOS Y COMBOS
                =========================================== */}

                {loadingMenuDetail ? (

                  <Stack
                    spacing={1.5}
                    alignItems="center"
                    sx={{ py: 4 }}
                  >

                    <CircularProgress
                      size={28}
                    />

                    <Typography
                      color="text.secondary"
                    >
                      Cargando detalle del menu...
                    </Typography>

                  </Stack>

                ) : (

                  <Grid
                    container
                    spacing={2}
                  >

                    {availableItems.map(
                      (item) => {

                        const cartItem =
                          cartMap.get(
                            item.id
                          );

                        return (

                          <Grid
                            item
                            xs={12}
                            md={6}
                            key={
                              item.id
                            }
                          >

                            <Card
                              variant="outlined"
                              sx={{
                                height:
                                  "100%",
                                borderRadius:
                                  3,
                              }}
                            >

                              <CardContent>

                                <Stack
                                  spacing={1.5}
                                  sx={{
                                    height:
                                      "100%",
                                  }}
                                >

                                  <Stack
                                    direction="row"
                                    justifyContent="space-between"
                                    spacing={2}
                                  >

                                    <Box>

                                      <Typography
                                        fontWeight={
                                          700
                                        }
                                      >
                                        {
                                          item.title
                                        }
                                      </Typography>

                                      <Typography
                                        color="text.secondary"
                                        variant="body2"
                                      >
                                        {
                                          item.category
                                        }{" "}
                                        ·{" "}
                                        {
                                          item.itemType
                                        }
                                      </Typography>

                                    </Box>


                                    <Chip
                                      label={
                                        formatCurrency(
                                          item.price
                                        )
                                      }
                                      color="primary"
                                      size="small"
                                    />

                                  </Stack>


                                  <Typography
                                    color="text.secondary"
                                    variant="body2"
                                  >
                                    {
                                      item.description
                                    }
                                  </Typography>


                                  <Stack
                                    direction="row"
                                    spacing={1}
                                    alignItems="center"
                                    sx={{
                                      mt: "auto",
                                    }}
                                  >

                                    <Button
                                      variant="outlined"
                                      startIcon={
                                        <RemoveOutlinedIcon />
                                      }
                                      onClick={
                                        () =>
                                          decreaseItem(
                                            item
                                          )
                                      }
                                      disabled={
                                        !cartItem
                                      }
                                    >
                                      Quitar
                                    </Button>


                                    <Button
                                      variant="contained"
                                      startIcon={
                                        <AddOutlinedIcon />
                                      }
                                      onClick={
                                        () =>
                                          addItem(
                                            item
                                          )
                                      }
                                    >
                                      Agregar
                                    </Button>


                                    <Typography
                                      color="text.secondary"
                                    >
                                      {
                                        cartItem
                                          ?.quantity ??
                                        0
                                      }{" "}
                                      en pedido
                                    </Typography>

                                  </Stack>

                                </Stack>

                              </CardContent>

                            </Card>

                          </Grid>

                        );
                      }
                    )}

                  </Grid>

                )}

              </Stack>

            </CardContent>

          </Card>

        </Grid>


        {/* ===================================================
            RESUMEN
        =================================================== */}

        <Grid
          item
          xs={12}
          lg={4}
        >

          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,

              position: {
                lg: "sticky",
              },

              top: {
                lg: 24,
              },
            }}
          >

            <CardContent>

              <Stack spacing={2.5}>

                {/* ===========================================
                    ENCABEZADO RESUMEN
                =========================================== */}

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Resumen del pedido
                  </Typography>

                  <Chip
                    label={`${getCountItems(cart)} items`}
                    size="small"
                  />

                </Stack>


                {/* ===========================================
                    ITEMS
                =========================================== */}

                {cart.length === 0 ? (

                  <Alert
                    severity="info"
                  >
                    Todavia no has agregado productos ni combos.
                  </Alert>

                ) : (

                  <Stack spacing={1.5}>

                    {cart.map(
                      (item) => (

                        <Box
                          key={item.id}
                          sx={{
                            border:
                              "1px solid",

                            borderColor:
                              "divider",

                            borderRadius:
                              2,

                            p: 1.5,
                          }}
                        >

                          <Stack
                            direction="row"
                            justifyContent="space-between"
                            spacing={2}
                          >

                            <Box>

                              <Typography
                                fontWeight={
                                  700
                                }
                              >
                                {
                                  item.title
                                }
                              </Typography>

                              <Typography
                                color="text.secondary"
                                variant="body2"
                              >
                                {
                                  item.quantity
                                }{" "}
                                x{" "}
                                {
                                  formatCurrency(
                                    item.price
                                  )
                                }
                              </Typography>

                            </Box>


                            <Typography
                              fontWeight={
                                700
                              }
                            >
                              {
                                formatCurrency(
                                  item.subtotal
                                )
                              }
                            </Typography>

                          </Stack>


                          <Stack
                            direction="row"
                            spacing={1}
                            sx={{
                              mt: 1.5,
                            }}
                          >

                            <Button
                              size="small"
                              variant="outlined"
                              onClick={
                                () =>
                                  decreaseItem(
                                    item
                                  )
                              }
                            >
                              -1
                            </Button>


                            <Button
                              size="small"
                              variant="outlined"
                              onClick={
                                () =>
                                  addItem(
                                    item
                                  )
                              }
                            >
                              +1
                            </Button>


                            <Button
                              size="small"
                              color="error"
                              variant="text"
                              startIcon={
                                <DeleteOutlineOutlinedIcon />
                              }
                              onClick={
                                () => {

                                  removeItem(
                                    item
                                  );

                                  setItemNotes(
                                    (
                                      previousNotes
                                    ) => {

                                      const nextNotes =
                                        {
                                          ...previousNotes,
                                        };

                                      delete nextNotes[
                                        item.id
                                      ];

                                      return nextNotes;
                                    }
                                  );
                                }
                              }
                            >
                              Eliminar
                            </Button>

                          </Stack>


                          <TextField
                            size="small"
                            fullWidth
                            multiline
                            minRows={2}
                            sx={{
                              mt: 1.5,
                            }}
                            label={`Observacion para ${item.itemType}`}
                            placeholder="Indicaciones para este producto o combo"
                            value={
                              itemNotes[
                                item.id
                              ] ?? ""
                            }
                            onChange={
                              (event) => {

                                const note =
                                  event
                                    .target
                                    .value;

                                setItemNotes(
                                  (
                                    previousNotes
                                  ) => ({
                                    ...previousNotes,

                                    [
                                      item.id
                                    ]:
                                      note,
                                  })
                                );
                              }
                            }
                            inputProps={{
                              maxLength:
                                300,
                            }}
                            helperText={`${(itemNotes[item.id] ?? "").length}/300 caracteres`}
                          />

                        </Box>

                      )
                    )}

                  </Stack>

                )}


                <Divider />


                {/* ===========================================
                    TOTALES
                =========================================== */}

                <Stack spacing={1}>

                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Subtotal
                    </Typography>

                    <Typography>
                      {
                        formatCurrency(
                          subtotalAmount
                        )
                      }
                    </Typography>

                  </Stack>


                  <Stack
                    direction="row"
                    justifyContent="space-between"
                  >

                    <Typography
                      color="text.secondary"
                    >
                      Impuestos
                    </Typography>

                    <Typography>
                      {
                        formatCurrency(
                          taxAmount
                        )
                      }
                    </Typography>

                  </Stack>


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
                    >
                      {
                        formatCurrency(
                          totalAmount
                        )
                      }
                    </Typography>

                  </Stack>

                </Stack>


                <Divider />


                {/* ===========================================
                    MÉTODO DE PAGO
                =========================================== */}

                <Stack spacing={2}>

                  <Typography
                    variant="h6"
                    fontWeight={700}
                  >
                    Método de pago
                  </Typography>


                  <FormControl
                    fullWidth
                  >

                    <InputLabel
                      id="payment-method-label"
                    >
                      Método
                    </InputLabel>

                    <Select
                      labelId="payment-method-label"
                      value={
                        paymentMethod
                      }
                      label="Método"
                      onChange={
                        handlePaymentMethodChange
                      }
                    >

                      <MenuItem
                        value="Efectivo"
                      >
                        Efectivo
                      </MenuItem>

                      <MenuItem
                        value="Tarjeta"
                      >
                        Tarjeta
                      </MenuItem>

                    </Select>

                  </FormControl>


                  {/* =========================================
                      EFECTIVO
                  ========================================= */}

                  {paymentMethod ===
                    "Efectivo" && (

                    <Stack spacing={1.5}>

                      <TextField
                        label="Monto recibido"
                        type="number"
                        fullWidth
                        value={
                          amountReceived
                        }
                        onChange={
                          (event) =>
                            setAmountReceived(
                              event
                                .target
                                .value
                            )
                        }
                        inputProps={{
                          min: 0,
                          step: 100,
                        }}
                      />


                      {amountReceived !==
                        "" && (

                        Number(
                          amountReceived
                        ) <
                        totalAmount ? (

                          <Alert
                            severity="warning"
                          >
                            El monto recibido es insuficiente.
                          </Alert>

                        ) : (

                          <Alert
                            severity="success"
                          >
                            Vuelto:{" "}
                            {formatCurrency(
                              changeAmount
                            )}
                          </Alert>

                        )

                      )}

                    </Stack>

                  )}


                  {/* =========================================
                      TARJETA
                  ========================================= */}

                  {paymentMethod ===
                    "Tarjeta" && (

                    <Stack spacing={1.5}>

                      <FormControl
                        fullWidth
                      >

                        <InputLabel
                          id="card-brand-label"
                        >
                          Marca
                        </InputLabel>

                        <Select
                          labelId="card-brand-label"
                          value={
                            cardBrand
                          }
                          label="Marca"
                          onChange={
                            (event) =>
                              setCardBrand(
                                event
                                  .target
                                  .value
                              )
                          }
                        >

                          <MenuItem
                            value="Visa"
                          >
                            Visa
                          </MenuItem>

                          <MenuItem
                            value="Mastercard"
                          >
                            Mastercard
                          </MenuItem>

                          <MenuItem
                            value="American Express"
                          >
                            American Express
                          </MenuItem>

                        </Select>

                      </FormControl>


                      <TextField
                        label="Últimos 4 dígitos"
                        fullWidth
                        value={
                          cardLastFour
                        }
                        onChange={
                          (event) => {

                            const value =
                              event
                                .target
                                .value
                                .replace(
                                  /\D/g,
                                  ""
                                )
                                .slice(
                                  0,
                                  4
                                );

                            setCardLastFour(
                              value
                            );
                          }
                        }
                        inputProps={{
                          inputMode:
                            "numeric",

                          maxLength:
                            4,
                        }}
                        helperText="Digite únicamente los últimos 4 dígitos."
                      />

                    </Stack>

                  )}

                </Stack>


                {/* ===========================================
                    CONFIRMAR
                =========================================== */}

                <Button
                  variant="contained"
                  size="large"
                  startIcon={
                    <ShoppingBagOutlinedIcon />
                  }
                  onClick={
                    handleSubmit
                  }
                  disabled={
                    submitting ||
                    cart.length ===
                      0 ||
                    !isAuthenticated
                  }
                >

                  {submitting
                    ? "Registrando pedido..."
                    : "Confirmar pedido"}

                </Button>


                {/* ===========================================
                    LIMPIAR
                =========================================== */}

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={
                    cleanCart
                  }
                  disabled={
                    cart.length ===
                    0
                  }
                >
                  Limpiar pedido
                </Button>


                {/* ===========================================
                    SIN SESIÓN
                =========================================== */}

                {!userData?.id && (

                  <Alert
                    severity="warning"
                  >
                    Debe iniciar sesion para registrar el pedido. Ya no se usa un cliente por defecto del sistema.
                  </Alert>

                )}

              </Stack>

            </CardContent>

          </Card>

        </Grid>

      </Grid>

    </Stack>
  );
}