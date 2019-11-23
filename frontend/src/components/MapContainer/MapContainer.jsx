/* global google */
import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import { DirectionsRenderer } from 'react-google-maps';
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
    directions: null
  };

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

  componentDidMount() {
    const waypoints = this.props.locations.map(loc => ({
      location: {lat: parseFloat(loc.foursquare.coordinate.latitude),
      lng: parseFloat(loc.foursquare.coordinate.longitude)},
      stopover: true
    }))
    const origin = waypoints.shift().location;
    const destination = waypoints.pop().location;

    const DirectionsService = new google.maps.DirectionsService();
    DirectionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          this.setState({
            directions: result
          });
        } else {
          console.error('error fetching directions ${result}');
        }
      }
    );
  }

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
          {this.state.directions && <DirectionsRenderer directions = {this.state.directions} />}
        {console.log(this.state.directions)}
        </Map>
      </div>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);

