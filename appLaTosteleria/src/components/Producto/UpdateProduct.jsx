import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { Box, CircularProgress, Container } from "@mui/material";

import ProductForm from "./Form/ProductForm";
import ProductService from "../../services/ProductService";
import { toast } from "react-toastify";

export function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [producto, setProducto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  const cargarProducto = useCallback(async () => {
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
  }, [id]);

  useEffect(() => {
    cargarProducto();
  }, [cargarProducto]);

  const actualizarProducto = async (datos) => {
    try {
      setGuardando(true);

      const formData = new FormData();

      formData.append("id_producto", Number(id));
      formData.append("nombre_producto", datos.nombre_producto);
      formData.append("descripcion", datos.descripcion);
      formData.append("precio", datos.precio);
      formData.append("categoria_id", datos.categoria_id);

      datos.ingredientes.forEach((ingredienteId) => {
        formData.append("ingredientes[]", ingredienteId);
      });

      if (datos.archivoImagen) {
        formData.append("imagen", datos.archivoImagen);
      }

      const response = await ProductService.updateProduct(formData);

      toast.success(response.data.message || t("products.form.updateSuccess"));

      navigate("/producto");
    } catch (error) {
      console.error("Error al actualizar el producto:", error);

      const mensajeServidor = error.response?.data?.message;

      if (
        mensajeServidor === "Ya existe un producto registrado con ese nombre."
      ) {
        toast.error(t("products.form.validation.duplicateName"));
      } else if (error.response) {
        toast.error(mensajeServidor || t("products.form.updateError"));
      } else {
        toast.error(t("products.form.serverError"));
      }
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
        buttonText={t("products.form.update")}
      />
    </Container>
  );
}
