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
}