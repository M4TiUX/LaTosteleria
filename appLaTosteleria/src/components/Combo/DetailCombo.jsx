import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ComboService from "../../services/ComboService";
import { Card, CardContent, Typography, Button } from "@mui/material";

export function DetailCombo() {
  const { id } = useParams();
  const [combo, setCombo] = useState(null);

  useEffect(() => {
    ComboService.getComboById(id)
      .then((response) => setCombo(response.data))
      .catch((error) => console.log(error));
  }, [id]);

  if (!combo) return <p>Cargando combo...</p>;

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Detalle del Combo
      </Typography>

      <Card
        sx={{
          maxWidth: 700,
          margin: "auto",
          borderRadius: 4,
          boxShadow: 6,
        }}
      >
        <CardContent>
          <Typography variant="h4" fontWeight="bold">
            {combo.nombre_combo}
          </Typography>

          <Typography sx={{ mt: 2 }}>{combo.descripcion}</Typography>

          <Typography sx={{ mt: 2 }}>
            Categoría: <strong>{combo.nombre_categoria}</strong>
          </Typography>

          <Typography
            variant="h5"
            color="primary"
            fontWeight="bold"
            sx={{ mt: 2 }}
          >
            ₡ {new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(combo.precio_especial)}
          </Typography>

          <Typography
            variant="h6"
            sx={{
              mt: 4,
              mb: 2,
              fontWeight: "bold",
            }}
          >
            Productos incluidos
          </Typography>

          {combo.productos?.map((producto) => (
            <Card
              key={producto.id_producto}
              sx={{
                mb: 2,
                backgroundColor: "#f8f9fa",
              }}
            >
              <CardContent>
                <Typography variant="subtitle1">
                  {producto.nombre_producto}
                </Typography>

                <Typography color="text.secondary">
                  Cantidad: {producto.cantidad}
                </Typography>
              </CardContent>
            </Card>
          ))}

          <Button
            component={Link}
            to="/combo"
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
