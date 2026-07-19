import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Box, CircularProgress, Container } from "@mui/material";

import ProductForm from "./Form/ProductForm";
import ProductService from "../../services/ProductService";
import { toast } from "react-toastify";

export function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarProducto();
  }, []);

  const cargarProducto = async () => {
    try {
      const response = await ProductService.getProductById(id);

      const producto = response.data;

      setProducto({
        ...producto,
        categoria_id: Number(producto.categoria_id),
        precio: Number(producto.precio),
        ingredientes: (producto.ingredientes || []).map((ingrediente) =>
          Number(ingrediente.id_ingrediente),
        ),
      });
    } catch (error) {
      console.error("Error al cargar el producto:", error);
    } finally {
      setCargando(false);
    }
  };

  const actualizarProducto = async (datos) => {
    try {
      setGuardando(true);

      const response = await ProductService.updateProduct({
        id_producto: Number(id),
        ...datos,
      });

      toast.success(
        response.data.message || "Producto actualizado correctamente.",
      );

      navigate("/producto");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      console.error("Error completo:", error);
      console.error("Respuesta del servidor:", error.response?.data);
      console.error("Estado HTTP:", error.response?.status);

      const mensaje =
        error.response?.data?.message ||
        "No fue posible comunicarse con el servidor.";

      toast.error(mensaje);
    } finally {
      setGuardando(false);
    }
  };

  if (cargando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          mt: 10,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <ProductForm
        defaultValues={producto}
        onSubmit={actualizarProducto}
        loading={guardando}
        buttonText="Actualizar producto"
      />
    </Container>
  );
}
