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
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { styles } from "./styles";
import { StarRating } from "../../components/StarRating";

/**
 * Class for a Location Card in the Itinerary View
 * @prop {string} startTime Start Time for Visiting that location
 * @prop {string} endTime End Time for Visiting that location
 * @prop {number} suggestedTime Suggested Stay Time for in minutes
 * @prop {Venue} venue Venue Object that should have the following properties:
 * Venue: {
 *    name (string): Name of the Location,
 *    type ([string]): Type of the Location,
 *    media (string): src of Image of the Location,
 *    description (string): Description of the Location
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
    const { startTime, endTime, suggestedTime, venue, classes } = this.props;
    return (
      <Card className={classes.card} raised>
        <Grid container>
          
          {/* Time Section */}
          <Grid item md={2}>
            <CardContent className={classes.timeColumn}>
              <div className={classes.timeDetails}>
                <Typography className={classes.time}>{startTime}</Typography>
                <div className={classes.verticalLine}></div>
                <Typography className={classes.time}>{endTime}</Typography>
              </div>
              <div className={classes.suggestion}>
                <Typography className={classes.suggested}>Suggested:</Typography>
                <Typography className={classes.suggestedTime}>{suggestedTime} min</Typography>
              </div>
            </CardContent>
          </Grid>

          {/* Photo Section */}
          <Grid item md={4}>
            <CardMedia
              className={classes.media}
              image={venue.media} 
            />
          </Grid>

          {/* Content Section */}
          <Grid item md={6}>
            <CardContent className={classes.cardContent}>
              <IconButton className={classes.moreButton}>
                <MoreVertIcon />
              </IconButton>
              <Typography variant="h3" className={classes.venueName}>
                {venue.name}
              </Typography>

              <Grid item container spacing={2} >
                <Grid item md={4}>
                  <StarRating value={4.5} />
                </Grid>
                <Grid item md={8}>
                  <Typography className={classes.venueType} variant="subtitle1" color="textSecondary" component="p" noWrap>
                    {venue.type.join(', ')}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" paragraph className={classes.venueDescription}>
                {venue.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export const ItineraryLocationCard = withStyles(styles)(PureItineraryLocationCard);
