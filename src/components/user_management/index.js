import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
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
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Icon from "@material-ui/core/Icon";
import SaveIcon from "@material-ui/icons/Save";
import filterStyle from "../../assets/styles/TableFilter.css";
import SpringPopper from "./PersianCalendar";
/* #region  UserManagement Table Headers */
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
    console.log(filterStyle);
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
      startDate: null,
      desktopView: window.matchMedia("(max-width: 700px)").matches,
      mobileView: window.matchMedia("(max-width: 260px)").matches,
      columns:[
        { id: "name", label: "Name", minWidth: 170, align: "center" ,showResponsive:true},
        { id: "code", label: "ISO\u00a0Code", minWidth: 100, align: "center" ,showResponsive:true},
        {
          id: "population",
          label: "Population",
          minWidth: 170,
          align: "center",
          format: (value) => value.toLocaleString("en-US"),
          showResponsive:false
        },
        {
          id: "size",
          label: "Size\u00a0(km\u00b2)",
          minWidth: 170,
          align: "center",
          format: (value) => value.toLocaleString("en-US"),
          showResponsive:false
        },
        {
          id: "density",
          label: "Density",
          minWidth: 170,
          align: "center",
          format: (value) => value.toFixed(2),
          showResponsive:false
        },
        {
          id: "action",
          label: "Actions",
          disablePadding: true,
          showResponsive:false
        },
      ] 
    };
  
    this.handleChangeStartDate=this.handleChangeStartDate.bind(this);
  }
  

  componentDidMount() {
    const desktopHandler = e => this.setState({desktopView: e.desktopView});
    const mobileHandler = e => this.setState({mobileView: e.mobileView});

    window.matchMedia("(max-width: 700px)").addListener(desktopHandler);
    window.matchMedia("(max-width: 260px)").addListener(mobileHandler);
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

  handleChangeStartDate(value) {
    this.setState({ startDate: value });
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
        width: "25px",
      },
      container: {
        maxHeight: 440,
      },
    }));

    const formStyle = this.state.desktopView
      ? this.state.mobileView
        ? 
        /* #region  Mobile View */

          {
            Container: {
              padding: "3% 5% 1% 5%",
            },
            TextInput: {
              padding: "1% 1% 1% 1%",
              width: "100%",
            },
            SubmitButton: {
              padding: "5% 2% 5% 0",
              float: "left",
              marginLeft: "25%",
            },
            CsvButton: {
              // padding: "5% 2% 5% 0",
              float: "left",
              marginLeft:"25%"
            },
            Calendar: {
              padding: "1% 1% 1% 1%",
              // marginTop:"6.5%",
              width: 200,
            },
          }
        : /* #endregion */

          /* #region  IPad View */

          {
            Container: {
              padding: "3% 5% 1% 5%",
            },
            TextInput: {
              padding: "1% 1% 1% 1%",
              width: "100%",
            },
            SubmitButton: {
              padding: "5% 2% 5% 0",
              float: "left",
              marginLeft: "25%",
            },
            CsvButton: {
              padding: "5% 2% 5% 0",
              float: "left",
            },
            Calendar: {
              padding: "1% 1% 1% 1%",
              // marginTop:"2.5%",
              width: 200,
            },
          }
      : /* #endregion */

        /* #region  Desktop View */

        {
          Container: {
            padding: "3% 5% 2% 5%",
            display: "flex",
          },
          TextInput: {
            padding: "1% 1% 1% 1%",
          },
          SubmitButton: {
            padding: "2% 1% 1% 1%",
          },
          CsvButton: {
            padding: "2% 1% 1% 1%",
          },
          Calendar: {
            padding: "1% 1% 1% 1%",
            // marginTop:"6.5%",
            width: 200,
          },
        };
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
        <div>
          <div
            style={formStyle.Container}
            container
            spacing={2}
            alignItems="flex-end"
          >
            <div style={formStyle.TextInput} item>
              <TextField label="With a grid" style={{ width: "100%" }} />
            </div>
            <div style={formStyle.TextInput} item>
              <TextField
                id="input-with-icon-grid"
                style={{ width: "100%" }}
                label="With a grid"
              />
            </div>
            <div style={formStyle.TextInput} item>
              <TextField
                id="input-with-icon-grid"
                style={{ width: "100%" }}
                label="With a grid"
              />
            </div>

            <div style={formStyle.TextInput} item>
              <SpringPopper handleChangeDate={this.handleChangeStartDate} />
            </div>
            <div style={formStyle.SubmitButton} item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                onClick={(event) => {
                  event.preventDefault();
                  alert("here");
                  this.props.filterUsers();
                }}
              >
                Submit
              </Button>
            </div>
            <div style={formStyle.CsvButton} item>
              <Button
                variant="contained"
                color="primary"
                size="medium"
                startIcon={<SaveIcon />}
              >
                CSV
              </Button>
            </div>
          </div>
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
        <TableContainer style={{ marginTop: "3%" }}>
          <Table>
            <TableHeader
              classes={headerClassess}
              order={this.state.order}
              orderBy={this.state.orderBy}
              onRequestSort={handleRequestSort}
              columns={this.state.columns}
            />

            <TableBody>
              {stableSort(
                users,
                getComparator(this.state.order, this.state.orderBy)
              ).map((row, index) => {
                if (users.length > 0)
                  return (
                    <ToggleTableRow index={index} columns={this.state.columns} row={row} />
                  );
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
