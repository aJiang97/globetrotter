import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import * as React from "react";

const style = {
  width: "50%",
  height: "100%",
  overflow: "auto"
}

export class MapContainer extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <Map
        google={this.props.google}
        style={style}
        zoom={15}
        disableDefaultUI="true"
        initialCenter={{
          lat: this.props.lat,
          lng: this.props.lng
        }}
      >
        <Marker position={{ lat: this.props.lat, lng: this.props.lng}}/>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);