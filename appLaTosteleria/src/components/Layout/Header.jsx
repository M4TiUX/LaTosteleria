import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, Menu, MenuItem } from "@mui/material";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import SettingsIcon from "@mui/icons-material/Settings";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";
// Traductor
import { useTranslation } from "react-i18next";

export default function Header() {
  // ==============================================
  // TRADUCTOR
  // ==============================================

  const { t, i18n } = useTranslation();

  // ==============================================
  // USUARIO
  // ==============================================

  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken();
  const isLoggedIn = Boolean(userData && Object.keys(userData).length > 0);

  // ==============================================
  // CARRITO
  // ==============================================

  const { cart, getCountItems } = useCart();

  // ==============================================
  // ESTADOS DE MENÚS
  // ==============================================

  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);

  /*
   * Nuevo menú desplegable
   * de mantenimientos.
   */
  const [anchorElMaintenance, setAnchorElMaintenance] = useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const isMaintenanceOpen = Boolean(anchorElMaintenance);

  // ==============================================
  // MENÚ DE USUARIO
  // ==============================================

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);

    handleOpcionesMenuClose();
  };

  // ==============================================
  // MENÚ PRINCIPAL MÓVIL
  // ==============================================

  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };

  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };

  // ==============================================
  // MENÚ DE OPCIONES MÓVIL
  // ==============================================

  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  // ==============================================
  // MENÚ DE MANTENIMIENTOS
  // ==============================================

  const handleMaintenanceOpen = (event) => {
    setAnchorElMaintenance(event.currentTarget);
  };

  const handleMaintenanceClose = () => {
    setAnchorElMaintenance(null);
  };

  // ==============================================
  // OPCIONES DEL USUARIO
  // ==============================================

  const userItems = [
    {
      name: t("user.login"),

      link: "/user/login",

      login: false,
    },

    {
      name: t("user.register"),

      link: "/user/create",

      login: false,
    },

    {
      name: t("user.logout"),

      link: "/user/logout",

      login: true,
    },
  ];

  // ==============================================
  // MENÚ PRINCIPAL
  // ==============================================

  /*
   * Aquí dejamos únicamente
   * las páginas principales.
   *
   * Los mantenimientos ya no
   * aparecen individualmente
   * en el Header.
   */
  const navItems = [
    {
      name: "Dashboard",

      link: "/dashboard",

      roles: ["Administrador", "Empleado"],
    },

    {
      name: t("nav.productos"),

      link: "/producto",

      roles: null,
    },

    {
      name: t("nav.combos"),

      link: "/Combo",

      roles: null,
    },

    {
      name: t("nav.procesos"),

      link: "/Procesos",

      roles: ["Administrador", "Empleado", "Cocina"],
    },

    {
      name: t("nav.menus"),

      link: "/menu",

      roles: null,
    },

    {
      name: t("nav.pedidos"),

      link: "/pedido",

      roles: ["Cliente", "Empleado", "Administrador"],
    },
  ];

  // ==============================================
  // MANTENIMIENTOS
  // ==============================================

  /*
   * Cada rol verá únicamente los
   * mantenimientos autorizados.
   */
  const maintenanceItems = [
    {
      name: t("nav.mantenimientoProductos"),

      link: "/producto-table",

      roles: ["Administrador", "Empleado"],
    },

    {
      name: t("nav.mantenimientoCombos"),

      link: "/combo-table",

      roles: ["Administrador", "Empleado"],
    },

    {
      name: t("nav.mantenimientoProcesos"),

      link: "/procesos/mantenimiento",

      roles: ["Administrador", "Empleado"],
    },

    {
      name: t("nav.mantenimientoMenus"),

      link: "/menu/mantenimiento",

      roles: ["Administrador", "Empleado"],
    },

    {
      name: t("nav.usuarios"),

      link: "/user/gestion",

      roles: ["Administrador", "Empleado"],
    },
  ];

  /*
   * Filtramos los mantenimientos
   * según el rol actual.
   */
  const maintenanceItemsVisible = maintenanceItems.filter((item) => {
    if (!isLoggedIn) {
      return false;
    }

    return autorize(item.roles);
  });

  const puedeVerMantenimientos = maintenanceItemsVisible.length > 0;

  const menuIdPrincipal = "menu-appbar";

  // ==============================================
  // MENÚ PRINCIPAL - ESCRITORIO
  // ==============================================

  const menuPrincipal = (
    <Box
      sx={{
        display: {
          xs: "none",
          lg: "flex",
        },

        flex: "1 1 auto",

        minWidth: 0,

        justifyContent: "center",

        alignItems: "center",

        gap: 1,

        mx: 2,

        whiteSpace: "nowrap",
      }}
    >
      {navItems.map((item, index) => {
        if (item.roles) {
          if (!userData || Object.keys(userData).length === 0) {
            return null;
          }

          if (!autorize(item.roles)) {
            return null;
          }
        }

        return (
          <Button
            key={index}
            component={Link}
            to={item.link}
            color="secondary"
            sx={{
              px: 1.3,

              py: 0.8,

              flexShrink: 0,

              textTransform: "none",
            }}
          >
            <Typography textAlign="center" noWrap>
              {item.name}
            </Typography>
          </Button>
        );
      })}

      {/* ======================================
          BOTÓN MANTENIMIENTOS
          ====================================== */}

      {puedeVerMantenimientos && (
        <>
          <Button
            color="secondary"
            onClick={handleMaintenanceOpen}
            startIcon={<SettingsIcon />}
            endIcon={<ArrowDropDownIcon />}
            aria-haspopup="true"
            aria-expanded={isMaintenanceOpen ? "true" : undefined}
            sx={{
              px: 1.3,

              py: 0.8,

              flexShrink: 0,

              textTransform: "none",
            }}
          >
            <Typography textAlign="center" noWrap>
              {t("nav.mantenimientos")}
            </Typography>
          </Button>

          <Menu
            anchorEl={anchorElMaintenance}
            open={isMaintenanceOpen}
            onClose={handleMaintenanceClose}
            anchorOrigin={{
              vertical: "bottom",

              horizontal: "left",
            }}
            transformOrigin={{
              vertical: "top",

              horizontal: "left",
            }}
            PaperProps={{
              sx: {
                minWidth: 250,

                borderRadius: 2,

                mt: 0.5,

                boxShadow: 4,
              },
            }}
          >
            {maintenanceItemsVisible.map((item, index) => (
              <MenuItem
                key={index}
                component={Link}
                to={item.link}
                onClick={handleMaintenanceClose}
                sx={{
                  py: 1.2,
                }}
              >
                <SettingsIcon
                  fontSize="small"
                  sx={{
                    mr: 1.5,
                    color: "text.secondary",
                  }}
                />

                <Typography>{item.name}</Typography>
              </MenuItem>
            ))}
          </Menu>
        </>
      )}
    </Box>
  );

  // ==============================================
  // MENÚ PRINCIPAL - MÓVIL
  // ==============================================

  /*
   * En móvil ya existe el menú hamburguesa.
   * Los mantenimientos se agrupan dentro
   * de ese mismo menú para evitar crear
   * otro desplegable encima.
   */
  const menuPrincipalMobile = (
    <>
      {navItems.map((page, index) => {
        if (page.roles) {
          if (!userData || Object.keys(userData).length === 0) {
            return null;
          }

          if (!autorize(page.roles)) {
            return null;
          }
        }

        return (
          <MenuItem
            key={`nav-${index}`}
            component={Link}
            to={page.link}
            onClick={handleClosePrincipalMenu}
          >
            <Typography>{page.name}</Typography>
          </MenuItem>
        );
      })}

      {puedeVerMantenimientos && (
        <>
          <Divider />

          <MenuItem
            disabled
            sx={{
              opacity: "1 !important",
            }}
          >
            <SettingsIcon
              fontSize="small"
              sx={{
                mr: 1.5,
              }}
            />

            <Typography fontWeight={700}>{t("nav.mantenimientos")}</Typography>
          </MenuItem>

          {maintenanceItemsVisible.map((item, index) => (
            <MenuItem
              key={`maintenance-mobile-${index}`}
              component={Link}
              to={item.link}
              onClick={handleClosePrincipalMenu}
              sx={{
                pl: 4,
              }}
            >
              <Typography>{item.name}</Typography>
            </MenuItem>
          ))}
        </>
      )}
    </>
  );

  // ==============================================
  // MENÚ DEL USUARIO
  // ==============================================

  const userMenuId = "user-menu";

  const userMenu = (
    <Box
      sx={{
        flexGrow: 0,
      }}
    >
      <IconButton
        size="large"
        edge="end"
        aria-label="account of current user"
        aria-controls={userMenuId}
        aria-haspopup="true"
        onClick={handleUserMenuOpen}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>

      <Menu
        sx={{
          mt: "45px",
        }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: "top",

          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",

          horizontal: "right",
        }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData && Object.keys(userData).length > 0 && (
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData?.email}
            </Typography>
          </MenuItem>
        )}

        {userItems.map((setting, index) => {
          if (setting.login && isLoggedIn) {
            return (
              <MenuItem
                key={index}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography>{setting.name}</Typography>
              </MenuItem>
            );
          }

          if (!setting.login && !isLoggedIn) {
            return (
              <MenuItem
                key={index}
                component={Link}
                to={setting.link}
                onClick={handleUserMenuClose}
              >
                <Typography>{setting.name}</Typography>
              </MenuItem>
            );
          }

          return null;
        })}
      </Menu>
    </Box>
  );

  // ==============================================
  // OPCIONES EN MÓVIL
  // ==============================================

  const menuOpcionesId = "badge-menu-mobile";

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{
        vertical: "bottom",

        horizontal: "right",
      }}
      transformOrigin={{
        vertical: "top",

        horizontal: "right",
      }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      {/* Carrito solo Cliente */}

      {userData &&
        Object.keys(userData).length > 0 &&
        autorize(["Cliente"]) && (
          <MenuItem
            component={Link}
            to="/pedido/crear"
            onClick={handleOpcionesMenuClose}
          >
            <IconButton
              size="large"
              sx={{
                color: "secondary.main",
              }}
            >
              <Badge
                badgeContent={getCountItems(cart)}
                sx={{
                  "& .MuiBadge-badge": {
                    backgroundColor: "secondary.main",

                    color: "primary.main",
                  },
                }}
              >
                <ShoppingCartIcon
                  sx={{
                    color: "secondary.main",
                  }}
                />
              </Badge>
            </IconButton>

            <p>{t("orders.create.title")}</p>
          </MenuItem>
        )}

    </Menu>
  );

  // ==============================================
  // HEADER
  // ==============================================

  return (
    <Box
      className="no-print"
      sx={{
        flexGrow: 1,
      }}
    >
      <AppBar
        position="static"
        color="primaryLight"
        sx={{
          backgroundColor: "primaryLight.main",

          width: "100%",

          borderRadius: 0,

          overflow: "visible",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",

            flexWrap: "nowrap",

            alignItems: "center",

            flexDirection: "row",

            gap: {
              xs: 0.5,
              lg: 1,
            },

            justifyContent: "space-between",

            px: {
              xs: 1,
              sm: 2,
            },

            minWidth: 0,
          }}
        >
          {/* ==================================
              LOGO + HAMBURGUESA
              ================================== */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              flex: "0 0 auto",

              minWidth: 0,
            }}
          >
            <Tooltip title="La Tostelería">
              <IconButton
                size="large"
                edge="end"
                component={Link}
                to="/"
                aria-label="La Tostelería"
                sx={{
                  p: 0.5,

                  color: "secondary.main",
                }}
              >
                <img
                  src="/images/LogoLaTosteleria.jpeg"
                  alt="La Tostelería"
                  style={{
                    width: 40,

                    height: 40,

                    objectFit: "contain",

                    display: "block",
                  }}
                />
              </IconButton>
            </Tooltip>

            {/* Menú hamburguesa */}
            <IconButton
              size="large"
              color="inherit"
              aria-controls={menuIdPrincipal}
              aria-haspopup="true"
              sx={{
                mr: 2,

                display: {
                  xs: "inline-flex",

                  lg: "none",
                },
              }}
              onClick={handleOpenPrincipalMenu}
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id={menuIdPrincipal}
              anchorEl={anchorElPrincipal}
              anchorOrigin={{
                vertical: "bottom",

                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",

                horizontal: "left",
              }}
              open={Boolean(anchorElPrincipal)}
              onClose={handleClosePrincipalMenu}
              sx={{
                display: {
                  xs: "block",

                  lg: "none",
                },
              }}
              PaperProps={{
                sx: {
                  minWidth: 260,
                },
              }}
            >
              {menuPrincipalMobile}
            </Menu>
          </Box>

          {/* ==================================
              NAVEGACIÓN PRINCIPAL
              ================================== */}

          {menuPrincipal}

          {/* ==================================
              OPCIONES DERECHA
              ================================== */}

          <Box
            sx={{
              display: "flex",

              alignItems: "center",

              justifyContent: "flex-end",

              flex: "0 0 auto",

              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "flex",
                },

                alignItems: "center",
              }}
            >
              {/* Carrito solo Cliente */}

              {userData &&
                Object.keys(userData).length > 0 &&
                autorize(["Cliente"]) && (
                  <Tooltip title={t("header.myCart")}>
                    <IconButton
                      size="large"
                      edge="end"
                      component={Link}
                      to="/pedido/crear"
                      aria-label={t("header.myCart")}
                      sx={{
                        color: "secondary.main",
                      }}
                    >
                      <Badge
                        badgeContent={getCountItems(cart)}
                        sx={{
                          "& .MuiBadge-badge": {
                            backgroundColor: "secondary.main",

                            color: "primary.main",
                          },
                        }}
                      >
                        <ShoppingCartIcon
                          sx={{
                            color: "secondary.main",
                          }}
                        />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                )}

              {/* Traductor ES / EN */}

              <Box
                sx={{
                  display: "flex",

                  alignItems: "center",

                  mr: 1,
                }}
              >
                <Button
                  color="inherit"
                  size="small"
                  onClick={() => i18n.changeLanguage("es")}
                  sx={{
                    minWidth: "35px",
                  }}
                >
                  ES
                </Button>

                <Button
                  color="inherit"
                  size="small"
                  onClick={() => i18n.changeLanguage("en")}
                  sx={{
                    minWidth: "35px",
                  }}
                >
                  EN
                </Button>
              </Box>

            </Box>

            {/* Usuario */}

            <div>{userMenu}</div>

            {/* Más opciones móvil */}

            <Box
              sx={{
                display: {
                  xs: "flex",
                  md: "none",
                },
              }}
            >
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={menuOpcionesId}
                aria-haspopup="true"
                onClick={handleOpcionesMenuOpen}
                color="inherit"
              >
                <MoreIcon />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      {menuOpcionesMobile}
    </Box>
  );
}
