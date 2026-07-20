<?php

class ingrediente
{
    public function index()
    {
        try {
            $response = new Response();
            $ingredienteModel = new IngredienteModel();

            $result = $ingredienteModel->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $ingredienteModel = new IngredienteModel();

            $result = $ingredienteModel->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}