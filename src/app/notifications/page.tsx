"use client"

import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import { useQuery } from "@blitzjs/rpc"
import getNotifications from "./queries/getNotifications"
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
} from "@mui/material"
import {
  Notifications as NotificationsIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material"
import { useState } from "react"
import { useMutation } from "@blitzjs/rpc"
import markNotificationRead from "./mutations/markNotificationRead"

export default function NotificationsPage() {
  const user = useCurrentUser()
  const [notifications] = useQuery(getNotifications, {})
  const [markReadMutation] = useMutation(markNotificationRead)

  const handleMarkAsRead = async (id: number) => {
    try {
      await markReadMutation(id)
    } catch (error) {
      // Handle error silently or show user-friendly message
    }
  }

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view notifications
        </Typography>
      </Container>
    )
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length || 0

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <NotificationsIcon sx={{ mr: 2, fontSize: 32 }} />
        <Typography variant="h4" component="h1">
          Notifications
        </Typography>
        {unreadCount > 0 && <Chip label={`${unreadCount} unread`} color="primary" sx={{ ml: 2 }} />}
      </Box>

      {!notifications || notifications.length === 0 ? (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 4 }}>
            <NotificationsIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              No notifications yet
            </Typography>
            <Typography variant="body2" color="text.secondary">
              You&apos;ll see notifications about appointments, payments, and system updates here.
            </Typography>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <List>
            {notifications.map((notification, index) => (
              <div key={notification.id}>
                <ListItem
                  sx={{
                    bgcolor: notification.isRead ? "transparent" : "action.hover",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Typography variant="subtitle1">{notification.message}</Typography>
                        <Chip
                          label={notification.type}
                          size="small"
                          color="secondary"
                          variant="outlined"
                        />
                        {!notification.isRead && <Chip label="New" size="small" color="primary" />}
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" color="text.secondary">
                        {new Date(notification.createdAt).toLocaleString()}
                      </Typography>
                    }
                  />
                  <ListItemSecondaryAction>
                    {!notification.isRead && (
                      <IconButton
                        edge="end"
                        onClick={() => handleMarkAsRead(notification.id)}
                        title="Mark as read"
                      >
                        <MarkReadIcon />
                      </IconButton>
                    )}
                  </ListItemSecondaryAction>
                </ListItem>
                {index < notifications.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Card>
      )}
    </Container>
  )
}
