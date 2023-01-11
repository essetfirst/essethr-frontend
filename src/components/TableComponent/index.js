import React from "react";
import PropTypes from "prop-types";

import {
  makeStyles,
  Paper,
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TablePagination,
  FormControlLabel,
  Box,
  Slide,
  Switch,
  Typography,
  colors,
} from "@material-ui/core";

import { Ballot as EmptyTableIcon } from "@material-ui/icons";
// import EmptyTableIcon from "../../icons/EmptyTable";
import { ThreeDots } from "react-loading-icons";

import ErrorBoxComponent from "../ErrorBoxComponent";

import Head from "./Head";
import Toolbar from "./Toolbar";
import Row from "./Row";

const useStyles = makeStyles((theme) => ({
  root: {
    width: "100%",
  },

  paper: {
    width: "100%",
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },

  table: {
    width: "100%",
  },
}));

// const initialState = { data: [], loading: false, error: null };
// const reducer = (state, action) => {};

const TableComponent = ({
  columns,
  data = [],
  renderRow,
  size,

  requestState,
  emptyDataText,
  rowActions = [],

  selectionEnabled = true,
  toolbarSelectionTitle,
  selectionActions = [],

  onRowClick,
  onSelectionChange,
  onSortParamsChange,

  expandableRow,
  expandableRowIcons,
  renderRowExpansion,

  paginationEnabled = true,

  sizeAdjustEnabled = false,

  ...rest
}) => {
  const classes = useStyles();
  const [selected, setSelected] = React.useState([]);
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("id");
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const rowCount = data.length;
  const handleChangeDense = () => setDense(!dense);

  /***************************** SORTING HANDLERS ***********************************/
  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "desc";
    const newOrderDir = isAsc ? "desc" : "asc";
    const newOrderBy = property;
    setOrder(newOrderDir);
    setOrderBy(newOrderBy);
    onSortParamsChange(newOrderBy, newOrderDir);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };
  /********************************************************************************/

  /****************** SELECTION HANDLERS ******************************************/
  const numSelected = selected.length;
  const isSelected = (id) => selected.indexOf(id) !== -1;

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = data.map((n) => n.id || n._id);
      setSelected(newSelecteds);
      onSelectionChange(newSelecteds);
      return;
    }
    setSelected([]);
    onSelectionChange([]);
  };

  const handleSelectClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
    onSelectionChange(newSelected);
  };

  /*****************************************************************************************/

  /**************** PAGINATION HANDLERS ************************************************/
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

  /*********************************************************************************************/

  /**************************** RENDERING DATA ROWS ********************************************/

  /***********************************************************************************************/

  const { requesting, isLoading, error, onRetry } = requestState || {};

  React.useEffect(() => {
    setSelected([]);
    setOrderBy("id");
    setPage(0);
    setDense(true);
    setRowsPerPage(10);
  }, [data]);

  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <TableContainer>
          <Toolbar
            selected={selected}
            maxCount={data.length}
            toolbarActions={selectionActions}
            toolbarSelectionTitle={toolbarSelectionTitle}
          />
          <MuiTable
            size={
              dense
                ? size === "small"
                  ? size
                  : "medium"
                : size === "medium"
                ? size
                : "medium"
            }
            {...rest}
          >
            <Head
              fields={columns}
              rowCount={rowCount}
              selectable={selectionEnabled}
              selectedCount={numSelected}
              onSelectAllClicked={handleSelectAllClick}
              createSortHandler={createSortHandler}
              orderBy={orderBy}
              orderDir={order}
              hasActionsField={rowActions.length > 0}
            />
            <TableBody>
              {requesting || isLoading ? (
                <Slide
                  direction="left"
                  in={requesting || isLoading}
                  mountOnEnter
                  unmountOnExit
                >
                  {/* skeleton for Table Row */}
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={columns.length + 2}>
                      <Box
                        height={"100%"}
                        width="100%"
                        display="flex"
                        justifyContent="center"
                      >
                        <ThreeDots
                          fill="#009688"
                          stroke={colors.common.white}
                          width="50"
                          height="50"
                        />
                      </Box>
                    </TableCell>
                  </TableRow>
                </Slide>
              ) : error ? (
                <Slide
                  direction="left"
                  in={Boolean(error)}
                  mountOnEnter
                  unmountOnExit
                >
                  <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                    <TableCell colSpan={columns.length + 2}>
                      <Box
                        height={"100%"}
                        width="100%"
                        display="flex"
                        justifyContent="center"
                        alignItems="center"
                      >
                        <ErrorBoxComponent error={error} retry={onRetry} />
                      </Box>
                    </TableCell>
                  </TableRow>
                </Slide>
              ) : data && Array.isArray(data) && data.length > 0 ? (
                data
                  .slice(
                    paginationEnabled ? page * rowsPerPage : 0,
                    paginationEnabled
                      ? page * rowsPerPage + rowsPerPage
                      : data.length
                  )
                  .map((rowData) => {
                    return (
                      <Row
                        key={rowData.id || rowData._id}
                        columns={columns}
                        rowData={rowData}
                        renderRow={renderRow}
                        onRowClicked={onRowClick}
                        selectable={selectionEnabled}
                        isSelected={isSelected}
                        onSelectClicked={handleSelectClick}
                        rowActions={rowActions}
                      />
                    );
                  })
              ) : (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={columns.length + 2}>
                    <Box
                      height={"100%"}
                      width="100%"
                      display="flex"
                      flexDirection="column"
                      justifyContent="center"
                      alignItems="center"
                    >
                      {emptyDataText ? (
                        { emptyDataText }
                      ) : (
                        <>
                          <span>
                            <EmptyTableIcon fontSize="large" color="disabled" />
                          </span>
                          <Typography
                            align="center"
                            variant="body2"
                            color="textSecondary"
                          >
                            {"No entries to display."}
                          </Typography>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              )}
              {/* 
              {!requesting && !error && emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={columns.length + 2} />
                </TableRow>
              )} */}
            </TableBody>
          </MuiTable>
        </TableContainer>
        {paginationEnabled && (
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={data.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
        {sizeAdjustEnabled && (
          <Box p={1}>
            <FormControlLabel
              control={<Switch checked={dense} onChange={handleChangeDense} />}
              label="Dense padding"
            />
          </Box>
        )}
      </Paper>
    </div>
  );
};

TableComponent.propTypes = {
  columns: PropTypes.array.isRequired,
  data: PropTypes.array.isRequired,

  size: PropTypes.oneOf(["small", "medium", "large", "xlarge", "large"]),

  requestState: PropTypes.shape({
    requesting: PropTypes.bool,
    isLoading: PropTypes.bool,
    error: PropTypes.any,
    onRetry: PropTypes.func,
  }),

  renderRow: PropTypes.func,
  onRowClick: PropTypes.func,
  rowActions: PropTypes.array,

  selectionEnabled: PropTypes.bool,
  selectionActions: PropTypes.array,
  onSelectionChange: PropTypes.func,
  onSortParamsChange: PropTypes.func,

  expandableRow: PropTypes.bool,
  expandableRowIcons: PropTypes.shape({
    expand: PropTypes.node,
    collapse: PropTypes.node,
  }),
  renderRowExpansion: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
  //   apiUrl: PropTypes.string,
};

TableComponent.defaultProps = {
  renderRow: (_) => null,

  expandableRow: false,
  expandableRowIcons: {
    expand: null,
    collapse: null,
  },
  renderRowExpansion: (_) => null,

  onSelectionChange: (_) => {},
  onSortParamsChange: (_) => {},
};

export default TableComponent;
