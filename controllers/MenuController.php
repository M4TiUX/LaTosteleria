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
}
