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
import { useTranslation } from "react-i18next";
import UserService from "../../services/UserService";
import { UserContext } from "../../context/UserContext";

function createSchema(t) {
  return yup.object({
    name: yup
      .string()
      .trim()
      .required(t("userManagement.validation.nameRequired"))
      .min(3, t("userManagement.validation.nameMin"))
      .max(100, t("userManagement.validation.nameMax")),
    email: yup
      .string()
      .trim()
      .required(t("userManagement.validation.emailRequired"))
      .email(t("userManagement.validation.emailInvalid")),
    password: yup
      .string()
      .required(t("userManagement.validation.passwordRequired"))
      .min(8, t("userManagement.validation.passwordMin")),
    rol_id: yup
      .number()
      .required(t("userManagement.validation.roleRequired"))
      .oneOf([3, 4], t("userManagement.validation.roleAllowed")),
  });
}

function getErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export function UserManagement() {
  const { t } = useTranslation();
  const { decodeToken } = useContext(UserContext);
  const activeUser = decodeToken();
  const roleName = activeUser?.rol?.name ?? "";
  const isAdmin = roleName === "Administrador";

  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState("");
  const [saving, setSaving] = useState(false);

  const schema = useMemo(() => createSchema(t), [t]);

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

  const roleOptions = useMemo(
    () => [
      { id: 3, label: t("userManagement.roles.employee") },
      { id: 4, label: t("userManagement.roles.kitchen") },
    ],
    [t],
  );

  const roleLabelById = useMemo(() => {
    return roleOptions.reduce((acc, role) => {
      acc[role.id] = role.label;
      return acc;
    }, {});
  }, [roleOptions]);

  const loadUsers = () => {
    setLoadingUsers(true);
    setUsersError("");

    UserService.getUsers()
      .then((response) => {
        const data = Array.isArray(response?.data) ? response.data : [];
        setUsers(data);
      })
      .catch((error) => {
        setUsersError(
          getErrorMessage(error, t("userManagement.errors.operation")),
        );
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

      toast.success(t("userManagement.createSuccess"));
      reset({ name: "", email: "", password: "", rol_id: 3 });
      loadUsers();
    } catch (error) {
      toast.error(getErrorMessage(error, t("userManagement.errors.operation")));
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {t("userManagement.title")}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {isAdmin
          ? t("userManagement.adminDescription")
          : t("userManagement.employeeDescription")}
      </Typography>

      <Grid container spacing={3}>
        {isAdmin && (
          <Grid item xs={12} lg={5}>
            <Card>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  {t("userManagement.createUser")}
                </Typography>

                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
                  <Stack spacing={2}>
                    <Controller
                      name="name"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          label={t("userManagement.name")}
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
                          label={t("userManagement.email")}
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
                          label={t("userManagement.password")}
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
                          <InputLabel id="rol-id-label">
                            {t("userManagement.role")}
                          </InputLabel>
                          <Select
                            {...field}
                            labelId="rol-id-label"
                            label={t("userManagement.role")}
                          >
                            {roleOptions.map((role) => (
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

                    <Button
                      type="submit"
                      variant="contained"
                      color="secondary"
                      disabled={saving}
                    >
                      {saving
                        ? t("userManagement.saving")
                        : t("userManagement.createUser")}
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
                {t("userManagement.registeredUsers")}
              </Typography>

              {usersError && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {usersError}
                </Alert>
              )}

              {loadingUsers ? (
                <Typography color="text.secondary">
                  {t("userManagement.loading")}
                </Typography>
              ) : (
                <TableContainer>
                  <Table size="small">
                    <TableHead>
                      <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>{t("userManagement.name")}</TableCell>
                        <TableCell>{t("userManagement.email")}</TableCell>
                        <TableCell>{t("userManagement.role")}</TableCell>
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4}>
                            <Typography color="text.secondary">
                              {t("userManagement.noUsers")}
                            </Typography>
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.id}</TableCell>
                            <TableCell>{item.name}</TableCell>
                            <TableCell>{item.email}</TableCell>
                            <TableCell>
                              {item.role_name ||
                                roleLabelById[item.rol_id] ||
                                item.rol_id}
                            </TableCell>
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
