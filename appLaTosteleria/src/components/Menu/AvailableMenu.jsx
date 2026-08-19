import { useEffect, useState } from "react";

import PropTypes from "prop-types";

import { useTranslation } from "react-i18next";

import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";

import { Link } from "react-router-dom";

import MenuService from "../../services/MenuService";

import { formatMenuDate, formatMenuTime } from "./menuUtils";

/*
 * Tarjeta para productos y combos
 * incluidos en el menú.
 */
function MenuItemCard({ item }) {
  return (
    <Card
      sx={{
        height: "100%",
        borderRadius: "8px",
        boxShadow: 2,
        backgroundColor: "#fff",
        overflow: "hidden",

        display: "flex",
        flexDirection: "column",

        transition: "0.25s",

        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 5,
        },
      }}
    >
      {/* Imagen del producto/combo */}
      {item.imagen ? (
        <CardMedia
          component="img"
          height="180"
          image={`/images/${item.imagen}`}
          alt={item.nombre}
          sx={{
            objectFit: "cover",
          }}
        />
      ) : (
        <Box
          sx={{
            height: 180,
            bgcolor: "action.hover",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <RestaurantMenuOutlinedIcon
            sx={{
              fontSize: 60,
              color: "text.disabled",
            }}
          />
        </Box>
      )}

      <CardContent
        sx={{
          flexGrow: 1,
        }}
      >
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={700}>
            {item.nombre}
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitBoxOrient: "vertical",
              WebkitLineClamp: 2,
              overflow: "hidden",
              minHeight: 40,
            }}
          >
            {item.descripcion}
          </Typography>

          <Typography variant="subtitle2" fontWeight={700} color="primary">
            ₡{" "}
            {new Intl.NumberFormat("es-CR", {
              maximumFractionDigits: 0,
            }).format(Number(item.precio ?? 0))}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

function CategoryBlock({ category }) {
  const { t } = useTranslation();

  const productos = category.productos ?? [];

  const combos = category.combos ?? [];

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
        {category.categoria_nombre}
      </Typography>

      {/* Productos */}
      {productos.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            {t("menus.common.products")}
          </Typography>

          <Grid
            container
            spacing={2}
            sx={{
              mb: combos.length > 0 ? 3 : 0,
            }}
          >
            {productos.map((item) => (
              <Grid item xs={12} sm={6} md={4} key={`producto-${item.id}`}>
                <MenuItemCard item={item} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Combos */}
      {combos.length > 0 && (
        <>
          <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 1 }}>
            {t("menus.common.combos")}
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
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    nombre: PropTypes.string,

    descripcion: PropTypes.string,

    precio: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

    imagen: PropTypes.string,
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
  const { t } = useTranslation();

  const [menu, setMenu] = useState(null);

  const [loaded, setLoaded] = useState(false);

  const [error, setError] = useState(null);

  useEffect(() => {
    MenuService.getAvailableMenu()
      .then((response) => {
        setMenu(response.data ?? null);

        setLoaded(true);
      })
      .catch((err) => {
        setError(err);
        setLoaded(true);
      });
  }, []);

  if (!loaded) {
    return <p>{t("menus.available.loading")}</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!menu) {
    return <p>{t("menus.available.noMenu")}</p>;
  }

  return (
    <Box>
      {/* Título de la página */}
      <Typography
        variant="h3"
        sx={{
          mb: 1,
          fontWeight: 700,
        }}
      >
        {t("menus.available.title")}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("menus.available.description")}
      </Typography>

      <Box sx={{ mb: 4 }}>
        {/* Nombre del menú */}
        <Typography
          variant="h4"
          sx={{
            mb: 1,
            fontWeight: 700,
          }}
        >
          {menu.nombre_menu}
        </Typography>

        <Chip
          label={t("menus.available.availableNow")}
          color="success"
          sx={{ mb: 2 }}
        />

        {/* Imagen principal del menú */}
        {menu.imagen ? (
          <Box
            component="img"
            src={`/images/${menu.imagen}`}
            alt={menu.nombre_menu}
            sx={{
              width: "100%",
              maxWidth: 900,

              height: {
                xs: 240,
                sm: 360,
                md: 430,
              },

              objectFit: "cover",
              display: "block",
              borderRadius: 3,
              boxShadow: 3,
              mb: 3,
            }}
          />
        ) : (
          /*
           * Fallback para los menús
           * antiguos sin imagen.
           */
          <Box
            sx={{
              width: "100%",
              maxWidth: 900,

              height: {
                xs: 240,
                sm: 360,
                md: 430,
              },

              bgcolor: "action.hover",

              display: "flex",
              justifyContent: "center",
              alignItems: "center",

              borderRadius: 3,
              mb: 3,
            }}
          >
            <RestaurantMenuOutlinedIcon
              sx={{
                fontSize: 100,
                color: "text.disabled",
              }}
            />
          </Box>
        )}

        {/* Vigencia */}
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          {t("menus.available.availability", {
            startDate: formatMenuDate(menu.fecha_inicio),

            startTime: formatMenuTime(menu.hora_inicio),

            endDate: formatMenuDate(menu.fecha_fin),

            endTime: formatMenuTime(menu.hora_fin),
          })}
        </Typography>

        <Button
          component={Link}
          to={`/menu/${menu.id_menu}`}
          variant="outlined"
          sx={{
            mb: 3,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          {t("menus.available.viewDetail")}
        </Button>

        {/* Categorías */}
        {menu.categorias?.map((category) => (
          <CategoryBlock key={category.categoria_nombre} category={category} />
        ))}
      </Box>
    </Box>
  );
}
