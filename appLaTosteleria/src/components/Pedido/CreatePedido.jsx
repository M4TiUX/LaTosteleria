import { useContext, useEffect, useMemo, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";

import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import RemoveOutlinedIcon from "@mui/icons-material/RemoveOutlined";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

// Importaciones de Leaflet
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

// Fix para el ícono de Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: icon,
  shadowUrl: iconShadow,
});

import MenuService from "../../services/MenuService";
import PedidoService from "../../services/PedidoService";
import DireccionEnvioService from "../../services/DireccionEnvioService";

import { UserContext } from "../../context/UserContext";
import { useCart } from "../../hooks/useCart";

// ============================================================
// FORMATO DE MONEDA
// ============================================================

function formatCurrency(value) {
  const number = Number(value ?? 0);
  if (isNaN(number)) return "₡ 0";
  const formattedNumber = new Intl.NumberFormat("es-CR", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number);
  return `₡ ${formattedNumber}`;
}

// ============================================================
// NORMALIZAR PRODUCTOS Y COMBOS DEL MENÚ
// ============================================================

function normalizeMenuItems(menu) {
  const normalized = [];
  menu?.categorias?.forEach((category) => {
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
// COMPONENTE PARA CAPTURAR CLICS EN EL MAPA
// ============================================================

function MapClickHandler({ setSelectedLocation, setMapCenter }) {
  const map = useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      setSelectedLocation({ lat, lng });
      setMapCenter([lat, lng]);
      map.flyTo([lat, lng], map.getZoom());
    },
  });
  return null;
}

// ============================================================
// COMPONENTE PRINCIPAL
// ============================================================

