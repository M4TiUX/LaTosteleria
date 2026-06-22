<?php

class Response
{
    private $status = 200;

    public function status(int $code)
    {
        $this->status = $code;
        return $this;
    }
    
    public function toJSON($response = [],$message="")
    {
        //Verificar respuesta - permitir null como respuesta válida, pero si es null o un array vacío, solo establecer 400 si hay un mensaje de error
        if ($response !== null || (is_array($response) && !empty($response))) {
            $json = $response;
        } else {
            //solo setear 400 si $response es missing o undefined y no hay mensaje de error
            if (!empty($message)) {
                $this->status = 400;
                $json = $message;
            } else {
                $json = $response; // null o array vacio es vaildo
            }
        }
        //Escribir respuesta JSON con código de estado HTTP
        echo json_encode(
            $json,
            http_response_code($this->status)
        );
    }
}
