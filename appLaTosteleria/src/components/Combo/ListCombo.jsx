import { useEffect, useState } from "react";
import ComboService from "../../services/ComboService";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export function ListCombo() {
  const [data, setData] = useState([]);

  useEffect(() => {
    ComboService.getCombos()
      .then((response) => setData(response.data))
      .catch((error) => console.log(error));
  }, []);

  return (
    <>
      <Typography variant="h3" sx={{ mb: 4 }}>
        Combos
      </Typography>

      <Grid container spacing={3}>
        {data.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id_combo}>
            <Card>
              <CardContent>
                <Typography variant="h5">{item.nombre_combo}</Typography>

                <Typography sx={{ mt: 2 }}>{item.descripcion}</Typography>

                <Typography sx={{ mt: 2 }}>
                  Categoría: {item.nombre_categoria}
                </Typography>

                <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                  ₡ {item.precio_especial}
                </Typography>

                <Button
                  variant="contained"
                  sx={{ mt: 2 }}
                  href={`/combo/${item.id_combo}`}
                >
                  Ver detalle
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
}