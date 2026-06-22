import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import {
  Card,
  CardContent,
  Typography,
  Button,
  CardMedia,
} from "@mui/material";
import { Link } from "react-router-dom";

export function DetailProduct() {
  const { id } = useParams();
  const [producto, setProducto] = useState(null);

  useEffect(() => {
    ProductService.getProductById(id)
      .then((response) => setProducto(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!producto) return <p>Cargando producto...</p>;

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Detalle del Producto
      </Typography>

      <Card
        sx={{
          maxWidth: 700,
          margin: "auto",
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardMedia
          component="img"
          height="350"
          image={`/images/${producto.imagen}`}
          alt={producto.nombre_producto}
        />

        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {producto.nombre_producto}
          </Typography>

          <Typography sx={{ mt: 2 }}>{producto.descripcion}</Typography>

          <Typography sx={{ mt: 2 }}>
            Categoría: <strong>{producto.nombre_categoria}</strong>
          </Typography>

          <Typography
            variant="h4"
            color="success.main"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            ₡ {producto.precio}
          </Typography>

          <Button
            component={Link}
            to="/producto"
            variant="contained"
            sx={{ mt: 3 }}
          >
            Volver
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
