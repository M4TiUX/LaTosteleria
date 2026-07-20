import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "flex-start", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold" sx={{ mb: 1 }}>
            Mantenimiento de menús
          </Typography>
          <Typography color="text.secondary">
            Gestiona los menús registrados, crea nuevos y cambia su estado.
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/menu/mantenimiento/crear"
          variant="contained"
          startIcon={<AddOutlinedIcon />}
        >
          Nuevo menú
        </Button>
      </Stack>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error?.response?.data?.message ?? error?.message ?? "No fue posible cargar los menús."}
        </Alert>
      )}

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Fecha inicio</TableCell>
              <TableCell>Fecha fin</TableCell>
              <TableCell>Hora inicio</TableCell>
              <TableCell>Hora fin</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {menus.length > 0 ? (
              menus.map((menu) => {
                const status = formatStatus(menu, now);

                return (
                  <TableRow key={menu.id_menu} hover>
                    <TableCell>
                      <Typography fontWeight={700}>{menu.nombre_menu}</Typography>
                    </TableCell>
                    <TableCell>{formatMenuDate(menu.fecha_inicio)}</TableCell>
                    <TableCell>{formatMenuDate(menu.fecha_fin)}</TableCell>
                    <TableCell>{formatMenuTime(menu.hora_inicio)}</TableCell>
                    <TableCell>{formatMenuTime(menu.hora_fin)}</TableCell>
                    <TableCell>
                      <Chip label={status.label} color={status.color} size="small" />
                    </TableCell>
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        <Button
                          component={Link}
                          to={`/menu/${menu.id_menu}`}
                          variant="outlined"
                          size="small"
                          startIcon={<VisibilityOutlinedIcon />}
                        >
                          Ver
                        </Button>
                        <Button
                          component={Link}
                          to={`/menu/mantenimiento/editar/${menu.id_menu}`}
                          variant="contained"
                          size="small"
                          startIcon={<EditOutlinedIcon />}
                        >
                          Editar
                        </Button>
                        <Button
                          variant="outlined"
                          color={Number(menu.activo) === 1 ? "error" : "success"}
                          size="small"
                          disabled={processingId === Number(menu.id_menu)}
                          startIcon={Number(menu.activo) === 1 ? <BlockOutlinedIcon /> : <CheckCircleOutlinedIcon />}
                          onClick={() => handleToggleActive(menu)}
                        >
                          {processingId === Number(menu.id_menu)
                            ? "Guardando..."
                            : Number(menu.activo) === 1
                              ? "Desactivar"
                              : "Activar"}
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay menús registrados.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}