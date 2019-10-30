import React from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Paper,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";

class PureLocationListWindow extends React.Component {
  render() {
    const { classes, isOpen, locations } = this.props;
    return (
      <div>
        <Paper className={isOpen ? classes.drawerOn : classes.drawerOff}>
          <Typography variant="h5" className={classes.title}>
            Selected Locations
          </Typography>
          {locations.map((location, key) => (
            <Card key={key} className={classes.card}>
              <CardMedia className={classes.media} image={location.media} />
              <CardContent>
                <Typography component="h2" variant="h5">
                  {location.title}
                </Typography>
                <Typography
                  variant="subtitle1"
                  color="textSecondary"
                  component="p"
                >
                  {location.type}
                </Typography>
              </CardContent>
              <CardActions disableSpacing></CardActions>
            </Card>
          ))}
        </Paper>
      </div>
    );
  }
}

export const LocationListWindow = withStyles(styles)(PureLocationListWindow);
