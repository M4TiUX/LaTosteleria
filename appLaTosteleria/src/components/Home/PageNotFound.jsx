import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import error from "../../assets/error.jpg";
import { useTranslation } from "react-i18next";

export function PageNotFound() {
  const { t } = useTranslation();

  return (
    <Container component="main" sx={{ mt: 8, mb: 2 }}>
      <Grid container spacing={2}>
        <Grid size={4}>
          <Box
            component="img"
            sx={{
              borderRadius: "8px",
              maxWidth: "100%",
              height: "auto",
            }}
            alt="404 Error"
            src={error}
          />
        </Grid>
        <Grid size={8}>
          <Typography
            component="h1"
            variant="h2"
            align="center"
            color="text.primary"
            gutterBottom
          >
            {t("errors.notFoundTitle")}
          </Typography>
          <Typography variant="h5" align="center" color="text.secondary">
            {t("errors.notFoundMessage")}
          </Typography>
        </Grid>
      </Grid>
    </Container>
  );
}
