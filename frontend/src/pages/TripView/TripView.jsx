import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

import { ItineraryLocationCard } from "../../components/ItineraryLocationCard";
import { TravelSeparator } from "../../components/TravelSeparator";
import { DateTabs } from "../../components/DateTabs";
import operaHouse from "../../assets/opera-house.jpg";
import { 
  Typography
} from "@material-ui/core";


export class PureTripView extends React.Component {
  
  
  
  constructor(props) {
    super(props);
    this.itineraryItem = {
      startTime: "10.00am",
      endTime: "12.00pm",
      suggestedTime: "45 min",
      venue: {
        name: "Sydney Opera House",
        type: ["Sightseeing", "National Monument", "Iconic Sights to Visit"],
        media: operaHouse,
        description: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings."
      }
    }
  }
  
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.container}>
        <Typography variant="h2" className={classes.title}>Your Trip to Sydney</Typography>
        <DateTabs
          tabLabels={["01 Nov", "02 Nov", "03 Nov", "04 Nov"]}
        />
        <div className={classes.itinerary}>
          <ItineraryLocationCard itineraryItem={this.itineraryItem} />
          <TravelSeparator walkTime="15 min" driveTime="4 min" publicTime="10 min" />
          <ItineraryLocationCard itineraryItem={this.itineraryItem} />
          <TravelSeparator walkTime="15 min" driveTime="4 min" publicTime="10 min" />
          <ItineraryLocationCard itineraryItem={this.itineraryItem} />
          <TravelSeparator walkTime="15 min" driveTime="4 min" publicTime="10 min" />
          <ItineraryLocationCard itineraryItem={this.itineraryItem} />
        </div>
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
