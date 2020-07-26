import React from "react";
import { slideDown, slideUp } from "./TableAnimation";
import EditUser from "./EditUser";
import DeleteUser from "./DeleteUser";
import TableCell from "@material-ui/core/TableCell";
import TableRow from "@material-ui/core/TableRow";
import "./ToggleTableRow.css";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";

export default class ToggleTableRow extends React.Component {
  state = { expanded: false };

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
    var name = this.props.row["name"];
    return [
      <TableRow onClick={this.toggleExpander}>
        {this.props.columns.map((column) => {
          const value = this.props.row[column.id];
          return column["id"] !== "action" ? (
            <TableCell key={column.id} align={column.align}>
              {column.format && typeof value === "number"
                ? column.format(value)
                : value}
            </TableCell>
          ) : (
            <Box
            width="50px"
              display="flex"
              justifyContent="center"
              m={1}
              p={1}
              bgcolor="background.paper"
            >
              <Box p={1}>
                <EditUser />
              </Box>
              <Box p={1}>
                <DeleteUser />
              </Box>
            </Box>

            // <div
            //   style={{
            //     display: "flex",
            //     align: "center",
            //     paddingRight: "30%",
            //     paddingTop: "10%",
            //   }}
            // >

            // </div>
          );
        })}
      </TableRow>,
      this.state.expanded && (
        <TableRow className="expandable" ref="expanderBody">
          <TableCell colSpan={this.props.columns.length}>
            <Grid container>
              <Box
                boxShadow={0}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{ width: "8rem", height: "5rem" }}
              >
                {name}
              </Box>
              <Box
                boxShadow={1}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{ width: "8rem", height: "5rem" }}
              >
                {name}
              </Box>
              <Box
                boxShadow={2}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{ width: "8rem", height: "5rem" }}
              >
                {name}
              </Box>
              <Box
                boxShadow={3}
                bgcolor="background.paper"
                m={1}
                p={1}
                style={{ width: "8rem", height: "5rem" }}
              >
                {name}
              </Box>
            </Grid>
          </TableCell>
        </TableRow>
      ),
    ];
  }
}