export function CreatePedido() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken();

  const {
    cart,
    addItem,
    decreaseItem,
    removeItem,
    cleanCart,
    getTotal,
    getCountItems,
  } = useCart();

  const isAuthenticated = Boolean(userData?.id);

  // ==========================================================
  // MENÚ
  // ==========================================================

  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);

  // ==========================================================
  // OBSERVACIONES
  // ==========================================================

  const [orderNotes, setOrderNotes] = useState("");
  const [itemNotes, setItemNotes] = useState({});

  // ==========================================================
  // MÉTODO DE ENTREGA
  // ==========================================================

  const [deliveryMethod, setDeliveryMethod] = useState("Tienda");
  const [direcciones, setDirecciones] = useState([]);
  const [selectedDireccionId, setSelectedDireccionId] = useState("");
  const [loadingDirecciones, setLoadingDirecciones] = useState(false);

  // ==========================================================
  // MÉTODO DE PAGO
  // ==========================================================

  const [paymentMethod, setPaymentMethod] = useState("");
  const [amountReceived, setAmountReceived] = useState("");
  const [cardBrand, setCardBrand] = useState("");
  const [cardLastFour, setCardLastFour] = useState("");

  // ==========================================================
  // UBICACIÓN SELECCIONADA EN EL MAPA
  // ==========================================================

  const [selectedLocation, setSelectedLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([9.9281, -84.0907]);
  const [mapZoom, setMapZoom] = useState(13);

  // ==========================================================
  // GUARDAR UBICACIÓN COMO DIRECCIÓN
  // ==========================================================

  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [newDireccionDetalle, setNewDireccionDetalle] = useState("");
  const [savingDireccion, setSavingDireccion] = useState(false);

  // ==========================================================
  // CARGA Y ERRORES
  // ==========================================================

  const [loadingMenus, setLoadingMenus] = useState(true);
  const [loadingMenuDetail, setLoadingMenuDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // ==========================================================
  // CARGAR MENÚS
  // ==========================================================

  useEffect(() => {
    MenuService.getMenus()
      .then((response) => {
        const catalog = Array.isArray(response.data) ? response.data : [];
        const visibleMenus = catalog.filter(
          (menu) => Number(menu.activo) === 1,
        );
        setMenus(visibleMenus);
        if (visibleMenus.length > 0) {
          setSelectedMenuId(String(visibleMenus[0].id_menu));
        }
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            t("orders.create.errors.loadMenus"),
        );
      })
      .finally(() => {
        setLoadingMenus(false);
      });
  }, []);

  // ==========================================================
  // CARGAR DETALLE DEL MENÚ (CORREGIDO: sin cleanCart en dependencias)
  // ==========================================================

  useEffect(() => {
    if (!selectedMenuId) {
      setSelectedMenu(null);
      return;
    }

    setLoadingMenuDetail(true);
    setError(null);

    MenuService.getMenuById(selectedMenuId)
      .then((response) => {
        setSelectedMenu(response.data ?? null);
        // Limpiar carrito al cambiar de menú
        cleanCart();
        setItemNotes({});
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            t("orders.create.errors.loadMenu"),
        );
        setSelectedMenu(null);
      })
      .finally(() => {
        setLoadingMenuDetail(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenuId]);

  // ==========================================================
  // CARGAR DIRECCIONES CUANDO SE ELIGE "DOMICILIO"
  // ==========================================================

  useEffect(() => {
    if (deliveryMethod !== "Domicilio" || !userData?.id) {
      return;
    }

    setLoadingDirecciones(true);
    setError(null);

    DireccionEnvioService.getDirecciones(userData.id)
      .then((response) => {
        const lista = Array.isArray(response.data) ? response.data : [];
        setDirecciones(lista);
        if (lista.length > 0) {
          setSelectedDireccionId(String(lista[0].id_direccion));
        }
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            t("orders.create.errors.loadAddresses"),
        );
      })
      .finally(() => {
        setLoadingDirecciones(false);
      });
  }, [deliveryMethod, userData?.id]);

  // ==========================================================
  // ITEMS DISPONIBLES
  // ==========================================================

  const availableItems = useMemo(
    () => normalizeMenuItems(selectedMenu),
    [selectedMenu],
  );

  // ==========================================================
  // MAPA DEL CARRITO
  // ==========================================================

  const cartMap = useMemo(() => {
    return new Map(cart.map((item) => [item.id, item]));
  }, [cart]);

  // ==========================================================
  // TOTALES
  // ==========================================================

  const subtotalAmount = useMemo(() => getTotal(cart), [cart, getTotal]);
  const taxAmount = 0;

  const selectedDireccion = useMemo(() => {
    return (
      direcciones.find(
        (direccion) => String(direccion.id_direccion) === selectedDireccionId,
      ) ?? null
    );
  }, [direcciones, selectedDireccionId]);

  const shippingCost =
    deliveryMethod === "Domicilio" && selectedDireccion
      ? Number(selectedDireccion.costo_zona ?? 0)
      : 0;

  const totalAmount = subtotalAmount + taxAmount + shippingCost;
  const totalAmountRounded = Math.round(totalAmount);

  // ==========================================================
  // VUELTO
  // ==========================================================

  const changeAmount = useMemo(() => {
    if (paymentMethod !== "Efectivo") {
      return 0;
    }
    const received = Number(amountReceived);
    if (Number.isNaN(received) || received < totalAmountRounded) {
      return 0;
    }
    return received - totalAmountRounded;
  }, [paymentMethod, amountReceived, totalAmountRounded]);

  // ==========================================================
  // LIMPIAR OBSERVACIONES DE ITEMS ELIMINADOS
  // ==========================================================

  useEffect(() => {
    setItemNotes((previousNotes) => {
      const cartIds = new Set(cart.map((item) => item.id));
      const nextNotes = {};
      Object.entries(previousNotes).forEach(([itemId, note]) => {
        if (cartIds.has(itemId)) {
          nextNotes[itemId] = note;
        }
      });
      return nextNotes;
    });
  }, [cart]);

  // ==========================================================
  // CAMBIAR MÉTODO DE ENTREGA
  // ==========================================================

  const handleDeliveryMethodChange = (event, newMethod) => {
    if (newMethod === null) return;
    setDeliveryMethod(newMethod);
    setSelectedDireccionId("");
    setSelectedLocation(null);
    setError(null);
  };

  // ==========================================================
  // CAMBIAR MÉTODO DE PAGO
  // ==========================================================

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    setAmountReceived("");
    setCardBrand("");
    setCardLastFour("");
    setError(null);
  };

  // ==========================================================
  // GUARDAR UBICACIÓN COMO DIRECCIÓN
  // ==========================================================

  const handleSaveLocationAsDireccion = async () => {
    if (!selectedLocation) {
      setError(t("orders.create.errors.selectMapLocation"));
      return;
    }
    if (!newDireccionDetalle.trim()) {
      setError(t("orders.create.errors.addressDescription"));
      return;
    }

    setSavingDireccion(true);
    setError(null);

    try {
      const payload = {
        usuario_id: Number(userData.id),
        detalles: newDireccionDetalle.trim(),
        referencias: null,
        latitud: Number(selectedLocation.lat),
        longitud: Number(selectedLocation.lng),
        zona: "Por definir",
        costo_zona: 0,
      };

      const response = await DireccionEnvioService.createDireccion(payload);
      const nuevaDireccion = response.data;

      setDirecciones((prev) => [...prev, nuevaDireccion]);
      setSelectedDireccionId(String(nuevaDireccion.id_direccion));
      setSelectedLocation(null);
      setNewDireccionDetalle("");
      setOpenSaveDialog(false);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          t("orders.create.errors.saveAddress"),
      );
    } finally {
      setSavingDireccion(false);
    }
  };

  // ==========================================================
  // CONFIRMAR PEDIDO
  // ==========================================================

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      setError(t("orders.create.errors.loginRequired"));
      return;
    }
    if (!selectedMenuId) {
      setError(t("orders.create.errors.menuRequired"));
      return;
    }
    if (cart.length === 0) {
      setError(t("orders.create.errors.itemRequired"));
      return;
    }
    if (deliveryMethod === "Domicilio" && !selectedDireccionId) {
      setError(
        t("orders.create.errors.addressRequired"),
      );
      return;
    }

    if (paymentMethod === "Efectivo") {
      const received = Number(amountReceived);
      if (!amountReceived || Number.isNaN(received) || received <= 0) {
        setError(t("orders.create.errors.amountRequired"));
        return;
      }
      if (received < totalAmountRounded) {
        setError(t("orders.create.errors.insufficientAmount"));
        return;
      }
    }

    if (paymentMethod === "Tarjeta") {
      if (!cardBrand) {
        setError(t("orders.create.errors.cardBrandRequired"));
        return;
      }
      if (!/^[0-9]{4}$/.test(cardLastFour)) {
        setError(
          t("orders.create.errors.cardDigits"),
        );
        return;
      }
    }

    let paymentData;
    if (paymentMethod === "Efectivo") {
      paymentData = {
        metodo_pago: "Efectivo",
        monto_recibido: Number(amountReceived),
      };
    } else {
      paymentData = {
        metodo_pago: "Tarjeta",
        marca_tarjeta: cardBrand,
        ultimos_cuatro_digitos: cardLastFour,
      };
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        cliente_id: Number(userData?.id),
        menu_id: Number(selectedMenuId),
        metodo_entrega: deliveryMethod,
        direccion_id:
          deliveryMethod === "Domicilio"
            ? Number(selectedDireccionId) || null
            : null,
        observaciones: orderNotes,
        pago: paymentData,
        items: cart.map((item) => ({
          item_type: item.itemType,
          item_id: item.itemId,
          cantidad: item.quantity,
          observaciones: itemNotes[item.id] ?? "",
        })),
        ubicacion:
          deliveryMethod === "Domicilio" && selectedLocation
            ? { lat: selectedLocation.lat, lng: selectedLocation.lng }
            : null,
      };

      const response = await PedidoService.createOrder(payload);
      const orderId = response?.data?.pedido_id;

      cleanCart();
      setOrderNotes("");
      setItemNotes({});
      setDeliveryMethod("Tienda");
      setSelectedDireccionId("");
      setSelectedLocation(null);
      setPaymentMethod("");
      setAmountReceived("");
      setCardBrand("");
      setCardLastFour("");

      if (orderId) {
        navigate(`/pedido/seguimiento/${orderId}`);
      } else {
        navigate("/pedido");
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.response?.data?.result ??
          requestError?.message ??
          t("orders.create.errors.createOrder"),
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
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
        <Typography>{t("orders.create.loadingMenus")}</Typography>
      </Stack>
    );
  }

  // ==========================================================
  // VISTA
  // ==========================================================

  return (
    <Stack spacing={3}>
      {/* ENCABEZADO */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            {t("orders.create.title")}
          </Typography>
          <Typography color="text.secondary">
            {t("orders.create.description")}
          </Typography>
        </Box>
        <Button component={Link} to="/pedido" variant="outlined">
          {t("orders.create.viewHistory")}
        </Button>
      </Stack>

      {/* ERROR */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* CONTENIDO */}
      <Grid container spacing={3}>
        {/* CATÁLOGO */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={3}>
                {/* MENÚ Y ENTREGA */}
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="menu-select-label">{t("orders.create.menu")}</InputLabel>
                    <Select
                      labelId="menu-select-label"
                      value={selectedMenuId}
                      label={t("orders.create.menu")}
                      onChange={(event) =>
                        setSelectedMenuId(String(event.target.value))
                      }
                    >
                      {menus.map((menu) => (
                        <MenuItem
                          key={menu.id_menu}
                          value={String(menu.id_menu)}
                        >
                          {menu.nombre_menu}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box
                    sx={{
                      minWidth: { xs: "100%", md: 260 },
                    }}
                  >
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      sx={{ mb: 1 }}
                    >
                      {t("orders.common.deliveryMethod")}
                    </Typography>
                    <ToggleButtonGroup
                      value={deliveryMethod}
                      exclusive
                      fullWidth
                      color="primary"
                      onChange={handleDeliveryMethodChange}
                    >
                      <ToggleButton value="Tienda">
                        {t("orders.create.storePickup")}
                      </ToggleButton>
                      <ToggleButton value="Domicilio">{t("orders.create.homeDelivery")}</ToggleButton>
                    </ToggleButtonGroup>

                    {/* DOMICILIO */}
                    {deliveryMethod === "Domicilio" && (
                      <Box sx={{ mt: 2 }}>
                        {loadingDirecciones ? (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CircularProgress size={20} />
                            <Typography variant="body2" color="text.secondary">
                              {t("orders.create.loadingAddresses")}
                            </Typography>
                          </Stack>
                        ) : direcciones.length === 0 ? (
                          <Alert severity="warning">
                            {t("orders.create.noSavedAddresses")}
                          </Alert>
                        ) : (
                          <FormControl fullWidth>
                            <InputLabel id="direccion-select-label">
                              {t("orders.create.deliveryAddress")}
                            </InputLabel>
                            <Select
                              labelId="direccion-select-label"
                              value={selectedDireccionId}
                              label={t("orders.create.deliveryAddress")}
                              onChange={(event) =>
                                setSelectedDireccionId(
                                  String(event.target.value),
                                )
                              }
                            >
                              {direcciones.map((direccion) => (
                                <MenuItem
                                  key={direccion.id_direccion}
                                  value={String(direccion.id_direccion)}
                                >
                                  {direccion.detalles
                                    ? `${direccion.detalles} — ${formatCurrency(direccion.costo_zona ?? 0)}`
                                    : direccion.latitud && direccion.longitud
                                      ? `${t("orders.create.location")} (${direccion.latitud.toFixed(4)}, ${direccion.longitud.toFixed(4)}) — ${formatCurrency(direccion.costo_zona ?? 0)}`
                                      : `${t("orders.create.unnamedAddress")} — ${formatCurrency(direccion.costo_zona ?? 0)}`}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        )}

                        {/* MAPA */}
                        <Box sx={{ mt: 3 }}>
                          <Typography variant="subtitle2" gutterBottom>
                            {t("orders.create.mapInstruction")}
                          </Typography>
                          <MapContainer
                            center={mapCenter}
                            zoom={mapZoom}
                            style={{
                              height: "300px",
                              width: "100%",
                              borderRadius: "8px",
                            }}
                          >
                            <TileLayer
                              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <MapClickHandler
                              setSelectedLocation={setSelectedLocation}
                              setMapCenter={setMapCenter}
                            />
                            {selectedLocation && (
                              <Marker
                                position={[
                                  selectedLocation.lat,
                                  selectedLocation.lng,
                                ]}
                              >
                                <Popup>{t("orders.create.selectedLocation")}</Popup>
                              </Marker>
                            )}
                          </MapContainer>

                          {selectedLocation ? (
                            <Stack
                              direction="row"
                              spacing={2}
                              alignItems="center"
                              sx={{ mt: 1 }}
                            >
                              <Typography variant="body2">
                                {t("orders.create.coordinates")}: {selectedLocation.lat.toFixed(6)},{" "}
                                {selectedLocation.lng.toFixed(6)}
                              </Typography>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={() => setOpenSaveDialog(true)}
                              >
                                {t("orders.create.saveAsAddress")}
                              </Button>
                            </Stack>
                          ) : (
                            <Typography
                              variant="caption"
                              sx={{ mt: 1, display: "block" }}
                            >
                              💡 {t("orders.create.mapHint")}
                            </Typography>
                          )}
                        </Box>
                      </Box>
                    )}
                  </Box>
                </Stack>

                {/* OBSERVACIONES GENERALES */}
                <TextField
                  label={t("orders.create.orderNotes")}
                  placeholder={t("orders.create.orderNotesPlaceholder")}
                  value={orderNotes}
                  onChange={(event) => setOrderNotes(event.target.value)}
                  fullWidth
                  multiline
                  minRows={3}
                  inputProps={{ maxLength: 500 }}
                  helperText={t("orders.create.characters500", { count: orderNotes.length })}
                />

                {/* INFORMACIÓN DEL MENÚ */}
                {selectedMenu && (
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                      {selectedMenu.nombre_menu}
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ mb: 2, flexWrap: "wrap" }}
                    >
                      <Chip
                        label={`${t("orders.create.start")} ${selectedMenu.fecha_inicio}`}
                        size="small"
                      />
                      <Chip
                        label={`${t("orders.create.end")} ${selectedMenu.fecha_fin}`}
                        size="small"
                      />
                    </Stack>
                  </Box>
                )}

                {/* PRODUCTOS Y COMBOS */}
                {loadingMenuDetail ? (
                  <Stack spacing={1.5} alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                    <Typography color="text.secondary">
                      {t("orders.create.loadingMenuDetail")}
                    </Typography>
                  </Stack>
                ) : (
                  <Grid container spacing={2}>
                    {availableItems.map((item) => {
                      const cartItem = cartMap.get(item.id);
                      return (
                        <Grid item xs={12} md={6} key={item.id}>
                          <Card
                            variant="outlined"
                            sx={{ height: "100%", borderRadius: 3 }}
                          >
                            <CardContent>
                              <Stack spacing={1.5} sx={{ height: "100%" }}>
                                <Stack
                                  direction="row"
                                  justifyContent="space-between"
                                  spacing={2}
                                >
                                  <Box>
                                    <Typography fontWeight={700}>
                                      {item.title}
                                    </Typography>
                                    <Typography
                                      color="text.secondary"
                                      variant="body2"
                                    >
                                      {item.category} · {item.itemType === "combo" ? t("orders.common.combo") : t("orders.common.product")}
                                    </Typography>
                                  </Box>
                                  <Chip
                                    label={formatCurrency(item.price)}
                                    color="primary"
                                    size="small"
                                  />
                                </Stack>
                                <Typography
                                  color="text.secondary"
                                  variant="body2"
                                >
                                  {item.description}
                                </Typography>
                                <Stack
                                  direction="row"
                                  spacing={1}
                                  alignItems="center"
                                  sx={{ mt: "auto" }}
                                >
                                  <Button
                                    variant="outlined"
                                    startIcon={<RemoveOutlinedIcon />}
                                    onClick={() => decreaseItem(item)}
                                    disabled={!cartItem}
                                  >
                                    {t("orders.create.remove")}
                                  </Button>
                                  <Button
                                    variant="contained"
                                    startIcon={<AddOutlinedIcon />}
                                    onClick={() => addItem(item)}
                                  >
                                    {t("orders.create.add")}
                                  </Button>
                                  <Typography color="text.secondary">
                                    {t("orders.create.inOrder", { count: cartItem?.quantity ?? 0 })}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* RESUMEN */}
        <Grid item xs={12} lg={4}>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: 3,
              position: { lg: "sticky" },
              top: { lg: 24 },
            }}
          >
            <CardContent>
              <Stack spacing={2.5}>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="h6" fontWeight={700}>
                    {t("orders.create.summary")}
                  </Typography>
                  <Chip label={t("orders.create.items", { count: getCountItems(cart) })} size="small" />
                </Stack>

                {cart.length === 0 ? (
                  <Alert severity="info">
                    {t("orders.create.emptyCart")}
                  </Alert>
                ) : (
                  <Stack spacing={1.5}>
                    {cart.map((item) => (
                      <Box
                        key={item.id}
                        sx={{
                          border: "1px solid",
                          borderColor: "divider",
                          borderRadius: 2,
                          p: 1.5,
                        }}
                      >
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          spacing={2}
                        >
                          <Box>
                            <Typography fontWeight={700}>
                              {item.title}
                            </Typography>
                            <Typography color="text.secondary" variant="body2">
                              {item.quantity} x {formatCurrency(item.price)}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700}>
                            {formatCurrency(item.subtotal)}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => decreaseItem(item)}
                          >
                            -1
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => addItem(item)}
                          >
                            +1
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="text"
                            startIcon={<DeleteOutlineOutlinedIcon />}
                            onClick={() => {
                              removeItem(item);
                              setItemNotes((prev) => {
                                const next = { ...prev };
                                delete next[item.id];
                                return next;
                              });
                            }}
                          >
                            {t("orders.common.delete")}
                          </Button>
                        </Stack>
                        <TextField
                          size="small"
                          fullWidth
                          multiline
                          minRows={2}
                          sx={{ mt: 1.5 }}
                          label={t("orders.create.itemNote", { type: item.itemType === "combo" ? t("orders.common.combo").toLowerCase() : t("orders.common.product").toLowerCase() })}
                          placeholder={t("orders.create.itemNotePlaceholder")}
                          value={itemNotes[item.id] ?? ""}
                          onChange={(event) => {
                            const note = event.target.value;
                            setItemNotes((prev) => ({
                              ...prev,
                              [item.id]: note,
                            }));
                          }}
                          inputProps={{ maxLength: 300 }}
                          helperText={t("orders.create.characters300", { count: (itemNotes[item.id] ?? "").length })}
                        />
                      </Box>
                    ))}
                  </Stack>
                )}

                <Divider />

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{t("orders.common.subtotal")}</Typography>
                    <Typography>{formatCurrency(subtotalAmount)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">{t("orders.common.taxes")}</Typography>
                    <Typography>{formatCurrency(taxAmount)}</Typography>
                  </Stack>
                  {deliveryMethod === "Domicilio" && (
                    <Stack direction="row" justifyContent="space-between">
                      <Typography color="text.secondary">{t("orders.create.shipping")}</Typography>
                      <Typography>{formatCurrency(shippingCost)}</Typography>
                    </Stack>
                  )}
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>
                      {t("orders.common.total")}
                    </Typography>
                    <Typography variant="h6" fontWeight={700}>
                      {formatCurrency(totalAmount)}
                    </Typography>
                  </Stack>
                </Stack>

                <Divider />

                <Stack spacing={2}>
                  <Typography variant="h6" fontWeight={700}>
                    {t("orders.common.paymentMethod")}
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="payment-method-label">{t("orders.create.method")}</InputLabel>
                    <Select
                      labelId="payment-method-label"
                      value={paymentMethod}
                      label={t("orders.create.method")}
                      onChange={handlePaymentMethodChange}
                    >
                      <MenuItem value="Efectivo">{t("orders.create.cash")}</MenuItem>
                      <MenuItem value="Tarjeta">{t("orders.create.card")}</MenuItem>
                    </Select>
                  </FormControl>

                  {paymentMethod === "Efectivo" && (
                    <Stack spacing={1.5}>
                      <TextField
                        label={t("orders.create.amountReceived")}
                        type="number"
                        fullWidth
                        value={amountReceived}
                        onChange={(event) =>
                          setAmountReceived(event.target.value)
                        }
                        inputProps={{ min: 0, step: 100 }}
                      />
                      {amountReceived !== "" &&
                        (Number(amountReceived) < totalAmount ? (
                          <Alert severity="warning">
                            {t("orders.create.insufficientAmount")}
                          </Alert>
                        ) : (
                          <Alert severity="success">
                            {t("orders.summary.change")}: {formatCurrency(changeAmount)}
                          </Alert>
                        ))}
                    </Stack>
                  )}

                  {paymentMethod === "Tarjeta" && (
                    <Stack spacing={1.5}>
                      <FormControl fullWidth>
                        <InputLabel id="card-brand-label">{t("orders.summary.brand")}</InputLabel>
                        <Select
                          labelId="card-brand-label"
                          value={cardBrand}
                          label={t("orders.summary.brand")}
                          onChange={(event) => setCardBrand(event.target.value)}
                        >
                          <MenuItem value="Visa">Visa</MenuItem>
                          <MenuItem value="Mastercard">Mastercard</MenuItem>
                          <MenuItem value="American Express">
                            American Express
                          </MenuItem>
                        </Select>
                      </FormControl>
                      <TextField
                        label={t("orders.create.lastFourDigits")}
                        fullWidth
                        value={cardLastFour}
                        onChange={(event) => {
                          const value = event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 4);
                          setCardLastFour(value);
                        }}
                        inputProps={{ inputMode: "numeric", maxLength: 4 }}
                        helperText={t("orders.create.lastFourDigitsHelp")}
                      />
                    </Stack>
                  )}
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    cart.length === 0 ||
                    !isAuthenticated ||
                    (deliveryMethod === "Domicilio" && !selectedDireccionId)
                  }
                >
                  {submitting ? t("orders.create.submitting") : t("orders.create.confirm")}
                </Button>

                <Button
                  variant="outlined"
                  color="inherit"
                  onClick={cleanCart}
                  disabled={cart.length === 0}
                >
                  {t("orders.create.clearOrder")}
                </Button>

                {!userData?.id && (
                  <Alert severity="warning">
                    {t("orders.create.loginWarning")}
                  </Alert>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* DIÁLOGO PARA GUARDAR UBICACIÓN */}
      <Dialog open={openSaveDialog} onClose={() => setOpenSaveDialog(false)}>
        <DialogTitle>{t("orders.create.saveLocationTitle")}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("orders.create.saveLocationDescription")}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label={t("orders.create.addressDetails")}
            fullWidth
            variant="outlined"
            value={newDireccionDetalle}
            onChange={(e) => setNewDireccionDetalle(e.target.value)}
          />
          {selectedLocation && (
            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
              {t("orders.create.coordinates")}: {selectedLocation.lat.toFixed(6)},{" "}
              {selectedLocation.lng.toFixed(6)}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSaveDialog(false)}>{t("orders.common.cancel")}</Button>
          <Button
            onClick={handleSaveLocationAsDireccion}
            disabled={savingDireccion || !newDireccionDetalle.trim()}
          >
            {savingDireccion ? t("orders.common.saving") : t("orders.common.save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Stack>
  );
}
