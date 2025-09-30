"use client"

import { useState, useEffect, useCallback } from "react"
import { invoke } from "src/app/blitz-server"
import { useCurrentUser } from "src/app/users/hooks/useCurrentUser"
import getPayments from "src/app/payments/queries/getPayments"
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Grid,
  Paper,
  Tab,
  Tabs,
  IconButton,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material"
import {
  Payment as PaymentIcon,
  Receipt as ReceiptIcon,
  Download as DownloadIcon,
  MoreVert as MoreIcon,
  CheckCircle as CheckIcon,
  Schedule as ScheduleIcon,
  Cancel as CancelIcon,
  Refresh as RefreshIcon,
  CreditCard as CardIcon,
  AccountBalance as BankIcon,
  Phone as UpiIcon,
  Money as CashIcon,
} from "@mui/icons-material"
import { format } from "date-fns"
import { PAYMENT_STATUS, PAYMENT_METHODS, USER_ROLES } from "src/constants"
import Link from "next/link"

interface Payment {
  id: number
  appointmentId: number
  amount: number
  status: string
  method: string
  transactionId?: string | null
  createdAt: Date
  updatedAt: Date
  appointment: {
    id: number
    serviceType: string
    dateTime: Date
    customer: {
      name?: string | null
      email: string
    }
    professional: {
      user: {
        name?: string | null
        email: string
      }
    }
  }
}

