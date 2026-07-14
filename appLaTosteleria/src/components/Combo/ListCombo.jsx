import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
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

export function ListCombo() {
  const [combos, setCombos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    ComboService.getCombos()
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCombos(response.data);
        } else if (response.data && Array.isArray(response.data.data)) {
          setCombos(response.data.data);
        } else if (response.data && Array.isArray(response.data.combos)) {
          setCombos(response.data.combos);
        } else {
          setCombos([]);
          setError("La API no devolvió una lista válida de combos.");
        }
      })
      .catch((error) => {
        console.error("Error al cargar los combos:", error);
        setError("No fue posible cargar los combos.");
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
          Cargando combos...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 3 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 2 }}>
      <Box sx={{ mb: 3 }}>
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
            Combos
          </Typography>
        </Stack>

        <Typography color="text.secondary" sx={{ mt: 1 }}>
          Conozca los combos disponibles en La Tostelería.
        </Typography>
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
                    {combo.descripcion || "Combo sin descripción."}
                  </Typography>

                  {combo.nombre_categoria && (
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Categoría:{" "}
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
                      Precio especial
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
                    Ver detalle
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
            No hay combos disponibles en este momento.
          </Typography>
        </Box>
      )}
    </Box>
  );
}