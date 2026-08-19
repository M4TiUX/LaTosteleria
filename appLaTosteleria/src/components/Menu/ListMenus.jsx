import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import MenuService from "../../services/MenuService";
import { formatMenuDate, formatMenuTime, isMenuAvailable } from "./menuUtils";

export function ListMenus() {
  const { t } = useTranslation();

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

  /*
   * Actualiza la hora cada minuto
   * para determinar correctamente
   * si un menú está disponible.
   */
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, 60000);

    return () => clearInterval(timerId);
  }, []);

  const visibleMenus = useMemo(() => {
    /*
     * Los menús inactivos nunca deben mostrarse
     * en el catálogo público.
     */
    const menusActivos = menus.filter((menu) => Number(menu.activo) === 1);

    if (!showOnlyAvailable) {
      return menusActivos;
    }

    return menusActivos.filter((menu) => isMenuAvailable(menu, now));
  }, [menus, now, showOnlyAvailable]);

  if (!loaded) {
    return <p>{t("menus.list.loading")}</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  return (
    <Box>
      {/* Encabezado */}
      <Stack
        direction={{
          xs: "column",
          md: "row",
        }}
        alignItems={{
          xs: "flex-start",
          md: "center",
        }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography
            variant="h3"
            sx={{
              mb: 1,
              fontWeight: 700,
            }}
          >
            {t("menus.list.title")}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            {t("menus.list.description")}
          </Typography>
        </Box>
      </Stack>

      {/* Filtro */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
          flexWrap: "wrap",
          mb: 4,
        }}
      >
        <Typography variant="body1" color="text.secondary">
          {t("menus.list.availableDescription")}
        </Typography>

        <Button
          variant={showOnlyAvailable ? "contained" : "outlined"}
          onClick={() => setShowOnlyAvailable((current) => !current)}
          sx={{
            textTransform: "none",
          }}
        >
          {showOnlyAvailable
            ? t("menus.list.showingAvailable")
            : t("menus.list.showAvailable")}
        </Button>
      </Box>

      {/* Menús */}
      <Grid container spacing={3}>
        {visibleMenus.length > 0 ? (
          visibleMenus.map((menu) => {
            const disponible = isMenuAvailable(menu, now);

            return (
              <Grid item xs={12} md={6} lg={4} key={menu.id_menu}>
                <Card
                  sx={{
                    height: "100%",

                    borderRadius: "8px",

                    boxShadow: 4,

                    background:
                      "linear-gradient(180deg, #fffdf8 0%, #fff7ea 100%)",

                    overflow: "hidden",

                    display: "flex",

                    flexDirection: "column",

                    transition: "0.25s",

                    "&:hover": {
                      transform: "translateY(-4px)",

                      boxShadow: 7,
                    },
                  }}
                >
                  {/* Imagen */}
                  {menu.imagen ? (
                    <CardMedia
                      component="img"
                      height="220"
                      image={`/images/${menu.imagen}`}
                      alt={menu.nombre_menu}
                      sx={{
                        objectFit: "cover",
                      }}
                    />
                  ) : (
                    /*
                     * Los menús antiguos
                     * pueden tener imagen
                     * NULL.
                     */
                    <Box
                      sx={{
                        height: 220,

                        bgcolor: "action.hover",

                        display: "flex",

                        justifyContent: "center",

                        alignItems: "center",
                      }}
                    >
                      <RestaurantMenuOutlinedIcon
                        sx={{
                          fontSize: 75,

                          color: "text.disabled",
                        }}
                      />
                    </Box>
                  )}

                  <CardContent
                    sx={{
                      flexGrow: 1,

                      display: "flex",

                      flexDirection: "column",
                    }}
                  >
                    <Stack
                      spacing={1.5}
                      sx={{
                        flexGrow: 1,
                      }}
                    >
                      {/* Nombre */}
                      <Typography variant="h5" fontWeight={700}>
                        {menu.nombre_menu}
                      </Typography>

                      {/* Estado */}
                      <Chip
                        label={
                          disponible
                            ? t("menus.status.availableNow")
                            : t("menus.status.unavailable")
                        }
                        color={disponible ? "success" : "default"}
                        size="small"
                        sx={{
                          alignSelf: "flex-start",
                        }}
                      />

                      {/* Inicio */}
                      <Typography variant="body2" color="text.secondary">
                        {t("menus.common.start")}:{" "}
                        {formatMenuDate(menu.fecha_inicio)}{" "}
                        {formatMenuTime(menu.hora_inicio)}
                      </Typography>

                      {/* Fin */}
                      <Typography variant="body2" color="text.secondary">
                        {t("menus.common.end")}:{" "}
                        {formatMenuDate(menu.fecha_fin)}{" "}
                        {formatMenuTime(menu.hora_fin)}
                      </Typography>
                    </Stack>

                    {/* Detalle */}
                    <Stack
                      direction="row"
                      spacing={1.5}
                      sx={{
                        mt: 3,
                      }}
                    >
                      <Button
                        component={Link}
                        to={`/menu/${menu.id_menu}`}
                        variant="contained"
                        fullWidth
                        sx={{
                          borderRadius: "8px",

                          textTransform: "none",

                          fontWeight: 600,
                        }}
                      >
                        {t("menus.list.viewMenu")}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })
        ) : (
          <Grid item xs={12}>
            <Typography
              variant="body1"
              color="text.secondary"
              align="center"
              sx={{ py: 4 }}
            >
              {t("menus.list.noAvailable")}
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
