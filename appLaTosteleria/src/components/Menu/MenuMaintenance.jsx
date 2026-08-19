import { useCallback, useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddCircleIcon from "@mui/icons-material/AddCircle";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SearchIcon from "@mui/icons-material/Search";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";

import toast from "react-hot-toast";

import MenuService from "../../services/MenuService";
import { UserContext } from "../../context/UserContext";

import { formatMenuDate, formatMenuTime, isMenuAvailable } from "./menuUtils";

/*
 * Construye el FormData necesario para
 * cambiar únicamente el estado del menú,
 * conservando el resto de la información.
 */
function buildMenuUpdateFormData(menu, activo) {
  const productos = [];
  const combos = [];

  menu.categorias?.forEach((category) => {
    category.productos?.forEach((item) => {
      productos.push(Number(item.id));
    });

    category.combos?.forEach((item) => {
      combos.push(Number(item.id));
    });
  });

  const formData = new FormData();

  formData.append("id_menu", Number(menu.id_menu));

  formData.append("nombre_menu", menu.nombre_menu);

  formData.append("fecha_inicio", menu.fecha_inicio);

  formData.append("fecha_fin", menu.fecha_fin);

  formData.append("hora_inicio", String(menu.hora_inicio).slice(0, 8));

  formData.append("hora_fin", String(menu.hora_fin).slice(0, 8));

  formData.append("productos", JSON.stringify(Array.from(new Set(productos))));

  formData.append("combos", JSON.stringify(Array.from(new Set(combos))));

  formData.append("activo", activo);

  /*
   * No enviamos imagen.
   *
   * MenuModel conservará la imagen
   * que el menú ya tiene.
   */

  return formData;
}

export function MenuMaintenance() {
  const { t } = useTranslation();

  const { autorize } = useContext(UserContext);

  /*
   * Solamente el Administrador puede
   * modificar la información de Menús.
   *
   * El Encargado puede entrar al
   * mantenimiento, pero solo consultar.
   */
  const puedeModificar = autorize(["Administrador"]);

  const [menus, setMenus] = useState([]);

  const [loaded, setLoaded] = useState(false);

  const [error, setError] = useState(null);

  const [now] = useState(() => new Date());

  const [processingId, setProcessingId] = useState(null);

  const [busqueda, setBusqueda] = useState("");

  const [statusFilter, setStatusFilter] = useState("");

  const getStatus = (menu) => {
    const activo = Number(menu.activo) === 1;

    const disponible = isMenuAvailable(menu, now);

    if (!activo) {
      return {
        key: "inactive",
        label: t("menus.status.inactive"),
        color: "default",
      };
    }

    if (disponible) {
      return {
        key: "available",
        label: t("menus.status.available"),
        color: "success",
      };
    }

    return {
      key: "active",
      label: t("menus.status.active"),
      color: "warning",
    };
  };

  const cargarMenus = useCallback(() => {
    MenuService.getMenus()
      .then((response) => {
        setMenus(response.data ?? []);

        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, []);

  useEffect(() => {
    cargarMenus();
  }, [cargarMenus]);

  const menusFiltrados = menus.filter((menu) => {
    const status = getStatus(menu);

    const coincideBusqueda = String(menu.nombre_menu ?? "")
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado = statusFilter === "" || status.key === statusFilter;

    return coincideBusqueda && coincideEstado;
  });

  const handleToggleActive = async (menu) => {
    /*
     * Protección visual adicional.
     * El Encargado nunca debería
     * ejecutar esta función.
     */
    if (!puedeModificar) {
      return;
    }

    const estaActivo = Number(menu.activo) === 1;

    const mensajeConfirmacion = estaActivo
      ? t("menus.maintenance.confirmDisable", {
          name: menu.nombre_menu,
        })
      : t("menus.maintenance.confirmEnable", {
          name: menu.nombre_menu,
        });

    const confirmed = window.confirm(mensajeConfirmacion);

    if (!confirmed) {
      return;
    }

    try {
      setError(null);

      setProcessingId(Number(menu.id_menu));

      /*
       * Recuperamos el menú completo
       * porque necesitamos conservar
       * productos y combos.
       */
      const response = await MenuService.getMenuById(menu.id_menu);

      const nuevoEstado = estaActivo ? 0 : 1;

      const formData = buildMenuUpdateFormData(response.data, nuevoEstado);

      await MenuService.updateMenu(formData);

      toast.success(
        nuevoEstado === 1
          ? t("menus.maintenance.enableSuccess")
          : t("menus.maintenance.disableSuccess"),
      );

      cargarMenus();
    } catch (err) {
      console.error("Error al actualizar el estado del menú:", err);

      setError(err);

      toast.error(t("menus.maintenance.statusError"));
    } finally {
      setProcessingId(null);
    }
  };

  if (!loaded) {
    return <p>{t("menus.maintenance.loading")}</p>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              color: "#4a1714",
            }}
          >
            {t("menus.maintenance.title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            {t("menus.maintenance.description")}
          </Typography>
        </Box>

        {/* Solo Administrador */}
        {puedeModificar && (
          <Button
            component={Link}
            to="/menu/mantenimiento/crear"
            variant="contained"
            startIcon={<AddCircleIcon />}
            sx={{
              backgroundColor: "#9b1209",
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: "none",
              fontSize: "1rem",
              fontWeight: 600,

              "&:hover": {
                backgroundColor: "#7d0e07",
              },
            }}
          >
            {t("menus.maintenance.newMenu")}
          </Button>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message ??
            error?.message ??
            t("menus.maintenance.loadError")}
        </Alert>
      )}

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 4,
        }}
      >
        {/* Filtros */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 2,
            mb: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <TextField
              placeholder={t("menus.maintenance.search")}
              value={busqueda}
              onChange={(event) => setBusqueda(event.target.value)}
              size="small"
              sx={{ width: 300 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <Select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              displayEmpty
              size="small"
              sx={{ width: 250 }}
            >
              <MenuItem value="">{t("menus.maintenance.allStatuses")}</MenuItem>

              <MenuItem value="available">
                {t("menus.status.available")}
              </MenuItem>

              <MenuItem value="active">{t("menus.status.active")}</MenuItem>

              <MenuItem value="inactive">{t("menus.status.inactive")}</MenuItem>
            </Select>
          </Box>

          <Chip
            label={t("menus.maintenance.total", {
              count: menusFiltrados.length,
            })}
            sx={{
              fontSize: "0.95rem",
              px: 1,
            }}
          />
        </Box>

        {/* Tabla */}
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#faf4f2",
                }}
              >
                <TableCell>
                  <strong>{t("menus.maintenance.id")}</strong>
                </TableCell>

                {/* Imagen */}
                <TableCell>
                  <strong>{t("menus.maintenance.image")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("menus.maintenance.menu")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("menus.maintenance.start")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("menus.maintenance.end")}</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>{t("menus.maintenance.status")}</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>{t("menus.maintenance.actions")}</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menusFiltrados.map((menu) => {
                const status = getStatus(menu);

                return (
                  <TableRow
                    key={menu.id_menu}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": {
                        border: 0,
                      },
                    }}
                  >
                    <TableCell>{menu.id_menu}</TableCell>

                    {/* Imagen */}
                    <TableCell>
                      {menu.imagen ? (
                        <Box
                          component="img"
                          src={`/images/${menu.imagen}`}
                          alt={menu.nombre_menu}
                          sx={{
                            width: 85,
                            height: 60,
                            objectFit: "cover",
                            borderRadius: 2,
                            display: "block",
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            width: 85,
                            height: 60,
                            borderRadius: 2,
                            bgcolor: "action.hover",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <RestaurantMenuOutlinedIcon color="disabled" />
                        </Box>
                      )}
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={600}>
                        {menu.nombre_menu}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {formatMenuDate(menu.fecha_inicio)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {formatMenuTime(menu.hora_inicio)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Typography fontWeight={500}>
                        {formatMenuDate(menu.fecha_fin)}
                      </Typography>

                      <Typography variant="body2" color="text.secondary">
                        {formatMenuTime(menu.hora_fin)}
                      </Typography>
                    </TableCell>

                    <TableCell align="center">
                      <Chip
                        label={status.label}
                        color={status.color}
                        size="small"
                        sx={{
                          fontWeight: 600,
                        }}
                      />
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                          flexWrap: "wrap",
                        }}
                      >
                        {/* Administrador y Encargado */}
                        <Button
                          component={Link}
                          to={`/menu/${menu.id_menu}`}
                          variant="contained"
                          startIcon={<VisibilityIcon />}
                          size="small"
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          {t("menus.maintenance.detail")}
                        </Button>

                        {/* Solo Administrador */}
                        {puedeModificar && (
                          <>
                            <Button
                              component={Link}
                              to={`/menu/mantenimiento/editar/${menu.id_menu}`}
                              variant="outlined"
                              startIcon={<EditIcon />}
                              size="small"
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                                borderColor: "#b71c1c",
                                color: "#b71c1c",

                                "&:hover": {
                                  borderColor: "#8e0000",
                                  backgroundColor: "#fff4f4",
                                },
                              }}
                            >
                              {t("menus.maintenance.edit")}
                            </Button>

                            <Button
                              variant="outlined"
                              onClick={() => handleToggleActive(menu)}
                              disabled={processingId === Number(menu.id_menu)}
                              startIcon={
                                Number(menu.activo) === 1 ? (
                                  <BlockIcon />
                                ) : (
                                  <CheckCircleIcon />
                                )
                              }
                              size="small"
                              color={
                                Number(menu.activo) === 1 ? "error" : "success"
                              }
                              sx={{
                                textTransform: "none",
                                borderRadius: 2,
                              }}
                            >
                              {processingId === Number(menu.id_menu)
                                ? t("menus.maintenance.saving")
                                : Number(menu.activo) === 1
                                  ? t("menus.maintenance.disable")
                                  : t("menus.maintenance.enable")}
                            </Button>
                          </>
                        )}
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {menusFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      {t("menus.maintenance.noResults")}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
}
