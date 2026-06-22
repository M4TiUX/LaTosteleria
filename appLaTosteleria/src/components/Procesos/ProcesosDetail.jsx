import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

const API_BASE = "http://localhost/apilatosteleria/ProcesoPreparacion/show";

export default function ProcesosDetail() {
  const { id } = useParams();
  const [proceso, setProceso] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_BASE}/${id}`)
      .then((res) => res.json())
      .then((data) => {
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
  if (error)   return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Link to="/procesos" className="text-amber-600 hover:underline text-sm mb-4 inline-block">
        ← Volver a procesos
      </Link>

      <h1 className="text-2xl font-bold mb-1">{proceso.nombre_producto}</h1>
      <p className="text-gray-500 mb-6">
        {proceso.estaciones.length}{" "}
        {proceso.estaciones.length === 1 ? "estación" : "estaciones"} en este proceso
      </p>

      <ol className="space-y-3">
        {proceso.estaciones.map((estacion) => (
          <li
            key={estacion.id_estacion}
            className="flex items-center gap-4 bg-white shadow rounded-xl p-4 border border-gray-100"
          >
            <span className="w-8 h-8 flex items-center justify-center rounded-full bg-amber-500 text-white font-bold text-sm shrink-0">
              {estacion.orden_paso}
            </span>
            <div>
              <p className="font-medium">{estacion.nombre_estacion}</p>
              <p className="text-xs text-gray-400">{estacion.tiempo_estimado_minutos} min</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}