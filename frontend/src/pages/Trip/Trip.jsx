import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, TextField, Typography } from "@material-ui/core";

import { NavBar } from "../../components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import { styles } from "./styles";
import bg from "../../assets/trip-bg.jpg";
import history from "../../history";
export class PureTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      start_date: "",
      end_date: "",
      displayError: "",
    };
  }
  handleInputChange = event => {
    this.setState({
      location: event.target.value
    });
  };
  handleStartDateChange = event => {
    this.setState({
      start_date: event.target.value
    });
  };
  handleEndDateChange = event => {
    this.setState({
      end_date: event.target.value
    });
  };
  handleSubmit = () => {
    const { location, start_date, end_date } = this.state;
    if (location === "" || start_date === "" || end_date === "") {
      this.setState({ displayError: "Some fields are missing." })
    } else if (new Date(end_date) - new Date(start_date) < 0) {
      this.setState({ displayError: "End date cannot be earlier than start date." })
    }
    const parsedLocation = location.replace(" ", "_");
    history.push(
      `/preferences?location=${parsedLocation}&start_date=${start_date}&end_date=${end_date}`
    );
  };
  render() {
    const { classes } = this.props;
    return (
      <div>
        <NavBar />
        <div className={classes.bg_layer} />
        <img src={bg} alt="background" className={classes.bg} />
        <div className={classes.modal_container}>
          <Typography variant="h4" className={classes.title}>
            Where's your next adventure?
          </Typography>
          <TextField
            id="location"
            label="Destination"
            value={this.state.location}
            InputLabelProps={{
              className: classes.label,
              shrink: true
            }}
            InputProps={{
              className: classes.input,
              classes: {
                root: classes.underline
              }
            }}
            className={classes.textfield}
            onChange={this.handleInputChange}
          />
          <div className={classes.dates}>
            <TextField
              id="start_date"
              label="Start date"
              type="date"
              value={this.state.start_date}
              InputLabelProps={{
                className: classes.label,
                shrink: true
              }}
              InputProps={{
                className: classes.input,
                classes: {
                  root: classes.underline
                }
              }}
              onChange={this.handleStartDateChange}
            />
            <div />
            <TextField
              id="end_date"
              label="End date"
              type="date"
              value={this.state.end_date}
              InputLabelProps={{
                className: classes.label,
                shrink: true
              }}
              InputProps={{
                className: classes.input,
                classes: {
                  root: classes.underline
                }
              }}
              onChange={this.handleEndDateChange}
            />
          </div>
          {this.state.displayError !== "" &&
            <Typography variant="caption" color="error">
              {this.state.displayError}
            </Typography>
          }
          <IconButton
            type="submit"
            color="primary"
            variant="contained"
            className={classes.nextButton}
            onClick={this.handleSubmit}
          >
            <ArrowForwardIcon />
          </IconButton>
        </div>
      </div>
    );
  }
}

export const Trip = withStyles(styles)(PureTrip);
