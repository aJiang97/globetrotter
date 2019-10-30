import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { styles } from "./styles";
import history from "../../history";

import { ItineraryLocationCard } from "../../components/ItineraryLocationCard";
import { TravelSeparator } from "../../components/TravelSeparator";
import operaHouse from "../../assets/opera-house.jpg";


export class PureTripView extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <ItineraryLocationCard 
          startTime="10.00am" 
          endTime="12.00pm"
          suggestedTime="45"
          venue={{
            name: "Sydney Opera House",
            type: ["Sightseeing", "National Monument", "Iconic Sights to Visit"],
            media: operaHouse,
            description: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings."
          }} 
        />

        <TravelSeparator 
          walkTime="15 min"
          driveTime="4 min"
          publicTime="10 min"
        />

        <ItineraryLocationCard 
          startTime="1.00pm" 
          endTime="2.00pm"
          suggestedTime="45"
          venue={{
            name: "Sydney Opera House",
            type: ["Sightseeing", "National Monument", "Iconic Sights to Visit"],
            media: operaHouse,
            description: "The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour in Sydney, New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings."
          }} 
        />
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
