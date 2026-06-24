import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";

import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CardMedia,
} from "@mui/material";

export function ListProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => {
        console.log("Estructura de la respuesta:", response.data);

        if (Array.isArray(response.data)) {
          setData(response.data); // Si es un arreglo directo [...]
        } else if (response.data && Array.isArray(response.data.data)) {
          setData(response.data.data); // Si viene envuelto en un objeto { data: [...] }
        } else if (response.data && Array.isArray(response.data.productos)) {
          setData(response.data.productos); // Si viene envuelto como { productos: [...] }
        } else {
          console.error("La API no devolvió un formato de arreglo válido.");
          setData([]);
        }
      })
      .catch((error) => {
        console.error("Error al traer productos:", error);
      });
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Nuestros Productos
      </Typography>

      <Grid container spacing={3}>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item.id_producto}>
              <Card
                sx={{
                  height: "100%",
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="220"
                  image={`/images/${item.imagen}`}
                  alt={item.nombre_producto}
                />

                <CardContent>
                  <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {item.nombre_producto}
                  </Typography>

                  <Typography color="text.secondary" sx={{ minHeight: 50 }}>
                    {item.descripcion}
                  </Typography>

                  <Typography sx={{ mt: 2 }}>
                    Categoría: <strong>{item.nombre_categoria}</strong>
                  </Typography>

                  <Typography
                    variant="body1"
                    color="success.main"
                    fontWeight="bold"
                    sx={{ mt: 2 }}
                  >
                    Precio: ₡ {new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(item.precio)}
                  </Typography>

                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, borderRadius: 2 }}
                    href={`/producto/${item.id_producto}`}
                  >
                    Ver detalle
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          /* Mensaje provisional mientras carga o por si no hay productos */
          <Grid item xs={12}>
            <Typography
              variant="h6"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              Cargando productos o no se encontraron resultados...
            </Typography>
          </Grid>
        )}
      </Grid>
    </>
  );
}
