import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TablePagination from "@material-ui/core/TablePagination";
import TableRow from "@material-ui/core/TableRow";
import IntlMessages from "util/IntlMessages";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { updateUserList, filterUsers } from "actions/UserManagement";
import { CSVLink } from "react-csv";

/* #region  UserManagement Table Headers */
const columns = [
  { id: "name", label: "Name", minWidth: 170, align: "center" },
  { id: "code", label: "ISO\u00a0Code", minWidth: 100, align: "center" },
  {
    id: "population",
    label: "Population",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "size",
    label: "Size\u00a0(km\u00b2)",
    minWidth: 170,
    align: "center",
    format: (value) => value.toLocaleString("en-US"),
  },
  {
    id: "density",
    label: "Density",
    minWidth: 170,
    align: "center",
    format: (value) => value.toFixed(2),
  },
  {
    id: "delete",
    label: "Delete",
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },

  {
    id: "edit",
    label: "Edit",
    minWidth: 50,
    align: "center",
    format: (value) => value.toFixed(2),
  },
];
/* #endregion */

/* #region  Table Header Sorter */

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
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
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function EnhancedTableHead(props) {
  const { classes, order, orderBy, onRequestSort, columns } = props;
  const createSortHandler = (property) => {
    console.log(property);
    onRequestSort(property);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={"center"}
            padding={headCell.disablePadding ? "none" : "default"}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.id === "edit" || headCell.id === "delete" ? (
              headCell.label
            ) : (
              <TableSortLabel
                id={headCell.id}
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : "asc"}
                onClick={(headcell) => {
                  console.log(headcell.target.id);
                  createSortHandler(headcell.target.id);
                }}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <span className={classes.visuallyHidden}>
                    {order === "" ? "" : ""}
                  </span>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

/* #endregion */

export class UserManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filter: { text1: "", text2: "", text3: "" },
      showEditModal: false,
      orderBy: "name",
      order: "asc",
      setOrderBy: "name",
      setOrder: "asc",
    };
  }

  render() {
    /* #region  init const */
    const page = 0;
    const rowsPerPage = 10;
    const setRowsPerPage = 10;
    const setPage = 1;
    const {
      filter: { text1, text2, text3 },
    } = this.state;
    const { showMessage, loader, alertMessage } = this.props;

    /* #endregion */

    /* #region Custome Styles */

    const headerClassess = makeStyles((theme) => ({
      root: {
        width: "100%",
      },
      paper: {
        width: "100%",
        marginBottom: theme.spacing(2),
      },
      table: {
        minWidth: 750,
      },
      visuallyHidden: {
        border: 0,
        clip: "rect(0 0 0 0)",
        height: 1,
        margin: -1,
        overflow: "hidden",
        padding: 0,
        position: "absolute",
        top: 20,
        width: 1,
      },
    }));

    const classes = makeStyles((theme) => ({
      root: {
        width: "100%",
        padding: "5% 5% 5% 5% !important",
      },
      form: {
        margin: "5% 5% 5% 5% !important",
      },
      "& > *": {
        margin: theme.spacing(2),
        width: "25ch",
      },
      container: {
        maxHeight: 440,
      },
    }));
    /* #endregion */

    /* #region  state actions */
    const handleChangePage = (event, newPage) => {
      setPage(newPage);
    };

    const handleRequestSort = (property) => {
      var isAsc = this.state.orderBy === property && this.state.order === "asc";
      this.setState({ order: isAsc ? "desc" : "asc", orderBy: property });
    };

    const handleChangeRowsPerPage = (event) => {
      setRowsPerPage(+event.target.value);
      setPage(0);
    };

    /* #endregion */ var users;

    if (this.props.users) users = this.props.users;
    else users = [];
    this.state.users = this.props.users;

    return (
      <Paper className={classes.root}>
        <form
          className={classes.form}
          noValidate
          autoComplete="off"
          onSubmit={(event) => {
            event.preventDefault();
            this.props.filterUsers();
          }}
        >
          <TextField
            id="text1"
            label={<IntlMessages id="appModule.signin" />}
            variant="filled"
            onChange={(e) => {
              this.setState({ text1: e.target.value });
            }}
          />
          <TextField
            id="text2"
            label={<IntlMessages id="appModule.signin" />}
            variant="filled"
            onChange={(e) => {
              this.setState({ text2: e.target.value });
            }}
          />
          <TextField
            id="text3"
            label={<IntlMessages id="appModule.signin" />}
            variant="filled"
            onChange={(e) => {
              this.setState({ text3: e.target.value });
            }}
          />
          <input type="submit" value="Submit" />
          <button>
            {" "}
            <CSVLink filename="Users" data={users} enclosingCharacter={`'`}>
              CSV File
            </CSVLink>
          </button>
        </form>

        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        <TableContainer className={classes.container}>
          <Table>
            <EnhancedTableHead
              classes={headerClassess}
              order={this.state.order}
              orderBy={this.state.orderBy}
              onRequestSort={handleRequestSort}
              columns={columns}
            />

            <TableBody>
              {stableSort(
                users,
                getComparator(this.state.order, this.state.orderBy)
              ).map((row) => {
                row["edit"] = "hi";
                row["delete"] = "bye";
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map((column) => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.format && typeof value === "number"
                            ? column.format(value)
                            : value}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
              }
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[10, 25, 100]}
          component="div"
          count={users.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

const mapStateToProps = ({ userFilter }) => {
  const { users } = userFilter;

  console.log(userFilter);
  return { users };
};

export default connect(mapStateToProps, {
  filterUsers,
  updateUserList,
})(UserManagement);
