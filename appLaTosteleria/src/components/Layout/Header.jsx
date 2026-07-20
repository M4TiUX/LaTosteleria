import { useContext, useState } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import Badge from "@mui/material/Badge";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MoreIcon from "@mui/icons-material/MoreVert";
import Tooltip from "@mui/material/Tooltip";
import { useCart } from "../../hooks/useCart";
import { UserContext } from "../../context/UserContext";

export default function Header() {
  const { decodeToken, autorize } = useContext(UserContext);
  const userData = decodeToken();

  const { cart, getCountItems } = useCart();
  const [anchorElUser, setAnchorEl] = useState(null);
  const [mobileOpcionesAnchorEl, setMobileMoreAnchorEl] = useState(null);
  const isMobileOpcionesMenuOpen = Boolean(mobileOpcionesAnchorEl);
  const [anchorElPrincipal, setAnchorElPrincipal] = useState(null);

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
    { name: "Login", link: "/user/login", login: false },
    { name: "Registrarse", link: "/user/create", login: false },
    { name: "Logout", link: "/user/logout", login: true },
  ];

  const navItems = [
    { name: "Productos", link: "/producto", roles: null },
    { name: "Mantenimiento Productos", link: "/producto-table", roles: null },
    { name: "Combos", link: "/Combo", roles: null },
    { name: "Procesos", link: "/Procesos", roles: null },
    { name: "Menús", link: "/menu", roles: null },
    { name: "Mantenimiento Menús", link: "/menu/mantenimiento", roles: ["Administrador"] },
  ];

  const menuIdPrincipal = "menu-appbar";

  const menuPrincipal = (
    <Box
      sx={{
        display: { xs: "none", lg: "flex" },
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
        if (item.roles && userData && !autorize(item.roles)) {
          return null;
        }

        if (item.roles == null || userData) {
          return (
            <Button
              key={index}
              component={Link}
              to={item.link}
              color="secondary"
              sx={{ px: 1.5, py: 0.8, flexShrink: 0 }}
            >
              <Typography textAlign="center" noWrap>
                {item.name}
              </Typography>
            </Button>
          );
        }

        return null;
      })}
    </Box>
  );

  const menuPrincipalMobile = navItems.map((page, index) => (
    (page.roles && userData && !autorize(page.roles)) ? null : (
      page.roles == null || userData ? (
        <MenuItem key={index} component={Link} to={page.link}>
          <Typography sx={{ textAlign: "center" }}>{page.name}</Typography>
        </MenuItem>
      ) : null
    )
  ));

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
        {userData && (
          <MenuItem>
            <Typography variant="subtitle1" gutterBottom>
              {userData?.email}
            </Typography>
          </MenuItem>
        )}

        {userItems.map((setting, index) => {
          if (setting.login && userData && Object.keys(userData).length > 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
                  {setting.name}
                </Typography>
              </MenuItem>
            );
          }

          if (!setting.login && Object.keys(userData).length == 0) {
            return (
              <MenuItem key={index} component={Link} to={setting.link}>
                <Typography sx={{ textAlign: "center" }}>
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
      <MenuItem>
        <IconButton size="large" sx={{ color: "secondary.main" }}>
          <Badge
            badgeContent={getCountItems(cart)}
            component={Link}
            to="/rental/crear/"
            sx={{
              "& .MuiBadge-badge": {
                backgroundColor: "secondary.main",
                color: "primary.main",
              },
            }}
          >
            <ShoppingCartIcon sx={{ color: "secondary.main" }} />
          </Badge>
        </IconButton>
        <p>Compras</p>
      </MenuItem>
      <MenuItem>
        <IconButton size="large" color="inherit">
          <Badge badgeContent={17} color="error">
            <NotificationsIcon />
          </Badge>
        </IconButton>
        <p>Notificaciones</p>
      </MenuItem>
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        color="primaryLight"
        sx={{
          backgroundColor: "primaryLight.main",
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
            gap: { xs: 0.5, lg: 1 },
            justifyContent: "space-between",
            px: { xs: 1, sm: 2 },
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
                sx={{ p: 0.5, color: "secondary.main" }}
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
            <IconButton
              size="large"
              color="inherit"
              aria-controls={menuIdPrincipal}
              aria-haspopup="true"
              sx={{ mr: 2, display: { xs: "inline-flex", lg: "none" } }}
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
              sx={{ display: { xs: "block", lg: "none" } }}
            >
              {menuPrincipalMobile}
            </Menu>
            
          </Box>

          {menuPrincipal}

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
              sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}
            >
              <Tooltip title="Mi carrito">
                <IconButton
                  size="large"
                  edge="end"
                  component={Link}
                  to="/rental/crear/"
                  aria-label="Mi carrito"
                  sx={{ color: "secondary.main" }}
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
                    <ShoppingCartIcon sx={{ color: "secondary.main" }} />
                  </Badge>
                </IconButton>
              </Tooltip>
              <IconButton size="large" color="inherit">
                <Badge badgeContent={17} color="error">
                  <NotificationsIcon />
                </Badge>
              </IconButton>
            </Box>
            <div>{userMenu}</div>
            <Box sx={{ display: { xs: "flex", md: "none" } }}>
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
