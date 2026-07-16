import { Typography, Container } from "@mui/material";
import { ProductForm } from "./Form/ProductForm";

export function CreateProduct() {
  const guardarProducto = async (data) => {
    console.log(data);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ mb: 3 }}
      >
        Crear Producto
      </Typography>

      <ProductForm
        onSubmit={guardarProducto}
        submitText="Guardar producto"
      />
    </Container>
  );
}