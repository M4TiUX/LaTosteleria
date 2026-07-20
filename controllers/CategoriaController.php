<?php

class categoria
{
    public function index()
    {
        try {
            $response = new Response();
            $categoriaModel = new CategoriaModel();

            $result = $categoriaModel->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $categoriaModel = new CategoriaModel();

            $result = $categoriaModel->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}