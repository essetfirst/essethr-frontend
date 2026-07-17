import React from "react";
import {
  Box, Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip, MenuItem,
} from "@mui/material";
import { useSnackbar } from "notistack";
import ReceiptIcon from "@mui/icons-material/Receipt";
import PageView from "components/PageView";
import PageSkeleton from "components/PageSkeleton";
import EmptyState from "components/EmptyState";
import { expensesApi } from "features/platform/api";

const STATUS_COLORS = {
  pending: "warning",
  approved: "success",
  rejected: "error",
  paid: "info",
};

export default function ExpensesView() {
  const { enqueueSnackbar } = useSnackbar();
  const [claims, setClaims] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [statusFilter, setStatusFilter] = React.useState("");
  const [form, setForm] = React.useState({
    employeeId: "",
    amount: "",
    category: "",
    description: "",
  });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await expensesApi.list(statusFilter ? { status: statusFilter } : {});
      setClaims(res?.claims || []);
    } catch {
      enqueueSnackbar("Failed to load expense claims.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar, statusFilter]);

  React.useEffect(() => { load(); }, [load]);

  const handleSubmit = async () => {
    if (!form.employeeId.trim() || !form.amount) {
      enqueueSnackbar("Employee ID and amount are required.", { variant: "warning" });
      return;
    }
    const res = await expensesApi.create({
      employeeId: form.employeeId.trim(),
      amount: Number(form.amount),
      category: form.category.trim() || undefined,
      description: form.description.trim() || undefined,
    });
    if (res?.success) {
      enqueueSnackbar("Expense claim submitted.", { variant: "success" });
      setForm({ employeeId: "", amount: "", category: "", description: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to submit claim.", { variant: "error" });
    }
  };

  const updateStatus = async (id, status) => {
    const res = await expensesApi.updateStatus(id, status);
    if (res?.success) {
      enqueueSnackbar(`Claim marked ${status}.`, { variant: "success" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Update failed.", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <PageView title="Expenses" icon={<ReceiptIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
        <PageSkeleton showTitle={false} showActions={false} contentRows={4} />
      </PageView>
    );
  }

  return (
    <PageView title="Expenses" icon={<ReceiptIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>Submit claim</Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
          <TextField label="Employee ID" size="small" required value={form.employeeId}
            onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
          <TextField label="Amount" size="small" type="number" required value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })} />
          <TextField label="Category" size="small" value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })} />
          <TextField label="Description" size="small" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <Button variant="contained" onClick={handleSubmit}>Submit</Button>
        </Box>
      </Paper>

      <Box display="flex" justifyContent="flex-end" mb={2}>
        <TextField select label="Status" size="small" value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)} sx={{ minWidth: 160 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
          <MenuItem value="paid">Paid</MenuItem>
        </TextField>
      </Box>

      {claims.length === 0 ? (
        <EmptyState title="No expense claims" description="Submitted claims will appear here." />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Employee</TableCell>
              <TableCell>Category</TableCell>
              <TableCell align="right">Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {claims.map((claim) => (
              <TableRow key={claim._id}>
                <TableCell>{claim.employeeId}</TableCell>
                <TableCell>{claim.category || "—"}</TableCell>
                <TableCell align="right">{Number(claim.amount).toLocaleString()} {claim.currency || "ETB"}</TableCell>
                <TableCell>
                  <Chip size="small" label={claim.status} color={STATUS_COLORS[claim.status] || "default"} />
                </TableCell>
                <TableCell>
                  {claim.status === "pending" && (
                    <Box display="flex" gap={1}>
                      <Button size="small" onClick={() => updateStatus(claim._id, "approved")}>Approve</Button>
                      <Button size="small" color="error" onClick={() => updateStatus(claim._id, "rejected")}>Reject</Button>
                    </Box>
                  )}
                  {claim.status === "approved" && (
                    <Button size="small" onClick={() => updateStatus(claim._id, "paid")}>Mark paid</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageView>
  );
}
