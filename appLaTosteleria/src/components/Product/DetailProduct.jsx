import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductService from "../../services/ProductService";
import { Card, CardContent, Typography, Button } from "@mui/material";
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

      <Card sx={{ maxWidth: 600 }}>
        <CardContent>
          <Typography variant="h4">{producto.nombre_producto}</Typography>

          <Typography sx={{ mt: 2 }}>{producto.descripcion}</Typography>

          <Typography sx={{ mt: 2 }}>
            Categoría: {producto.nombre_categoria}
          </Typography>

          <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
            ₡ {producto.precio}
          </Typography>

          <Typography sx={{ mt: 2 }}>
            Imagen: {producto.imagen}
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