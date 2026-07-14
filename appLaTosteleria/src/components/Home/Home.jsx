import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
export function Home() {
  return (
    <Container sx={{ p: 2 }} maxWidth="sm">
      <Typography
        component="h1"
        variant="h2"
        align="center"
        color="text.primary"
        sx={{ fontFamily: "Cooper Black" }}
        gutterBottom
      >
        La Tostelería
      </Typography >
      <img
        src="/images/Logo2.png"
        alt="Tostada de aguacate"
        style={{
          display: "block",
          width: "100%",
          maxWidth: 420,
          margin: "24px auto",
          borderRadius: 16,
        }}
      />
      <Typography 
      variant="h5" 
      align="center" 
      color="text.primary"
      sx={{fontFamily:"Cooper Black"}}>
        Descubre nuestros productos y combos especiales.
      </Typography>
    </Container>
  );
}
