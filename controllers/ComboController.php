<?php
class combo
{
    public function index()
    {
        try {
            $response = new Response();

            $comboM = new ComboModel();

            $result = $comboM->all();

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();

            $combo = new ComboModel();

            $result = $combo->get($id);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // POST crear combo
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $combo = new ComboModel();

            $result = $combo->create($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT actualizar combo
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $combo = new ComboModel();

            $result = $combo->update($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    // PUT cambiar estado del combo
    public function changeStatus()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $combo = new ComboModel();

            $result = $combo->changeStatus($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
