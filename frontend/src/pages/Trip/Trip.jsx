import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { styles } from "./styles";
import bg from "../../assets/trip-bg.jpg";
import history from "../../history";
export class PureTrip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      start_date: "",
      end_date: ""
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
            id="location" label="Destination" value={this.state.location}
            InputLabelProps={{
              className: classes.inputLabel,
              shrink: true 
            }}
            InputProps={{
              className: classes.input
            }}
            className={classes.textfield}
            onChange={this.handleInputChange}
          />
          <div className={classes.dates}>
            <TextField
              id="start_date" label="Start date" type="date" value={this.state.start_date}
              InputLabelProps={{
                className: classes.inputLabel,
                shrink: true
              }}
              InputProps={{
                className: classes.input
              }}
              className={classes.dateTextField}
              onChange={this.handleStartDateChange}
            />
            <TextField
              id="end_date" label="End date" type="date" value={this.state.end_date}
              InputLabelProps={{
                className: classes.inputLabel,
                shrink: true
              }}
              InputProps={{
                className: classes.input
              }}
              className={classes.dateTextField}
              onChange={this.handleEndDateChange}
            />
          </div>
          <Button
            type="submit" color="primary" variant="contained"
            className={classes.nextButton}
            href="/preferences"
            onClick={() => history.push("/preferences")}
          >
            <ArrowForwardIcon />
          </Button>
        </div>
      </div>
    );
  }
}

export const Trip = withStyles(styles)(PureTrip);
