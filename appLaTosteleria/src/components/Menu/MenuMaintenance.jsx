import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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
import toast from "react-hot-toast";
import MenuService from "../../services/MenuService";
import { formatMenuDate, formatMenuTime, isMenuAvailable } from "./menuUtils";

function formatStatus(menu, now) {
  const activo = Number(menu.activo) === 1;
  const disponible = isMenuAvailable(menu, now);

  if (!activo) {
    return {
      label: "Inactivo",
      color: "default",
    };
  }

  if (disponible) {
    return {
      label: "Disponible",
      color: "success",
    };
  }

  return {
    label: "Activo",
    color: "warning",
  };
}

function buildMenuUpdatePayload(menu, activo) {
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

  return {
    id_menu: Number(menu.id_menu),
    nombre_menu: menu.nombre_menu,
    fecha_inicio: menu.fecha_inicio,
    fecha_fin: menu.fecha_fin,
    hora_inicio: String(menu.hora_inicio).slice(0, 8),
    hora_fin: String(menu.hora_fin).slice(0, 8),
    productos: Array.from(new Set(productos)),
    combos: Array.from(new Set(combos)),
    activo,
  };
}

export function MenuMaintenance() {
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [now] = useState(() => new Date());
  const [processingId, setProcessingId] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const loadMenus = () => {
    MenuService.getMenus()
      .then((response) => {
        setMenus(response.data ?? []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  };

  useEffect(() => {
    loadMenus();
  }, []);

  const menusFiltrados = menus.filter((menu) => {
    const status = formatStatus(menu, now);
    const coincideBusqueda = menu.nombre_menu
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideEstado =
      statusFilter === "" || status.label === statusFilter;

    return coincideBusqueda && coincideEstado;
  });

  const handleToggleActive = async (menu) => {
    const action = Number(menu.activo) === 1 ? "desactivar" : "activar";
    const confirmed = window.confirm(
      `¿Desea ${action} el menú "${menu.nombre_menu}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setError(null);
      setProcessingId(Number(menu.id_menu));

      const response = await MenuService.getMenuById(menu.id_menu);
      const payload = buildMenuUpdatePayload(
        response.data,
        Number(menu.activo) === 1 ? 0 : 1,
      );

      await MenuService.updateMenu(payload);
      toast.success(
        Number(payload.activo) === 1
          ? "El menú fue activado correctamente."
          : "El menú fue desactivado correctamente.",
      );
      loadMenus();
    } catch (err) {
      setError(err);
      toast.error("No fue posible actualizar el estado del menú.");
    } finally {
      setProcessingId(null);
    }
  };

  if (!loaded) {
    return <p>Cargando mantenimiento de menús...</p>;
  }

  return (
    <Container maxWidth="xl" sx={{ py: 5 }}>
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
            Mantenimiento de Menús
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Administra los menús registrados en el sistema
          </Typography>
        </Box>

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
          Nuevo Menú
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message ??
            error?.message ??
            "No fue posible cargar los menús."}
        </Alert>
      )}

      <Paper
        elevation={4}
        sx={{
          p: 3,
          borderRadius: 4,
        }}
      >
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
              placeholder="Buscar menú..."
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
              <MenuItem value="">Todos los estados</MenuItem>
              <MenuItem value="Disponible">Disponible</MenuItem>
              <MenuItem value="Activo">Activo</MenuItem>
              <MenuItem value="Inactivo">Inactivo</MenuItem>
            </Select>
          </Box>

          <Chip
            label={`Total: ${menusFiltrados.length} menús`}
            sx={{
              fontSize: "0.95rem",
              px: 1,
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  backgroundColor: "#faf4f2",
                }}
              >
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Menú</strong>
                </TableCell>
                <TableCell>
                  <strong>Inicio</strong>
                </TableCell>
                <TableCell>
                  <strong>Fin</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Estado</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {menusFiltrados.map((menu) => {
                const status = formatStatus(menu, now);

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
                          Detalle
                        </Button>

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
                          Editar
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
                          color={Number(menu.activo) === 1 ? "error" : "success"}
                          sx={{
                            textTransform: "none",
                            borderRadius: 2,
                          }}
                        >
                          {processingId === Number(menu.id_menu)
                            ? "Guardando..."
                            : Number(menu.activo) === 1
                              ? "Inhabilitar"
                              : "Habilitar"}
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}

              {menusFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No se encontraron menús
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