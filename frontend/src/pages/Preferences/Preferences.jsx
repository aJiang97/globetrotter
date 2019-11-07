import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Typography } from "@material-ui/core";
import { PreferenceCard } from "../../components/PreferenceCard";
import { styles } from "./styles";
import history from "../../history";

import { NavBar } from "../../components";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import bg from "../../assets/trip-bg.jpg";

export class PurePreferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayError: false,
      locationTypes: {
        "Night Life": false,
        Shopping: false,
        Nature: false,
        Museums: false,
        "Religious Sites": false,
        "National Monument": false,
        Themeparks: false,
        Markets: false,
        Restaurants: false
      }
    };
  }

  updateSelected = name => {
    this.setState(prevState => ({
      locationTypes: {
        ...prevState.locationTypes,
        [name]: !prevState.locationTypes[name]
      },
      displayError: false
    }));
  };

  getSelected = () => {
    var result = [];
    for (let value of Object.keys(this.state.locationTypes)) {
      if (this.state.locationTypes[value]) {
        result.push(value);
      }
    }
    return result;
  };

  handleSubmit = () => {
    const preferences = this.getSelected();
    if (preferences.length === 0) {
      this.setState({
        displayError: true
      });
    } else {
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get("location");
      const startDate = urlParams.get("start_date");
      const endDate = urlParams.get("end_date");
      history.push(
        `/locations?location=${location}&start_date=${startDate}&end_date=${endDate}&preferences=${preferences}`
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        <NavBar />
        <div className={classes.bg_layer} />
        <img src={bg} alt="background" className={classes.bg} />
        <div className={classes.container}>
          <Typography variant="h4" className={classes.title}>
            What type of places do you like going to?
          </Typography>
          <PreferenceCardList
            locationTypes={this.state.locationTypes}
            updateSelected={this.updateSelected}
            getSelected={this.getSelected}
          />
          {this.state.displayError && (
            <Typography
              variant="caption"
              color="error"
              className={classes.errorMessage}
            >
              Please choose at least 1 option
            </Typography>
          )}
          <div className={classes.buttonRow}>
            <IconButton
              type="button"
              color="primary"
              variant="contained"
              className={classes.navButton}
              onClick={() => history.push("/trip")}
            >
              <ArrowBackIcon />
            </IconButton>
            <IconButton
              type="submit"
              color="primary"
              variant="contained"
              className={classes.navButton}
              onClick={this.handleSubmit}
            >
              <ArrowForwardIcon />
            </IconButton>
          </div>
        </div>
      </div>
    );
  }
}

class PreferenceCardList extends React.Component {
  render() {
    const { locationTypes, updateSelected, getSelected } = this.props;
    return (
      <div
        onClick={getSelected}
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr" }}
      >
        {Object.keys(locationTypes).map((value, index) => {
          return (
            <PreferenceCard
              key={index}
              name={value}
              update={updateSelected}
              checked={locationTypes[value]}
            />
          );
        })}
      </div>
    );
  }
}

export const Preferences = withStyles(styles)(PurePreferences);
