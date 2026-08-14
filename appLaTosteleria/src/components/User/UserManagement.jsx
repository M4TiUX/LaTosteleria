import { useContext, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import toast from "react-hot-toast";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";

const schema = yup.object({
  name: yup
    .string()
    .trim()
    .required("El nombre es obligatorio.")
    .min(3, "El nombre debe tener al menos 3 caracteres.")
    .max(100, "El nombre no puede superar los 100 caracteres."),
  email: yup
    .string()
    .trim()
    .required("El correo es obligatorio.")
    .email("El correo no tiene un formato valido."),
  password: yup
    .string()
    .required("La contrasena es obligatoria.")
    .min(8, "La contrasena debe tener al menos 8 caracteres."),
  rol_id: yup
    .number()
    .required("Debe seleccionar un rol.")
    .oneOf([3, 4], "Solo puede seleccionar Encargado o Cocina."),
});

const ROLE_OPTIONS = [
  { id: 3, label: "Encargado" },
  { id: 4, label: "Cocina" },
];

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    "No fue posible completar la operacion."
  );
}

export function UserManagement() {
  const { decodeToken } = useContext(UserContext);
  const activeUser = decodeToken();
  const roleName = activeUser?.rol?.name ?? "";
  const isAdmin = roleName === "Administrador";

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [saving, setSaving] = useState(false);

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
      rol_id: 3,
    },
    resolver: yupResolver(schema),
  });

  const roleLabelById = useMemo(() => {
    return ROLE_OPTIONS.reduce((acc, role) => {
      acc[role.id] = role.label;
      return acc;
    }, {});
  }, []);

  const loadUsers = () => {
    setLoadingUsers(true);
    setUsersError("");

    UserService.getUsers()
      .then((response) => {
        const data = Array.isArray(response?.data) ? response.data : [];
        setUsers(data);
      })
      .catch((error) => {
        setUsersError(getErrorMessage(error));
      })
      .finally(() => {
        setLoadingUsers(false);
      });
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const onSubmit = async (formData) => {
    setSaving(true);

    try {
      await UserService.createUser({
        ...formData,
        rol_id: Number(formData.rol_id),
      });

      toast.success("Usuario creado correctamente.");
      reset({ name: "", email: "", password: "", rol_id: 3 });
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        Gestion de usuarios
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin
          ? "Administrador puede consultar usuarios y crear cuentas de Encargado o Cocina."
          : "Encargado puede consultar usuarios, pero no gestionar roles privilegiados ni crear cuentas administrativas."}
      </Typography>

      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} lg={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Crear usuario
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Stack spacing={2}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Nombre"
                          error={Boolean(errors.name)}
                          helperText={errors.name?.message || " "}
                        />
                      )}
                    />

                    <Controller
                      name="email"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label="Correo"
                          error={Boolean(errors.email)}
                          helperText={errors.email?.message || " "}
                        />
                      )}
                    />

                    <Controller
                      name="password"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="password"
                          label="Contrasena"
                          error={Boolean(errors.password)}
                          helperText={errors.password?.message || " "}
                        />
                      )}
                    />

                    <Controller
                      name="rol_id"
                      control={control}
                      render={({ field }) => (
                        <FormControl fullWidth error={Boolean(errors.rol_id)}>
                          <InputLabel id="rol-id-label">Rol</InputLabel>
                          <Select {...field} labelId="rol-id-label" label="Rol">
                            {ROLE_OPTIONS.map((role) => (
                              <MenuItem key={role.id} value={role.id}>
                                {role.label}
                              </MenuItem>
                            ))}
                          </Select>
                          {errors.rol_id && (
                            <Typography variant="caption" color="error" sx={{ mt: 0.5 }}>
                              {errors.rol_id.message}
                            </Typography>
                          )}
                        </FormControl>
                      )}
                    />

                    <Button type="submit" variant="contained" color="secondary" disabled={saving}>
                      {saving ? "Guardando..." : "Crear usuario"}
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        <Grid item xs={12} lg={isAdmin ? 7 : 12}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Usuarios registrados
              </Typography>

              {usersError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {usersError}
                </Alert>
              )}

              {loadingUsers ? (
                <Typography color="text.secondary">Cargando usuarios...</Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>Nombre</TableCell>
                        <TableCell>Correo</TableCell>
                        <TableCell>Rol</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography color="text.secondary">No hay usuarios para mostrar.</Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>{item.role_name || roleLabelById[item.rol_id] || item.rol_id}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
