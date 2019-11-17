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
import MoreVertIcon from "@material-ui/icons/MoreVert";
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
  constructor(props) {
    super(props);
    this.state = {
      expanded: null
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card} raised>
        <Grid container>
          {/* Time Section */}
          <Grid item md={2}>
            <CardContent className={classes.timeColumn}>
              <div className={classes.suggestion}>
                <Typography className={classes.suggested}>
                  Suggested:
                </Typography>
                <Typography className={classes.suggestedTime}>
                  {this.props.suggestedTime}
                </Typography>
              </div>
            </CardContent>
          </Grid>

          {/* Photo Section */}
          <Grid item md={4}>
            <CardMedia className={classes.media} image={this.props.media} />
          </Grid>

          {/* Content Section */}
          <Grid item md={6}>
            <CardContent className={classes.cardContent}>
              <IconButton className={classes.moreButton}>
                <MoreVertIcon />
              </IconButton>
              <Typography variant="h3" className={classes.venueName}>
                {this.props.title}
              </Typography>
              <StarRating value={4.5} />
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
