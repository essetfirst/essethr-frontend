import React from "react";
import {
  Box, Button, Paper, TextField, Typography, Table, TableHead, TableRow, TableCell, TableBody, Chip,
} from "@mui/material";
import { useSnackbar } from "notistack";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import PageView from "components/PageView";
import PageSkeleton from "components/PageSkeleton";
import EmptyState from "components/EmptyState";
import { benefitsApi } from "features/platform/api";

export default function BenefitsView() {
  const { enqueueSnackbar } = useSnackbar();
  const [plans, setPlans] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({ name: "", description: "", allowanceAmount: "" });

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await benefitsApi.list();
      setPlans(res?.plans || []);
    } catch {
      enqueueSnackbar("Failed to load benefit plans.", { variant: "error" });
    }
    setLoading(false);
  }, [enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  const handleCreate = async () => {
    if (!form.name.trim()) {
      enqueueSnackbar("Plan name is required.", { variant: "warning" });
      return;
    }
    const res = await benefitsApi.create({
      name: form.name.trim(),
      description: form.description.trim(),
      allowanceAmount: form.allowanceAmount ? Number(form.allowanceAmount) : 0,
    });
    if (res?.success) {
      enqueueSnackbar("Benefit plan created.", { variant: "success" });
      setForm({ name: "", description: "", allowanceAmount: "" });
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed to create plan.", { variant: "error" });
    }
  };

  if (loading) {
    return (
      <PageView title="Benefits" icon={<CardGiftcardIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
        <PageSkeleton showTitle={false} showActions={false} contentRows={4} />
      </PageView>
    );
  }

  return (
    <PageView title="Benefits" icon={<CardGiftcardIcon fontSize="large" />} backPath="/app/dashboard" breadcrumbs>
      <Paper sx={{ p: 2, mb: 2 }}>
        <Typography variant="subtitle2" gutterBottom>New benefit plan</Typography>
        <Box display="flex" flexWrap="wrap" gap={1.5} alignItems="flex-end">
          <TextField label="Name" size="small" required value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })} />
          <TextField label="Description" size="small" value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })} />
          <TextField label="Allowance (ETB)" size="small" type="number" value={form.allowanceAmount}
            onChange={(e) => setForm({ ...form, allowanceAmount: e.target.value })} />
          <Button variant="contained" onClick={handleCreate}>Add plan</Button>
        </Box>
      </Paper>

      {plans.length === 0 ? (
        <EmptyState title="No benefit plans" description="Create your first plan to track allowances and perks." />
      ) : (
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell align="right">Allowance</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {plans.map((plan) => (
              <TableRow key={plan._id}>
                <TableCell>{plan.name}</TableCell>
                <TableCell>{plan.description || "—"}</TableCell>
                <TableCell align="right">{Number(plan.allowanceAmount || 0).toLocaleString()} ETB</TableCell>
                <TableCell>
                  <Chip size="small" label={plan.active !== false ? "Active" : "Inactive"}
                    color={plan.active !== false ? "success" : "default"} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </PageView>
  );
}
