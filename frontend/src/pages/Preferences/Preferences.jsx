import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { PreferenceCard } from "../../components/PreferenceCard";
import { styles } from "./styles";
import history from "../../history";

import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import bg from "../../assets/trip-bg.jpg";

export class PurePreferences extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        <div className={classes.bg_layer} />
        <img src={bg} alt="background" className={classes.bg} />
        <div className={classes.container}>
          <Typography variant="h4" className={classes.title}>
            What type of places do you like going to?
          </Typography>
          <PreferenceCardList />
          <div className={classes.buttonRow}>
            <Button
              type="button" color="primary" variant="contained"
              className={classes.navButton}
              href="/trip"
              onClick={() => history.push("/preferences")}
            >
              <ArrowBackIcon />
            </Button>
            <Button
              type="submit" color="primary" variant="contained"
              className={classes.navButton}
              href="/locations"
              onClick={() => history.push("/preferences")}
            >
              <ArrowForwardIcon />
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

class PreferenceCardList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      locationTypes: {
        "Urban-Life": false,
        Shopping: false,
        Nature: false,
        Museums: false,
        "Religious Sites": false,
        "National Monuments": false,
        "Theme Parks": false,
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
      }
    }));
  };

  getSelected = () => {
    var result = [];
    for (let value of Object.keys(this.state.locationTypes)) {
      if (this.state.locationTypes[value]) {
        result.push(value);
      }
    }
    console.log(result);
  };

  render() {
    return (
      <div onClick={this.getSelected}>
        {Object.keys(this.state.locationTypes).map((value, index) => {
          return (
            <PreferenceCard
              key={index}
              name={value}
              update={this.updateSelected}
              checked={this.state.locationTypes[value]}
            />
          );
        })}
      </div>
    );
  }
}

export const Preferences = withStyles(styles)(PurePreferences);
