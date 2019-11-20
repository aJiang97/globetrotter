import * as React from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Grid,
  IconButton
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { RemoveCircleOutline } from "@material-ui/icons";
import { styles } from "./styles";
import { StarRating } from "../../components/StarRating";

/**
 * Class for a Location Card in the Itinerary View
 * @prop {ItineraryItem} itineraryItem Object containing details of a location
 * interface ItineraryItem {
 *    startTime (Start Time for Visiting that location): string,
 *    endTime (End Time for Visiting that Location): string,
 *    suggestedTime (Suggested Stay Time): string,
 *    venue: {
 *      name (Name of Location): string
 *      type (Type(s) of Locations): [string]
 *      media (src of Image of Location): string
 *      description (Description of Location): string
 *    }
 * }
 */
class PureItineraryLocationCard extends React.Component {
  render() {
    const { classes, onDelete } = this.props;
    return (
      <Card className={classes.card} raised>
        <Grid container>
          {/* Photo Section */}
          <Grid item md={5}>
            <CardMedia className={classes.media} image={this.props.media} />
          </Grid>

          {/* Content Section */}
          <Grid item md={7}>
            <CardContent className={classes.cardContent}>
              <IconButton
                className={classes.removeButton}
                onClick={() => onDelete(this.props.id)}
              >
                <RemoveCircleOutline />
              </IconButton>
              <Typography variant="h3" className={classes.venueName}>
                {this.props.title}
              </Typography>
              {this.props.rating && (
                <StarRating value={this.props.rating.toFixed(2)} />
              )}
              <Typography
                className={classes.venueType}
                variant="subtitle1"
                color="textSecondary"
                component="p"
                noWrap
              >
                {this.props.type.join(", ")}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export const ItineraryLocationCard = withStyles(styles)(
  PureItineraryLocationCard
);
