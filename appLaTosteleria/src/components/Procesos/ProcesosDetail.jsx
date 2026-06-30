import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ProcesoServices from "../../services/ProcesosServices";
import { Card, CardContent, Typography, Button } from "@mui/material";

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

  if (loading) return <p className="text-center mt-10">Cargando detalle...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Button
        component={Link}
        to="/procesos"
        variant="text"
        className="text-amber-600 hover:underline text-sm mb-4 inline-block"
        style={{ textTransform: 'none', padding: 0 }}
      >
       Volver a procesos
      </Button>

      <Typography variant="h4" component="h1" className="font-bold mb-1 text-2xl">
        {proceso.nombre_producto}
      </Typography>
      
      <Typography variant="body2" className="text-gray-500 mb-6">
        {proceso.estaciones.length}{" "}
        {proceso.estaciones.length === 1 ? "estación" : "estaciones"} en este proceso
      </Typography>

      <ol className="space-y-3">
        {proceso.estaciones.map((estacion) => (
          <Card 
            key={estacion.id_estacion} 
            component="li" 
            variant="outlined"
            className=" shadow rounded-xl border border-gray-100"
          >
            <CardContent className="flex items-center gap-4 p-4" style={{ paddingBottom: '16px' }}>
              <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm shrink-0">
                {estacion.orden_paso}
              </span>
              <div>
                <Typography variant="subtitle1" component="p" className="font-medium">
                  {estacion.nombre_estacion}
                </Typography>
                <Typography variant="caption" component="p" className="text-gray-400">
                  {estacion.tiempo_estimado_minutos} min
                </Typography>
              </div>
            </CardContent>.
          </Card>
        ))}
      </ol>
    </div>
  );
}