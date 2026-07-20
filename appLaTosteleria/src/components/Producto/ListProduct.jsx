import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductService from "../../services/ProductService";

import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

export function ListProduct() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => {
        console.log("Estructura de la respuesta:", response.data);

        if (Array.isArray(response.data)) {
          setProductos(
            response.data.filter((producto) => Number(producto.activo) === 1),
          );
        } else if (response.data && Array.isArray(response.data.data)) {
          setProductos(
            response.data.data.filter(
              (producto) => Number(producto.activo) === 1,
            ),
          );
        } else if (response.data && Array.isArray(response.data.productos)) {
          setProductos(
            response.data.productos.filter(
              (producto) => Number(producto.activo) === 1,
            ),
          );
        } else {
          setProductos([]);
          setError("La API no devolvió una lista válida de productos.");
        }
      })
      .catch((error) => {
        console.error("Error al traer productos:", error);
        setError("No fue posible cargar los productos.");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

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
          minHeight: 400,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 2,
        }}
      >
        <CircularProgress />

        <Typography color="text.secondary">Cargando productos...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          minHeight: 350,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        <Typography variant="h6" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 3 }}>
      <Box sx={{ mb: 5 }}>
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
          Nuestros productos
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 1, maxWidth: 650 }}
        >
          Conoce nuestra variedad de productos preparados especialmente para
          disfrutar en cualquier momento del día.
        </Typography>
      </Box>

      {productos.length > 0 ? (
        <Grid container spacing={3}>
          {productos.map((producto) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={producto.id_producto}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 4,
                  overflow: "hidden",
                  boxShadow: 3,
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: 10,
                  },
                }}
              >
                <Box
                  sx={{
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  <CardMedia
                    component="img"
                    image={`/images/${producto.imagen}`}
                    alt={producto.nombre_producto}
                    sx={{
                      height: 230,
                      objectFit: "cover",
                      transition: "transform 0.4s ease",
                      "&:hover": {
                        transform: "scale(1.05)",
                      },
                    }}
                  />

                  <Chip
                    label={producto.nombre_categoria || "Sin categoría"}
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 14,
                      left: 14,
                      fontWeight: "bold",
                      bgcolor: "background.paper",
                      boxShadow: 2,
                    }}
                  />
                </Box>

                <CardContent
                  sx={{
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    p: 3,
                  }}
                >
                  <Typography
                    variant="h5"
                    component="h2"
                    fontWeight="bold"
                    gutterBottom
                  >
                    {producto.nombre_producto}
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      WebkitLineClamp: 3,
                      overflow: "hidden",
                      minHeight: 60,
                      lineHeight: 1.5,
                    }}
                  >
                    {producto.descripcion || "Producto sin descripción."}
                  </Typography>

                  <Typography
                    variant="h5"
                    color="success.main"
                    fontWeight="bold"
                    sx={{ mt: "auto", pt: 3 }}
                  >
                    {formatearPrecio(producto.precio)}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 3, pt: 0 }}>
                  <Button
                    component={Link}
                    to={`/producto/${producto.id_producto}`}
                    variant="contained"
                    fullWidth
                    sx={{
                      py: 1.2,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                    }}
                  >
                    Ver detalle
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            minHeight: 300,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos disponibles.
          </Typography>
        </Box>
      )}
    </Box>
  );
}
