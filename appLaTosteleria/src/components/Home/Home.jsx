import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { useTranslation } from "react-i18next";
import { AvailableMenu } from "../Menu/AvailableMenu";

export function Home() {
  const { t } = useTranslation();

  return (
    <Container sx={{ p: 2 }} maxWidth="lg">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        sx={{ fontWeight: 700, letterSpacing: "0.04em" }}
        gutterBottom
      >
        La Tostelería
      </Typography >
      <img
        src="/images/Logo2.png"
        alt="Tostada de aguacate"
        style={{
          display: "block",
          width: "60%",
          maxWidth: 420,
          margin: "24px auto",
          borderRadius: "8px",
        }}
      />
      <Typography 
      variant="h5" 
      align="center" 
      color="text.primary"
      sx={{fontWeight:700, letterSpacing: "0.02em"}}>
        {t("home.slogan")}
      </Typography>

      <Typography
        variant="body1"
        align="center"
        color="text.secondary"
        sx={{ mt: 2, maxWidth: 820, mx: "auto" }}
      >
        La Tosteleria es una cafeteria y deli donde combinamos pan artesanal, bebidas calientes y postres caseros.
        Explore el menu disponible por horario y descubra opciones frescas preparadas con ingredientes de calidad.
      </Typography>

      <Box sx={{ mt: 5 }}>
        <AvailableMenu />
      </Box>
    </Container>
  );
}
