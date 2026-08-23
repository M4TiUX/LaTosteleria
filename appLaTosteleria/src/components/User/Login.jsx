import { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";
import { useTranslation } from "react-i18next";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { login, decodeToken } = useContext(UserContext);
  const [error, setError] = useState(null);

  const loginSchema = yup.object({
    email: yup
      .string()
      .required(t("auth.login.validation.emailRequired"))
      .email(t("auth.login.validation.emailInvalid")),
    password: yup.string().required(t("auth.login.validation.passwordRequired")),
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: { email: "", password: "" },
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (dataForm) => {
    try {
      setError(null);
      const response = await UserService.loginUser(dataForm);

      const data = response.data;

      // ✅ 1. Si la respuesta es HTML, mostramos error y no guardamos nada
      if (
        typeof data === "string" &&
        (data.includes("<html") || data.includes("xdebug"))
      ) {
        toast.error(t("auth.login.serverInternalError"), {
          duration: 5000,
        });
        setError(t("auth.login.htmlError"));
        return;
      }

      // ✅ 2. Extraer el token (solo si es un JWT válido)
      let token = null;
      if (typeof data === "string" && data.split(".").length === 3) {
        token = data; // es un JWT directo
      } else if (
        data?.token &&
        typeof data.token === "string" &&
        data.token.split(".").length === 3
      ) {
        token = data.token;
      } else if (
        data?.access_token &&
        typeof data.access_token === "string" &&
        data.access_token.split(".").length === 3
      ) {
        token = data.access_token;
      }

      // ✅ 3. Si hay token válido, guardar y redirigir
      if (token) {
        login(token);
        const activeUser = decodeToken();
        const roleName = activeUser?.rol?.name ?? "";
        toast.success(t("auth.login.success"), { duration: 2000 });

        const requestedPath = location.state?.from?.pathname;
        const canRespectRequestedPath = Boolean(
          requestedPath && requestedPath !== "/unauthorized",
        );

        if (roleName === "Cocina") {
          navigate(canRespectRequestedPath ? requestedPath : "/procesos", {
            replace: true,
          });
        } else if (roleName === "Administrador" || roleName === "Empleado") {
          navigate(canRespectRequestedPath ? requestedPath : "/dashboard", {
            replace: true,
          });
        } else {
          navigate(canRespectRequestedPath ? requestedPath : "/", {
            replace: true,
          });
        }
      } else {
        // Si no hay token, mostramos el mensaje de error que venga del backend
        const msg = data?.message || data?.error || t("auth.login.invalidCredentials");
        toast.error(msg, { duration: 4000 });
        setError(msg);
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.error(t("auth.login.error"), {
        duration: 4000,
      });
      setError(err.message || t("auth.login.unknownError"));
    }
  };

  const onError = (errors) => console.log(errors);

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={1}>
        <Grid size={12}>
          <Typography variant="h5" gutterBottom>
            {t("auth.login.title")}
          </Typography>
        </Grid>

        {error && (
          <Grid size={12}>
            <Alert severity="error">{error}</Alert>
          </Grid>
        )}

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="email"
                  label={t("auth.login.email")}
                  error={Boolean(errors.email)}
                  helperText={errors.email ? errors.email.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="password"
                  label={t("auth.login.password")}
                  type="password"
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={12}>
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            sx={{ m: 1 }}
          >
            {t("auth.login.submit")}
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}
