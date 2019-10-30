import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

import { ItineraryLocationCard } from "../../components/ItineraryLocationCard";
import { TravelSeparator } from "../../components/TravelSeparator";
import operaHouse from "../../assets/opera-house.jpg";


export class PureTripView extends React.Component {
  render() {
    const { classes } = this.props;
    let itineraryItem = {
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
    return (
      <div>
        <ItineraryLocationCard itineraryItem={itineraryItem} />

        <TravelSeparator 
          walkTime="15 min"
          driveTime="4 min"
          publicTime="10 min"
        />

        <ItineraryLocationCard itineraryItem={itineraryItem} />

        <TravelSeparator 
          walkTime="15 min"
          driveTime="4 min"
          publicTime="10 min"
        />

        <ItineraryLocationCard itineraryItem={itineraryItem} />

        <TravelSeparator 
          walkTime="15 min"
          driveTime="4 min"
          publicTime="10 min"
        />

        <ItineraryLocationCard itineraryItem={itineraryItem} />
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
