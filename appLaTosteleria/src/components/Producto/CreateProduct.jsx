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

      const response = await ProductService.createProduct(producto);

      toast.success(response.data.message || "Producto registrado correctamente.");

      navigate("/producto");
    } catch (error) {
      console.error("Error al guardar el producto:", error);

      if (error.response) {

        toast.error(error.response?.data.message || "Ocurrió un error al registrar el producto.");
        
      } else {

        toast.error(error.response?.data.message || "No fue posible comunicarse con el servidor.");

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
