import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";
import { alpha } from "@material-ui/core/styles";
import Box from "@material-ui/core/Box";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import { FormControl, RadioGroup, Radio } from "@material-ui/core";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import PreviewIcon from "@material-ui/icons/Visibility";
import FilterListIcon from "@material-ui/icons/FilterList";
import TextField from "@material-ui/core/TextField";
import DateButton from "./BookDetails/components/DateButton";
import DateModal from "./BookDetails/components/DateModal";

import CustomButtons from "../../shared/components/UIElements/CustomButtons";
import IconOnlyButton from "../../shared/components/UIElements/IconOnlyButton";

import "./BookTable.css";

function descendingComparator(a, b, orderBy) {
  const aValue = a[orderBy] ?? "";
  const bValue = b[orderBy] ?? "";
  if (isNaN(aValue) || isNaN(bValue)) {
    return aValue.localeCompare(bValue);
  }
  if (bValue < aValue) {
    return -1;
  }
  if (bValue > aValue) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const DEFAULT_ORDER = "asc";
const DEFAULT_ORDER_BY = null;
const DEFAULT_ROWS_PER_PAGE = 25;

function BookTableHead(props) {
  const {
    onSelectAllClick,
    order,
    orderBy,
    numSelected,
    rowCount,
    onRequestSort,
    headCells,
    checkbox,
    displayImage,
  } = props;
  const createSortHandler = (newOrderBy) => (event) => {
    onRequestSort(event, newOrderBy);
  };

  return (
    <TableHead>
      <TableRow>
        {checkbox && (
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                "aria-label": "select all",
              }}
            />
          </TableCell>
        )}
        <TableCell padding="see"></TableCell>
        {!displayImage && (
          <TableCell>
            <IconOnlyButton icon="image" title="Image" />
          </TableCell>
        )}
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            sx={{ backgroundColor: "yellow", fontWeight: "bold" }}
            align={headCell.numeric ? "right" : "left"}
            padding={headCell.disablePadding ? "none" : "normal"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box
                  component="span"
                  style={{
                    position: "absolute",
                    top: "-9999px",
                    left: "-9999px",
                  }}
                  aria-hidden="true"
                >
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

BookTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function BookTableToolbar(props) {
  const {
    numSelected,
    selected: selectedRows,
    title,
    actions,
    filterValue,
    handleChangeFilter,
    handleResetOrderBy,
    handleResetPage,
    searchText,
    handleSearch,
    handleAdditionToCollection,
  } = props;

  const [openFilter, setOpenFilter] = React.useState(false);
  const [openCollectionModal, setOpenCollectionModal] = useState(false);
  const [dateObtention, setDateObtention] = useState(null);

  const handleOpenFilter = () => {
    setOpenFilter(!openFilter);
  };

  const handleOpenOwnedModal = () => {
    setOpenCollectionModal(true);
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: "1 1 100%" }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} sélectionné(s)
        </Typography>
      ) : (
        <Typography
          sx={{ flex: "1 1 100%" }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          {title}
        </Typography>
      )}

      <DateModal
        open={openCollectionModal}
        handleClose={() => setOpenCollectionModal(false)}
        date={dateObtention}
        label="Date d'achat"
        title="Quand avez-vous acheté ce(s) livre(s) ?"
        handleChange={(e) => setDateObtention(e.target.value)}
        handleSubmit={() =>
          handleAdditionToCollection(selectedRows, dateObtention)
        }
      />

      <IconButton onClick={handleOpenFilter}>
        <FilterListIcon />
      </IconButton>
      <div className="filter-container">
        {openFilter && (
          <React.Fragment>
            <FormControl>
              <div
                style={{
                  padding: "10px",
                  margin: "10px",
                  marginLeft: "50px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                }}
              >
                {" "}
                <RadioGroup
                  row
                  aria-labelledby="test"
                  name="test"
                  value={filterValue}
                  // execute la fonction handleChangeFilter et lui passe en paramètre l'event
                  onChange={(event) => {
                    handleChangeFilter(event);
                    handleResetOrderBy();
                    handleResetPage();
                  }}
                >
                  <FormControlLabel
                    value="all"
                    control={<Radio />}
                    label="Tout"
                  />
                  <FormControlLabel
                    value="collection"
                    control={<Radio />}
                    label="Collection"
                  />
                  <FormControlLabel
                    value="wishlist"
                    control={<Radio />}
                    label="Wishlist"
                  />
                  <FormControlLabel
                    value="none"
                    control={<Radio />}
                    label="Autres"
                  />
                </RadioGroup>
              </div>
            </FormControl>

            <TextField
              label="Recherche"
              variant="outlined"
              value={searchText}
              onChange={handleSearch}
              margin="normal"
              InputLabelProps={{ position: "top" }}
            />
          </React.Fragment>
        )}

        {numSelected > 0 ? (
          <div
            style={{
              padding: "12px",
              margin: "10px",
              marginLeft: "10px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              border: "1px solid #ccc",
              borderRadius: "5px",
            }}
          >
            {actions.map((action) =>
              action.type === "wishlist" ? (
                <CustomButtons
                  buttonType={action.type}
                  title={action.title}
                  onClick={() => action.handleAction(selectedRows)}
                />
              ) : (
                <DateButton
                  options={[
                    {
                      name: "Je possède",
                      action: () => action.handleAction(selectedRows),
                    },
                    {
                      name: "Je possède (daté)",
                      action: handleOpenOwnedModal,
                    },
                  ]}
                />
              )
            )}
          </div>
        ) : null}
      </div>
      {/* {openFilter && <SearchBar />} */}
    </Toolbar>
  );
}

BookTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function BookTable({
  rows,
  headCells,
  title,
  actions,
  checkbox,
  handleChangeFilter,
  filterValue,
  handleSearch,
  searchText,
  handleAdditionToCollection,
}) {
  const [order, setOrder] = React.useState(DEFAULT_ORDER);
  const [orderBy, setOrderBy] = React.useState(DEFAULT_ORDER_BY);
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(true);
  const [visibleRows, setVisibleRows] = React.useState(null);
  const [rowsPerPage, setRowsPerPage] = React.useState(DEFAULT_ROWS_PER_PAGE);
  const [paddingHeight, setPaddingHeight] = React.useState(0);

  React.useEffect(() => {
    let rowsOnMount = stableSort(
      rows,
      getComparator(DEFAULT_ORDER, DEFAULT_ORDER_BY)
    );

    rowsOnMount = rowsOnMount.slice(
      0 * DEFAULT_ROWS_PER_PAGE,
      0 * DEFAULT_ROWS_PER_PAGE + DEFAULT_ROWS_PER_PAGE
    );

    setVisibleRows(rowsOnMount);
  }, [rows]);

  const handleRequestSort = React.useCallback(
    (event, newOrderBy) => {
      // execute the code only if theOrderBy is equal to the current orderBy
      if (newOrderBy !== orderBy) {
        setOrderBy(newOrderBy);
        return;
      }
      const isAsc = orderBy === newOrderBy && order === "asc";
      const toggledOrder = isAsc ? "desc" : "asc";
      setOrder(toggledOrder);
      setOrderBy(newOrderBy);

      const sortedRows = stableSort(
        rows,
        getComparator(toggledOrder, newOrderBy)
      );
      const updatedRows = sortedRows.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);
    },
    [order, orderBy, page, rowsPerPage, rows]
  );

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n._id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
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
  };

  const handleChangePage = React.useCallback(
    (event, newPage, rows) => {
      setPage(newPage);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));

      const updatedRows = sortedRows.slice(
        newPage * rowsPerPage,
        newPage * rowsPerPage + rowsPerPage
      );

      setVisibleRows(updatedRows);

      // Avoid a layout jump when reaching the last page with empty rows.
      const numEmptyRows =
        newPage > 0
          ? Math.max(0, (1 + newPage) * rowsPerPage - rows.length)
          : 0;

      const newPaddingHeight = (dense ? 33 : 53) * numEmptyRows;
      setPaddingHeight(newPaddingHeight);
    },
    [order, orderBy, dense, rowsPerPage]
  );

  const handleChangeRowsPerPage = React.useCallback(
    (event, rows) => {
      const updatedRowsPerPage = parseInt(event.target.value, 10);
      setRowsPerPage(updatedRowsPerPage);

      setPage(0);

      const sortedRows = stableSort(rows, getComparator(order, orderBy));
      const updatedRows = sortedRows.slice(
        0 * updatedRowsPerPage,
        0 * updatedRowsPerPage + updatedRowsPerPage
      );

      setVisibleRows(updatedRows);

      // There is no layout jump to handle on the first page.
      setPaddingHeight(0);
    },
    [order, orderBy]
  );

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

  const isSelected = (name) => selected.indexOf(name) !== -1;

  const history = useHistory();

  const openPreview = (id) => {
    history.push(`/book/${id}`);
  };

  return (
    <Box sx={{ width: "100%" }}>
      <Paper sx={{ width: "100%", mb: 2 }}>
        <BookTableToolbar
          numSelected={selected.length}
          selected={selected}
          title={title}
          actions={actions}
          filterValue={filterValue}
          handleChangeFilter={handleChangeFilter}
          handleResetOrderBy={() => setOrderBy(null)}
          handleResetPage={() => setPage(0)}
          handleSearch={handleSearch}
          searchText={searchText}
          handleAdditionToCollection={handleAdditionToCollection}
        />
        <TableContainer>
          <Table
            stickyHeader
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? "small" : "large"}
          >
            <BookTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
              headCells={headCells}
              checkbox={checkbox}
              displayImage={dense}
            />
            <TableBody>
              {visibleRows
                ? visibleRows.map((row, index) => {
                    const isItemSelected = isSelected(row._id);
                    const labelId = `Book-table-checkbox-${index}`;

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row._id)}
                        role="checkbox"
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.name}
                        selected={isItemSelected}
                        sx={{ cursor: "pointer" }}
                      >
                        {checkbox && (
                          <TableCell padding="checkbox">
                            <Checkbox
                              color="primary"
                              checked={isItemSelected}
                              inputProps={{
                                "aria-labelledby": labelId,
                              }}
                            />
                          </TableCell>
                        )}
                        <TableCell padding="see">
                          <IconButton
                            key={row._id}
                            onClick={() => openPreview(row._id)}
                          >
                            <PreviewIcon />
                          </IconButton>
                        </TableCell>
                        {!dense && (
                          <TableCell>
                            <img
                              src={row.image}
                              style={{ width: "100px" }}
                              alt={row.titre}
                            />
                          </TableCell>
                        )}
                        {headCells.map((headCell) => {
                          const cellValue = row[headCell.id];

                          const align = headCell.numeric ? "right" : "left";

                          return (
                            <TableCell key={headCell.id} align={align}>
                              {headCell.id === "prix"
                                ? cellValue.toFixed(2) + "€"
                                : headCell.id === "serie"
                                ? row["version"]
                                  ? cellValue + " (v" + row["version"] + ")"
                                  : cellValue
                                : cellValue}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  })
                : null}
              {paddingHeight > 0 && (
                <TableRow
                  style={{
                    height: paddingHeight,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[25, 50, 100]}
          component="div"
          count={rows.length}
          labelRowsPerPage="Éléments par page"
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(event, newPage) =>
            handleChangePage(event, newPage, rows)
          }
          onRowsPerPageChange={(event) => handleChangeRowsPerPage(event, rows)}
        />
        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label="Condensé"
          style={{ marginLeft: "1rem", marginBottom: "1rem" }}
        />
      </Paper>
    </Box>
  );
}
