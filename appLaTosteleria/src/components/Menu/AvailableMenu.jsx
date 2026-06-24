import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Chip, Grid, Stack, Typography } from '@mui/material';
import MenuService from '../../services/MenuService';

function MenuItemCard({ item }) {
  return (
    <Card
      sx={{
        height: '100%',
        borderRadius: 3,
        boxShadow: 2,
        backgroundColor: '#fff'
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
          <Typography variant="subtitle2" fontWeight={700} color="primary">
            ₡ {new Intl.NumberFormat('es-CR', { maximumFractionDigits: 0 }).format(item.precio)}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CategoryBlock({ category }) {
  const productos = category.productos ?? [];
  const combos = category.combos ?? [];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {category.categoria_nombre}
      </Typography>

      {productos.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Productos
          </Typography>
          <Grid container spacing={2} sx={{ mb: combos.length > 0 ? 3 : 0 }}>
            {productos.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={`producto-${item.id}`}>
                <MenuItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {combos.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            Combos
          </Typography>
          <Grid container spacing={2}>
            {combos.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={`combo-${item.id}`}>
                <MenuItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Box>
  );
}

export function AvailableMenu() {
  const [menu, setMenu] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    MenuService.getAvailableMenu()
      .then((response) => {
        setMenu(response.data);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return <p>Cargando menú disponible...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!menu) {
    return <p>No hay un menú disponible en este momento.</p>;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        {menu.nombre_menu}
      </Typography>
      <Chip
        label={menu.activo ? 'Disponible ahora' : 'No disponible'}
        color={menu.activo ? 'success' : 'default'}
        sx={{ mb: 2 }}
      />
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Disponible del {menu.fecha_inicio} al {menu.fecha_fin} de {menu.hora_inicio} a {menu.hora_fin}.
      </Typography>

      {menu.categorias?.map((category) => (
        <CategoryBlock key={category.categoria_nombre} category={category} />
      ))}
    </Box>
  );
}
