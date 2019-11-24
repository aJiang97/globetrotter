/* global google */
// import { Map, GoogleApiWrapper, InfoWindow, Marker } from "google-maps-react";
import {
  DirectionsRenderer,
  GoogleMap,
  withGoogleMap,
  Marker,
} from "react-google-maps";
import * as React from "react";

const style = {
  width: "100%",
  height: "100%"
};

class MapContainer extends React.Component {
  state = {
    directions: null,
    waypoints: null,
    locations: null
  };


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
            disableDefaultUI = {true}
          >
            <DirectionsRenderer
              directions={this.state.directions}
              options={
                {
                  suppressInfoWindows:true,
                  suppressMarkers:true
                }
              }
            />
            {this.props.locations.map((loc,key) => (
                <Marker
                  key={key}
                  position={{
                    lat: loc.foursquare.coordinate.latitude,
                    lng: loc.foursquare.coordinate.longitude
                  }}
                  name={loc.foursquare.venue_name}
                  icon={new google.maps.MarkerImage('http://chart.apis.google.com/chart?chst=d_map_pin_letter&chld=%E2%80%A2|276df0')}
                >
                </Marker>
            ))}
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