interface TabPanelProps {
  children?: React.ReactNode
  index: number
  value: number
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`payments-tabpanel-${index}`}
      aria-labelledby={`payments-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  )
}

export default function PaymentsPage() {
  const user = useCurrentUser()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [tabValue, setTabValue] = useState(0)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null)
  const [refundDialogOpen, setRefundDialogOpen] = useState(false)
  const [refundReason, setRefundReason] = useState("")

  // Mock data for demonstration
  const mockPayments: Payment[] = [
    {
      id: 1,
      appointmentId: 1,
      amount: 150,
      status: PAYMENT_STATUS.PAID,
      method: PAYMENT_METHODS.CARD,
      transactionId: "txn_1234567890",
      createdAt: new Date("2024-01-15T10:30:00"),
      updatedAt: new Date("2024-01-15T10:30:00"),
      appointment: {
        id: 1,
        serviceType: "Cardiology Consultation",
        dateTime: new Date("2024-01-20T14:00:00"),
        customer: {
          name: "John Doe",
          email: "john@example.com"
        },
        professional: {
          user: {
            name: "Dr. Sarah Johnson",
            email: "sarah@example.com"
          }
        }
      }
    },
    {
      id: 2,
      appointmentId: 2,
      amount: 120,
      status: PAYMENT_STATUS.PENDING,
      method: PAYMENT_METHODS.UPI,
      transactionId: null,
      createdAt: new Date("2024-01-18T09:15:00"),
      updatedAt: new Date("2024-01-18T09:15:00"),
      appointment: {
        id: 2,
        serviceType: "Dermatology Consultation",
        dateTime: new Date("2024-01-25T11:00:00"),
        customer: {
          name: "Jane Smith",
          email: "jane@example.com"
        },
        professional: {
          user: {
            name: "Dr. Michael Chen",
            email: "michael@example.com"
          }
        }
      }
    },
    {
      id: 3,
      appointmentId: 3,
      amount: 100,
      status: PAYMENT_STATUS.REFUNDED,
      method: PAYMENT_METHODS.CARD,
      transactionId: "txn_0987654321",
      createdAt: new Date("2024-01-10T16:45:00"),
      updatedAt: new Date("2024-01-12T10:20:00"),
      appointment: {
        id: 3,
        serviceType: "Pediatric Consultation",
        dateTime: new Date("2024-01-15T15:30:00"),
        customer: {
          name: "Bob Wilson",
          email: "bob@example.com"
        },
        professional: {
          user: {
            name: "Dr. Emily Rodriguez",
            email: "emily@example.com"
          }
        }
      }
    }
  ]

  const loadPayments = useCallback(async () => {
    if (!user) return

    setLoading(true)
    try {
      // TODO: Implement getPayments query
      // const result = await invoke(getPayments, {})
      // setPayments(result.payments)

      // Use mock data for now
      setPayments(mockPayments)
    } catch (error) {
      console.error("Failed to load payments:", error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadPayments()
  }, [loadPayments])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, payment: Payment) => {
    setAnchorEl(event.currentTarget)
    setSelectedPayment(payment)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
    setSelectedPayment(null)
  }

  const handleRefundRequest = () => {
    setRefundDialogOpen(true)
    handleMenuClose()
  }

  const confirmRefundRequest = async () => {
    if (!selectedPayment) return

    try {
      // TODO: Implement refund request mutation
      console.log("Requesting refund for payment:", selectedPayment.id, "Reason:", refundReason)
      setRefundDialogOpen(false)
      setRefundReason("")
      setSelectedPayment(null)
      loadPayments()
    } catch (error) {
      console.error("Failed to request refund:", error)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return "success"
      case PAYMENT_STATUS.PENDING:
        return "warning"
      case PAYMENT_STATUS.FAILED:
        return "error"
      case PAYMENT_STATUS.REFUNDED:
        return "info"
      default:
        return "default"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case PAYMENT_STATUS.PAID:
        return <CheckIcon />
      case PAYMENT_STATUS.PENDING:
        return <ScheduleIcon />
      case PAYMENT_STATUS.FAILED:
        return <CancelIcon />
      case PAYMENT_STATUS.REFUNDED:
        return <RefreshIcon />
      default:
        return <ScheduleIcon />
    }
  }

  const getMethodIcon = (method: string) => {
    switch (method) {
      case PAYMENT_METHODS.CARD:
        return <CardIcon />
      case PAYMENT_METHODS.UPI:
        return <UpiIcon />
      case PAYMENT_METHODS.WALLET:
        return <BankIcon />
      case PAYMENT_METHODS.CASH:
        return <CashIcon />
      default:
        return <PaymentIcon />
    }
  }

  const filterPaymentsByStatus = (status?: string) => {
    if (!status) return payments
    return payments.filter(payment => payment.status === status)
  }

  const paidPayments = filterPaymentsByStatus(PAYMENT_STATUS.PAID)
  const pendingPayments = filterPaymentsByStatus(PAYMENT_STATUS.PENDING)
  const refundedPayments = filterPaymentsByStatus(PAYMENT_STATUS.REFUNDED)
  const failedPayments = filterPaymentsByStatus(PAYMENT_STATUS.FAILED)

  const totalPaid = paidPayments.reduce((sum, payment) => sum + payment.amount, 0)
  const totalPending = pendingPayments.reduce((sum, payment) => sum + payment.amount, 0)

  const renderPaymentCard = (payment: Payment) => (
    <Card key={payment.id} sx={{ mb: 2 }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar sx={{ bgcolor: "primary.main" }}>
              {getMethodIcon(payment.method)}
            </Avatar>
            <Box>
              <Typography variant="h6" component="h3">
                {payment.appointment.serviceType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.role === USER_ROLES.PROFESSIONAL
                  ? `Patient: ${payment.appointment.customer.name || payment.appointment.customer.email}`
                  : `Doctor: ${payment.appointment.professional.user.name || payment.appointment.professional.user.email}`}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Chip
              icon={getStatusIcon(payment.status)}
              label={payment.status}
              color={getStatusColor(payment.status) as any}
              size="small"
            />
            <IconButton
              size="small"
              onClick={(e) => handleMenuClick(e, payment)}
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Box>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Amount
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: "bold", color: "primary.main" }}>
              ${payment.amount}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Method
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: "500" }}>
              {payment.method}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Date
            </Typography>
            <Typography variant="body1">
              {format(new Date(payment.createdAt), "MMM dd, yyyy")}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Typography variant="body2" color="text.secondary">
              Time
            </Typography>
            <Typography variant="body1">
              {format(new Date(payment.createdAt), "hh:mm a")}
            </Typography>
          </Grid>
        </Grid>

        {payment.transactionId && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Transaction ID
            </Typography>
            <Typography variant="body2" sx={{ fontFamily: "monospace", bgcolor: "grey.100", p: 1, borderRadius: 1 }}>
              {payment.transactionId}
            </Typography>
          </Box>
        )}

        <Divider sx={{ my: 2 }} />

        <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
          <Button
            size="small"
            variant="outlined"
            startIcon={<ReceiptIcon />}
            component={Link}
            href={`/appointments/${payment.appointmentId}`}
          >
            View Appointment
          </Button>
          <Button
            size="small"
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={() => console.log("Download receipt for payment:", payment.id)}
          >
            Download Receipt
          </Button>
        </Box>
      </CardContent>
    </Card>
  )

  if (!user) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Please log in to view your payments
        </Typography>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom sx={{ fontWeight: "bold" }}>
          Payment History
        </Typography>
        <Typography variant="h6" color="text.secondary">
          View and manage your payment transactions
        </Typography>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <CheckIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Paid
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    ${totalPaid}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <ScheduleIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Pending
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    ${totalPending}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <PaymentIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Total Transactions
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {payments.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <RefreshIcon />
                </Avatar>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    Refunded
                  </Typography>
                  <Typography variant="h5" sx={{ fontWeight: "bold" }}>
                    {refundedPayments.length}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="payments tabs">
          <Tab label={`All (${payments.length})`} />
          <Tab label={`Paid (${paidPayments.length})`} />
          <Tab label={`Pending (${pendingPayments.length})`} />
          <Tab label={`Refunded (${refundedPayments.length})`} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        {loading ? (
          <Typography>Loading payments...</Typography>
        ) : payments.length > 0 ? (
          payments.map(renderPaymentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <PaymentIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No payments found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Your payment history will appear here once you make transactions.
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        {paidPayments.length > 0 ? (
          paidPayments.map(renderPaymentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <CheckIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No paid transactions
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Completed payments will appear here.
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        {pendingPayments.length > 0 ? (
          <>
            <Alert severity="info" sx={{ mb: 3 }}>
              You have {pendingPayments.length} pending payment(s) totaling ${totalPending}.
              Please complete these payments to confirm your appointments.
            </Alert>
            {pendingPayments.map(renderPaymentCard)}
          </>
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <ScheduleIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No pending payments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              All your payments are up to date.
            </Typography>
          </Box>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        {refundedPayments.length > 0 ? (
          refundedPayments.map(renderPaymentCard)
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <RefreshIcon sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
            <Typography variant="h5" component="h3" gutterBottom>
              No refunded payments
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Refunded transactions will appear here.
            </Typography>
          </Box>
        )}
      </TabPanel>

      {/* Action Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => console.log("Download receipt")}>
          <DownloadIcon sx={{ mr: 1 }} />
          Download Receipt
        </MenuItem>
        {selectedPayment?.status === PAYMENT_STATUS.PAID && (
          <MenuItem onClick={handleRefundRequest}>
            <RefreshIcon sx={{ mr: 1 }} />
            Request Refund
          </MenuItem>
        )}
      </Menu>

      {/* Refund Dialog */}
      <Dialog open={refundDialogOpen} onClose={() => setRefundDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request Refund</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Are you sure you want to request a refund for this payment?
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Reason for refund"
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRefundDialogOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={confirmRefundRequest}
            color="primary"
            variant="contained"
            disabled={!refundReason.trim()}
          >
            Request Refund
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
}