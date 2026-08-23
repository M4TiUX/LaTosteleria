import { useEffect, useMemo, useState } from "react";

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

import { formatMenuDate, formatMenuTime, isMenuAvailable } from "./menuUtils";

/*
 * Intervalo para volver a evaluar la disponibilidad
 * con la hora del navegador (igual que ListMenus).
 */
const AVAILABILITY_CHECK_INTERVAL_MS = 60000;

export function AvailableMenu() {
  const { t } = useTranslation();

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

  /*
   * Reevalúa periódicamente con la hora del navegador,
   * para no depender del reloj/zona horaria del servidor.
   */
  useEffect(() => {
    const timerId = setInterval(() => {
      setNow(new Date());
    }, AVAILABILITY_CHECK_INTERVAL_MS);

    return () => clearInterval(timerId);
  }, []);

  const availableMenus = useMemo(
    () => menus.filter((menu) => isMenuAvailable(menu, now)),
    [menus, now],
  );

  if (!loaded) {
    return <p>{t("menus.available.loading")}</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (availableMenus.length === 0) {
    return <p>{t("menus.available.noMenu")}</p>;
  }

  return (
    <Box>
      {/* Título de la página */}
      <Typography
        variant="h3"
        sx={{
          mb: 3,
          fontWeight: 700,
        }}
      >
        {t("menus.available.title")}
      </Typography>

      <Grid container spacing={3}>
        {availableMenus.map((menu) => (
          <Grid item xs={12} md={6} lg={4} key={menu.id_menu}>
            <Card
              sx={{
                height: "100%",
                borderRadius: "8px",
                boxShadow: 4,
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
              {/* Imagen del menú */}
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
                <Stack spacing={1.5} sx={{ flexGrow: 1 }}>
                  <Typography variant="h5" fontWeight={700}>
                    {menu.nombre_menu}
                  </Typography>

                  <Chip
                    label={t("menus.available.availableNow")}
                    color="success"
                    size="small"
                    sx={{ alignSelf: "flex-start" }}
                  />

                  <Typography variant="body2" color="text.secondary">
                    {t("menus.available.availability", {
                      startDate: formatMenuDate(menu.fecha_inicio),

                      startTime: formatMenuTime(menu.hora_inicio),

                      endDate: formatMenuDate(menu.fecha_fin),

                      endTime: formatMenuTime(menu.hora_fin),
                    })}
                  </Typography>
                </Stack>

                <Button
                  component={Link}
                  to={`/menu/${menu.id_menu}`}
                  variant="contained"
                  fullWidth
                  sx={{
                    mt: 3,
                    borderRadius: "8px",
                    textTransform: "none",
                    fontWeight: 600,
                  }}
                >
                  {t("menus.available.viewDetail")}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
