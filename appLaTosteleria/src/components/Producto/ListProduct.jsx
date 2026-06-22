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
        setData(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Nuestros Productos
      </Typography>

      <Grid container spacing={3}>
        {data.map((item) => (
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
                  variant="h4"
                  color="success.main"
                  fontWeight="bold"
                  sx={{ mt: 2 }}
                >
                  ₡ {item.precio}
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
        ))}
      </Grid>
    </>
  );
}
