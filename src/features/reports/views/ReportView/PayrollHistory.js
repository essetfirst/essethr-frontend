import { fmt } from "utils/date";
import React from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box, Paper, Typography, CircularProgress, Button, Table, TableHead, TableRow, TableCell, TableBody,
} from "@mui/material";
import PageView from "components/PageView";
import API from "api";

export default function PayrollHistory() {
  const [payrolls, setPayrolls] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    API.payroll.getAll().then((res) => {
      setPayrolls(res?.payrolls || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  return (
    <PageView title="Payroll History Report" backPath="/app/reports">
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}><CircularProgress /></Box>
      ) : (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title / Period</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payrolls.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>{p.title || p.period || "Payroll run"}</TableCell>
                  <TableCell>{p.status || (p.locked ? "locked" : "draft")}</TableCell>
                  <TableCell>{p.createdOn ? fmt(p.createdOn, "MMM d, yyyy") : "—"}</TableCell>
                  <TableCell align="right">
                    <Button component={RouterLink} to={`/app/payroll/${p._id}`} size="small" color="primary">
                      View & compare
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!payrolls.length && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No payroll runs found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      )}
    </PageView>
  );
}
