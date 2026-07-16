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

    // POST crear producto
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $producto = new ProductoModel();

            $result = $producto->create($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT actualizar producto
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $producto = new ProductoModel();

            $result = $producto->update($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
