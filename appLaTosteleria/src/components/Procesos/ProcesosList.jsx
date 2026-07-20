import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProcesoServices from "../../services/ProcesosServices";
import { Card, CardContent, Typography, Grid, Button } from "@mui/material";

export function ProcesosList() {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    ProcesoServices.getProcesos()
      .then((res) => {
        const data = res.data;
        if (data.status === 200) {
          setProcesos(data.result);
        } else {
          setError(data.result);
        }
        setLoading(false);
      })
      .catch(() => {
        setError("Error al conectar con el servidor");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center mt-10">Cargando procesos...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  // Advertencia (opcional) en consola si hay IDs duplicados
  const ids = procesos.map((p) => p.id_producto);
  const duplicados = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (duplicados.length > 0) {
    console.warn("⚠️ Hay productos con id_producto duplicado:", duplicados);
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Typography
        variant="h4"
        component="h1"
        className="text-2xl font-bold mb-6"
        textAlign="center"
      >
        Procesos de Preparación
      </Typography>

      <Grid container spacing={4}>
        {[...procesos]
          .sort((a, b) => a.id_producto - b.id_producto)
          .map((proceso, index) => (
            <Grid item xs={6} key={`${proceso.id_producto}-${index}`}>
              <Card
                variant="outlined"
                className="bg-white shadow rounded-xl border border-gray-100 h-full"
              >
                <CardContent className="flex flex-col items-center text-center gap-3">
                  <div>
                    <Typography
                      variant="h6"
                      component="p"
                      className="font-semibold text-lg leading-tight"
                    >
                      {proceso.nombre_producto}
                    </Typography>
                    <Typography
                      variant="body2"
                      className="text-sm text-gray-500 mt-1"
                    >
                      {proceso.total_estaciones}{" "}
                      {proceso.total_estaciones == 1
                        ? "estación"
                        : "estaciones"}
                    </Typography>
                  </div>

                  <Button
                    component={Link}
                    to={`/Procesos/${proceso.id_producto}`}
                    variant="contained"
                    fullWidth
                    style={{
                      backgroundColor: "#f59e0b",
                      color: "#fff",
                      textTransform: "none",
                      marginTop: "auto",
                      
                    }}
                    
                  >
                    Ver detalle
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
      </Grid>
    </div>
  );
}
