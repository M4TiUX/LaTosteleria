import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProcesoServices from "../../services/ProcesosServices";
import { Card, CardContent, Typography, Button, Grid, Box } from "@mui/material";

export function ProcesosDetail() {
  const { id } = useParams();
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ProcesoServices.getProcesoById(id)
      .then((res) => {
        const data = res.data;
        if (data.status === 200) {
          setProceso(data.result);
        } else {
          setError(data.result);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al conectar con el servidor");
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p style={{ textAlign: "center", marginTop: "2.5rem" }}>Cargando detalle...</p>;
  if (error) return <p style={{ textAlign: "center", marginTop: "2.5rem", color: "red" }}>{error}</p>;

  const estacionesOrdenadas = [...(proceso?.estaciones || [])].sort((a, b) => {
    const idA = Number(a?.id_estacion ?? 0);
    const idB = Number(b?.id_estacion ?? 0);
    return idA - idB;
  });

  return (
    <Box sx={{ p: 3 , pt: 2 }}>
      <Button
        component={Link}
        textAlign="top-left"
        to="/procesos"
        variant="text"
        sx={{
          textTransform: "none",
          padding: 0,
          color: "#d97706",
          "&:hover": { textDecoration: "underline", backgroundColor: "primary.light", p: 1 , color: "primary.contrastText" },
        }}
      >
        Volver a procesos
      </Button>

      <Typography variant="h4" component="h1" sx={{ fontWeight: "bold", mb: 1 }}>
        {proceso.nombre_producto}
      </Typography>

      <Typography variant="body2" sx={{ color: "gray.500", mb: 3 }}>
        {proceso.estaciones.length}{" "}
        {proceso.estaciones.length === 1 ? "estación" : "estaciones"} en este proceso
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {estacionesOrdenadas.map((estacion,index) => (
          <Grid item xs={12} sm={6} md={4} key={estacion.id_estacion}>
            <Card
              variant="outlined"
              sx={{
                bgcolor: "white",
                boxShadow: 1,
                borderRadius: 2,
                borderColor: "#f3f4f6",
              }}
            >
              <CardContent sx={{ p: 2 }}>
                <Typography variant="subtitle1" component="p" sx={{ fontWeight: 600, color: "#1f2937" }}>
                  {index + 1}-{estacion.nombre_estacion}
                </Typography>
                <Typography variant="caption" component="p" sx={{ color: "#6b7280", mt: 1 }}>
                  {estacion.tiempo_estimado_minutos} min
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}