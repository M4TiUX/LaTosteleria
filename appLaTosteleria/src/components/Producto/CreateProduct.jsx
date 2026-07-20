import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Box, Container } from "@mui/material";

import ProductForm from "./Form/ProductForm";
import ProductService from "../../services/ProductService";
import { toast } from "react-toastify";

export function CreateProduct() {
  const navigate = useNavigate();
  const [guardando, setGuardando] = useState(false);

  const guardarProducto = async (producto) => {
    try {
      setGuardando(true);

      const formData = new FormData();

      formData.append("nombre_producto", producto.nombre_producto);
      formData.append("descripcion", producto.descripcion);
      formData.append("precio", producto.precio);
      formData.append("categoria_id", producto.categoria_id);

      producto.ingredientes.forEach((ingredienteId) => {
        formData.append("ingredientes[]", ingredienteId);
      });

      if (producto.archivoImagen) {
        formData.append("imagen", producto.archivoImagen);
      }

      const response = await ProductService.createProduct(formData);

      toast.success(
        response.data.message || "Producto registrado correctamente.",
      );

      navigate("/producto");
    } catch (error) {
      console.error("Error al guardar el producto:", error);

      if (error.response) {
        toast.error(
          error.response?.data.message ||
            "Ocurrió un error al registrar el producto.",
        );
      } else {
        toast.error("No fue posible comunicarse con el servidor.");
      }
    } finally {
      setGuardando(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        py: {
          xs: 4,
          md: 6,
        },
        bgcolor: "background.default",
      }}
    >
      <Container maxWidth="lg">
        <ProductForm
          onSubmit={guardarProducto}
          loading={guardando}
          buttonText="Guardar producto"
        />
      </Container>
    </Box>
  );
}
