import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  IconButton,
  Paper,
  Typography
} from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";

class PureLocationListWindow extends React.Component {
  render() {
    const { classes, isOpen, locations, onRemove } = this.props;
    return (
      <Paper className={isOpen ? classes.drawerOn : classes.drawerOff}>
        <Typography variant="h5" className={classes.title}>
          Selected Locations
        </Typography>
        {locations.map((location, key) => (
          <Card key={key} className={classes.card}>
            <CardMedia
              className={classes.media}
              image={location.foursquare.pictures[0]}
            />
            <CardActions disableSpacing>
              <IconButton
                className={classes.closeButton}
                onClick={() => onRemove(key)}
              >
                <Close />
              </IconButton>
            </CardActions>
            <CardContent className={classes.content}>
              <Typography variant="h6">
                {location.foursquare.venue_name}
              </Typography>
              <Typography variant="caption" color="textSecondary" component="p">
                {this.props.getTypes(location.foursquare.location_types)}
              </Typography>
            </CardContent>
          </Card>
        ))}
        {this.props.displayError && (
          <Typography
            variant="caption"
            color="error"
            className={classes.errorMessage}
          >
            Please choose at least 1 place
          </Typography>
        )}
      </Paper>
    );
  }
}

export const LocationListWindow = withStyles(styles)(PureLocationListWindow);
