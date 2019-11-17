import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { Button, TextField, Typography } from "@material-ui/core";

import { CalendarGrid, DateTabs, NavBar } from "../../components";
import APIClient from "../../api/apiClient";
import { UserContext } from "../../UserContext";

export class PureTripView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDateItinerary: null,
      itinerary: null,
      travelTimes: null,
      dates: null,
      isEditableTitle: false,
      title: ""
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

  handleEditableTitle = () => {
    this.setState({
      isEditableTitle: true
    });
  };

  handleNonEditableTitle = () => {
    this.setState({
      isEditableTitle: false
    });
  };

  handleChangeTitle = e => {
    this.setState({
      title: e.target.value
    });
  };

  handleSaveItinerary = () => {
    this.apiClient = new APIClient();
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("location");
    const start = this.state.dates[0];
    const end = this.state.dates[this.state.dates.length - 1];
    const description = this.state.title;
    this.apiClient
      .saveItinerary(
        this.context.user.token,
        description,
        city,
        start,
        end,
        this.props.places,
        this.state.itinerary
      )
      .then(data => console.log(data));
  };

  componentDidMount = () => {
    if (this.props.places) {
      this.apiClient = new APIClient();
      const placeIDs = this.props.places
        .map(place => `place_id:${place.google.place_id}`)
        .join("|");
      const urlParams = new URLSearchParams(window.location.search);
      const location = urlParams.get("location");
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
            title: `Your Trip to ${location}`,
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
        {this.state.isEditableTitle ? (
          <TextField
            InputProps={{
              classes: {
                input: classes.resize
              }
            }}
            onBlur={this.handleNonEditableTitle}
            onChange={this.handleChangeTitle}
            onMouseOut={this.handleNonEditableTitle}
            value={this.state.title}
            className={classes.title}
          />
        ) : (
          <Typography
            variant="h2"
            className={classes.title}
            onMouseOver={this.handleEditableTitle}
          >
            {this.state.title}
          </Typography>
        )}
        {this.context.user && (
          <Button
            variant="contained"
            color="primary"
            className={classes.saveButton}
            onClick={this.handleSaveItinerary}
          >
            Save
          </Button>
        )}
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

PureTripView.contextType = UserContext;

export const TripView = withStyles(styles)(PureTripView);
