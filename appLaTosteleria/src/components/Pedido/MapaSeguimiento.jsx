// src/components/MapaSeguimiento.jsx

import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Solución para los iconos de Leaflet en Vite/Webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapaSeguimiento = ({ idPedido }) => {
  const [ubicacion, setUbicacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [historial, setHistorial] = useState([]);
  const mapRef = useRef(null);

  // Función para obtener la ubicación del repartidor desde el backend
  const obtenerUbicacion = async () => {
    try {
      const response = await fetch(`/api/pedido/${idPedido}/repartidor/ubicacion`);
      if (!response.ok) {
        throw new Error('Error al obtener la ubicación');
      }
      const data = await response.json();
      if (data.latitud && data.longitud) {
        const nuevaPos = [data.latitud, data.longitud];
        setUbicacion(nuevaPos);
        setHistorial(prev => [...prev, nuevaPos]); // Guardar historial
        setError(null);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('No se pudo obtener la ubicación del repartidor');
    } finally {
      setCargando(false);
    }
  };

  // Efecto para obtener la ubicación inicial y luego cada 3 segundos
  useEffect(() => {
    obtenerUbicacion();
    const interval = setInterval(obtenerUbicacion, 3000); // 3 segundos

    return () => clearInterval(interval);
  }, [idPedido]);

  // Centrar el mapa en la nueva ubicación cuando cambie
  useEffect(() => {
    if (ubicacion && mapRef.current) {
      mapRef.current.flyTo(ubicacion, 16);
    }
  }, [ubicacion]);

  if (cargando) {
    return <div className="text-center py-5">Cargando mapa...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Coordenadas iniciales (si no hay ubicación, usar un punto por defecto)
  const posicionInicial = ubicacion || [4.6097, -74.0817];

  return (
    <div style={{ height: '500px', width: '100%', borderRadius: '12px', overflow: 'hidden' }}>
      <MapContainer
        center={posicionInicial}
        zoom={16}
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />

        {/* Marcador del repartidor */}
        {ubicacion && (
          <Marker position={ubicacion}>
            <Popup>
              <strong>¡Tu pedido está aquí!</strong><br />
              Repartidor en movimiento...
            </Popup>
          </Marker>
        )}

        {/* Polyline: rastro del repartidor (últimos 20 puntos) */}
        {historial.length > 1 && (
          <Polyline
            positions={historial.slice(-20)}
            color="blue"
            weight={3}
            opacity={0.7}
          />
        )}
      </MapContainer>

      {/* Indicador de actualización en tiempo real */}
      <div className="text-muted small mt-2 text-center">
        <i className="bi bi-circle-fill text-success me-1"></i>
        Actualizando ubicación en vivo...
      </div>
    </div>
  );
};

export default MapaSeguimiento;