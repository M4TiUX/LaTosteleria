<?php

class SeguimientoPedidoController {

    public function show($id){

        $json = array(
            "status" => 200,
            "pedido" => $id,
            "estado" => "En preparación"
        );

        echo json_encode($json);
    }

}