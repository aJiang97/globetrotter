/* global google */
import { Map, GoogleApiWrapper, InfoWindow, DirectionsRenderer, Marker } from 'google-maps-react';
import * as React from "react";

const style = {
  width: "50%",
  height: "100%",
  overflow: "auto"
}


export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
    directions: {}
  };

  createCoordinatesList() {
    var names = ['lat', 'lng'], coordinates = [];
    this.props.locations.map(loc => {
      var array = {};
      array[names[0]] = parseFloat(loc.foursquare.coordinate.latitude);
      array[names[1]] = parseFloat(loc.foursquare.coordinate.longitude);
      coordinates.push(array);
    })
    return coordinates;
  }

  onMarkerClick = (props, marker, e) => {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  }

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  // getDirections() {
  //   const coordinates = this.createCoordinatesList();
  //   var waypoints = [];
  //   var start = null;
  //   var end = null;
  //   for (var i = 0; i < coordinates.length; i++) {
  //     var array = {};
  //     array['location'] = new google.maps.LatLng(coordinates[i].lat, coordinates[i].lng);
  //     if (i === 0) {
  //       start = array['location'];
  //     } else if (i === coordinates.length - 1) {
  //       end = array['location'];
  //     }
  //     waypoints.push(array);
  //   }

  //   const DirectionsService = new google.maps.DirectionsService();
  //   DirectionsService.route(
  //     {
  //       origin: start,
  //       destination: end,
  //       travelMode: google.maps.TravelMode.DRIVING,
  //       waypoints: waypoints
  //     },
  //     (result, status) => {
  //       console.log(status);
  //       if (status === google.maps.DirectionsStatus.OK) {
  //         this.setState({
  //           directions: result
  //         });
  //       } else {
  //         console.error('error fetching directions ${result}');
  //       }
  //     }
  //   );
  // }

  render() {
    return (
      <div>
        <Map
          google={this.props.google}
          onClick = {this.onMapClicked}
          style={style}
          zoom={12}
          disableDefaultUI= {true}
          // This is Sydney centre coordinates
          initialCenter={{
            lat: this.props.locations[0].foursquare.coordinate.latitude,
            lng: this.props.locations[0].foursquare.coordinate.longitude
          }}
        >
          {this.props.locations.map((loc,key) => (
              <Marker
                key={key}
                onClick={this.onMarkerClick}
                position={{
                  lat: loc.foursquare.coordinate.latitude,
                  lng: loc.foursquare.coordinate.longitude
                }}
                name={loc.foursquare.venue_name} 
              />
          ))}
          {this.state.activeMarker && <InfoWindow
            marker={this.state.activeMarker}
            visible={this.state.showingInfoWindow}
          >
            <div>
              <h2>{this.state.selectedPlace.name}</h2>
            </div>
          </InfoWindow>}
          {/* {this.getDirections()}
          {this.props.directions && <DirectionsRenderer directions = {this.props.directions} />} */}
        {/* {console.log(this.createCoordinatesList())} */}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);

