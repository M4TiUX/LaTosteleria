import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MenuService from "../../services/MenuService";

export function DetailMenu() {
  const { id } = useParams();
  const [menu, setMenu] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    MenuService.getMenuById(id)
      .then((response) => {
        setMenu(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, [id]);

  if (!loaded) {
    return <p>Cargando menú...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!menu) {
    return <p>No se encontró el menú solicitado.</p>;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        {menu.nombre_menu}
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 1 }}>
        Disponibilidad: {menu.fecha_inicio} {menu.hora_inicio} a{" "}
        {menu.fecha_fin} {menu.hora_fin}
      </Typography>
      <Typography variant="body2" sx={{ mb: 3 }}>
        {menu.activo ? "Menú activo" : "Menú inactivo"}
      </Typography>

      {menu.categorias?.map((category) => (
        <Box key={category.categoria_nombre} sx={{ mb: 4 }}>
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            {category.categoria_nombre}
          </Typography>

          {category.productos?.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Productos
              </Typography>
              <Grid
                container
                spacing={2}
                sx={{ mb: category.combos?.length > 0 ? 3 : 0 }}
              >
                {category.productos.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={`producto-${item.id}`}>
                    <Card sx={{ borderRadius: 3, boxShadow: 2 }}>
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {item.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.descripcion}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="primary"
                          >
                            ₡{" "}
                            {new Intl.NumberFormat("es-CR", {
                              maximumFractionDigits: 0,
                            }).format(item.precio)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}

          {category.combos?.length > 0 && (
            <>
              <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
                Combos
              </Typography>
              <Grid container spacing={2}>
                {category.combos.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={`combo-${item.id}`}>
                    <Card
                      sx={{
                        borderRadius: 3,
                        boxShadow: 2,
                        backgroundColor: "#fff8ef",
                      }}
                    >
                      <CardContent>
                        <Stack spacing={1}>
                          <Typography variant="subtitle1" fontWeight={700}>
                            {item.nombre}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.descripcion}
                          </Typography>
                          <Typography
                            variant="subtitle2"
                            fontWeight={700}
                            color="primary"
                          >
                            ₡{" "}
                            {new Intl.NumberFormat("es-CR", {
                              maximumFractionDigits: 0,
                            }).format(item.precio)}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Box>
      ))}

      <Button component={Link} to="/menu" variant="contained" sx={{ mt: 2 }}>
        Volver al listado
      </Button>
    </Box>
  );
}
