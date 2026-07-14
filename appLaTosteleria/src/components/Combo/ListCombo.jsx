import { useEffect, useState } from "react";
import ComboService from "../../services/ComboService";
import { Card, CardContent, Typography, Grid, Button, Box } from "@mui/material";

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
            <Card
              sx={{
                height: "100%",
                borderRadius: 3,
                boxShadow: 3,
                transition: "0.3s",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: 8,
                },
              }}
            >
              <CardContent>
                <Typography variant="h5" fontWeight="bold">
                  {item.nombre_combo}
                </Typography>

                <Typography color="text.secondary" sx={{ mt: 1 }}>
                  {item.descripcion}
                </Typography>

                <Box
                  sx={{
                    mt: 2,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <Typography>
                    Categoría: <strong>{item.nombre_categoria}</strong>
                  </Typography>

                  <Typography
                    variant="h5"
                    color="primary"
                    fontWeight="bold"
                    sx={{ textAlign: "right", whiteSpace: "nowrap" }}
                  >
                    ₡{" "}
                    {new Intl.NumberFormat("es-CR", {
                      maximumFractionDigits: 0,
                    }).format(item.precio_especial)}
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3, borderRadius: 2 }}
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
