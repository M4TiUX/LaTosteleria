import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";

import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

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
        Productos
      </Typography>

      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id_producto}>
            <Card>
              <CardContent>
                <Typography variant="h5">{item.nombre_producto}</Typography>

                <Typography sx={{ mt: 2 }}>{item.descripcion}</Typography>

                <Typography sx={{ mt: 2 }}>
                  Categoría: {item.nombre_categoria}
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ₡ {item.precio}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
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
