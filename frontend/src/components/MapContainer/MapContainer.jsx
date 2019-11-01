import { Map, GoogleApiWrapper, InfoWindow, Marker } from 'google-maps-react';
import * as React from "react";

const style = {
  width: "50%",
  height: "100%",
  overflow: "auto"
}


export class MapContainer extends React.Component {
  constructor() {
    super();
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {}
    }
    this.onMarkerClick = this.onMarkerClick.bind(this);
    this.onClose = this.onClose.bind(this);
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    })
  
  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null
      })
    }
  }

  renderMarkers() {
    return this.props.locations.map((loc,key) => {
      return (<Marker onClick={this.onMarkerClick} position={{
        lat: loc.lat,
        lng: loc.lng
      }} name={loc.title} />);
    })
  }

  render() {
    const { classes } = this.props;
    return (
      <Map
        google={this.props.google}
        style={style}
        zoom={12}
        disableDefaultUI="true"
        // This is Sydney centre coordinates
        initialCenter={{
          lat: -33.8708,
          lng: 151.2073
        }}
      >
        {this.renderMarkers()}
        {/* <InfoWindow marker={this.state.activeMarker} visible={this.state.showingInfoWindow} onClose={this.onClose}>
          <div>
            {this.state.selectedPlace.name}
          </div>
        </InfoWindow>); */}
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);