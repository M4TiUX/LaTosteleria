import { useEffect, useState } from "react";
import ProductService from "../../services/ProductService";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Button,
} from "@mui/material";

export function TableProduct() {
  const [data, setData] = useState([]);

  useEffect(() => {
    ProductService.getProducts()
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Mantenimiento de Productos
      </Typography>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Producto</strong></TableCell>
              <TableCell><strong>Categoría</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id_producto}>
                <TableCell>{item.id_producto}</TableCell>
                <TableCell>{item.nombre_producto}</TableCell>
                <TableCell>{item.nombre_categoria}</TableCell>
                <TableCell>₡ {new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(item.precio)}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    href={`/producto/${item.id_producto}`}
                  >
                    Detalle
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}