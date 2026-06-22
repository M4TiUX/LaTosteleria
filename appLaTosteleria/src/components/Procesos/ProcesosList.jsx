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
  if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Typography variant="h4" component="h1" className="text-2xl font-bold mb-6">
        Procesos de Preparación
      </Typography>

      <ul className="space-y-4">
        {procesos.map((proceso) => (
          <Card 
            key={proceso.id_producto} 
            component="li" 
            variant="outlined"
            className="bg-white shadow rounded-xl border border-gray-100"
          >
            <CardContent style={{ paddingBottom: '16px' }}>
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item>
                  <Typography variant="h6" component="p" className="font-semibold text-lg leading-tight">
                    {proceso.nombre_producto}
                  </Typography>
                  <Typography variant="body2" className="text-sm text-gray-500 mt-1">
                    {proceso.total_estaciones}{" "}
                    {proceso.total_estaciones == 1 ? "estación" : "estaciones"}
                  </Typography>
                </Grid>
                
                <Grid item>
                  <Button
                    component={Link}
                    to={`/procesos/${proceso.id_producto}`}
                    variant="contained"
                    style={{ backgroundColor: '#f59e0b', color: '#fff', textTransform: 'none' }}
                  >
                    Ver detalle →
                  </Button>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        ))}
      </ul>
    </div>
  );
}