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
  ToggleButton,
  ToggleButtonGroup,
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

function formatCurrency(value) {
  return new Intl.NumberFormat("es-CR", {
    style: "currency",
    currency: "CRC",
    maximumFractionDigits: 0,
  }).format(Number(value ?? 0));
}

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

export function CreatePedido() {
  const navigate = useNavigate();
  const { decodeToken } = useContext(UserContext);
  const userData = decodeToken();
  const { cart, addItem, decreaseItem, removeItem, cleanCart, getTotal, getCountItems } = useCart();

  const [menus, setMenus] = useState([]);
  const [selectedMenuId, setSelectedMenuId] = useState("");
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [deliveryMethod, setDeliveryMethod] = useState("Tienda");
  const [loadingMenus, setLoadingMenus] = useState(true);
  const [loadingMenuDetail, setLoadingMenuDetail] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    MenuService.getMenus()
      .then((response) => {
        const catalog = Array.isArray(response.data) ? response.data : [];
        const visibleMenus = catalog.filter((menu) => Number(menu.activo) === 1);

        setMenus(visibleMenus);
        if (visibleMenus.length > 0) {
          setSelectedMenuId(String(visibleMenus[0].id_menu));
        }
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            "No fue posible cargar los menus disponibles.",
        );
      })
      .finally(() => {
        setLoadingMenus(false);
      });
  }, []);

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
        cleanCart();
      })
      .catch((requestError) => {
        setError(
          requestError?.response?.data?.message ??
            requestError?.message ??
            "No fue posible cargar el menu seleccionado.",
        );
        setSelectedMenu(null);
      })
      .finally(() => {
        setLoadingMenuDetail(false);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMenuId]);

  const availableItems = useMemo(() => normalizeMenuItems(selectedMenu), [selectedMenu]);
  const cartMap = useMemo(() => {
    return new Map(cart.map((item) => [item.id, item]));
  }, [cart]);

  const taxAmount = useMemo(() => Math.round(getTotal(cart) * 0.13), [cart, getTotal]);
  const totalAmount = useMemo(() => getTotal(cart) + taxAmount, [cart, getTotal, taxAmount]);

  const handleSubmit = async () => {
    if (!selectedMenuId) {
      setError("Debe seleccionar un menu antes de crear el pedido.");
      return;
    }

    if (cart.length === 0) {
      setError("Debe agregar al menos un producto o combo al pedido.");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const payload = {
        cliente_id: userData?.id ?? null,
        menu_id: Number(selectedMenuId),
        metodo_entrega: deliveryMethod,
        items: cart.map((item) => ({
          item_type: item.itemType,
          item_id: item.itemId,
          cantidad: item.quantity,
        })),
      };

      const response = await PedidoService.createOrder(payload);
      const orderId = response?.data?.pedido_id;

      cleanCart();

      if (orderId) {
        navigate(`/pedido/seguimiento/${orderId}`);
      } else {
        navigate("/pedido");
      }
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ??
          requestError?.message ??
          "No fue posible registrar el pedido.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loadingMenus) {
    return (
      <Stack spacing={2} alignItems="center" sx={{ py: 8 }}>
        <CircularProgress />
        <Typography>Cargando menus para crear el pedido...</Typography>
      </Stack>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        justifyContent="space-between"
        spacing={2}
      >
        <Box>
          <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>
            Nuevo pedido
          </Typography>
          <Typography color="text.secondary">
            Selecciona un menu activo y arma el pedido agregando o quitando productos y combos.
          </Typography>
        </Box>

        <Button component={Link} to="/pedido" variant="outlined">
          Ver historial
        </Button>
      </Stack>

      {error && <Alert severity="error">{error}</Alert>}

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
              <Stack spacing={3}>
                <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
                  <FormControl fullWidth>
                    <InputLabel id="menu-select-label">Menu</InputLabel>
                    <Select
                      labelId="menu-select-label"
                      value={selectedMenuId}
                      label="Menu"
                      onChange={(event) => setSelectedMenuId(String(event.target.value))}
                    >
                      {menus.map((menu) => (
                        <MenuItem key={menu.id_menu} value={String(menu.id_menu)}>
                          {menu.nombre_menu}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <Box sx={{ minWidth: { xs: "100%", md: 260 } }}>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>
                      Metodo de entrega
                    </Typography>
                    <ToggleButtonGroup
                      value={deliveryMethod}
                      exclusive
                      onChange={(_, value) => {
                        if (value) {
                          setDeliveryMethod(value);
                        }
                      }}
                      fullWidth
                    >
                      <ToggleButton value="Tienda">Tienda</ToggleButton>
                      <ToggleButton value="Domicilio">Domicilio</ToggleButton>
                    </ToggleButtonGroup>
                  </Box>
                </Stack>

                {selectedMenu && (
                  <Box>
                    <Typography variant="h5" fontWeight={700} sx={{ mb: 0.75 }}>
                      {selectedMenu.nombre_menu}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
                      <Chip label={`Inicio ${selectedMenu.fecha_inicio}`} size="small" />
                      <Chip label={`Fin ${selectedMenu.fecha_fin}`} size="small" />
                    </Stack>
                  </Box>
                )}

                {loadingMenuDetail ? (
                  <Stack spacing={1.5} alignItems="center" sx={{ py: 4 }}>
                    <CircularProgress size={28} />
                    <Typography color="text.secondary">Cargando detalle del menu...</Typography>
                  </Stack>
                ) : (
                  <Grid container spacing={2}>
                    {availableItems.map((item) => {
                      const cartItem = cartMap.get(item.id);

                      return (
                        <Grid item xs={12} md={6} key={item.id}>
                          <Card variant="outlined" sx={{ height: "100%", borderRadius: 3 }}>
                            <CardContent>
                              <Stack spacing={1.5} sx={{ height: "100%" }}>
                                <Stack direction="row" justifyContent="space-between" spacing={2}>
                                  <Box>
                                    <Typography fontWeight={700}>{item.title}</Typography>
                                    <Typography color="text.secondary" variant="body2">
                                      {item.category} · {item.itemType}
                                    </Typography>
                                  </Box>
                                  <Chip label={formatCurrency(item.price)} color="primary" size="small" />
                                </Stack>

                                <Typography color="text.secondary" variant="body2">
                                  {item.description}
                                </Typography>

                                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: "auto" }}>
                                  <Button
                                    variant="outlined"
                                    startIcon={<RemoveOutlinedIcon />}
                                    onClick={() => decreaseItem(item)}
                                    disabled={!cartItem}
                                  >
                                    Quitar
                                  </Button>
                                  <Button
                                    variant="contained"
                                    startIcon={<AddOutlinedIcon />}
                                    onClick={() => addItem(item)}
                                  >
                                    Agregar
                                  </Button>
                                  <Typography color="text.secondary">
                                    {cartItem?.quantity ?? 0} en pedido
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

        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 3, boxShadow: 3, position: { lg: "sticky" }, top: { lg: 24 } }}>
            <CardContent>
              <Stack spacing={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h6" fontWeight={700}>
                    Resumen del pedido
                  </Typography>
                  <Chip label={`${getCountItems(cart)} items`} size="small" />
                </Stack>

                {cart.length === 0 ? (
                  <Alert severity="info">Todavia no has agregado productos ni combos.</Alert>
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
                        <Stack direction="row" justifyContent="space-between" spacing={2}>
                          <Box>
                            <Typography fontWeight={700}>{item.title}</Typography>
                            <Typography color="text.secondary" variant="body2">
                              {item.quantity} x {formatCurrency(item.price)}
                            </Typography>
                          </Box>
                          <Typography fontWeight={700}>{formatCurrency(item.subtotal)}</Typography>
                        </Stack>

                        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
                          <Button size="small" variant="outlined" onClick={() => decreaseItem(item)}>
                            -1
                          </Button>
                          <Button size="small" variant="outlined" onClick={() => addItem(item)}>
                            +1
                          </Button>
                          <Button
                            size="small"
                            color="error"
                            variant="text"
                            startIcon={<DeleteOutlineOutlinedIcon />}
                            onClick={() => removeItem(item)}
                          >
                            Eliminar
                          </Button>
                        </Stack>
                      </Box>
                    ))}
                  </Stack>
                )}

                <Divider />

                <Stack spacing={1}>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Subtotal</Typography>
                    <Typography>{formatCurrency(getTotal(cart))}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography color="text.secondary">Impuestos</Typography>
                    <Typography>{formatCurrency(taxAmount)}</Typography>
                  </Stack>
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="h6" fontWeight={700}>Total</Typography>
                    <Typography variant="h6" fontWeight={700}>{formatCurrency(totalAmount)}</Typography>
                  </Stack>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingBagOutlinedIcon />}
                  onClick={handleSubmit}
                  disabled={submitting || cart.length === 0}
                >
                  {submitting ? "Registrando pedido..." : "Confirmar pedido"}
                </Button>

                <Button variant="outlined" color="inherit" onClick={cleanCart} disabled={cart.length === 0}>
                  Limpiar pedido
                </Button>

                {!userData?.id && (
                  <Typography color="text.secondary" variant="body2">
                    No hay una sesion activa. El pedido se registrara con el cliente por defecto del sistema.
                  </Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Stack>
  );
}