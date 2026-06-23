import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Box, Button, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import MenuService from '../../services/MenuService';

export function ListMenus() {
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    MenuService.getMenus()
      .then((response) => {
        setMenus(response.data ?? []);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return <p>Cargando menús...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Menús registrados
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Consulta los menús disponibles en La Tostelería.
      </Typography>

      <Grid container spacing={3}>
        {menus.map((menu) => (
          <Grid item xs={12} md={6} lg={4} key={menu.id_menu}>
            <Card
              sx={{
                height: '100%',
                borderRadius: 4,
                boxShadow: 4,
                background: 'linear-gradient(180deg, #fffdf8 0%, #fff7ea 100%)'
              }}
            >
              <CardContent>
                <Stack spacing={1.5}>
                  <Typography variant="h5" fontWeight={700}>
                    {menu.nombre_menu}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Inicio: {menu.fecha_inicio} {menu.hora_inicio}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Fin: {menu.fecha_fin} {menu.hora_fin}
                  </Typography>
                </Stack>
                <Button
                  component={Link}
                  to={`/menu/${menu.id_menu}`}
                  variant="contained"
                  fullWidth
                  sx={{ mt: 3 }}
                >
                  Ver menú
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
