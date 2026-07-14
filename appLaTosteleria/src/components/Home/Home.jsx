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
          width: "100%",
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
        Descubre nuestros productos y combos especiales.
      </Typography>
    </Container>
  );
}
