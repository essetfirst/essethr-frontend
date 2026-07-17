import { fmt } from "utils/date";
import React from "react";
import {
  Box,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Typography,
  CircularProgress,
  MenuItem,
  TablePagination,
} from "@mui/material";
import API from "api";
import Searchbar from "components/common/Searchbar";

const ACTION_OPTIONS = [
  { value: "", label: "All actions" },
  { value: "auth.login", label: "auth.login" },
  { value: "auth.logout", label: "auth.logout" },
  { value: "employee.create", label: "employee.create" },
  { value: "employee.update", label: "employee.update" },
  { value: "employee.import", label: "employee.import" },
  { value: "leave.approve", label: "leave.approve" },
  { value: "payroll.lock", label: "payroll.lock" },
  { value: "payroll.finalize", label: "payroll.finalize" },
  { value: "role.create", label: "role.create" },
];

const AuditLogPanel = () => {
  const [logs, setLogs] = React.useState([]);
  const [total, setTotal] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState(null);
  const [search, setSearch] = React.useState("");
  const [action, setAction] = React.useState("");
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(25);

  const handleSearchChange = () => (e) => {
    setSearch(e.target.value);
    setPage(0);
  };

  React.useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.audit.getAll({
          search,
          action: action || undefined,
          page: page + 1,
          limit: rowsPerPage,
        });
        if (cancelled) return;
        if (res?.success) {
          setLogs(res.logs || res.data || []);
          setTotal(res.pagination?.total ?? res.total ?? 0);
        } else {
          setError(res?.error || "Could not load audit logs.");
        }
      } catch (e) {
        if (!cancelled) setError(e.message);
      }
      if (!cancelled) setLoading(false);
    })();
    return () => { cancelled = true; };
  }, [search, action, page, rowsPerPage]);

  return (
    <Box>
      <Box mb={2} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gridGap={12}>
        <Typography variant="body2" color="textSecondary">
          {total} events
        </Typography>
        <Box display="flex" alignItems="center" gridGap={12}>
          <TextField
            select
            label="Action"
            size="small"
            value={action}
            onChange={(e) => { setAction(e.target.value); setPage(0); }}
            style={{ minWidth: 180 }}
          >
            {ACTION_OPTIONS.map((o) => (
              <MenuItem key={o.value || "all"} value={o.value}>{o.label}</MenuItem>
            ))}
          </TextField>
          <Searchbar
            searchTerm={search}
            searchTermPlaceholder="Search actor, action, summary…"
            onSearchTermChange={handleSearchChange}
          />
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Paper variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>When</TableCell>
                <TableCell>Actor</TableCell>
                <TableCell>Action</TableCell>
                <TableCell>Summary</TableCell>
                <TableCell>IP</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {logs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No audit events yet.
                  </TableCell>
                </TableRow>
              ) : (
                logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      {fmt(log.createdOn, "MMM d, yyyy HH:mm")}
                    </TableCell>
                    <TableCell>{log.actorEmail || "—"}</TableCell>
                    <TableCell>{log.action}</TableCell>
                    <TableCell>{log.summary || "—"}</TableCell>
                    <TableCell>{log.metadata?.ip || "—"}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            count={total}
            page={page}
            onChangePage={(_e, newPage) => setPage(newPage)}
            rowsPerPage={rowsPerPage}
            onChangeRowsPerPage={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
            rowsPerPageOptions={[10, 25, 50, 100]}
          />
        </Paper>
      )}
    </Box>
  );
};

export default AuditLogPanel;
