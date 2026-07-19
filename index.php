<?php
// Composer autoloader
require_once 'vendor/autoload.php';

/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";

/***--- Agregar todos los modelos*/
require_once "models/RolModel.php";
require_once "models/UserModel.php";
require_once "models/ImageModel.php";
require_once "models/ProductoModel.php";
require_once "models/ComboModel.php";
require_once "models/ProcesoPreparacionModel.php";
require_once "models/MenuModel.php";
require_once "models/CategoriaModel.php";
require_once "models/IngredienteModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/UserController.php";
require_once "controllers/ImageController.php";
require_once "controllers/ProductoController.php";
require_once "controllers/ComboController.php";
require_once "controllers/ProcesoPreparacionController.php";
require_once "controllers/MenuController.php";
require_once "controllers/SeguimientoPedidoController.php";
require_once "controllers/CategoriaController.php";
require_once "controllers/IngredienteController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();