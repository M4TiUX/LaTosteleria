<?php

class menu
{
    public function index()
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();
            $result = $menuM->all();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function get($id)
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();
            $result = $menuM->get($id);
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function available()
    {
        try {
            $response = new Response();
            $menuM = new MenuModel();
            $result = $menuM->available();
            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $menuM = new MenuModel();
            $result = $menuM->create($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }

    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();

            $inputJSON = $request->getJSON();

            $menuM = new MenuModel();
            $result = $menuM->update($inputJSON);

            $response->toJSON($result);
        } catch (Exception $e) {
            handleException($e);
        }
    }
}
