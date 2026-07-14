import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ComboService from "../../services/ComboService";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";

export function DetailCombo() {
  const { id } = useParams();

  const [combo, setCombo] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ComboService.getComboById(id)
      .then((response) => {
        console.log("Detalle del combo:", response.data);

        if (response.data?.data) {
          setCombo(response.data.data);
        } else {
          setCombo(response.data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar el combo:", error);
        setError("No fue posible cargar la información del combo.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, [id]);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(Number(precio));
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
          gap: 1.5,
        }}
      >
        <CircularProgress size={36} />

        <Typography variant="body2" color="text.secondary">
          Cargando información del combo...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: 850, mx: "auto", py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>

        <Button
          component={Link}
          to="/combo"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Volver a combos
        </Button>
      </Box>
    );
  }

  if (!combo) {
    return (
      <Box sx={{ maxWidth: 850, mx: "auto", py: 4 }}>
        <Alert severity="warning" sx={{ mb: 3 }}>
          No se encontró el combo solicitado.
        </Alert>

        <Button
          component={Link}
          to="/combo"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Volver a combos
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
        },
        py: {
          xs: 2,
          md: 3,
        },
      }}
    >
      <Button
        component={Link}
        to="/combo"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 2,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Volver a combos
      </Button>

      <Card
        sx={{
          borderRadius: 4,
          boxShadow: 4,
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: {
              xs: 2.5,
              sm: 3,
            },
            py: 2.5,
            bgcolor: "action.hover",
            display: "flex",
            justifyContent: "space-between",
            alignItems: {
              xs: "flex-start",
              sm: "center",
            },
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            gap: 2,
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "background.paper",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                boxShadow: 1,
              }}
            >
              <RestaurantMenuOutlinedIcon color="primary" />
            </Box>

            <Box>
              <Typography
                variant="h4"
                component="h1"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "1.6rem",
                    sm: "2rem",
                  },
                }}
              >
                {combo.nombre_combo}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Combo especial
              </Typography>
            </Box>
          </Stack>

          <Chip
            icon={<CategoryOutlinedIcon />}
            label={combo.nombre_categoria || "Sin categoría"}
            sx={{
              fontWeight: "bold",
              bgcolor: "background.paper",
            }}
          />
        </Box>

        <CardContent
          sx={{
            p: {
              xs: 2.5,
              sm: 3,
            },
            "&:last-child": {
              pb: {
                xs: 2.5,
                sm: 3,
              },
            },
          }}
        >
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
              <Typography variant="caption" color="text.secondary">
                Precio especial
              </Typography>

              <Typography
                variant="h4"
                color="success.main"
                fontWeight="bold"
                sx={{
                  fontSize: {
                    xs: "1.8rem",
                    sm: "2.1rem",
                  },
                }}
              >
                {formatearPrecio(combo.precio_especial)}
              </Typography>
            </Box>

            <Chip
              icon={<LocalOfferOutlinedIcon />}
              label="Precio promocional"
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.5 }}
          >
            <DescriptionOutlinedIcon />

            <Typography variant="h6" component="h2" fontWeight="bold">
              Descripción
            </Typography>
          </Stack>

          <Typography
            variant="body1"
            color="text.secondary"
            sx={{
              lineHeight: 1.7,
            }}
          >
            {combo.descripcion || "Combo sin descripción."}
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            sx={{ mb: 1.5 }}
          >
            <RestaurantMenuOutlinedIcon />

            <Typography variant="h6" component="h2" fontWeight="bold">
              Productos incluidos
            </Typography>
          </Stack>

          {combo.productos?.length > 0 ? (
            <List
              disablePadding
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {combo.productos.map((producto) => (
                <ListItem
                  key={producto.id_producto}
                  sx={{
                    px: 1.5,
                    py: 1.25,
                    border: 1,
                    borderColor: "divider",
                    borderRadius: 2,
                    bgcolor: "background.paper",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    flexWrap: {
                      xs: "wrap",
                      sm: "nowrap",
                    },
                    transition: "0.2s",
                    "&:hover": {
                      boxShadow: 3,
                      transform: "translateY(-2px)",
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={`/images/${producto.imagen}`}
                    alt={producto.nombre_producto}
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: 2,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />

                  <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                    <Typography
                      fontWeight="bold"
                      sx={{
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      {producto.nombre_producto}
                    </Typography>

                    <Typography variant="body2" color="text.secondary">
                      Cantidad: {producto.cantidad}
                    </Typography>
                  </Box>

                  <Chip
                    label={`x${producto.cantidad}`}
                    size="small"
                    sx={{
                      fontWeight: "bold",
                    }}
                  />

                  <Button
                    component={Link}
                    to={`/producto/${producto.id_producto}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      ml: {
                        xs: "auto",
                        sm: 0,
                      },
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Ver producto
                  </Button>
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography color="text.secondary">
              No hay productos registrados en este combo.
            </Typography>
          )}

          <Button
            component={Link}
            to="/combo"
            variant="contained"
            fullWidth
            startIcon={<ArrowBackIcon />}
            sx={{
              mt: 3,
              py: 1,
              borderRadius: 2,
              textTransform: "none",
              fontWeight: "bold",
            }}
          >
            Volver al catálogo de combos
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}
