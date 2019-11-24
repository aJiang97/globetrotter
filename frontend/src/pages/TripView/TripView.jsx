import React from "react";
import { Redirect } from "react-router-dom";
import ReactLoading from "react-loading";
import { withStyles } from "@material-ui/core/styles";
import { Button, Grid, TextField, Typography } from "@material-ui/core";
import { SaveAlt } from "@material-ui/icons";

import { styles } from "./styles";
import { AddLocationModal } from "../../components/forms";
import { AlertMessage, CalendarGrid, DateTabs, NavBar, UsersRow, AddUserModal } from "../../components";
import APIClient from "../../api/apiClient";
import MapContainer from "../../components/MapContainer/MapContainer";
import { UserContext } from "../../UserContext";
import io from "socket.io-client";

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
      isAddUserOpen: false,
      title: "",
      saved: false,
      whoSaved: "User",
      users: [],
      deleted: false,
      deletedUser: null,
      addedUser: null,
      redirect: false,
      dateIndex: 0,
      openAddLocationModal: false,
      places: null
    };
    this.apiClient = new APIClient();
    this.socket = io.connect('http://127.0.0.1:5000/');
  }

  getElementOrder = (path, id) => {
    for (var i = 0; i < path.length; i++) {
      if (path[i] === id) {
        return i;
      }
    }
  }; 

  // #region Date Functions
  getDates = (start, end) => {
    var dates = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
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
    const nPlacesPerDate = Math.floor(path.length / period);
    const remainder = path.length % period;
    var totalPlaces;
    var i = 0;
    if (remainder > index) {
      i += index * (nPlacesPerDate + 1)
      totalPlaces = nPlacesPerDate + 1
    } else {
      i += remainder * (nPlacesPerDate + 1) + Math.abs(remainder - index) * nPlacesPerDate;
      totalPlaces = nPlacesPerDate
    }
    var result = [];
    for (var j = 0; j < totalPlaces; j++) {
      result.push(path[i])
      i++;      
    }
    return result
  };

  handleStartDateChange = e => {
    const newDates = this.getDates(e.target.value, this.state.endDate);
    const currentDateItinerary = this.getCurrentDateItinerary(this.state.itinerary, 0, newDates.length);
    
    this.setDateIndex(0);
    this.setState({
      startDate: e.target.value,
      dates: newDates,
      currentDateItinerary: currentDateItinerary
    });

    const new_dates = {
      startDate: e.target.value,
      endDate: this.state.endDate,
      dates: newDates,
      dateIndex: 0,
      currentDateItinerary: currentDateItinerary
    };

    this.socket.emit('edit_dates', new_dates, this.state.uuid);
  };

  handleEndDateChange = e => {
    const newDates = this.getDates(this.state.startDate, e.target.value);
    const currentDateItinerary = this.getCurrentDateItinerary(this.state.itinerary, 0, newDates.length);

    this.setDateIndex(0);
    this.setState({
      endDate: e.target.value,
      dates: newDates,
      currentDateItinerary: this.getCurrentDateItinerary(
        this.state.itinerary,
        0,
        newDates.length
      )
    });

    const new_dates = {
      startDate: this.state.startDate,
      endDate: e.target.value,
      dates: newDates,
      dateIndex: 0,
      currentDateItinerary: currentDateItinerary
    };

    this.socket.emit('edit_dates', new_dates, this.state.uuid);
  };
  // #endregion

  // #region Title Functions
  handleEditableTitle = () => {
    this.setState({ isEditableTitle: true });
  };

  handleNonEditableTitle = () => {
    this.setState({ isEditableTitle: false });

    // Send title change to other users
    this.socket.emit('edit_title', this.state.title, this.state.uuid);
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value });
  };
  // #endregion

  // #region Alert Message Controller Functions
  handleCloseSaveMessage = e => {
    this.setState({ saved: false });
  };

  handleCloseDeleteMessage = e => {
    this.setState({
      deleted: false
    });
  };
  // #endregion

  // #region Add/Delete Locations
  handleSubmitLocation = newLocations => {
    const places = this.state.places.concat(newLocations);
    const placeToIndex = {};
    places.map((place, i) => (placeToIndex[place.google.place_id] = i));
    const placeIDs = places
      .map(place => `place_id:${place.google.place_id}`)
      .join("|");
    this.apiClient = new APIClient();
    this.apiClient.generateItinerary(placeIDs).then(data => {
      const detailedPath = places
        .map(place => ({
          ...place,
          order: this.getElementOrder(data.path, place.google.place_id)
        }))
        .sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

      const currentDateItinerary = this.getCurrentDateItinerary(
                                      detailedPath,
                                      this.state.dateIndex,
                                      this.state.dates.length
                                    );

      this.setState({
        itinerary: detailedPath,
        places: places,
        currentDateItinerary: currentDateItinerary,
        placeToIndex: placeToIndex,
        travelTimes: data.travel_matrix,
        openAddLocationModal: false
      });

      const newLocationState = {
        itinerary: detailedPath,
        places: places,
        currentDateItinerary: currentDateItinerary,
        placeToIndex: placeToIndex,
        travelTimes: data.travel_matrix,
        openAddLocationModal: false
      }

      this.socket.emit('edit_locations', newLocationState, this.state.uuid);

    });
  };
  
  addMinutes = (datetime, min) => {
    datetime.setTime(datetime.getTime() + (min*60*1000));
    return this;
  }

  handleExportTrip = () => {
    const nPlacesPerDate = Math.floor(this.state.itinerary.length / this.state.dates.length);
    const remainder = this.state.itinerary.length % this.state.dates.length;
    var itinerary = []
    var dateIndex = 0
    var i = 0
    while (i < this.state.itinerary.length && dateIndex < this.state.dates.length) {
      var totalPlaces;
      if (remainder > dateIndex) totalPlaces = nPlacesPerDate + 1;
      else totalPlaces = nPlacesPerDate;
      var datetime = new Date(this.state.dates[dateIndex])
      this.addMinutes(datetime, 9 * 60);
      for (var j = 0; j < totalPlaces; j++) {
        if (i >= this.state.itinerary.length) break;
        itinerary.push({
          start: new Date(datetime),
          name: this.state.itinerary[i].foursquare.venue_name,
          duration: 60,
        })
        if (i !== this.state.itinerary.length - 1) {
          const thisLocationID = this.state.itinerary[i].google.place_id
          const nextLocationID = this.state.itinerary[i + 1].google.place_id
          const indexA = this.state.placeToIndex[thisLocationID];
          const indexB = this.state.placeToIndex[nextLocationID];
          const travelTime = this.state.travelTimes[indexA][indexB];
          this.addMinutes(datetime, 60 + parseInt(travelTime.split(" ")[0]));
          i++;  
        }
      }
      dateIndex++
    }
    this.apiClient = new APIClient();
    this.apiClient.exportTrip(itinerary).then((result) => {
      const element = document.createElement("a");
      const file = new Blob([result.content], {type: 'text/calendar'});
      element.href = URL.createObjectURL(file);
      element.download = `${this.state.title}.ics`;
      document.body.appendChild(element); // Required for this to work in FireFox
      element.click();
    })
  }

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
        .map(place => ({
          ...place,
          order: this.getElementOrder(data.path, place.google.place_id)
        }))
        .sort((a, b) => parseFloat(a.order) - parseFloat(b.order));

      const currentDateItinerary = this.getCurrentDateItinerary(
                                      detailedPath,
                                      this.state.dateIndex,
                                      this.state.dates.length
                                    );
      
      this.setState({
        itinerary: detailedPath,
        places: places,
        currentDateItinerary: currentDateItinerary,
        placeToIndex: placeToIndex,
        travelTimes: data.travel_matrix
      });

      const newLocationState = {
        itinerary: detailedPath,
        places: places,
        currentDateItinerary: currentDateItinerary,
        placeToIndex: placeToIndex,
        travelTimes: data.travel_matrix
      }

      this.socket.emit('edit_locations', newLocationState, this.state.uuid);
    });
  };

  handleOpenAddLocationModal = () => {
    this.setState({ openAddLocationModal: true });
  };

  handleCloseAddLocationModal = () => {
    this.setState({ openAddLocationModal: false });
  };
  // #endregion

  // #region Saving/Deleting Trips
  handleDeleteTrip = () => {
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
  };

  handleSaveItinerary = () => {
    const { uuid, title, startDate, endDate, places, itinerary, city } = this.state;
    const {token } = this.context.user;
    if (uuid) {
      this.apiClient
        .updateItinerary(
          token,
          uuid,
          title,
          city,
          startDate,
          endDate,
          places,
          itinerary
        )
        .then(result => {
          var user = this.context.user;
          this.apiClient.getAllTrips(this.context.user.token).then(data => {
            user.trips = data.trips;
            this.context.logIn(user);
            this.setState({
              saved: true,
              whoSaved: user.name
            });

            this.socket.emit('save', user, uuid);
          });
        });
    } else {
      this.apiClient
        .saveItinerary(
          token,
          title,
          city,
          startDate,
          endDate,
          places,
          itinerary
        )
        .then(result => {
          var user = this.context.user;
          this.apiClient.getAllTrips(this.context.user.token).then(data => {
            user.trips = data.trips;
            this.context.logIn(user);
            this.setState({
              saved: true,
              whoSaved: user.name,
              uuid: result.uuid
            });
          });
        });
    }
  };
  // #endregion

  // #region Multi-User Collaboration Functions
  handleAddUserToTrip = (user) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const userToken = this.context.user.token;
    this.apiClient
      .addUserToTrip(userToken, user, uuid)
      .then(response => {
        this.updateUsersOnTrip(uuid);
        this.setState({
          addedUser: {...user}
        });
      });
  }

  handleRemoveUser = (email) => {
    const urlParams = new URLSearchParams(window.location.search);
    const uuid = urlParams.get("uuid");
    const userToken = this.context.user.token;
    const userToDelete = this.getUserFromTrip(email);

    this.apiClient
      .deleteUserFromTrip(userToken, email, uuid)
      .then(response => {
        this.updateUsersOnTrip(uuid);
        this.setState({
          deletedUser: {...userToDelete}
        });
      });
  }

  updateUsersOnTrip = (uuid) => {
    const userToken = this.context.user.token;

    // #region this.context.user
    // {name: "Sebastian Chua", token: "06df15cb7da564eb4284ccb136559dd0b80bbb95cc971b1c450a594d25e829fe", email: "sebi@test.com", password: "ff156710984f143b", trips: Array(1)}
    // email: "sebi@test.com"
    // name: "Sebastian Chua"
    // password: "ff156710984f143b"
    // token: "06df15cb7da564eb4284ccb136559dd0b80bbb95cc971b1c450a594d25e829fe"
    // trips: Array(1)
    // 0: {description: "Business Trip", city: "New York", tripstart: "2019-12-12 00:00:00+00:00", tripend: "2019-12-16 00:00:00+00:00", modifieddate: "2019-11-20 16:04:11.797981+00:00", …}
    // length: 1
    // #endregion

    this.apiClient
      .getUsersOnTrip(userToken, uuid)
      .then(response => {
        this.setState({
          users: response
        })

        this.socket.emit('edit_users', this.state.users, this.state.uuid);
      });
  }

  listenForChanges = (uuid) => {
    // Setup socket for this user using uuid as a room
    this.socket.emit('join', {
      user: this.context.user,
      room: uuid
    }, () => { console.log('Successfully joined room.') });
    
    this.socket.on('editTitle', (new_title) => {
      this.setState({ title: new_title });
    });

    this.socket.on('editUsers', (new_users) => {
      this.setState({ users: new_users });
    });

    this.socket.on('editDates', (new_dates) => {
      this.setState({
        startDate: new_dates.startDate,
        endDate: new_dates.endDate,
        dates: new_dates.dates,
        dateIndex: new_dates.dateIndex,
        currentDateItinerary: new_dates.currentDateItinerary
      });
    });

    this.socket.on('editLocations', (new_data) => {
      this.setState({
        itinerary: new_data.itinerary,
        places: new_data.places,
        currentDateItinerary: new_data.currentDateItinerary,
        placeToIndex: new_data.placeToIndex,
        travelTimes: new_data.travelTimes,
        openAddLocationModal: new_data.openAddLocationModal
      })
    });

    this.socket.on('userSave', (user) => {
      console.log('SAVING SOCKET RECEIVED');
      console.log(user);
      this.setState({
        saved: true,
        whoSaved: user
      });
    })

    this.socket.on('message', (msg) => {
      console.log('Received Message: ' + msg);
    })
  }

  handleCloseAddUserMessage = e => {
    this.setState({
      addedUser: null
    });
  }

  handleCloseDeleteUserMessage = e => {
    this.setState({
      deletedUser: null
    });
  }

  openAddUserModal = () => {
    this.setState({ isAddUserOpen: true });
  }
  
  closeAddUserModal = () => {
    this.setState({ isAddUserOpen: false });
  }

  isUserOnTrip = (email) => {
    for (let user of this.state.users) {
      if (user.email === email) {
        return true;
      }
    }
    return false;
  }

  getUserFromTrip = (email) => {
    for (let user of this.state.users) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }
  // #endregion
   
  // #region React Lifecycle Methods
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

        this.updateUsersOnTrip(uuid);
        this.listenForChanges(uuid);

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

  componentWillUnmount() {
    // Closes socket connection
    this.socket.emit('leave', {
      user: this.context.user, 
      room: this.state.uuid
    }, () => { console.log('Successfully left room') });

    clearTimeout(this.id);
  }
  // #endregion

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <NavBar />
        {!this.state.places && (
          <div className={classes.loadingContainer}>
            <ReactLoading type={"spin"} color={"black"} />
          </div>
        )}
        <Grid className={classes.section}>
          <Grid container item xs={6} className={classes.subSection}>
            <div className={classes.smallContainer}>
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
                variant="h3"
                className={classes.title}
                onMouseOver={this.handleEditableTitle}
              >
                {this.state.title}
              </Typography>
            )}
            <div className={classes.flexDiv} />
            {this.context.user && this.state.places && (
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
            </div>
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
            {this.state.places &&
              <div className={classes.smallContainer}>
                {this.context.user && this.state.uuid &&
                  <UsersRow 
                    currentUser={this.getUserFromTrip(this.context.user.email)}
                    users={this.state.users} 
                    handleAdd={this.openAddUserModal}
                    handleRemove={this.handleRemoveUser}  
                  />
                }
                <div className={classes.flexDiv} />
                <div className={classes.secondRowButtons}>
                  <Button
                    color="primary"
                    onClick={this.handleOpenAddLocationModal}
                  >
                    Add Location
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.handleExportTrip}
                  >
                    <div style={{display: "flex", flexDirection: "row", alignItems: "center"}}>
                      <SaveAlt />
                      Export
                    </div>
                  </Button>
                </div>
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

            {/* Form for adding users to the trip  */}
            {this.state.isAddUserOpen && (
              <AddUserModal
                isUserOnTrip={this.isUserOnTrip}
                onClose={this.closeAddUserModal}
                onSubmit={this.handleAddUserToTrip}
              />
            )}

            <AlertMessage
              open={this.state.saved}
              onClose={this.handleCloseSaveMessage}
              message={`${this.state.whoSaved} saved the trip.`}
            />
            <AlertMessage
              open={this.state.deleted}
              onClose={this.handleCloseDeleteMessage}
              message={"Your trip is successfully deleted!"}
            />
            <AlertMessage
              open={this.state.addedUser !== null}
              onClose={this.handleCloseAddUserMessage}
              message={`${this.state.addedUser ? this.state.addedUser.displayname : 'User'} was successfully added to this trip.`}
            />
            <AlertMessage
              open={this.state.deletedUser !== null}
              onClose={this.handleCloseDeleteUserMessage}
              message={`${this.state.deletedUser ? this.state.deletedUser.displayname : 'User'} was successfully removed from this trip.`}
            />
            {this.state.openAddLocationModal && (
              <AddLocationModal
                city={this.state.city}
                onSubmit={this.handleSubmitLocation}
                onClose={this.handleCloseAddLocationModal}
                existingLocations={this.state.places}
              />
            )}
            {this.state.redirect && <Redirect to="/home" />}
          </Grid>
          <Grid container item xs={6}>
            {this.state.dates && 
             this.state.currentDateItinerary && 
             this.state.currentDateItinerary.length !== 0 &&
             (
              <MapContainer
                locations={this.state.currentDateItinerary}
              />
            )}
          </Grid>
        </Grid>
      </div>
    );
  }
}

PureTripView.contextType = UserContext;

export const TripView = withStyles(styles)(PureTripView);
