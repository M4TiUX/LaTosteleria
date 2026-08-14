import { useState } from "react";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useForm, Controller } from "react-hook-form";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { yupResolver } from "@hookform/resolvers/yup";

export function Signup() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const signupSchema = yup.object({
    name: yup
      .string()
      .trim()
      .required("El nombre es requerido")
      .min(3, "El nombre debe tener al menos 3 caracteres"),
    email: yup
      .string()
      .trim()
      .required("El email es requerido")
      .email("Formato de email invalido"),
    password: yup
      .string()
      .required("La contrasena es requerida")
      .min(8, "La contrasena debe tener al menos 8 caracteres"),
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rol_id: 2,
    },
    resolver: yupResolver(signupSchema),
  });

  const onSubmit = async (dataForm) => {
    try {
      setError("");
      await UserService.createUser({
        ...dataForm,
        rol_id: 2,
      });

      toast.success("Registro exitoso. Ahora puede iniciar sesion.", {
        duration: 3000,
        position: "top-center",
      });

      reset({ name: "", email: "", password: "", rol_id: 2 });
      navigate("/user/login", { replace: true });
    } catch (e) {
      const message =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message ||
        "No fue posible completar el registro.";

      setError(message);
      toast.error(message);
    }
  };

  const onError = (errors, e) => console.log(errors, e);

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit, onError)} noValidate>
        <Grid container spacing={1}>
          <Grid size={12} sm={12}>
            <Typography variant="h5" gutterBottom>
              Registro de cliente
            </Typography>
          </Grid>

          {error && (
            <Grid size={12} sm={12}>
              <Alert severity="error">{error}</Alert>
            </Grid>
          )}

          <Grid size={12} sm={12}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="name"
                    label="Nombre"
                    error={Boolean(errors.name)}
                    helperText={errors.name ? errors.name.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={6}>
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
          <Grid size={12} sm={6}>
            <FormControl variant="standard" fullWidth sx={{ m: 1 }}>
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="password"
                    label="Contrasena"
                    type="password"
                    error={Boolean(errors.password)}
                    helperText={errors.password ? errors.password.message : " "}
                  />
                )}
              />
            </FormControl>
          </Grid>
          <Grid size={12} sm={12}>
            <Button
              type="submit"
              variant="contained"
              color="secondary"
              sx={{ m: 1 }}
            >
              Registrarme
            </Button>
          </Grid>
        </Grid>
      </form>
    </>
  );
}
