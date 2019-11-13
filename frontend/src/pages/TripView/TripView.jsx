import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

import {
  CalendarGrid,
  DateTabs,
  NavBar,
} from "../../components";
import { Typography } from "@material-ui/core";
export class PureTripView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itinerary: null,
      travelTimes: null
    };
  }

  getDates = () => {
    const urlParams = new URLSearchParams(window.location.search);
    var startDate = new Date(urlParams.get("start_date"));
    var endDate = new Date(urlParams.get("end_date"));
    var dates = [];
    var curDate = startDate;
    while (curDate <= endDate) {
      dates.push(curDate.toString().slice(4, 15));
      const nextDate = new Date(curDate);
      nextDate.setDate(curDate.getDate() + 1);
      curDate = nextDate;
    }
    return dates;
  };

  componentDidMount = () => {
    if (this.props.places) {
      this.setState({
        itinerary: this.props.places.map(place => ({
          ...place,
          suggestedTime: 45
        })),
        travelTimes: [
          [0, 30, 25, 45, 50, 40],
          [0, 0, 20, 15, 70, 40],
          [0, 0, 0, 35, 75, 35],
          [0, 0, 0, 0, 65, 40],
          [0, 0, 0, 0, 0, 30],
          [0, 0, 0, 0, 0, 0]
        ]
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <NavBar />
        <Typography variant="h2" className={classes.title}>
          Your Trip to
        </Typography>
        <DateTabs tabLabels={this.getDates()} />
        {/* <div className={classes.itinerary}>
          {this.state.itinerary &&
            this.state.itinerary.map((item, key) => (
              <div key={key}>
                <TravelSeparator driveTime="4 min" />
                <ItineraryLocationCard
                  title={item.foursquare.venue_name}
                  type={this.getTypes(item.foursquare.location_types)}
                  media={item.foursquare.pictures[0]}
                  suggestedTime={item.suggestedTime}
                  rating={item.google.rating.toFixed(2)}
                />
              </div>
            ))}
        </div> */}
        <CalendarGrid
          itinerary={this.state.itinerary}
          travelTimes={this.state.travelTimes}
          placeToIndex={this.props.placeToIndex}
        />
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
