import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import TableContainer from "@material-ui/core/TableContainer";
import TableHeader from "./TableHeader";
import TablePagination from "../TablePagination/TablePagination";
import IntlMessages from "util/IntlMessages";
import { connect } from "react-redux";
import TextField from "@material-ui/core/TextField";
import CircularProgress from "@material-ui/core/CircularProgress";
import { updateUserList, filterUsers } from "actions/UserManagement";
import { CSVLink } from "react-csv";
import { slideDown, slideUp } from "./TableAnimation";
import ToggleTableRow from "./ToggleTableRow";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import { convertToPersianNumber } from "./PersianNumber";
import "./TableFilter.css";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";

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
    id: "action",
    label: "Actions",
    disablePadding: true,
  },
];
/* #endregion */
function stableSort(array, comparator) {
  console.log(Array.isArray(array));

  if (!Array.isArray(array)) return [{}];
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}
function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

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
      previous: {},
      setPrevious: {},
      expanded: false,
    };
  }

  toggleExpander = (e) => {
    if (e.target.type === "checkbox") return;

    if (!this.state.expanded) {
      this.setState({ expanded: true }, () => {
        if (this.refs.expanderBody) {
          slideDown(this.refs.expanderBody);
        }
      });
    } else {
      slideUp(this.refs.expanderBody, {
        onComplete: () => {
          this.setState({ expanded: false });
        },
      });
    }
  };

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

    const filterStyle = makeStyles((theme) => ({
      root: {
        "& > *": {
          margin: theme.spacing(1),
          width: "25ch",
        },
      },
    }));

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

    const formStyles = makeStyles((theme) => ({
      root: {
        flexGrow: 1,
      },
      paper: {
        padding: theme.spacing(1),
        textAlign: "center",
        color: theme.palette.text.secondary,
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
        width: "25px",
      },
      container: {
        maxHeight: 440,
      },
    }));
    /* #endregion */

    /* #region  state actions */

    const handleChangePage = (event, newPage) => {
      this.state.setPage = newPage;
      alert("handleChangePage");
    };

    const handleRequestSort = (property) => {
      var isAsc = this.state.orderBy === property && this.state.order === "asc";
      this.setState({ order: isAsc ? "desc" : "asc", orderBy: property });
    };

    const handleChangeRowsPerPage = (event) => {
      this.state.setRowsPerPage = +event.target.value;
      this.state.setPage = 0;
      alert("handleChangeRowsPerPage");
    };

    /* #endregion */

    var users;

    if (this.props.users) users = this.props.users;
    else users = [];
    this.state.users = this.props.users;

    return (
      <Paper className={classes.root}>
        <form style={{ marginRight: "5%" }}>
          <TextField
            style={{
              margin: "3% 1% 2% 1%",
            }}
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
          />
          <TextField
            style={{
              margin: "3% 1% 2% 1%",
            }}
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
          />
          <TextField
            style={{
              margin: "3% 1% 2% 1%",
            }}
            id="outlined-basic"
            label="Outlined"
            variant="outlined"
          />
        </form>
        <div style={{ marginRight: "5%" }}>
          <Button
            style={{
              margin: "3% 1% 0 1%",
              float: "right",
            }}
            variant="contained"
            color="primary"
            onClick={(event) => {
              event.preventDefault();
              alert("here");
              this.props.filterUsers();
            }}
          >
            Submit
          </Button>

          {users.length > 0 ? ( 
            <Button
              style={{
                margin: "3% 1% 0 1%",
              }}
              variant="contained"
              color="primary"
              size="medium"
              startIcon={<SaveIcon />}
            >
              <CSVLink  style={{color:"white"}} filename="Users" data={users} enclosingCharacter={`'`}>
                CSV File
              </CSVLink>
            </Button>
          ) : null}
        </div>

        {/* <form
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
            style={{ margin: "2% 1% 0 1%" }}
            onChange={(e) => {
              this.setState({ text1: e.target.value });
            }}
          />
          <TextField
            id="text2"
            label={<IntlMessages id="appModule.signin" />}
            variant="filled"
            style={{ margin: "2% 1% 0 1%" }}
            onChange={(e) => {
              this.setState({ text2: e.target.value });
            }}
          />
          <TextField
            id="text3"
            label={<IntlMessages id="appModule.signin" />}
            variant="filled"
            style={{ margin: "2% 1% 0 1%" }}
            onChange={(e) => {
              this.setState({ text3: e.target.value });
            }}
          />
          <input
            type="submit"
            value="Submit"
            style={{ margin: "2% 1% 0 1%" }}
            onClick={(event) => {
              event.preventDefault();
              alert("here");
              this.props.filterUsers();
            }}
          />
          {users.length > 0 ? (
            <button style={{ margin: "2% 1% 0 1%" }}>
              <CSVLink filename="Users" data={users} enclosingCharacter={`'`}>
                CSV File
              </CSVLink>
            </button>
          ) : null}
        </form> */}

        {loader && (
          <div className="loader-view">
            <CircularProgress />
          </div>
        )}
        <TableContainer style={{ marginTop: "5%" }}>
          <Table>
            <TableHeader
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
                if (users.length > 0)
                  return <ToggleTableRow columns={columns} row={row} />;
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={["10", "25", "100"]}
          component="div"
          count={users.length > 0 ? users.length : 0}
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

  return { users };
};

export default connect(mapStateToProps, {
  filterUsers,
  updateUserList,
})(UserManagement);
