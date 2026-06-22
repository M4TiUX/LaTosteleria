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

      <Card sx={{ maxWidth: 700 }}>
        <CardContent>
          <Typography variant="h4">{combo.nombre_combo}</Typography>

          <Typography sx={{ mt: 2 }}>{combo.descripcion}</Typography>

          <Typography sx={{ mt: 2 }}>
            Categoría: {combo.nombre_categoria}
          </Typography>

          <Typography variant="h5" color="primary" sx={{ mt: 2 }}>
            ₡ {combo.precio_especial}
          </Typography>

          <Typography variant="h6" sx={{ mt: 3 }}>
            Productos incluidos:
          </Typography>

          {combo.productos?.map((producto) => (
            <Typography key={producto.id_producto} sx={{ mt: 1 }}>
              - {producto.nombre_producto} x{producto.cantidad}
            </Typography>
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