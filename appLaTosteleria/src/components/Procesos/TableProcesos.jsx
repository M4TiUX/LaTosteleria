import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";

import ProcesoServices from "../../services/ProcesosServices";

import { toast } from "react-toastify";

export function TableProcesos() {
  const { t } = useTranslation();

  const [procesos, setProcesos] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [deleteItem, setDeleteItem] =
    useState(null);

  const [deleting, setDeleting] =
    useState(false);

  // =====================================================
  // CARGAR PROCESOS
  // =====================================================

  const cargarProcesos = useCallback(
    async () => {
      try {
        setLoading(true);
        setError("");

        const response =
          await ProcesoServices.getProcesos();

        setProcesos(
          response.data?.result ?? []
        );
      } catch (err) {
        console.error(err);

        setError(
          t(
            "processMaintenance.loadingError"
          )
        );
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  useEffect(() => {
    cargarProcesos();
  }, [cargarProcesos]);

  // =====================================================
  // ELIMINAR PROCESO
  // =====================================================

  const confirmarEliminar = async () => {
    if (!deleteItem) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response =
        await ProcesoServices.deleteProceso(
          deleteItem.id_producto
        );

      toast.success(
        response.data?.message ||
          t(
            "processMaintenance.form.deleteSuccess"
          )
      );

      setDeleteItem(null);

      await cargarProcesos();
    } catch (err) {
      console.error(
        "Error al eliminar el proceso:",
        err
      );

      let message;

      if (err.response) {
        message =
          err.response?.data?.message ||
          err.response?.data?.result ||
          t(
            "processMaintenance.form.deleteError"
          );
      } else {
        message = t(
          "processMaintenance.form.serverError"
        );
      }

      setError(message);
      toast.error(message);
    } finally {
      setDeleting(false);
    }
  };

  // =====================================================
  // FILTRAR PROCESOS
  // =====================================================

  const procesosFiltrados =
    procesos.filter((proceso) =>
      String(
        proceso.nombre_producto ?? ""
      )
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 5 }}
    >
      {/* ENCABEZADO */}

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
          mb: 4,
        }}
      >
        <Box>
          <Typography
            variant="h3"
            fontWeight="bold"
          >
            {t(
              "processMaintenance.title"
            )}
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            {t(
              "processMaintenance.description"
            )}
          </Typography>
        </Box>

        <Button
          component={Link}
          to="/procesos/mantenimiento/crear"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          {t(
            "processMaintenance.newProcess"
          )}
        </Button>
      </Box>

      {/* ERROR */}

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      {/* TABLA */}

      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <TextField
          value={search}
          onChange={(event) =>
            setSearch(event.target.value)
          }
          placeholder={t(
            "processMaintenance.search"
          )}
          size="small"
          sx={{
            width: {
              xs: "100%",
              sm: 350,
            },
            mb: 3,
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />

        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              py: 5,
            }}
          >
            <CircularProgress />
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>
                      {t(
                        "processMaintenance.product"
                      )}
                    </strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>
                      {t(
                        "processMaintenance.stations"
                      )}
                    </strong>
                  </TableCell>

                  <TableCell align="center">
                    <strong>
                      {t(
                        "processMaintenance.actions"
                      )}
                    </strong>
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {procesosFiltrados.map(
                  (proceso) => (
                    <TableRow
                      key={
                        proceso.id_producto
                      }
                      hover
                    >
                      <TableCell>
                        <Typography
                          fontWeight={600}
                        >
                          {
                            proceso.nombre_producto
                          }
                        </Typography>
                      </TableCell>

                      <TableCell align="center">
                        {
                          proceso.total_estaciones
                        }
                      </TableCell>

                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent:
                              "center",
                            gap: 1,
                            flexWrap: "wrap",
                          }}
                        >
                          <Button
                            component={Link}
                            to={`/Procesos/${proceso.id_producto}`}
                            size="small"
                            variant="outlined"
                            startIcon={
                              <VisibilityIcon />
                            }
                            sx={{
                              textTransform:
                                "none",
                            }}
                          >
                            {t(
                              "processMaintenance.detail"
                            )}
                          </Button>

                          <Button
                            component={Link}
                            to={`/procesos/mantenimiento/editar/${proceso.id_producto}`}
                            size="small"
                            variant="outlined"
                            startIcon={
                              <EditIcon />
                            }
                            sx={{
                              textTransform:
                                "none",
                            }}
                          >
                            {t(
                              "processMaintenance.edit"
                            )}
                          </Button>

                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            startIcon={
                              <DeleteIcon />
                            }
                            onClick={() =>
                              setDeleteItem(
                                proceso
                              )
                            }
                            sx={{
                              textTransform:
                                "none",
                            }}
                          >
                            {t(
                              "processMaintenance.delete"
                            )}
                          </Button>
                        </Box>
                      </TableCell>
                    </TableRow>
                  )
                )}

                {procesosFiltrados.length ===
                  0 && (
                  <TableRow>
                    <TableCell
                      colSpan={3}
                      align="center"
                      sx={{ py: 5 }}
                    >
                      {t(
                        "processMaintenance.noResults"
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* CONFIRMACIÓN DE ELIMINACIÓN */}

      <Dialog
        open={Boolean(deleteItem)}
        onClose={() => {
          if (!deleting) {
            setDeleteItem(null);
          }
        }}
      >
        <DialogTitle>
          {t(
            "processMaintenance.deleteDialog.title"
          )}
        </DialogTitle>

        <DialogContent>
          <DialogContentText>
            {t(
              "processMaintenance.deleteDialog.message",
              {
                product:
                  deleteItem?.nombre_producto ??
                  "",
              }
            )}
          </DialogContentText>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDeleteItem(null)
            }
            disabled={deleting}
          >
            {t(
              "processMaintenance.deleteDialog.cancel"
            )}
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmarEliminar}
            disabled={deleting}
          >
            {deleting
              ? t(
                  "processMaintenance.deleteDialog.deleting"
                )
              : t(
                  "processMaintenance.deleteDialog.delete"
                )}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}