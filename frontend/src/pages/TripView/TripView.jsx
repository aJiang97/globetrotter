import React from "react";
import { Redirect } from "react-router-dom";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";

import { styles } from "./styles";
import { AlertMessage, CalendarGrid, DateTabs, NavBar } from "../../components";
import APIClient from "../../api/apiClient";
import { UserContext } from "../../UserContext";

export class PureTripView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      uuid: null,
      currentDateItinerary: null,
      itinerary: null,
      travelTimes: null,
      startDate: null,
      endDate: null,
      dates: null,
      isEditableTitle: false,
      title: "",
      saved: false,
      deleted: false,
      redirect: false,
      dateIndex: 0
    };
  }

  getDates = (start, end) => {
    var dates = [];
    const startDate = new Date(start)
    const endDate = new Date(end)
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
      dateIndex: index,
      currentDateItinerary: this.getCurrentDateItinerary(
        this.state.itinerary,
        index,
        this.state.dates.length
      )
    });
  };

  getCurrentDateItinerary = (path, index, period) => {
    const nPlacesPerDate = Math.ceil(path.length / period);
    return path.filter((place, i) => {
      return i < nPlacesPerDate * (index + 1) && i >= nPlacesPerDate * index;
    });
  };

  getElementOrder = (path, id) => {
    for (var i = 0; i < path.length; i++) {
      if (path[i] === id) {
        return i;
      }
    }
  };

  handleDeleteLocation = g_id => {
    const places = this.state.itinerary.filter(
      place => place.google.place_id !== g_id
    );
    const placeToIndex = {};
    places.map((place, i) => (placeToIndex[place.google.place_id] = i));
    const placeIDs = places
      .map(place => `place_id:${place.google.place_id}`)
      .join("|");
    this.apiClient = new APIClient();
    this.apiClient.generateItinerary(placeIDs).then(data => {
      const detailedPath = places
        .map((place) => ({
          ...place,
          order: this.getElementOrder(data.path, place.google.place_id)
        }))
        .sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
      this.setState({
        itinerary: detailedPath,
        places: places,
        currentDateItinerary: this.getCurrentDateItinerary(
          detailedPath,
          this.state.dateIndex,
          this.state.dates.length
        ),
        placeToIndex: placeToIndex,
        travelTimes: data.travel_matrix
      });
    });
  };

  handleEditableTitle = () => {
    this.setState({ isEditableTitle: true });
  };

  handleNonEditableTitle = () => {
    this.setState({ isEditableTitle: false });
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };

  handleStartDateChange = e => {
    const newDates = this.getDates(e.target.value, this.state.endDate)
    this.setDateIndex(0)
    this.setState({
      startDate: e.target.value,
      dates: newDates,
      currentDateItinerary: this.getCurrentDateItinerary(
        this.state.itinerary,
        0,
        newDates.length
      ),
    })
  }

  handleEndDateChange = e => {
    const newDates = this.getDates(this.state.startDate, e.target.value)
    this.setDateIndex(0)
    this.setState({
      endDate: e.target.value,
      dates: newDates,
      currentDateItinerary: this.getCurrentDateItinerary(
        this.state.itinerary,
        0,
        newDates.length
      ),
    })
  }

  handleCloseSaveMessage = e => {
    this.setState({ saved: false });
  };

  handleCloseDeleteMessage = e => {
    this.setState({
      deleted: false
    });
  };

  handleDeleteTrip = () => {
    this.apiClient = new APIClient();
    this.apiClient
      .deleteTrip(this.context.user.token, this.state.uuid)
      .then(data => {
        var user = this.context.user;
        this.apiClient.getAllTrips(this.context.user.token).then(data => {
          user.trips = data.trips;
          this.context.logIn(user);
          this.setState({ deleted: true });
        });
        this.id = setTimeout(() => this.setState({ redirect: true }), 5000);
      });
  }

  handleSaveItinerary = () => {
    this.apiClient = new APIClient();
    const { uuid, title, startDate, endDate, places, itinerary, city } = this.state;
    const {token } = this.context.user;
    if (uuid) {
      this.apiClient.updateItinerary(
        token, uuid, title, city, startDate, endDate, places, itinerary
      ).then(data => {
        var user = this.context.user;
        this.apiClient.getAllTrips(this.context.user.token).then(data => {
          user.trips = data.trips;
          this.context.logIn(user);
          this.setState({
            saved: true
          });
        });
      })
    } else {
      this.apiClient.saveItinerary(
        token, title, city, startDate, endDate, places, itinerary
      )
      .then(data => {
        var user = this.context.user;
        this.apiClient.getAllTrips(this.context.user.token).then(data => {
          user.trips = data.trips;
          this.context.logIn(user);
          this.setState({
            saved: true
          });
        });
      });
    }
  };
  componentWillUnmount() {
    clearTimeout(this.id);
  }

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const startDate = urlParams.get("start_date");
    const endDate = urlParams.get("end_date");
    const dates = this.getDates(startDate, endDate);
    this.apiClient = new APIClient();
    var placeToIndex = {};
    if (uuid) {
      this.apiClient
        .getItineraryDetail(this.context.user.token, uuid)
        .then(detail => {
          const placeIDs = detail.blob.places
            .map(place => `place_id:${place.google.place_id}`)
            .join("|");
          detail.blob.places.map(
            (location, i) => (placeToIndex[location.google.place_id] = i)
          );
          this.apiClient.generateItinerary(placeIDs).then(data => {
            this.setState({
              uuid: uuid,
              title: detail.info.description,
              itinerary: detail.blob.orderedPlaces,
              city: detail.info.city,
              places: detail.blob.places,
              startDate: startDate,
              endDate: endDate,
              dates: dates,
              currentDateItinerary: this.getCurrentDateItinerary(
                detail.blob.orderedPlaces,
                this.state.dateIndex,
                dates.length
              ),
              placeToIndex: placeToIndex,
              travelTimes: data.travel_matrix
            });
          });
        });
    } else if (this.props.places) {
      const location = urlParams.get("location").replace("_", " ");
      const placeIDs = this.props.places
        .map(place => `place_id:${place.google.place_id}`)
        .join("|");
      this.props.places.map(
        (location, i) => (placeToIndex[location.google.place_id] = i)
      );
      this.apiClient.generateItinerary(placeIDs).then(data => {
        const detailedPath = this.props.places
          .map((place, i) => ({
            ...place,
            order: this.getElementOrder(data.path, place.google.place_id)
          }))
          .sort((a, b) => parseFloat(a.order) - parseFloat(b.order));
        this.setState({
          title: `Your Trip to ${location}`,
          itinerary: detailedPath,
          city: urlParams.get("location"),
          places: this.props.places,
          startDate: startDate,
          endDate: endDate,
          dates: dates,
          currentDateItinerary: this.getCurrentDateItinerary(
            detailedPath,
            this.state.dateIndex,
            dates.length
          ),
          placeToIndex: placeToIndex,
          travelTimes: data.travel_matrix
        });
      });
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
          <div className={classes.buttonsContainer}>
            <Button
              variant="contained"
              color="secondary"
              onClick={this.handleDeleteTrip}
              className={classes.DeleteButton}
              disabled={this.state.uuid === null}
            >
              Delete
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={this.handleSaveItinerary}
              className={classes.SaveButton}
              disabled={this.state.place && this.state.places.length === null}
            >
              Save
            </Button>
          </div>
        )}
        {this.state.dates &&
          <div className={classes.datesContainer}>
            From
            <TextField
              type="date"
              value={this.state.startDate}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                classes: {
                  root: classes.underline
                }
              }}
              onChange={this.handleStartDateChange}
            />
            to
            <TextField
              type="date"
              value={this.state.endDate}
              InputLabelProps={{
                shrink: true
              }}
              InputProps={{
                classes: {
                  root: classes.underline
                }
              }}
              onChange={this.handleEndDateChange}
            />
          </div>
        }
        {this.state.dates && (
          <DateTabs
            activeDate={this.state.dateIndex}
            tabLabels={this.state.dates}
            setDateIndex={this.setDateIndex}
          />
        )}
        <CalendarGrid
          itinerary={this.state.currentDateItinerary}
          travelTimes={this.state.travelTimes}
          placeToIndex={this.state.placeToIndex}
          handleDeleteLocation={this.handleDeleteLocation}
        />
        <AlertMessage
          open={this.state.saved}
          onClose={this.handleCloseSaveMessage}
          message={"Your trip is successfully saved!"}
        />
        <AlertMessage
          open={this.state.deleted}
          onClose={this.handleCloseDeleteMessage}
          message={"Your trip is successfully deleted!"}
        />
        {this.state.redirect && <Redirect to="/home" />}
      </div>
    );
  }
}

PureTripView.contextType = UserContext;

export const TripView = withStyles(styles)(PureTripView);
