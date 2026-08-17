import { useContext, useEffect, useState } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

import ComboService from "../../services/ComboService";
import { UserContext } from "../../context/UserContext";

import {
  Avatar,
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
  const { t } = useTranslation();

  /*
   * Obtener el rol del usuario.
   * Solo el Administrador puede crear,
   * editar o cambiar el estado de combos.
   */
  const { decodeToken } = useContext(UserContext);

  const userData = decodeToken();

  const roleName = userData?.rol?.name ?? "";

  const isAdministrador = roleName === "Administrador";

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
            ? {
                ...combo,
                activo: nuevoEstado,
              }
            : combo,
        ),
      );

      toast.success(
        nuevoEstado === 1
          ? t("combos.maintenance.statusEnabledSuccess")
          : t("combos.maintenance.statusDisabledSuccess"),
      );
    } catch (error) {
      console.error("Error al cambiar el estado del combo:", error);

      toast.error(t("combos.maintenance.statusChangeError"));
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
            {t("combos.maintenance.title")}
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "text.secondary",
              mt: 1,
            }}
          >
            {t("combos.maintenance.subtitle")}
          </Typography>
        </Box>

        {/* Solo Administrador */}
        {isAdministrador && (
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
            {t("combos.maintenance.newCombo")}
          </Button>
        )}
      </Box>

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
              placeholder={t("combos.maintenance.searchPlaceholder")}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              size="small"
              sx={{
                width: 300,
              }}
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
              sx={{
                width: 250,
              }}
            >
              <MenuItem value="">
                {t("combos.maintenance.allCategories")}
              </MenuItem>

              {categorias.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </Box>

          <Chip
            label={t("combos.maintenance.total", {
              count: combosFiltrados.length,
            })}
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
                  <strong>{t("combos.maintenance.image")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("combos.maintenance.combo")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("combos.maintenance.category")}</strong>
                </TableCell>

                <TableCell>
                  <strong>{t("combos.maintenance.specialPrice")}</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>{t("combos.maintenance.status")}</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>{t("combos.maintenance.actions")}</strong>
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
                  {/* ID */}
                  <TableCell>{item.id_combo}</TableCell>

                  {/* Imagen */}
                  <TableCell>
                    <Avatar
                      variant="rounded"
                      src={item.imagen ? `/images/${item.imagen}` : undefined}
                      alt={item.nombre_combo}
                      sx={{
                        width: 70,
                        height: 55,
                        borderRadius: 2,
                      }}
                    >
                      {item.nombre_combo?.charAt(0)?.toUpperCase()}
                    </Avatar>
                  </TableCell>

                  {/* Nombre */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      {item.nombre_combo}
                    </Typography>
                  </TableCell>

                  {/* Categoría */}
                  <TableCell>
                    <Chip
                      label={
                        item.nombre_categoria ||
                        t("combos.maintenance.noCategory")
                      }
                      size="small"
                      variant="outlined"
                      sx={{
                        borderRadius: 2,
                      }}
                    />
                  </TableCell>

                  {/* Precio */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      ₡{" "}
                      {new Intl.NumberFormat("es-CR", {
                        maximumFractionDigits: 0,
                      }).format(item.precio_especial)}
                    </Typography>
                  </TableCell>

                  {/* Estado */}
                  <TableCell align="center">
                    <Chip
                      label={
                        Number(item.activo) === 1
                          ? t("combos.maintenance.active")
                          : t("combos.maintenance.disabled")
                      }
                      color={Number(item.activo) === 1 ? "success" : "default"}
                      size="small"
                      sx={{
                        fontWeight: 600,
                      }}
                    />
                  </TableCell>

                  {/* Acciones */}
                  <TableCell align="center">
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 1,
                        flexWrap: "wrap",
                      }}
                    >
                      {/* Disponible para consulta */}
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
                        {t("combos.maintenance.detail")}
                      </Button>

                      {/* Acciones exclusivas del Administrador */}
                      {isAdministrador && (
                        <>
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
                            {t("combos.maintenance.edit")}
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
                            color={
                              Number(item.activo) === 1 ? "error" : "success"
                            }
                            sx={{
                              textTransform: "none",
                              borderRadius: 2,
                            }}
                          >
                            {Number(item.activo) === 1
                              ? t("combos.maintenance.disable")
                              : t("combos.maintenance.enable")}
                          </Button>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {combosFiltrados.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <Typography color="text.secondary">
                      {t("combos.maintenance.noCombos")}
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
