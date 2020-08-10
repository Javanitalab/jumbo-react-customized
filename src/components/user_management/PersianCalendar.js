import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import Popper from "@material-ui/core/Popper";
import TextField from "@material-ui/core/TextField";
import moment from "moment";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import EnglishNumberToFarsi from "./EnglishToFarsi"
const useStyles = makeStyles((theme) => ({
  paper: {
    border: "1px solid",
    padding: theme.spacing(1),
    backgroundColor: theme.palette.background.paper,
  },
}));

const Fade = React.forwardRef(function Fade(props, ref) {
  const { in: open, children, onEnter, onExited, ...other } = props;

  return (
    <div ref={ref} {...other}>
      {children}
    </div>
  );
});

Fade.propTypes = {
  children: PropTypes.element,
  in: PropTypes.bool,
  onEnter: PropTypes.func,
  onExited: PropTypes.func,
};

export default function SpringPopper(props) {
  console.log(props);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [date, setDate] = React.useState();

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const open = Boolean(anchorEl);
  const id = open ? "spring-popper" : undefined;

  return (
    <div>
      <TextField
        label="With a grid"
        defaultValue={new Date().toLocaleDateString("fa-IR")}
        value={date}
        onClick={handleClick}
        style={{ width: "100%" }}
      />

      <Popper id={id} open={open} anchorEl={anchorEl} transition>
        {({ TransitionProps }) => (
          <Fade {...TransitionProps}>
            <Calendar
              onChange={(value) => {
                console.log(value)
                setDate(EnglishNumberToFarsi(value.year+"/"+value.month+"/"+value.day));
                setAnchorEl(false);
                props.handleChangeDate(EnglishNumberToFarsi(value.year+"/"+value.month+"/"+value.day));
              }}
              shouldHighlightWeekends
              locale="fa" // add this
            />

          </Fade>
        )}
      </Popper>
    </div>
  );
}
