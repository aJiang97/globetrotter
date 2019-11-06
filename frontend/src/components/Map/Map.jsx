import { Map, GoogleApiWrapper } from 'google-maps-react';

const style = {
  width: '50%',
  height: '50%',
  position: 'relative'
}

export class MapContainer extends React.Component {
  state = {
    showingInfoWindow: false,
    activeMarker: {},
    selectedPlace: {},
  };

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
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
        style={style}
        zoom={15}
        initialCenter={{
          lat: -34.397,
          lng: 150.644
        }}
        onClick={this.onMapClicked}
      >
        <Marker
          onClick={this.onMarkerClick}
          name={'Sydney'}
          position={{lat: -34.397, lng:150.644}}/>
        <InfoWindow onClose={this.onInfoWindowClose}>
            <div>
              <h1>{this.state.selectedPlace.name}</h1>
            </div>
        </InfoWindow>
      </Map>
    )
  }
}

export default GoogleApiWrapper({
  apiKey: 'AIzaSyB376cyeRoqfXHQXE-Zhl45CP8sPSK4MV0'
})(MapContainer);