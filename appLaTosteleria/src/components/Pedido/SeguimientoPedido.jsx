import { Card, CardContent, Typography, LinearProgress } from "@mui/material";

export function SeguimientoPedido() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5">
          Seguimiento del Pedido
        </Typography>

        <Typography>
          Estado: En preparación
        </Typography>

        <LinearProgress
          variant="determinate"
          value={50}
          sx={{ mt: 2 }}
        />

        <Typography sx={{ mt: 2 }}>
          Aquí se mostrará el mapa del repartidor.
        </Typography>
      </CardContent>
    </Card>
  );
}