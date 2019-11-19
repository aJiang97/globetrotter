import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
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
    selectedPlace: {}
  };


  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
    });
  

  onMapClicked = (props) => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  };

  render() {
    return (
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
          >
            {/* <InfoWindow
              marker={this.state.activeMarker}
              visible={this.state.showingInfoWindow}
            >
              <div>
                <h1>{this.state.selectedPlace.name}</h1>
              </div>
            </InfoWindow> */}
          </Marker>
      ))}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);