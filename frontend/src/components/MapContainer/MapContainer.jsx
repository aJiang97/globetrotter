/* global google */
// import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import {
  DirectionsRenderer,
  GoogleMap,
  withGoogleMap
} from "react-google-maps";
import * as React from "react";

const style = {
  width: "100%",
  height: "100%"
};

class MapContainer extends React.Component {
  state = {
    // showingInfoWindow: false,
    // activeMarker: {},
    // selectedPlace: {},
    directions: null,
    waypoints: null,
    locations: null
  };

  // onMarkerClick = (props, marker, e) => {
  //   this.setState({
  //     selectedPlace: props,
  //     activeMarker: marker,
  //     showingInfoWindow: true
  //   });
  // };

  // onMapClicked = props => {
  //   if (this.state.showingInfoWindow) {
  //     this.setState({
  //       showingInfoWindow: false,
  //       activeMarker: null
  //     });
  //   }
  // };

  apiIsLoaded = () => {
    var origin;
    var destination;
    const waypoints = this.props.locations.map((loc, key) => {
      if (key === 0) {
        origin = new google.maps.LatLng(
          parseFloat(loc.foursquare.coordinate.latitude),
          parseFloat(loc.foursquare.coordinate.longitude)
        );
      }
      if (key === this.props.locations.length - 1) {
        destination = new google.maps.LatLng(
          parseFloat(loc.foursquare.coordinate.latitude),
          parseFloat(loc.foursquare.coordinate.longitude)
        );
      }
      return {
        location: {
          lat: parseFloat(loc.foursquare.coordinate.latitude),
          lng: parseFloat(loc.foursquare.coordinate.longitude)
        },
        stopover: true
      };
    });

    const directionsService = new google.maps.DirectionsService();
    // const directionsRenderer = new maps.DirectionsRenderer();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: google.maps.TravelMode.DRIVING,
        waypoints: waypoints
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          console.log(result);
          this.setState({
            directions: result,
            waypoints: waypoints,
            locations: this.props.locations
          });
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );
  };

  isEqual = (oldArray, newArray) => {
    if (!oldArray || !newArray) return false;
    if (oldArray.length !== newArray.length) return false;
    var i = 0;
    while (i < oldArray.length) {
      if (oldArray[i] !== newArray[i]) return false;
      i++;
    }
    return true;
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!this.isEqual(this.props.locations, nextProps.locations)) {
      return true;
    } else if (
      JSON.stringify(this.state.directions) !==
      JSON.stringify(nextState.directions)
    ) {
      return true;
    }
    return false;
  };

  componentDidMount = () => {
    this.apiIsLoaded();
  };

  render() {
    this.apiIsLoaded();
    const GoogleMapWrapper = withGoogleMap(props => {
      return (
        this.state.directions && (
          <GoogleMap
            defaultZoom={7}
            defaultCenter={this.state.directions.request.origin}
          >
            <DirectionsRenderer directions={this.state.directions} />
          </GoogleMap>
        )
      );
    });
    return (
      <GoogleMapWrapper
        containerElement={<div style={style} />}
        mapElement={<div style={{ height: `100%` }} />}
      />
    );
  }
}

export default MapContainer;
