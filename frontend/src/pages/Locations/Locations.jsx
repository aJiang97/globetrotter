import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Fab, Typography, Badge } from "@material-ui/core";
import { Add, Close, ArrowBackIos, ArrowForwardIos, Room } from "@material-ui/icons";

import { LocationCard, LocationListWindow, NavBar } from "../../components";
import { styles } from "./styles";
import history from "../../history.js";
import APIClient from "../../api/apiClient";
import Grid from "@material-ui/core/Grid";
import MapContainer from "../../components/MapContainer/MapContainer";

export class PureLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      isOpenListWindow: false,
      addedLocations: [],
      displayError: false
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
    const startDate = urlParams.get("start_date");
    const endDate = urlParams.get("end_date");

    if (this.state.addedLocations.length === 0) {
      this.setState({
        displayError: true
      });
    } else {
      var placesToIndex = {};
      const locations = this.getAddedLocations();
      locations.map(
        (location, i) => (placesToIndex[location.google.place_id] = i)
      );
      this.props.setPlaces(locations, placesToIndex);
      history.push(`/tripview?start_date=${startDate}&end_date=${endDate}`);
    }
  };

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
        places: places.locations
      });
    });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <NavBar />
        <Grid className={classes.section}>
          <Grid container item xs={7} className={classes.flexScroll}>
            <Typography variant="h5" className={classes.title}>
              Recommended Locations
            </Typography>
            {this.state.places.length !== 0 &&
              this.state.places.map((loc, key) => (
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
                    title={loc.foursquare.venue_name}
                    type={this.getTypes(loc.foursquare.location_types)}
                    rating={loc.google.rating}
                    media={loc.foursquare.pictures[0]}
                    description={loc.foursquare.description}
                  />
                </div>
              ))}
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
              <Badge showZero badgeContent={this.state.addedLocations.length} color="error">
                {this.state.isOpenListWindow ? <ArrowForwardIos /> : <ArrowBackIos />}
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
          <Grid container item xs={5}>
            <MapContainer locations={this.state.places} />
          </Grid>
        </Grid>
      </div>
    );
  }
}

export const Locations = withStyles(styles)(PureLocations);
