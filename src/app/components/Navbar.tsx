"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import { LogoutButton } from "src/app/(auth)/components/LogoutButton"
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Box,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Avatar,
  Chip,
} from "@mui/material"
import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Dashboard as DashboardIcon,
  Settings as SettingsIcon,
  Business as BusinessIcon,
  AdminPanelSettings as AdminIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material"
import { USER_ROLES } from "src/constants"

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null)
  const [notificationMenuAnchor, setNotificationMenuAnchor] = useState<null | HTMLElement>(null)
  const user = useCurrentUser()
  const pathname = usePathname()

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Professionals", href: "/professionals" },
    { label: "About", href: "/about" },
  ]

  const getDashboardLink = () => {
    if (!user) return "/dashboard"
    switch (user.role) {
      case USER_ROLES.PROFESSIONAL:
        return "/dashboard"
      case USER_ROLES.ADMIN:
        return "/dashboard"
      default:
        return "/dashboard"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return <AdminIcon />
      case USER_ROLES.PROFESSIONAL:
        return <BusinessIcon />
      case USER_ROLES.USER:
      default:
        return <PersonIcon />
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case USER_ROLES.ADMIN:
        return "error"
      case USER_ROLES.PROFESSIONAL:
        return "primary"
      case USER_ROLES.USER:
      default:
        return "default"
    }
  }

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget)
  }

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null)
  }

  const handleNotificationMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationMenuAnchor(event.currentTarget)
  }

  const handleNotificationMenuClose = () => {
    setNotificationMenuAnchor(null)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  const isActive = (href: string) => {
    return pathname === href
  }

  return (
    <>
      <AppBar
        position="sticky"
        sx={{ bgcolor: "background.paper", color: "text.primary", boxShadow: 1 }}
      >
        <Toolbar>
          {/* Logo */}
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                }}
              >
                <CalendarIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="h6" component="div" sx={{ fontWeight: "bold" }}>
                AppBookSystem
              </Typography>
            </Box>
          </Link>

          {/* Desktop Navigation */}
          <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" }, ml: 4, gap: 2 }}>
            {navItems.map((item) => (
              <Button
                key={item.href}
                component={Link}
                href={item.href}
                color={isActive(item.href) ? "primary" : "inherit"}
                sx={{
                  textTransform: "none",
                  fontWeight: isActive(item.href) ? 600 : 400,
                }}
              >
                {item.label}
              </Button>
            ))}
          </Box>

          {/* Desktop Actions */}
          <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1 }}>
            {user ? (
              <>
                {/* Notifications */}
                <IconButton
                  color="inherit"
                  onClick={handleNotificationMenuOpen}
                  sx={{ position: "relative" }}
                >
                  <Badge badgeContent={3} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>

                {/* User Menu */}
                <IconButton onClick={handleUserMenuOpen} sx={{ p: 0 }}>
                  <Avatar sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </Avatar>
                </IconButton>
              </>
            ) : (
              <Box sx={{ display: "flex", gap: 1 }}>
                <Button component={Link} href="/login" color="inherit">
                  Login
                </Button>
                <Button component={Link} href="/signup" variant="contained">
                  Get Started
                </Button>
              </Box>
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleMobileMenu}
            sx={{ display: { md: "none" } }}
          >
            {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Menu Drawer */}
      <Drawer
        variant="temporary"
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: 280,
          },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Box
            sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}
          >
            <Typography variant="h6">Menu</Typography>
            <IconButton onClick={toggleMobileMenu}>
              <CloseIcon />
            </IconButton>
          </Box>
          <Divider sx={{ mb: 2 }} />

          <List>
            {navItems.map((item) => (
              <ListItem
                key={item.href}
                component={Link}
                href={item.href}
                onClick={toggleMobileMenu}
                sx={{
                  textDecoration: "none",
                  color: "inherit",
                  borderRadius: 1,
                  mb: 0.5,
                  bgcolor: isActive(item.href) ? "action.selected" : "transparent",
                }}
              >
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
          </List>

          {user ? (
            <>
              <Divider sx={{ my: 2 }} />
              <List>
                <ListItem component={Link} href={getDashboardLink()} onClick={toggleMobileMenu}>
                  <ListItemIcon>
                    <DashboardIcon />
                  </ListItemIcon>
                  <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem component={Link} href="/profile" onClick={toggleMobileMenu}>
                  <ListItemIcon>
                    <SettingsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Profile" />
                </ListItem>
                <ListItem component={Link} href="/notifications" onClick={toggleMobileMenu}>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText primary="Notifications" />
                </ListItem>
              </List>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {user.name?.charAt(0) || user.email.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle2">{user.name || "User"}</Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      {getRoleIcon(user.role)}
                      <Chip label={user.role} size="small" color={getRoleColor(user.role) as any} />
                    </Box>
                  </Box>
                </Box>
                <LogoutButton />
              </Box>
            </>
          ) : (
            <>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 1 }}>
                <Button component={Link} href="/login" variant="outlined" fullWidth>
                  Login
                </Button>
                <Button component={Link} href="/signup" variant="contained" fullWidth>
                  Get Started
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Drawer>

      {/* User Menu */}
      <Menu
        anchorEl={userMenuAnchor}
        open={Boolean(userMenuAnchor)}
        onClose={handleUserMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Box sx={{ p: 2, minWidth: 200 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {user?.name?.charAt(0) || user?.email.charAt(0)}
            </Avatar>
            <Box>
              <Typography variant="subtitle2">{user?.name || "User"}</Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {user && getRoleIcon(user.role)}
                {user && (
                  <Chip label={user.role} size="small" color={getRoleColor(user.role) as any} />
                )}
              </Box>
            </Box>
          </Box>
          <Divider sx={{ mb: 1 }} />
        </Box>
        <MenuItem component={Link} href={getDashboardLink()} onClick={handleUserMenuClose}>
          <DashboardIcon sx={{ mr: 2 }} />
          Dashboard
        </MenuItem>
        <MenuItem component={Link} href="/profile" onClick={handleUserMenuClose}>
          <SettingsIcon sx={{ mr: 2 }} />
          Profile
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleUserMenuClose}>
          <LogoutButton />
        </MenuItem>
      </Menu>

      {/* Notification Menu */}
      <Menu
        anchorEl={notificationMenuAnchor}
        open={Boolean(notificationMenuAnchor)}
        onClose={handleNotificationMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        PaperProps={{
          sx: { width: 320, maxHeight: 400 },
        }}
      >
        <Box sx={{ p: 2 }}>
          <Typography variant="h6">Notifications</Typography>
        </Box>
        <Divider />
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Appointment Confirmed</Typography>
            <Typography variant="body2" color="text.secondary">
              Your appointment with Dr. Smith is confirmed for tomorrow
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">Payment Received</Typography>
            <Typography variant="body2" color="text.secondary">
              Payment of $150 has been processed successfully
            </Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Box>
            <Typography variant="subtitle2">New Message</Typography>
            <Typography variant="body2" color="text.secondary">
              You have a new message from your professional
            </Typography>
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem component={Link} href="/notifications" onClick={handleNotificationMenuClose}>
          <Typography variant="body2" color="primary" sx={{ textAlign: "center", width: "100%" }}>
            View All Notifications
          </Typography>
        </MenuItem>
      </Menu>
    </>
  )
}
