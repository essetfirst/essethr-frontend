/**
 * Reusable CRUD module page for platform features.
 */
import React from "react";
import {
  Box, Button, TextField, Typography, Paper, Table, TableHead, TableRow,
  TableCell, TableBody, MenuItem, TablePagination,
} from "@mui/material";
import { Ballot as EmptyTableIcon } from "@mui/icons-material";
import PageView from "components/PageView";
import PageSkeleton from "components/PageSkeleton";
import { useSnackbar } from "notistack";

const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export default function ModulePage({ title, icon, loadFn, columns, formFields, createFn, onRowAction }) {
  const { enqueueSnackbar } = useSnackbar();
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const [form, setForm] = React.useState({});
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const load = React.useCallback(async () => {
    setLoading(true);
    try {
      const res = await loadFn();
      setRows(res?.items || res?.jobs || res?.templates || res?.assignments ||
        res?.requests || res?.candidates || res?.instances || res?.goals ||
        res?.reviews || res?.courses || res?.records || []);
    } catch (e) {
      enqueueSnackbar("Failed to load.", { variant: "error" });
    }
    setLoading(false);
  }, [loadFn, enqueueSnackbar]);

  React.useEffect(() => { load(); }, [load]);

  React.useEffect(() => {
    setPage(0);
  }, [rows.length]);

  const handleCreate = async () => {
    if (!createFn) return;
    const res = await createFn(form);
    if (res?.success) {
      enqueueSnackbar("Saved.", { variant: "success" });
      setForm({});
      load();
    } else {
      enqueueSnackbar(res?.error || "Failed.", { variant: "error" });
    }
  };

  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  const paginatedRows = rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  const colSpan = columns.length + (onRowAction ? 1 : 0);

  return (
    <PageView title={title} icon={icon} backPath="/app/dashboard" breadcrumbs>
      {createFn && formFields && (
        <Paper style={{ padding: 16, marginBottom: 16 }}>
          <Typography variant="subtitle1" gutterBottom>Add new</Typography>
          <Box display="flex" flexWrap="wrap" gridGap={12} alignItems="flex-end">
            {formFields.map((f) => (
              f.type === "select" ? (
                <TextField
                  key={f.key} select label={f.label} size="small" style={{ minWidth: 140 }}
                  value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                >
                  {(f.options || []).map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
                </TextField>
              ) : (
                <TextField
                  key={f.key} label={f.label} size="small" type={f.type || "text"}
                  value={form[f.key] || ""} onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )
            ))}
            <Button variant="contained" color="primary" onClick={handleCreate}>Save</Button>
          </Box>
        </Paper>
      )}
      {loading ? (
        <PageSkeleton showTitle={false} showActions={false} contentRows={5} />
      ) : (
        <Paper>
          <Table size="small">
            <TableHead>
              <TableRow>
                {columns.map((c) => <TableCell key={c.key}>{c.label}</TableCell>)}
                {onRowAction && <TableCell align="right">Actions</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={colSpan} align="center">
                    <Box py={4} display="flex" flexDirection="column" alignItems="center" gridGap={8}>
                      <EmptyTableIcon fontSize="large" color="disabled" />
                      <Typography variant="body2" color="textSecondary">
                        No records yet. Add your first entry above or check back later.
                      </Typography>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : paginatedRows.map((row) => (
                <TableRow key={row._id}>
                  {columns.map((c) => (
                    <TableCell key={c.key}>{c.render ? c.render(row) : row[c.key] ?? "—"}</TableCell>
                  ))}
                  {onRowAction && (
                    <TableCell align="right">{onRowAction(row, load)}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length > 0 && (
            <TablePagination
              component="div"
              count={rows.length}
              page={page}
              onChangePage={handleChangePage}
              rowsPerPage={rowsPerPage}
              onChangeRowsPerPage={handleChangeRowsPerPage}
              rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
            />
          )}
        </Paper>
      )}
    </PageView>
  );
}
