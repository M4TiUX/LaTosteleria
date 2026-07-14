import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import MenuService from "../../services/MenuService";
import { formatMenuDate, formatMenuTime, isMenuAvailable } from "./menuUtils";

function MenuItemCard({ item }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: 3,
        boxShadow: 2,
        backgroundColor: "#fff",
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
            ₡{" "}
            {new Intl.NumberFormat("es-CR", {
              maximumFractionDigits: 0,
            }).format(item.precio)}
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

MenuItemCard.propTypes = {
  item: PropTypes.shape({
    nombre: PropTypes.string,
    descripcion: PropTypes.string,
    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

CategoryBlock.propTypes = {
  category: PropTypes.shape({
    categoria_nombre: PropTypes.string,
    productos: PropTypes.array,
    combos: PropTypes.array,
  }).isRequired,
};

export function AvailableMenu() {
  const [menus, setMenus] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(null);
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

  const availableMenus = useMemo(
    () => menus.filter((menu) => isMenuAvailable(menu, now)),
    [menus, now],
  );

  if (!loaded) {
    return <p>Cargando menú disponible...</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (availableMenus.length === 0) {
    return <p>No hay un menú disponible en este momento.</p>;
  }

  return (
    <Box>
      <Typography variant="h3" sx={{ mb: 1, fontWeight: 700 }}>
        Menús disponibles ahora
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        Estos menús están disponibles según la hora y fecha actual del navegador.
      </Typography>

      {availableMenus.map((menu) => (
        <Box key={menu.id_menu} sx={{ mb: 4 }}>
          <Typography variant="h4" sx={{ mb: 1, fontWeight: 700 }}>
            {menu.nombre_menu}
          </Typography>
          <Chip label="Disponible ahora" color="success" sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            Disponible del {formatMenuDate(menu.fecha_inicio)} {formatMenuTime(menu.hora_inicio)} al {formatMenuDate(menu.fecha_fin)} {formatMenuTime(menu.hora_fin)}.
          </Typography>

          {menu.categorias?.map((category) => (
            <CategoryBlock key={category.categoria_nombre} category={category} />
          ))}
        </Box>
      ))}
    </Box>
  );
}
