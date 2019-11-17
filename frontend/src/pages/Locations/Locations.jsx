import React from "react";
import ReactLoading from "react-loading";
import { withStyles } from "@material-ui/core/styles";
import { Button, Fab, Typography, Badge, Grid } from "@material-ui/core";
import { Add, Close, ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

import {
  LocationCard,
  LocationListWindow,
  LocationPane,
  NavBar
} from "../../components";
import { styles } from "./styles";
import history from "../../history.js";
import APIClient from "../../api/apiClient";

export class PureLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      isOpenListWindow: false,
      addedLocations: [],
      displayError: false,
      selectedLocation: null,
      resultsLoaded: false
    };
  }

  handleAddLocation = key => {
    this.setState(state => {
      const addedLocations = state.addedLocations.concat(key);
      return {
        ...state,
        addedLocations,
        displayError: false
      };
    });
  };

  handleRemoveLocation = key => {
    this.setState(state => {
      const addedLocations = state.addedLocations.filter(
        (locationKey, i) => locationKey !== key
      );
      return {
        ...state,
        addedLocations
      };
    });
  };

  handleOpenListWindow = () => {
    this.setState({
      isOpenListWindow: !this.state.isOpenListWindow
    });
  };

  handleSubmit = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const location = urlParams.get("location");
    const startDate = urlParams.get("start_date");
    const endDate = urlParams.get("end_date");

    if (this.state.addedLocations.length === 0) {
      this.setState({
        displayError: true
      });
    } else {
      const locations = this.getAddedLocations();
      this.props.setPlaces(locations);
      history.push(
        `/tripview?location=${location}&start_date=${startDate}&end_date=${endDate}`
      );
    }
  };

  handleClickLocation = () => {
    console.log(this.props.location);
  };

  updateLocationPane(location) {
    this.setState({
      selectedLocation: location
    });
  }

  getAddedLocations = () => {
    return this.state.places.filter(
      (value, key) => this.state.addedLocations.indexOf(key) !== -1
    );
  };

  getTypes = types => {
    return Object.keys(types).filter(type => type === true);
  };

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("location");
    const preferences = urlParams
      .get("preferences")
      .toLowerCase()
      .replace(" ", "_");
    this.apiClient = new APIClient();
    this.apiClient.getLocations(city, preferences).then(places => {
      places.locations.sort(
        (a, b) => parseFloat(b.google.rating) - parseFloat(a.google.rating)
      );
      this.setState({
        places: places.locations,
        selectedLocation: places.locations[0],
        resultsLoaded: true
      });
    });
  };

  render() {
    const { classes } = this.props;
    const locations = this.state.places;
    let locationList;

    if (locations && locations.length !== 0) {
      locationList = this.state.places.map((loc, key) => (
        <div key={key} className={classes.locationCardContainer}>
          {this.state.addedLocations.indexOf(key) !== -1 ? (
            <Fab
              color="primary"
              onClick={() => {
                this.handleRemoveLocation(key);
              }}
            >
              <Close />
            </Fab>
          ) : (
            <Fab
              color="primary"
              onClick={() => {
                this.handleAddLocation(key);
              }}
            >
              <Add />
            </Fab>
          )}
          <LocationCard
            className={classes.card}
            location={loc}
            clickHandler={() => this.updateLocationPane(loc)}
          />
        </div>
      ));
    } else {
      locationList = (
        <Typography variant="body1">No locations found.</Typography>
      );
    }

    return (
      <div>
        <NavBar />
        <Grid className={classes.section}>
          <Grid container item xs={6} className={classes.flexScroll}>
            <Typography variant="h5" className={classes.title}>
              Recommended Locations
            </Typography>
            {this.state.resultsLoaded ? (
              locationList
            ) : (
              <div className={classes.loadingContainer}>
                <ReactLoading type={"spin"} color={"black"} />
              </div>
            )}

            {/* Location Basket Drawer */}
            <Button
              variant="contained"
              color="primary"
              className={
                this.state.isOpenListWindow
                  ? classes.arrowButtonOut
                  : classes.arrowButtonIn
              }
              onClick={this.handleOpenListWindow}
            >
              <Badge
                showZero
                badgeContent={this.state.addedLocations.length}
                color="error"
              >
                {this.state.isOpenListWindow ? (
                  <ArrowForwardIos />
                ) : (
                  <ArrowBackIos />
                )}
              </Badge>
            </Button>
            <LocationListWindow
              isOpen={this.state.isOpenListWindow}
              locations={this.getAddedLocations()}
              onRemove={this.handleRemoveLocation}
              getTypes={this.getTypes}
              displayError={this.state.displayError}
            />
            <Button
              variant="contained"
              color="secondary"
              className={
                this.state.isOpenListWindow
                  ? classes.viewButtonOut
                  : classes.viewButtonIn
              }
              onClick={this.handleSubmit}
            >
              View Plan
            </Button>
          </Grid>
          <Grid container item xs={6} className={classes.locationPane}>
            {this.state.selectedLocation && (
              <LocationPane location={this.state.selectedLocation} />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export const Locations = withStyles(styles)(PureLocations);
