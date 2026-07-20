import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ComboService from "../../services/ComboService";

import {
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
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function TableCombo() {
  const [data, setData] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [categoria, setCategoria] = useState("");

  useEffect(() => {
    ComboService.getCombos()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setData(response.data);
        } else if (Array.isArray(response.data?.data)) {
          setData(response.data.data);
        } else {
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error al cargar los combos:", error);
      });
  }, []);

  const cambiarEstado = async (item) => {
    try {
      const nuevoEstado = Number(item.activo) === 1 ? 0 : 1;

      await ComboService.changeStatus({
        id_combo: item.id_combo,
        activo: nuevoEstado,
      });

      setData((combosActuales) =>
        combosActuales.map((combo) =>
          combo.id_combo === item.id_combo
            ? { ...combo, activo: nuevoEstado }
            : combo,
        ),
      );
    } catch (error) {
      console.error("Error al cambiar el estado del combo:", error);
    }
  };

  const combosFiltrados = data.filter((item) => {
    const coincideBusqueda = item.nombre_combo
      .toLowerCase()
      .includes(busqueda.toLowerCase());

    const coincideCategoria =
      categoria === "" || item.nombre_categoria === categoria;

    return coincideBusqueda && coincideCategoria;
  });

  const categorias = [
    ...new Set(data.map((item) => item.nombre_categoria).filter(Boolean)),
  ];

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
            Mantenimiento de Combos
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            Administra los combos disponibles en el sistema
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/combo/create"
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
          Nuevo Combo
        </Button>
      </Box>

      {/* Contenedor principal */}
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
              placeholder="Buscar combo..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
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
              value={categoria}
              onChange={(e) => setCategoria(e.target.value)}
              displayEmpty
              size="small"
              sx={{ width: 250 }}
            >
              <MenuItem value="">Todas las categorías</MenuItem>

              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Chip
            label={`Total: ${combosFiltrados.length} combos`}
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
                  <strong>ID</strong>
                </TableCell>

                <TableCell>
                  <strong>Combo</strong>
                </TableCell>

                <TableCell>
                  <strong>Categoría</strong>
                </TableCell>

                <TableCell>
                  <strong>Precio especial</strong>
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
              {combosFiltrados.map((item) => (
                <TableRow
                  key={item.id_combo}
                  hover
                  sx={{
                    "&:last-child td, &:last-child th": {
                      border: 0,
                    },
                  }}
                >
                  <TableCell>{item.id_combo}</TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.nombre_combo}
                    </Typography>
                  </TableCell>

                  <TableCell>
                    <Chip
                      label={item.nombre_categoria || "Sin categoría"}
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <Typography fontWeight={600}>
                      ₡{" "}
                      {new Intl.NumberFormat("es-CR", {
                        maximumFractionDigits: 0,
                      }).format(item.precio_especial)}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip
                      label={
                        Number(item.activo) === 1 ? "Activo" : "Inhabilitado"
                      }
                      color={Number(item.activo) === 1 ? "success" : "default"}
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
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/combo/${item.id_combo}`}
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
                        to={`/combo/update/${item.id_combo}`}
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
                        onClick={() => cambiarEstado(item)}
                        variant="outlined"
                        startIcon={
                          Number(item.activo) === 1 ? (
                            <BlockIcon />
                          ) : (
                            <CheckCircleIcon />
                          )
                        }
                        size="small"
                        color={Number(item.activo) === 1 ? "error" : "success"}
                        sx={{
                          textTransform: "none",
                          borderRadius: 2,
                        }}
                      >
                        {Number(item.activo) === 1
                          ? "Inhabilitar"
                          : "Habilitar"}
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {combosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      No se encontraron combos
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
