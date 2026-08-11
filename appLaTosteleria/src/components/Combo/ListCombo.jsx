import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ComboService from "../../services/ComboService";

import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import RestaurantMenuOutlinedIcon from "@mui/icons-material/RestaurantMenuOutlined";
import SettingsIcon from "@mui/icons-material/Settings";

export function ListCombo() {
  const { t } = useTranslation();

  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ComboService.getCombos()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCombos(
            response.data.filter((combo) => Number(combo.activo) === 1),
          );
        } else if (response.data && Array.isArray(response.data.data)) {
          setCombos(
            response.data.data.filter((combo) => Number(combo.activo) === 1),
          );
        } else if (response.data && Array.isArray(response.data.combos)) {
          setCombos(
            response.data.combos.filter((combo) => Number(combo.activo) === 1),
          );
        } else {
          setCombos([]);
          setError("invalidResponse");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los combos:", error);
        setError("loadError");
      })
      .finally(() => {
        setCargando(false);
      });
  }, []);

  const formatearPrecio = (precio) => {
    return new Intl.NumberFormat("es-CR", {
      style: "currency",
      currency: "CRC",
      maximumFractionDigits: 0,
    }).format(Number(precio));
  };

  if (cargando) {
    return (
      <Box
        sx={{
          minHeight: 250,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          gap: 1.5,
        }}
      >
        <CircularProgress size={34} />

        <Typography variant="body2" color="text.secondary">
          {t("combos.loading")}
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">
          {t(`combos.${error}`)}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Stack direction="row" spacing={1} alignItems="center">
            <RestaurantMenuOutlinedIcon
              color="primary"
              sx={{
                fontSize: {
                  xs: 28,
                  md: 34,
                },
              }}
            />

            <Typography variant="h4" component="h1" fontWeight="bold">
              {t("combos.title")}
            </Typography>
          </Stack>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            {t("combos.subtitle")}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/combo-table"
          variant="contained"
          startIcon={<SettingsIcon />}
          sx={{
            px: 3,
            py: 1.2,
            borderRadius: 2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {t("combos.maintenanceButton")}
        </Button>
      </Box>

      {combos.length > 0 ? (
        <Grid container spacing={3}>
          {combos.map((combo) => (
            <Grid item xs={12} sm={6} md={4} key={combo.id_combo}>
              <Card
                sx={{
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: 2,
                  boxShadow: 3,
                  transition: "0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: 8,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    component="h2"
                    fontWeight="bold"
                    sx={{
                      fontSize: "1.15rem",
                      mb: 0.75,
                    }}
                  >
                    {combo.nombre_combo}
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
                      lineHeight: 1.45,
                      fontSize: "0.88rem",
                    }}
                  >
                    {combo.descripcion || t("combos.noDescription")}
                  </Typography>

                  {combo.nombre_categoria && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      {t("combos.category")}:{" "}
                      <strong>{combo.nombre_categoria}</strong>
                    </Typography>
                  )}

                  <Box sx={{ mt: 2 }}>
                    <Typography
                      variant="caption"
                      color="text.secondary"
                      sx={{
                        display: "block",
                        mb: 0.25,
                      }}
                    >
                      {t("combos.specialPrice")}
                    </Typography>

                    <Typography
                      variant="h5"
                      color="success.main"
                      fontWeight="bold"
                      sx={{
                        fontSize: "1.55rem",
                      }}
                    >
                      {formatearPrecio(combo.precio_especial)}
                    </Typography>
                  </Box>
                </CardContent>

                <CardActions
                  sx={{
                    px: 2,
                    pb: 2,
                    pt: 0,
                  }}
                >
                  <Button
                    component={Link}
                    to={`/combo/${combo.id_combo}`}
                    variant="contained"
                    fullWidth
                    endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                    sx={{
                      py: 0.8,
                      borderRadius: 2,
                      textTransform: "none",
                      fontWeight: "bold",
                      fontSize: "0.88rem",
                    }}
                  >
                    {t("combos.viewDetail")}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box
          sx={{
            minHeight: 220,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography variant="body1" color="text.secondary">
            {t("combos.noAvailable")}
          </Typography>
        </Box>
      )}
    </Box>
  );
}