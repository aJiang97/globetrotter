import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Button, Typography } from "@material-ui/core";
import { styles } from "./styles";
import history from "../../history";

import { ItineraryLocationCard } from "../../components/ItineraryLocationCard";

export class PureTripView extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <ItineraryLocationCard />
      </div>
    );
  }
}

export const TripView = withStyles(styles)(PureTripView);
