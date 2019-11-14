import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

import { CalendarGrid, DateTabs, NavBar } from "../../components";
import APIClient from "../../api/apiClient";
import { Typography } from "@material-ui/core";
export class PureTripView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDateItinerary: null,
      itinerary: null,
      travelTimes: null,
      dates: null
    };
  }

  getDates = () => {
    const urlParams = new URLSearchParams(window.location.search);
    var startDate = new Date(urlParams.get("start_date"));
    var endDate = new Date(urlParams.get("end_date"));
    var dates = [];
    var curDate = startDate;
    while (curDate <= endDate) {
      dates.push(curDate.toString().slice(4, 15));
      const nextDate = new Date(curDate);
      nextDate.setDate(curDate.getDate() + 1);
      curDate = nextDate;
    }
    return dates;
  };

  setDateIndex = index => {
    this.setState({
      currentDateItinerary: this.getCurrentDateItinerary(
        this.state.itinerary,
        index,
        this.state.dates.length
      )
    });
  };

  getDetailedPath = path => {
    var detailedPath = [];
    for (var i = 0; i < path.length; i++) {
      for (var j = 0; j < this.props.places; j++) {
        if (
          JSON.stringify(path[i]) ===
          JSON.stringify(this.props.places[j].google.place_id)
        )
          detailedPath.push(this.props.places[j]);
      }
    }
    return detailedPath;
  };

  getCurrentDateItinerary = (path, index, period) => {
    const nPlacesPerDate = Math.ceil(path.length / period);
    return path.filter((place, i) => {
      return i < nPlacesPerDate * (index + 1) && i >= nPlacesPerDate * index;
    });
  };

  componentDidMount = () => {
    if (this.props.places) {
      this.apiClient = new APIClient();
      const placeIDs = this.props.places
        .map(place => `place_id:${place.google.place_id}`)
        .join("|");
      this.apiClient.generateItinerary(placeIDs).then(data =>
        //set state based on data
        {
          const detailedPath = this.props.places
            .map((place, i) => ({
              ...place,
              order: data.path[i][place.google.place_id],
              suggestedTime: 45
            }))
            .sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
          this.setState({
            itinerary: detailedPath,
            dates: this.getDates(),
            currentDateItinerary: this.getCurrentDateItinerary(
              detailedPath,
              0,
              this.getDates().length
            ),
            travelTimes: data.travel_matrix
          });
        }
      );
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <NavBar />
        <Typography variant="h2" className={classes.title}>
          Your Trip to
        </Typography>
        {this.state.dates && (
          <DateTabs
            tabLabels={this.state.dates}
            setDateIndex={this.setDateIndex}
          />
        )}
        <CalendarGrid
          itinerary={this.state.currentDateItinerary}
          travelTimes={this.state.travelTimes}
          placeToIndex={this.props.placeToIndex}
        />
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
