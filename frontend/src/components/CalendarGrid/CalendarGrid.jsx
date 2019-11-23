import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { ItineraryLocationCard, TravelSeparator } from "../";
import { styles } from "./styles";

class PureCalendarGrid extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      time: null
    };
  }

  getTypes = types => {
    var result = [];
    for (let value of Object.keys(types)) {
      if (types[value]) {
        result.push(value.replace("_", " "));
      }
    }
    return result;
  };

  isEqual = (a, b) => {
    var i = 0;
    if (!a || !b) return false;
    if (a.length !== b.length) return false;
    while (i < a.length) {
      if (a[i] !== b[i]) return false;
      i++;
    }
    return true;
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (!this.isEqual(this.state.time, nextState.time)) {
      return true;
    }
    if (this.props.itinerary !== nextProps.itinerary) {
      return true;
    }
    return false;
  };

  componentDidUpdate = () => {
    const { itinerary, travelTimes, placeToIndex } = this.props;
    itinerary &&
      this.setState({
        time: itinerary.map((item, i, arr) => {
          var time = 0;
          if (i !== 0) {
            const indexA = placeToIndex[arr[i - 1].google.place_id];
            const indexB = placeToIndex[item.google.place_id];
            time = travelTimes[indexA][indexB];
          }
          return time;
        })
      });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        {this.state.time &&
          this.state.time.length !== 0 &&
          this.props.itinerary.map((item, key) => (
            <div key={key}>
              <ItineraryLocationCard
                id={item.google.place_id}
                title={item.foursquare.venue_name}
                type={this.getTypes(item.foursquare.location_types)}
                media={item.foursquare.pictures[0]}
                rating={item.google.rating}
                onDelete={this.props.handleDeleteLocation}
              />
              {key !== this.props.itinerary.length - 1 && (
                <div>
                  <TravelSeparator time={this.state.time[key + 1]} />
                </div>
              )}
            </div>
          ))}
      </div>
    );
  }
}

export const CalendarGrid = withStyles(styles)(PureCalendarGrid);
