import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";

import {
  Alert,
  Box,
  Button,
  Card,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import RestaurantOutlinedIcon from "@mui/icons-material/RestaurantOutlined";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

export function DetailProduct() {
  const { id } = useParams();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ProductService.getProductById(id)
      .then((response) => {
        console.log("Detalle del producto:", response.data);

        if (response.data?.data) {
          setProducto(response.data.data);
        } else {
          setProducto(response.data);
        }
      })
      .catch((error) => {
        console.error("Error al cargar el producto:", error);
        setError("No fue posible cargar la información del producto.");
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
        <CircularProgress />

        <Typography color="text.secondary">
          Cargando información del producto...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 5,
        }}
      >
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>

        <Button
          component={Link}
          to="/producto"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Volver a productos
        </Button>
      </Box>
    );
  }

  if (!producto) {
    return (
      <Box
        sx={{
          maxWidth: 900,
          mx: "auto",
          py: 5,
        }}
      >
        <Alert severity="warning" sx={{ mb: 3 }}>
          No se encontró el producto solicitado.
        </Alert>

        <Button
          component={Link}
          to="/producto"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Volver a productos
        </Button>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        maxWidth: 1050,
        mx: "auto",
        px: {
          xs: 2,
          sm: 3,
        },
        py: {
          xs: 3,
          md: 4,
        },
      }}
    >
      <Button
        component={Link}
        to="/producto"
        startIcon={<ArrowBackIcon />}
        sx={{
          mb: 3,
          textTransform: "none",
          fontWeight: "bold",
        }}
      >
        Volver a productos
      </Button>

      <Divider sx={{ mb: 4 }} />

      <Grid container spacing={{ xs: 4, md: 5 }} alignItems="flex-start">
        {/* Columna izquierda: imagen */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              borderRadius: 4,
              overflow: "hidden",
              boxShadow: 4,
            }}
          >
            <CardMedia
              component="img"
              image={`/images/${producto.imagen}`}
              alt={producto.nombre_producto}
              sx={{
                width: "100%",
                height: {
                  xs: 280,
                  sm: 360,
                  md: 430,
                },
                objectFit: "cover",
              }}
            />
          </Card>
        </Grid>

        {/* Columna derecha: información */}
        <Grid item xs={12} md={6}>
          <Box>
            <Typography
              variant="h3"
              component="h1"
              fontWeight="bold"
              sx={{
                fontSize: {
                  xs: "2rem",
                  sm: "2.5rem",
                  md: "3rem",
                },
              }}
            >
              {producto.nombre_producto}
            </Typography>

            <Typography
              variant="h4"
              color="success.main"
              fontWeight="bold"
              sx={{ mt: 2 }}
            >
              {formatearPrecio(producto.precio)}
            </Typography>

            <Chip
              icon={<CategoryOutlinedIcon />}
              label={producto.nombre_categoria || "Sin categoría"}
              sx={{
                mt: 2.5,
                fontWeight: "bold",
              }}
            />

            <Divider sx={{ my: 4 }} />

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <DescriptionOutlinedIcon />

              <Typography variant="h5" component="h2" fontWeight="bold">
                Descripción
              </Typography>
            </Stack>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{
                lineHeight: 1.8,
              }}
            >
              {producto.descripcion || "Producto sin descripción."}
            </Typography>

            <Divider sx={{ my: 4 }} />

            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <RestaurantOutlinedIcon />

              <Typography variant="h5" component="h2" fontWeight="bold">
                Ingredientes
              </Typography>
            </Stack>

            {producto.ingredientes?.length > 0 ? (
              <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                {producto.ingredientes.map((ingrediente) => (
                  <Chip
                    key={ingrediente.id_ingrediente}
                    label={ingrediente.nombre_ingrediente}
                    variant="outlined"
                    sx={{
                      px: 0.5,
                      fontWeight: 500,
                    }}
                  />
                ))}
              </Stack>
            ) : (
              <Typography color="text.secondary">
                No hay ingredientes registrados.
              </Typography>
            )}
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ mt: 5, mb: 3 }} />

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Button
          component={Link}
          to="/producto"
          variant="contained"
          startIcon={<ArrowBackIcon />}
          sx={{
            width: {
              xs: "100%",
              sm: 380,
            },
            py: 1.4,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Volver al catálogo
        </Button>
      </Box>
    </Box>
  );
}
