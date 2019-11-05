import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Fab, Typography } from "@material-ui/core";
import { Add, Close, DoubleArrow } from "@material-ui/icons";

import { LocationCard, LocationListWindow } from "../../components";
import { styles } from "./styles";
import history from "../../history.js";
import APIClient from "../../api/apiClient";

export class PureLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      places: [],
      isOpenListWindow: false,
      addedLocations: []
    };
  }

  handleAddLocation = key => {
    this.setState(state => {
      const addedLocations = state.addedLocations.concat(key);
      return {
        ...state,
        addedLocations
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

  getAddedLocations = () => {
    return this.state.places.filter(
      (value, key) => this.state.addedLocations.indexOf(key) !== -1
    );
  };

  getTypes = types => {
    return Object.keys(types).filter(type => type === true);
  };

  UNSAFE_componentWillMount = () => {
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
        <div className={classes.container}>
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
        </div>
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
          <DoubleArrow />
        </Button>
        <LocationListWindow
          isOpen={this.state.isOpenListWindow}
          locations={this.getAddedLocations()}
          onRemove={this.handleRemoveLocation}
          getTypes={this.getTypes}
        />
        <Button
          variant="contained"
          color="secondary"
          className={
            this.state.isOpenListWindow
              ? classes.viewButtonOut
              : classes.viewButtonIn
          }
          onClick={() => {
            history.push("/tripview");
          }}
        >
          View Plan
        </Button>
      </div>
    );
  }
}

export const Locations = withStyles(styles)(PureLocations);
