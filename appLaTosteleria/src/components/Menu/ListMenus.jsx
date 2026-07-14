import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from '@mui/material';
import MenuService from '../../services/MenuService';
import { formatMenuDate, formatMenuTime, isMenuAvailable } from './menuUtils';

export function ListMenus() {
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState(false);
  const [now, setNow] = useState(() => new Date());

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

  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  const visibleMenus = useMemo(() => {
    if (!showOnlyAvailable) {
      return menus;
    }

    return menus.filter((menu) => isMenuAvailable(menu, now));
  }, [menus, now, showOnlyAvailable]);

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

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          flexWrap: 'wrap',
          mb: 4,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          Consulta los menús disponibles en La Tostelería.
        </Typography>

        <Button
          variant={showOnlyAvailable ? 'contained' : 'outlined'}
          onClick={() => setShowOnlyAvailable((current) => !current)}
        >
          {showOnlyAvailable ? 'Mostrando solo disponibles' : 'Mostrar solo disponibles'}
        </Button>
      </Box>

      <Grid container spacing={3}>
        {visibleMenus.length > 0 ? (
          visibleMenus.map((menu) => (
            <Grid item xs={12} md={6} lg={4} key={menu.id_menu}>
              <Card
                sx={{
                  height: '100%',
                  borderRadius: '8px',
                  boxShadow: 4,
                  background: 'linear-gradient(180deg, #fffdf8 0%, #fff7ea 100%)'
                }}
              >
                <CardContent>
                  <Stack spacing={1.5}>
                    <Typography variant="h5" fontWeight={700}>
                      {menu.nombre_menu}
                    </Typography>
                    <Chip
                      label={isMenuAvailable(menu, now) ? 'Disponible ahora' : 'Fuera de horario'}
                      color={isMenuAvailable(menu, now) ? 'success' : 'default'}
                      size="small"
                      sx={{ alignSelf: 'flex-start' }}
                    />
                    <Typography variant="body2" color="text.secondary">
                      Inicio: {formatMenuDate(menu.fecha_inicio)} {formatMenuTime(menu.hora_inicio)}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fin: {formatMenuDate(menu.fecha_fin)} {formatMenuTime(menu.hora_fin)}
                    </Typography>
                  </Stack>
                  <Button
                    component={Link}
                    to={`/menu/${menu.id_menu}`}
                    variant="contained"
                    fullWidth
                    sx={{ mt: 3, borderRadius: '8px' }}
                  >
                    Ver menú
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" color="text.secondary" align="center" sx={{ py: 4 }}>
              No hay menús disponibles en este momento.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
