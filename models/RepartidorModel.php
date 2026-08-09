<?php
class RepartidorModel {
    private $db;

    public function __construct() {
        // Ajusta la conexión según tu configuración
        $this->db = new PDO('mysql:host=localhost;dbname=latosteleria', 'root', '');
        $this->db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * Obtiene la ubicación actual de un repartidor
     */
    public function getUbicacion($idRepartidor) {
        $stmt = $this->db->prepare("SELECT latitud, longitud FROM repartidores WHERE id_repartidor = ?");
        $stmt->execute([$idRepartidor]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Actualiza la ubicación de un repartidor
     */
    public function actualizarUbicacion($idRepartidor, $latitud, $longitud) {
        $stmt = $this->db->prepare("UPDATE repartidores SET latitud = ?, longitud = ?, ultima_actualizacion = NOW() WHERE id_repartidor = ?");
        return $stmt->execute([$latitud, $longitud, $idRepartidor]);
    }

    /**
     * Obtiene todos los repartidores (para asignación)
     */
    public function getAll() {
        $stmt = $this->db->query("SELECT * FROM repartidores");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }
}