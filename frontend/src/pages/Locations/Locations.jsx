import React from "react";
import ReactLoading from "react-loading";
import { withStyles } from "@material-ui/core/styles";
import { Button, Fab, Typography, Badge, Grid } from "@material-ui/core";
import { Add, Close, ArrowBackIos, ArrowForwardIos } from "@material-ui/icons";

import {
  LocationCard,
  LocationListWindow,
  LocationPane,
  NavBar,
  SearchBar
} from "../../components";
import { styles } from "./styles";
import history from "../../history.js";
import APIClient from "../../api/apiClient";

class PureLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      isOpenListWindow: false,
      addedLocations: [],
      displayError: false,
      selectedLocation: null,
      resultsLoaded: false,
      city: "",
      searchResult: []
    };
  }

  handleAddLocation = key => {
    this.setState(state => {
      const addedLocations = state.addedLocations.concat(
        state.searchResult.length !== 0
          ? state.searchResult[key]
          : this.state.places[key]
      );
      return {
        ...state,
        addedLocations,
        displayError: false
      };
    });
  };

  handleRemoveLocation = id => {
    this.setState(state => {
      const addedLocations = state.addedLocations.filter(
        location => location.google.place_id !== id
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

  handleUpdateSearchResult = result => {
    this.setState({ searchResult: result });
    if (result && result.length !== 0) {
      this.setState({ selectedLocation: result[0] });
    } else {
      this.setState({ selectedLocation: this.state.places[0] });
    }
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
      this.props.setPlaces(this.state.addedLocations);
      history.push(
        `/tripview?location=${location}&start_date=${startDate}&end_date=${endDate}`
      );
    }
  };

  updateLocationPane(location) {
    this.setState({
      selectedLocation: location
    });
  }

  getTypes = types => {
    var result = [];
    for (let value of Object.keys(types)) {
      if (types[value]) {
        result.push(value.replace("_", " "));
      }
    }
    return result;
  };

  isAdded = id => {
    const { addedLocations } = this.state;
    for (var key in this.state.addedLocations) {
      if (addedLocations[key].google.place_id === id) return true;
    }
    return false;
  };

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("location").replace("_", " ");
    const preferences = urlParams.get("preferences").toLowerCase();
    this.apiClient = new APIClient();
    this.apiClient.getLocations(city, preferences).then(places => {
      places.locations.sort(
        (a, b) => parseFloat(b.google.rating) - parseFloat(a.google.rating)
      );
      this.setState({
        places: places.locations,
        selectedLocation: places.locations[0],
        resultsLoaded: true,
        city: city
      });
    });
  };

  render() {
    const { classes } = this.props;
    const locations = this.state.places;
    const { searchResult } = this.state;
    let locationList;

    if (searchResult && locations && locations.length !== 0) {
      var allLocations = [];
      if (searchResult.length !== 0) {
        allLocations = searchResult;
      } else {
        allLocations = this.state.places;
      }
      locationList = allLocations.map((loc, key) => (
        <div key={key} className={classes.locationCardContainer}>
          {this.isAdded(loc.google.place_id) ? (
            <Fab
              color="primary"
              onClick={() => {
                this.handleRemoveLocation(loc.google.place_id);
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
        <Typography variant="body1" className={classes.body1}>
          No locations found.
        </Typography>
      );
    }

    return (
      <div>
        <NavBar />
        <Grid className={classes.section}>
          <Grid container item xs={6} className={classes.flexScroll}>
            {this.state.resultsLoaded ? (
              <div className={classes.leftContainer}>
                <SearchBar
                  city={this.state.city}
                  handleSearchResult={this.handleUpdateSearchResult}
                />
                <Typography variant="h5" className={classes.title}>
                  Recommended Locations
                </Typography>
                {locationList}
              </div>
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
              locations={this.state.addedLocations}
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
