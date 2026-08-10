import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
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
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

import { toast } from "react-toastify";

import MenuService from "../../services/MenuService";
import {
  formatMenuDate,
  formatMenuTime,
} from "./menuUtils";

export function MenuMaintenance() {
  const { t } = useTranslation();

  const [menus, setMenus] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [estado, setEstado] = useState("");
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [actualizandoId, setActualizandoId] =
    useState(null);

  useEffect(() => {
    cargarMenus();
  }, []);

  const cargarMenus = async () => {
    try {
      setCargando(true);
      setError("");

      const response =
        await MenuService.getMenus();

      if (Array.isArray(response.data)) {
        setMenus(response.data);
      } else if (
        Array.isArray(response.data?.data)
      ) {
        setMenus(response.data.data);
      } else if (
        Array.isArray(response.data?.menus)
      ) {
        setMenus(response.data.menus);
      } else {
        setMenus([]);
      }
    } catch (err) {
      console.error(
        "Error al cargar los menús:",
        err
      );

      setError(
        t("menus.maintenance.loadError")
      );
    } finally {
      setCargando(false);
    }
  };

  const menusFiltrados = useMemo(() => {
    return menus.filter((menu) => {
      const nombre = String(
        menu.nombre_menu ?? ""
      ).toLowerCase();

      const coincideBusqueda =
        nombre.includes(
          busqueda.toLowerCase()
        );

      const activo =
        Number(menu.activo) === 1;

      const coincideEstado =
        estado === "" ||
        (estado === "activo" && activo) ||
        (estado === "inactivo" &&
          !activo);

      return (
        coincideBusqueda &&
        coincideEstado
      );
    });
  }, [menus, busqueda, estado]);

  const cambiarEstado = async (menu) => {
    const estaActivo =
      Number(menu.activo) === 1;

    const nuevoEstado = estaActivo
      ? 0
      : 1;

    const mensajeConfirmacion =
      estaActivo
        ? t(
            "menus.maintenance.confirmDisable",
            {
              name: menu.nombre_menu,
            }
          )
        : t(
            "menus.maintenance.confirmEnable",
            {
              name: menu.nombre_menu,
            }
          );

    const confirmado =
      window.confirm(
        mensajeConfirmacion
      );

    if (!confirmado) {
      return;
    }

    try {
      setActualizandoId(menu.id_menu);

      await MenuService.changeStatus({
        id_menu: Number(menu.id_menu),
        activo: nuevoEstado,
      });

      setMenus((menusActuales) =>
        menusActuales.map(
          (menuActual) =>
            Number(
              menuActual.id_menu
            ) ===
            Number(menu.id_menu)
              ? {
                  ...menuActual,
                  activo: nuevoEstado,
                }
              : menuActual
        )
      );

      toast.success(
        nuevoEstado === 1
          ? t(
              "menus.maintenance.enableSuccess"
            )
          : t(
              "menus.maintenance.disableSuccess"
            )
      );
    } catch (err) {
      console.error(
        "Error al actualizar el estado del menú:",
        err
      );

      toast.error(
        err.response?.data?.message ||
          t(
            "menus.maintenance.statusError"
          )
      );
    } finally {
      setActualizandoId(null);
    }
  };

  if (cargando) {
    return (
      <Box
        sx={{
          minHeight: 300,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography
          color="text.secondary"
        >
          {t(
            "menus.maintenance.loading"
          )}
        </Typography>
      </Box>
    );
  }

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 5 }}
    >
      {/* Encabezado */}
      <Box
        sx={{
          display: "flex",
          justifyContent:
            "space-between",
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
            {t(
              "menus.maintenance.title"
            )}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color:
                "text.secondary",
              mt: 1,
            }}
          >
            {t(
              "menus.maintenance.description"
            )}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/menu/create"
          variant="contained"
          startIcon={
            <AddCircleIcon />
          }
          sx={{
            backgroundColor:
              "#9b1209",
            px: 3,
            py: 1.5,
            borderRadius: 2,
            textTransform: "none",
            fontSize: "1rem",
            fontWeight: 600,

            "&:hover": {
              backgroundColor:
                "#7d0e07",
            },
          }}
        >
          {t(
            "menus.maintenance.newMenu"
          )}
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
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
            justifyContent:
              "space-between",
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
              placeholder={t(
                "menus.maintenance.search"
              )}
              value={busqueda}
              onChange={(event) =>
                setBusqueda(
                  event.target.value
                )
              }
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
              value={estado}
              onChange={(event) =>
                setEstado(
                  event.target.value
                )
              }
              displayEmpty
              size="small"
              sx={{ width: 220 }}
            >
              <MenuItem value="">
                {t(
                  "menus.maintenance.allStatuses"
                )}
              </MenuItem>

              <MenuItem value="activo">
                {t(
                  "menus.status.active"
                )}
              </MenuItem>

              <MenuItem value="inactivo">
                {t(
                  "menus.status.inactive"
                )}
              </MenuItem>
            </Select>
          </Box>

          <Chip
            label={t(
              "menus.maintenance.total",
              {
                count:
                  menusFiltrados.length,
              }
            )}
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
                  backgroundColor:
                    "#faf4f2",
                }}
              >
                <TableCell>
                  <strong>
                    {t(
                      "menus.maintenance.id"
                    )}
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    {t(
                      "menus.maintenance.menu"
                    )}
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    {t(
                      "menus.maintenance.start"
                    )}
                  </strong>
                </TableCell>

                <TableCell>
                  <strong>
                    {t(
                      "menus.maintenance.end"
                    )}
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    {t(
                      "menus.maintenance.status"
                    )}
                  </strong>
                </TableCell>

                <TableCell align="center">
                  <strong>
                    {t(
                      "menus.maintenance.actions"
                    )}
                  </strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {menusFiltrados.map(
                (menu) => {
                  const activo =
                    Number(
                      menu.activo
                    ) === 1;

                  const actualizando =
                    Number(
                      actualizandoId
                    ) ===
                    Number(
                      menu.id_menu
                    );

                  return (
                    <TableRow
                      key={
                        menu.id_menu
                      }
                      hover
                    >
                      <TableCell>
                        {menu.id_menu}
                      </TableCell>

                      <TableCell>
                        <Typography
                          fontWeight={
                            600
                          }
                        >
                          {
                            menu.nombre_menu
                          }
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatMenuDate(
                            menu.fecha_inicio
                          )}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatMenuTime(
                            menu.hora_inicio
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Typography variant="body2">
                          {formatMenuDate(
                            menu.fecha_fin
                          )}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {formatMenuTime(
                            menu.hora_fin
                          )}
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        <Chip
                          label={
                            activo
                              ? t(
                                  "menus.status.active"
                                )
                              : t(
                                  "menus.status.inactive"
                                )
                          }
                          color={
                            activo
                              ? "success"
                              : "default"
                          }
                          size="small"
                          sx={{
                            fontWeight:
                              600,
                          }}
                        />
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display:
                              "flex",
                            justifyContent:
                              "center",
                            gap: 1,
                            flexWrap:
                              "wrap",
                          }}
                        >
                          <Button
                            component={
                              Link
                            }
                            to={`/menu/${menu.id_menu}`}
                            variant="contained"
                            startIcon={
                              <VisibilityIcon />
                            }
                            size="small"
                            sx={{
                              textTransform:
                                "none",
                              borderRadius:
                                2,
                            }}
                          >
                            {t(
                              "menus.maintenance.detail"
                            )}
                          </Button>

                          <Button
                            component={
                              Link
                            }
                            to={`/menu/update/${menu.id_menu}`}
                            variant="outlined"
                            startIcon={
                              <EditIcon />
                            }
                            size="small"
                            sx={{
                              textTransform:
                                "none",
                              borderRadius:
                                2,
                              borderColor:
                                "#b71c1c",
                              color:
                                "#b71c1c",

                              "&:hover":
                                {
                                  borderColor:
                                    "#8e0000",
                                  backgroundColor:
                                    "#fff4f4",
                                },
                            }}
                          >
                            {t(
                              "menus.maintenance.edit"
                            )}
                          </Button>

                          <Button
                            onClick={() =>
                              cambiarEstado(
                                menu
                              )
                            }
                            disabled={
                              actualizando
                            }
                            variant="outlined"
                            startIcon={
                              actualizando ? (
                                <CircularProgress
                                  size={
                                    16
                                  }
                                  color="inherit"
                                />
                              ) : activo ? (
                                <BlockIcon />
                              ) : (
                                <CheckCircleIcon />
                              )
                            }
                            size="small"
                            color={
                              activo
                                ? "error"
                                : "success"
                            }
                            sx={{
                              textTransform:
                                "none",
                              borderRadius:
                                2,
                            }}
                          >
                            {actualizando
                              ? t(
                                  "menus.maintenance.saving"
                                )
                              : activo
                                ? t(
                                    "menus.maintenance.disable"
                                  )
                                : t(
                                    "menus.maintenance.enable"
                                  )}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                }
              )}

              {menusFiltrados.length ===
                0 && (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    align="center"
                    sx={{ py: 5 }}
                  >
                    <Typography color="text.secondary">
                      {t(
                        "menus.maintenance.noResults"
                      )}
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