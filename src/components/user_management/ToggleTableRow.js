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
    const rowBackgroudStyle =
      this.props.index % 2 == 1
        ? {
            backgroundColor: "white",
          }
        : {
            backgroundColor: "darkgray",
          };

    var name = this.props.row["name"];
    return [
      <TableRow style={rowBackgroudStyle} onClick={this.toggleExpander}>
        {this.props.columns.map((column) => {
          if (!column.showResponsive && window.innerWidth < 768) return;

          const value = this.props.row[column.id];
          return column["id"] !== "action" ? (
            <TableCell
              style={{ paddingLeft: "2.5%" }}
              key={column.id}
              align={column.align}
            >
              {column.format && typeof value === "number"
                ? column.format(value)
                : value}
            </TableCell>
          ) : (
            <TableCell
              style={{ paddingLeft: "2.5%", backgroundColor: "transparent" }}
              key={column.id}
              align={column.align}
            >
              {" "}
              <Box
                display="flex"
                justifyContent="center"
                style={rowBackgroudStyle}
                m={1}
                bgcolor="background.paper"
              >
                <Box>
                  <EditUser />
                </Box>
                <Box>
                  <DeleteUser />
                </Box>
              </Box>
            </TableCell>
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
