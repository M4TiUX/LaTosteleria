import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = "http://localhost/apilatosteleria/ProcesoPreparacion";

export default function ProcesosList() {
  const [procesos, setProcesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
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
      <h1 className="text-2xl font-bold mb-6">Procesos de Preparación</h1>

      <ul className="space-y-4">
        {procesos.map((proceso) => (
          <li
            key={proceso.id_producto}
            className="flex items-center justify-between bg-white shadow rounded-xl p-4 border border-gray-100"
          >
            <div>
              <p className="font-semibold text-lg">{proceso.nombre_producto}</p>
              <p className="text-sm text-gray-500">
                {proceso.total_estaciones}{" "}
                {proceso.total_estaciones == 1 ? "estación" : "estaciones"}
              </p>
            </div>
            <Link
              to={`/procesos/${proceso.id_producto}`}
              className="bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition"
            >
              Ver detalle →
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}