<?php

class producto
{
    // GET listar productos
    public function index()
    {
        try {
            $response = new Response();

            $productoM = new ProductoModel();

            $result = $productoM->all();

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }

    // GET obtener producto por id
    public function get($id)
    {
        try {

            $response = new Response();

            $producto = new ProductoModel();

            $result = $producto->get($id);

            $response->toJSON($result);

        } catch (Exception $e) {
            handleException($e);
        }
    }
}