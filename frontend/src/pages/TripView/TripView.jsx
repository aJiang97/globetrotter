import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, TextField, Typography } from "@material-ui/core";

import { styles } from "./styles";
import { CalendarGrid, DateTabs, NavBar, UsersRow, AddUserModal } from "../../components";
import { SaveMessage } from "./SaveMessage";
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
      isAddUserOpen: false,
      title: "",
      saved: false,
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
      title: e.target.value,
    });
  };

  handleCloseSaveMessage = e => {
    this.setState({
      saved: false
    })
  }
 
  handleSaveItinerary = () => {
    this.apiClient = new APIClient();
    const urlParams = new URLSearchParams(window.location.search);
    const city = urlParams.get("location").replace("_"," ");
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
      .then(data => {
        var user = this.context.user;
        this.apiClient.getAllTrips(this.context.user.token).then((data) => {
          user.trips = data.trips
          this.context.logIn(user);
          this.setState({
            saved: true
          })
        })
      })
  }

  openAddUserModal = () => {
    this.setState({ isAddUserOpen: true });
  }
  
  closeAddUserModal = () => {
    this.setState({ isAddUserOpen: false });
  }

  componentDidMount = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
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
              title: detail.info.description,
              itinerary: detail.blob.orderedPlaces,
              dates: this.getDates(),
              currentDateItinerary: this.getCurrentDateItinerary(
                detail.blob.orderedPlaces,
                0,
                this.getDates().length
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

        {/* Add Users Row Here */}
        <UsersRow users={[]} handleAdd={this.openAddUserModal}/>


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
          placeToIndex={this.state.placeToIndex}
        />
        <SaveMessage open={this.state.saved} onClose={this.handleCloseSaveMessage}/>

        {/* Form for adding users to the trip  */}
        {this.state.isAddUserOpen && (
          <AddUserModal
            onClose={this.closeAddUserModal}
            onSubmit={() => console.log("Submitted New User")}
          />
        )}

      </div>
    );
  }
}

PureTripView.contextType = UserContext;

export const TripView = withStyles(styles)(PureTripView);
