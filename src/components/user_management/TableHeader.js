
import React from "react";
import TableRow from "@material-ui/core/TableRow";
import TableCell from "@material-ui/core/TableCell";
import TableSortLabel from "@material-ui/core/TableSortLabel";
import TableHead from '@material-ui/core/TableHead';




  
  
export default function EnhancedTableHead(props) {
    const { classes, order, orderBy, onRequestSort, columns } = props;
    const createSortHandler = (property) => {
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
              {headCell.id === "action" ? (
                headCell.label
              ) : (
                <TableSortLabel
                  id={headCell.id}
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={(headcell) => {
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
  