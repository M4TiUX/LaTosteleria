import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";

// Traductor
import { useTranslation } from "react-i18next";

export default function Header() {
  // Traductor
  const { t, i18n } = useTranslation();

  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken();
  const isLoggedIn = Boolean(
    userData && Object.keys(userData).length > 0
  );

  const { cart, getCountItems } = useCart();

  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] =
    useState(null);

  const isMobileOpcionesMenuOpen = Boolean(
    mobileOpcionesAnchorEl
  );

  const [anchorElPrincipal, setAnchorElPrincipal] =
    useState(null);

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
    handleOpcionesMenuClose();
  };

  const handleOpenPrincipalMenu = (event) => {
    setAnchorElPrincipal(event.currentTarget);
  };

  const handleClosePrincipalMenu = () => {
    setAnchorElPrincipal(null);
  };

  const handleOpcionesMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const handleOpcionesMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

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

  // =====================================================
  // OPCIONES DEL MENÚ SEGÚN ROL
  // =====================================================

  const navItems = [
    {
      name: "Dashboard",
      link: "/dashboard",
      roles: ["Administrador", "Encargado"],
    },
    {
      name: t("nav.productos"),
      link: "/producto",
      roles: null,
    },
    {
      name: t("nav.mantenimientoProductos"),
      link: "/producto-table",
      roles: ["Administrador", "Empleado"],
    },
    {
      name: t("nav.combos"),
      link: "/Combo",
      roles: null,
    },
    {
      name: t("nav.procesos"),
      link: "/Procesos",
      roles: ["Administrador", "Encargado", "Cocina"],
    },

    // NUEVO: Mantenimiento de procesos
    {
      name: t("nav.mantenimientoProcesos"),
      link: "/procesos/mantenimiento",
      roles: ["Administrador", "Encargado"],
    },

    {
      name: t("nav.menus"),
      link: "/menu",
      roles: null,
    },
    {
      name: t("nav.pedidos"),
      link: "/pedido",
      roles: [
        "Cliente",
        "Encargado",
        "Administrador",
      ],
    },
    {
      name: t("nav.mantenimientoMenus"),
      link: "/menu/mantenimiento",
      roles: ["Administrador", "Encargado"],
    },
    {
      name: "Usuarios",
      link: "/user/gestion",
      roles: ["Administrador", "Encargado"],
    },
  ];

  const menuIdPrincipal = "menu-appbar";

  // =====================================================
  // MENÚ PRINCIPAL
  // =====================================================

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
        gap: 1.5,
        mx: 2,
        overflowX: "auto",
        whiteSpace: "nowrap",
      }}
    >
      {navItems.map((item, index) => {
        if (item.roles) {
          if (
            !userData ||
            Object.keys(userData).length === 0
          ) {
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
            sx={{ px: 1.5, py: 0.8, flexShrink: 0 }}
          >
            <Typography
              textAlign="center"
              noWrap
            >
              {item.name}
            </Typography>
          </Button>
        );
      })}
    </Box>
  );

  // =====================================================
  // MENÚ MÓVIL
  // =====================================================

  const menuPrincipalMobile = navItems.map(
    (page, index) => {
      if (page.roles) {
        if (
          !userData ||
          Object.keys(userData).length === 0
        ) {
          return null;
        }

        if (!autorize(page.roles)) {
          return null;
        }
      }

      return (
        <MenuItem
          key={index}
          component={Link}
          to={page.link}
          onClick={handleClosePrincipalMenu}
        >
          <Typography
            sx={{ textAlign: "center" }}
          >
            {page.name}
          </Typography>
        </MenuItem>
      );
    }
  );

  // =====================================================
  // MENÚ DEL USUARIO
  // =====================================================

  const userMenuId = "user-menu";

  const userMenu = (
    <Box sx={{ flexGrow: 0 }}>
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
        sx={{ mt: "45px" }}
        id="menu-appbar"
        anchorEl={anchorElUser}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorElUser)}
        onClose={handleUserMenuClose}
      >
        {userData &&
          Object.keys(userData).length > 0 && (
            <MenuItem>
              <Typography
                variant="subtitle1"
                gutterBottom
              >
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
                <Typography
                  sx={{ textAlign: "center" }}
                >
                  {setting.name}
                </Typography>
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
                <Typography
                  sx={{ textAlign: "center" }}
                >
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }
          return null;
        })}
      </Menu>
    </Box>
  );

  // =====================================================
  // MENÚ DE OPCIONES EN MÓVIL
  // =====================================================

  const menuOpcionesId =
    "badge-menu-mobile";

  const menuOpcionesMobile = (
    <Menu
      anchorEl={mobileOpcionesAnchorEl}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      id={menuOpcionesId}
      keepMounted
      open={isMobileOpcionesMenuOpen}
      onClose={handleOpcionesMenuClose}
    >
      {/* Carrito únicamente para Cliente */}

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
                    backgroundColor:
                      "secondary.main",
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

            <p>Nuevo pedido</p>
          </MenuItem>
        )}

      <MenuItem>
        <IconButton
          size="large"
          color="inherit"
        >
          <Badge
            badgeContent={17}
            color="error"
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  // =====================================================
  // HEADER
  // =====================================================

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{
          backgroundColor:
            "primaryLight.main",
          width: "100%",
          borderRadius: 0,
          overflow: "hidden",
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
            justifyContent:
              "space-between",
            px: {
              xs: 1,
              sm: 2,
            },
            overflow: "hidden",
          }}
        >
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
                component="a"
                href="/"
                aria-label="La Tostelería"
                sx={{
                  p: 0.5,
                  color:
                    "secondary.main",
                }}
              >
                <img
                  src="/images/LogoLaTosteleria.jpeg"
                  alt="La Tostelería"
                  style={{
                    width: 40,
                    height: 40,
                    objectFit:
                      "contain",
                    display: "block",
                  }}
                />
              </IconButton>
            </Tooltip>

            <IconButton
              size="large"
              color="inherit"
              aria-controls={
                menuIdPrincipal
              }
              aria-haspopup="true"
              sx={{
                mr: 2,
                display: { xs: "inline-flex", lg: "none" },
              }}
              onClick={
                handleOpenPrincipalMenu
              }
            >
              <MenuIcon />
            </IconButton>

            <Menu
              id={menuIdPrincipal}
              anchorEl={
                anchorElPrincipal
              }
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "left",
              }}
              keepMounted
              transformOrigin={{
                vertical: "top",
                horizontal: "left",
              }}
              open={Boolean(
                anchorElPrincipal
              )}
              onClose={
                handleClosePrincipalMenu
              }
              sx={{
                display: {
                  xs: "block",
                  lg: "none",
                },
              }}
            >
              {menuPrincipalMobile}
            </Menu>
          </Box>

          {menuPrincipal}

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent:
                "flex-end",
              flex: "0 0 auto",
              minWidth: 0,
            }}
          >
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                alignItems: "center",
              }}
            >
              {/* Carrito únicamente para Cliente */}

              {userData &&
                Object.keys(userData)
                  .length > 0 &&
                autorize([
                  "Cliente",
                ]) && (
                  <Tooltip title="Mi carrito">
                    <IconButton
                      size="large"
                      edge="end"
                      component={Link}
                      to="/pedido/crear"
                      aria-label="Mi carrito"
                      sx={{
                        color:
                          "secondary.main",
                      }}
                    >
                      <Badge
                        badgeContent={getCountItems(
                          cart
                        )}
                        sx={{
                          "& .MuiBadge-badge":
                            {
                              backgroundColor:
                                "secondary.main",
                              color:
                                "primary.main",
                            },
                        }}
                      >
                        <ShoppingCartIcon
                          sx={{
                            color:
                              "secondary.main",
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
                  onClick={() =>
                    i18n.changeLanguage(
                      "es"
                    )
                  }
                  sx={{
                    minWidth: "35px",
                  }}
                >
                  ES
                </Button>

                <Button
                  color="inherit"
                  size="small"
                  onClick={() =>
                    i18n.changeLanguage(
                      "en"
                    )
                  }
                  sx={{
                    minWidth: "35px",
                  }}
                >
                  EN
                </Button>
              </Box>

              <IconButton
                size="large"
                color="inherit"
              >
                <Badge
                  badgeContent={17}
                  color="error"
                >
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>

            <div>{userMenu}</div>

            <Box sx={{ display: { xs: "flex", md: "none" } }}>
              <IconButton
                size="large"
                aria-label="show more"
                aria-controls={
                  menuOpcionesId
                }
                aria-haspopup="true"
                onClick={
                  handleOpcionesMenuOpen
                }
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