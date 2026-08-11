import { useState, useContext } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";

export function Login() {
  const navigate = useNavigate();
  const { login } = useContext(UserContext);
  const [error, setError] = useState(null);

  const loginSchema = yup.object({
    email: yup.string().required("El email es requerido").email("Formato email"),
    password: yup.string().required("El password es requerido"),
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
      const response = await UserService.loginUser(dataForm);
      console.log("Respuesta del login:", response);

      const data = response.data;

      // ✅ 1. Si la respuesta es HTML, mostramos error y no guardamos nada
      if (typeof data === "string" && (data.includes("<html") || data.includes("xdebug"))) {
        toast.error("Error interno del servidor. Contacta al administrador.", { duration: 5000 });
        setError("El servidor devolvió un error HTML.");
        return;
      }

      // ✅ 2. Extraer el token (solo si es un JWT válido)
      let token = null;
      if (typeof data === "string" && data.split(".").length === 3) {
        token = data; // es un JWT directo
      } else if (data?.token && typeof data.token === "string" && data.token.split(".").length === 3) {
        token = data.token;
      } else if (data?.access_token && typeof data.access_token === "string" && data.access_token.split(".").length === 3) {
        token = data.access_token;
      }

      // ✅ 3. Si hay token válido, guardar y redirigir
      if (token) {
        login(token);
        toast.success("Bienvenido, usuario", { duration: 4000 });
        navigate("/");
      } else {
        // Si no hay token, mostramos el mensaje de error que venga del backend
        const msg = data?.message || data?.error || "Credenciales incorrectas";
        toast.error(msg, { duration: 4000 });
        setError(msg);
      }
    } catch (err) {
      console.error("Error en login:", err);
      toast.error("Error al iniciar sesión. Intenta de nuevo.", { duration: 4000 });
      setError(err.message || "Error desconocido");
    }
  };

  const onError = (errors) => console.log(errors);

  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
      <Grid container spacing={1}>
        <Grid size={12} sm={12}>
          <Typography variant="h5" gutterBottom>
            Login
          </Typography>
        </Grid>

        <Grid size={{ xs: 12, sm: 4 }}>
          <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
            <Controller
              name="email"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  id="email"
                  label="Email"
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
                  label="Password"
                  type="password"
                  error={Boolean(errors.password)}
                  helperText={errors.password ? errors.password.message : " "}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid size={12} sm={12}>
          <Button type="submit" variant="contained" color="secondary" sx={{ m: 1 }}>
            Login
          </Button>
        </Grid>
      </Grid>
    </form>
  );
}