import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Fab,
  Typography
} from "@material-ui/core";
import { Add, Close } from "@material-ui/icons";

import { StarRating } from "../../../StarRating";
import { styles } from "./styles";

class PureLocationCard extends React.Component {
  render() {
    const { classes, isAdded, location, id, onAdd, onRemove } = this.props;
    return (
      <div className={classes.locationContainer}>
        {isAdded ? (
          <Fab
            color="primary"
            onClick={() => {
              onRemove(location.google.place_id);
            }}
          >
            <Close />
          </Fab>
        ) : (
          <Fab
            color="primary"
            onClick={() => {
              onAdd(id);
            }}
          >
            <Add />
          </Fab>
        )}
        <Card className={classes.card}>
          <CardMedia
            className={classes.media}
            image={location.foursquare.pictures[0]}
          />
          <CardContent className={classes.content}>
            <Typography variant="h6">
              {location.foursquare.venue_name}
            </Typography>
            {location.google.rating && (
              <StarRating value={location.google.rating.toFixed(2)} />
            )}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export const LocationCard = withStyles(styles)(PureLocationCard);
