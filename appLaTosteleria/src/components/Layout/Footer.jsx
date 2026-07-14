// eslint-disable-next-line no-unused-vars
import React from "react";
import { Container, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import Toolbar from "@mui/material/Toolbar";
export function Footer() {
  return (
    <Toolbar
      sx={{
        px: 2,
        position: "fixed",
        bottom: 0,
        left: 0,
        width: "100%",
        height: "5rem",
        backgroundColor: "primary.main",
        paddingTop: "0.75rem",
        paddingBottom: "0.75rem",
        borderTop: "1px solid rgba(232, 195, 140, 0.28)",
        boxShadow: "0 -12px 30px rgba(68, 20, 10, 0.18)",
        zIndex: 1200,
      }}
    >
      <Container maxWidth="xl">
        <Grid container rowSpacing={1}>
          <Grid size={12}>
            <Typography
              align="center"
              color="secondary.main"
              variant="subtitle1"
              sx={{ fontWeight: 700, letterSpacing: "0.08em" }}
            >
              La Tostelería
            </Typography>
          </Grid>
          <Grid size={12}>
            <Typography align="center" color="secondary.main" variant="body2">
              Todos los derechos reservados
            </Typography>
          </Grid>
          {/* <Grid size={12}>
            <Typography align="center" color="secondary.main" variant="body1">
              {`${new Date().getFullYear()}`}
            </Typography>
          </Grid> */}
        </Grid>
      </Container>
    </Toolbar>
  );
}
