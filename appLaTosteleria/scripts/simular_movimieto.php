<?php
// scripts/simular_movimiento.php

// Configuración de la ruta (coordenadas de ejemplo, ajusta a tu ciudad)
$ruta = [
    ['lat' => 4.6097, 'lng' => -74.0817], // Punto A
    ['lat' => 4.6105, 'lng' => -74.0825], // Punto B
    ['lat' => 4.6110, 'lng' => -74.0830], // Punto C
    ['lat' => 4.6120, 'lng' => -74.0820], // Punto D
    ['lat' => 4.6130, 'lng' => -74.0810], // Punto E
    ['lat' => 4.6140, 'lng' => -74.0800], // Punto F (destino)
];

// ID del repartidor a simular (por defecto 1)
$idRepartidor = 1;
$paso = 0;
$totalPasos = count($ruta) - 1;

// Función para actualizar la ubicación
function actualizarUbicacion($id, $lat, $lng) {
    $url = 'http://localhost/tu-proyecto/api/repartidor/ubicacion'; // Cambia la URL
    $data = json_encode(['latitud' => $lat, 'longitud' => $lng]);

    $ch = curl_init($url);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $response = curl_exec($ch);
    curl_close($ch);

    echo "Ubicación actualizada: lat=$lat, lng=$lng\n";
}

// Bucle infinito de simulación
while (true) {
    // Obtener la ubicación actual según el paso
    $punto = $ruta[$paso];
    actualizarUbicacion($idRepartidor, $punto['lat'], $punto['lng']);

    // Avanzar al siguiente punto, o reiniciar si llega al final
    $paso++;
    if ($paso > $totalPasos) {
        $paso = 0; // Reinicia la ruta
    }

    // Esperar 3 segundos antes de la siguiente actualización
    sleep(3);
}