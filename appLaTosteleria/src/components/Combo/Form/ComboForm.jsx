import { useEffect, useState } from "react";
import ProductService from "../../../services/ProductService";
import CategoryService from "../../../services/CategoryService";

import {
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import SaveIcon from "@mui/icons-material/Save";

export function ComboForm({
  defaultValues = {},
  onSubmit,
  guardando = false,
  textoBoton = "Guardar Combo",
}) {
  const [categorias, setCategorias] = useState([]);
  const [productosDisponibles, setProductosDisponibles] = useState([]);

  const [nombreCombo, setNombreCombo] = useState(
    defaultValues.nombre_combo || ""
  );

  const [descripcion, setDescripcion] = useState(
    defaultValues.descripcion || ""
  );

  const [precioEspecial, setPrecioEspecial] = useState(
    defaultValues.precio_especial || ""
  );

  const [categoriaId, setCategoriaId] = useState(
    defaultValues.categoria_id || ""
  );

  const [productosSeleccionados, setProductosSeleccionados] = useState(
    defaultValues.productos?.map((producto) => ({
      producto_id: Number(producto.id_producto),
      cantidad: Number(producto.cantidad),
    })) || []
  );

  const [cargando, setCargando] = useState(true);

  // Cargar categorías y productos
  useEffect(() => {
    Promise.all([
      CategoryService.getCategories(),
      ProductService.getProducts(),
    ])
      .then(([categoriasResponse, productosResponse]) => {
        setCategorias(categoriasResponse.data);
        setProductosDisponibles(productosResponse.data);
      })
      .catch((error) => {
        console.error(
          "Error al cargar datos del formulario:",
          error
        );
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  // Seleccionar o quitar productos
  const manejarSeleccionProductos = (event) => {
    const idsSeleccionados = event.target.value.map(Number);

    setProductosSeleccionados((actuales) =>
      idsSeleccionados.map((id) => {
        const existente = actuales.find(
          (producto) => producto.producto_id === id
        );

        return (
          existente || {
            producto_id: id,
            cantidad: 1,
          }
        );
      })
    );
  };

  // Cambiar cantidad
  const cambiarCantidad = (productoId, cantidad) => {
    setProductosSeleccionados((actuales) =>
      actuales.map((producto) =>
        producto.producto_id === productoId
          ? {
              ...producto,
              cantidad: Math.max(1, Number(cantidad)),
            }
          : producto
      )
    );
  };

  // Enviar formulario
  const manejarSubmit = (event) => {
    event.preventDefault();

    if (productosSeleccionados.length === 0) {
      alert("Debe seleccionar al menos un producto.");
      return;
    }

    const datosCombo = {
      nombre_combo: nombreCombo,
      descripcion: descripcion,
      precio_especial: Number(precioEspecial),
      categoria_id: Number(categoriaId),
      productos: productosSeleccionados,
    };

    onSubmit(datosCombo);
  };

  if (cargando) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          py: 5,
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 850,
        mx: "auto",
        p: {
          xs: 3,
          md: 4,
        },
        borderRadius: 4,
      }}
    >
      <Box
        component="form"
        onSubmit={manejarSubmit}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Nombre */}
        <TextField
          label="Nombre del combo"
          value={nombreCombo}
          onChange={(event) =>
            setNombreCombo(event.target.value)
          }
          required
          fullWidth
        />

        {/* Descripción */}
        <TextField
          label="Descripción"
          value={descripcion}
          onChange={(event) =>
            setDescripcion(event.target.value)
          }
          multiline
          rows={3}
          fullWidth
        />

        {/* Precio */}
        <TextField
          label="Precio especial"
          type="number"
          value={precioEspecial}
          onChange={(event) =>
            setPrecioEspecial(event.target.value)
          }
          inputProps={{
            min: 0,
          }}
          required
          fullWidth
        />

        {/* Categoría */}
        <FormControl fullWidth required>
          <InputLabel id="categoria-label">
            Categoría
          </InputLabel>

          <Select
            labelId="categoria-label"
            value={categoriaId}
            label="Categoría"
            onChange={(event) =>
              setCategoriaId(event.target.value)
            }
          >
            {categorias.map((categoria) => (
              <MenuItem
                key={categoria.id_categoria}
                value={categoria.id_categoria}
              >
                {categoria.nombre_categoria}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Selección de productos */}
        <FormControl fullWidth>
          <InputLabel id="productos-label">
            Productos incluidos
          </InputLabel>

          <Select
            labelId="productos-label"
            multiple
            value={productosSeleccionados.map(
              (producto) => producto.producto_id
            )}
            onChange={manejarSeleccionProductos}
            label="Productos incluidos"
            renderValue={(seleccionados) => (
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 0.5,
                }}
              >
                {seleccionados.map((id) => {
                  const producto =
                    productosDisponibles.find(
                      (item) =>
                        Number(item.id_producto) === Number(id)
                    );

                  return (
                    <Chip
                      key={id}
                      label={
                        producto?.nombre_producto ||
                        `Producto ${id}`
                      }
                      size="small"
                    />
                  );
                })}
              </Box>
            )}
          >
            {productosDisponibles.map((producto) => {
              const seleccionado =
                productosSeleccionados.some(
                  (item) =>
                    item.producto_id ===
                    Number(producto.id_producto)
                );

              return (
                <MenuItem
                  key={producto.id_producto}
                  value={Number(producto.id_producto)}
                >
                  <Checkbox checked={seleccionado} />

                  <ListItemText
                    primary={producto.nombre_producto}
                  />
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        {/* Cantidades */}
        {productosSeleccionados.length > 0 && (
          <Box>
            <Typography
              variant="h6"
              fontWeight={600}
              sx={{ mb: 2 }}
            >
              Cantidad de productos
            </Typography>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              {productosSeleccionados.map(
                (productoSeleccionado) => {
                  const producto =
                    productosDisponibles.find(
                      (item) =>
                        Number(item.id_producto) ===
                        productoSeleccionado.producto_id
                    );

                  return (
                    <Box
                      key={
                        productoSeleccionado.producto_id
                      }
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: 2,
                        p: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                        }}
                      >
                        {producto?.imagen && (
                          <Box
                            component="img"
                            src={`/images/${producto.imagen}`}
                            alt={producto.nombre_producto}
                            sx={{
                              width: 55,
                              height: 55,
                              objectFit: "cover",
                              borderRadius: 2,
                            }}
                          />
                        )}

                        <Typography fontWeight={600}>
                          {producto?.nombre_producto ||
                            "Producto"}
                        </Typography>
                      </Box>

                      <TextField
                        label="Cantidad"
                        type="number"
                        size="small"
                        value={
                          productoSeleccionado.cantidad
                        }
                        onChange={(event) =>
                          cambiarCantidad(
                            productoSeleccionado.producto_id,
                            event.target.value
                          )
                        }
                        inputProps={{
                          min: 1,
                        }}
                        sx={{
                          width: 120,
                        }}
                      />
                    </Box>
                  );
                }
              )}
            </Box>
          </Box>
        )}

        {/* Botón guardar */}
        <Button
          type="submit"
          variant="contained"
          startIcon={<SaveIcon />}
          disabled={guardando}
          sx={{
            mt: 1,
            py: 1.3,
            backgroundColor: "#9b1209",
            textTransform: "none",
            fontWeight: 600,
            fontSize: "1rem",

            "&:hover": {
              backgroundColor: "#7d0e07",
            },
          }}
        >
          {guardando ? "Guardando..." : textoBoton}
        </Button>
      </Box>
    </Paper>
  );
}