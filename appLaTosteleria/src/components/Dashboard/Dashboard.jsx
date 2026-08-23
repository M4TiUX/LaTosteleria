import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Legend,
} from "recharts";
import PedidoService from "../../services/PedidoService";
import { useTranslation } from "react-i18next";

const BAR_COLORS = ["#8c2f24", "#ba4a2f", "#dd7e52"];
const PIE_COLORS = ["#8c2f24", "#4d7c0f", "#0369a1", "#7c2d12", "#4338ca", "#475569"];

function parseErrorMessage(error, fallback) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    fallback
  );
}

export function Dashboard() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState({
    top_productos: [],
    pedidos_hoy_por_estado: [],
    fecha: null,
  });

  useEffect(() => {
    let mounted = true;

    PedidoService.getDashboardSummary()
      .then((response) => {
        if (!mounted) {
          return;
        }

        const data = response?.data ?? {};

        setSummary({
          top_productos: Array.isArray(data.top_productos) ? data.top_productos : [],
          pedidos_hoy_por_estado: Array.isArray(data.pedidos_hoy_por_estado)
            ? data.pedidos_hoy_por_estado
            : [],
          fecha: data.fecha ?? null,
        });
      })
      .catch((err) => {
        if (mounted) {
          setError(parseErrorMessage(err, t("dashboard.loadError")));
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [t]);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
        <CircularProgress color="secondary" />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" sx={{ mt: 2 }}>
        {error}
      </Typography>
    );
  }

  const topProducts = summary.top_productos.map((item) => ({
    nombre: item.nombre_producto,
    unidades: Number(item.total_unidades) || 0,
  }));

  const ordersByState = summary.pedidos_hoy_por_estado.map((item) => ({
    estado: item.estado,
    total: Number(item.total) || 0,
  }));

  return (
    <Box>
      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
        {t("dashboard.title")}
      </Typography>

      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        {t("dashboard.description")}
      </Typography>

      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.referenceDate")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {summary.fecha || "-"}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.evaluatedProducts")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {topProducts.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                {t("dashboard.todayOrders")}
              </Typography>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                {ordersByState.reduce((acc, item) => acc + item.total, 0)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t("dashboard.topProducts")}
              </Typography>

              {topProducts.length === 0 ? (
                <Typography color="text.secondary">{t("dashboard.noSales")}</Typography>
              ) : (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={topProducts} margin={{ top: 8, right: 16, left: 4, bottom: 8 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="nombre" />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="unidades" radius={[8, 8, 0, 0]}>
                        {topProducts.map((entry, index) => (
                          <Cell key={`${entry.nombre}-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={6}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                {t("dashboard.ordersByStatus")}
              </Typography>

              {ordersByState.length === 0 ? (
                <Typography color="text.secondary">{t("dashboard.noOrdersToday")}</Typography>
              ) : (
                <Box sx={{ width: "100%", height: 320 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie
                        data={ordersByState}
                        dataKey="total"
                        nameKey="estado"
                        cx="50%"
                        cy="50%"
                        outerRadius={110}
                        label
                      >
                        {ordersByState.map((entry, index) => (
                          <Cell key={`${entry.estado}-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
