<?php

class DireccionEnvioModel
{
    // Ajusta estas coordenadas a la ubicacion real de la tienda
    private const TIENDA_LAT = 9.928069;
    private const TIENDA_LNG = -84.090725;
    private const TARIFA_BASE = 1000.00;
    private const TARIFA_POR_KM = 300.00;

    public $enlace;

    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all($usuarioId)
    {
        try {
            $usuarioId = (int) $usuarioId;

            $sql = "SELECT id_direccion, usuario_id, detalles, referencias, latitud, longitud, costo_zona
                FROM direcciones_envio
                WHERE usuario_id = $usuarioId
                ORDER BY id_direccion DESC";

            $result = $this->enlace->executeSQL($sql);

            return is_array($result) ? $result : [];
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $id = (int) $id;
            if ($id <= 0) {
                return null;
            }

            $sql = "SELECT id_direccion, usuario_id, detalles, referencias, latitud, longitud, costo_zona
                FROM direcciones_envio
                WHERE id_direccion = $id
                LIMIT 1";

            $result = $this->enlace->executeSQL($sql);

            return (is_array($result) && !empty($result)) ? $result[0] : null;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create($direccion)
    {
        try {
            if (!is_object($direccion)) {
                throw new Exception('Debe enviar la informacion de la direccion en formato JSON.');
            }

            $usuarioId = isset($direccion->usuario_id) ? (int) $direccion->usuario_id : 0;
            $detalles = isset($direccion->detalles) ? trim((string) $direccion->detalles) : '';
            $referencias = isset($direccion->referencias) ? trim((string) $direccion->referencias) : null;
            $latitud = isset($direccion->latitud) ? (float) $direccion->latitud : null;
            $longitud = isset($direccion->longitud) ? (float) $direccion->longitud : null;

            if ($usuarioId <= 0) {
                throw new Exception('Debe indicar el usuario propietario de la direccion.');
            }
            if ($detalles === '') {
                throw new Exception('Debe indicar los detalles de la direccion.');
            }
            if ($latitud === null || $longitud === null) {
                throw new Exception('Debe seleccionar la ubicacion en el mapa.');
            }

            $costoZona = $this->calcularCostoEnvio($latitud, $longitud);

            $detallesSql = $this->escape($detalles);
            $referenciasSql = ($referencias === null || $referencias === '')
                ? 'NULL'
                : "'" . $this->escape($referencias) . "'";

            $sql = "INSERT INTO direcciones_envio
                (usuario_id, detalles, referencias, latitud, longitud, costo_zona)
                VALUES
                ($usuarioId, '$detallesSql', $referenciasSql, $latitud, $longitud, $costoZona)";

            $id = $this->enlace->executeSQL_DML_last($sql);

            if ($id <= 0) {
                throw new Exception('No fue posible registrar la direccion.');
            }

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update($id, $direccion)
    {
        try {
            $id = (int) $id;
            if ($id <= 0) {
                throw new Exception('Direccion invalida.');
            }

            $existente = $this->get($id);
            if ($existente === null) {
                throw new Exception('La direccion no existe.');
            }

            $detalles = isset($direccion->detalles) ? trim((string) $direccion->detalles) : $existente->detalles;
            $referencias = isset($direccion->referencias) ? trim((string) $direccion->referencias) : $existente->referencias;
            $latitud = isset($direccion->latitud) ? (float) $direccion->latitud : (float) $existente->latitud;
            $longitud = isset($direccion->longitud) ? (float) $direccion->longitud : (float) $existente->longitud;

            $costoZona = $this->calcularCostoEnvio($latitud, $longitud);

            $detallesSql = $this->escape($detalles);
            $referenciasSql = ($referencias === null || $referencias === '')
                ? 'NULL'
                : "'" . $this->escape($referencias) . "'";

            $sql = "UPDATE direcciones_envio SET
                detalles = '$detallesSql',
                referencias = $referenciasSql,
                latitud = $latitud,
                longitud = $longitud,
                costo_zona = $costoZona
                WHERE id_direccion = $id";

            $this->enlace->executeSQL_DML($sql);

            return $this->get($id);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function delete($id)
    {
        try {
            $id = (int) $id;
            if ($id <= 0) {
                throw new Exception('Direccion invalida.');
            }

            $sql = "DELETE FROM direcciones_envio WHERE id_direccion = $id";
            $this->enlace->executeSQL_DML($sql);

            return true;
        } catch (Exception $e) {
            handleException($e);
        }
    }

    private function calcularCostoEnvio($lat, $lng)
    {
        $distanciaKm = $this->haversine(self::TIENDA_LAT, self::TIENDA_LNG, $lat, $lng);
        $costo = self::TARIFA_BASE + (self::TARIFA_POR_KM * $distanciaKm);

        return round($costo, 2);
    }

    private function haversine($lat1, $lng1, $lat2, $lng2)
    {
        $radioTierraKm = 6371;
        $dLat = deg2rad($lat2 - $lat1);
        $dLng = deg2rad($lng2 - $lng1);

        $a = sin($dLat / 2) * sin($dLat / 2) +
            cos(deg2rad($lat1)) * cos(deg2rad($lat2)) *
            sin($dLng / 2) * sin($dLng / 2);

        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

        return $radioTierraKm * $c;
    }

    private function escape($value)
    {
        return addslashes(trim((string) $value));
    }
}