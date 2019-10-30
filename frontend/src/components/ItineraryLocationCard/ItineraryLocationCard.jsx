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
    const { itineraryItem, classes } = this.props;
    return (
      <Card className={classes.card} raised>
        <Grid container>
          
          {/* Time Section */}
          <Grid item md={2}>
            <CardContent className={classes.timeColumn}>
              <div className={classes.timeDetails}>
                <Typography className={classes.time}>{itineraryItem.startTime}</Typography>
                <div className={classes.verticalLine}></div>
                <Typography className={classes.time}>{itineraryItem.endTime}</Typography>
              </div>
              <div className={classes.suggestion}>
                <Typography className={classes.suggested}>Suggested:</Typography>
                <Typography className={classes.suggestedTime}>{itineraryItem.suggestedTime}</Typography>
              </div>
            </CardContent>
          </Grid>

          {/* Photo Section */}
          <Grid item md={4}>
            <CardMedia
              className={classes.media}
              image={itineraryItem.venue.media} 
            />
          </Grid>

          {/* Content Section */}
          <Grid item md={6}>
            <CardContent className={classes.cardContent}>
              <IconButton className={classes.moreButton}>
                <MoreVertIcon />
              </IconButton>
              <Typography variant="h3" className={classes.venueName}>
                {itineraryItem.venue.name}
              </Typography>

              <Grid item container spacing={2} >
                <Grid item md={4}>
                  <StarRating value={4.5} />
                </Grid>
                <Grid item md={8}>
                  <Typography className={classes.venueType} variant="subtitle1" color="textSecondary" component="p" noWrap>
                    {itineraryItem.venue.type.join(', ')}
                  </Typography>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" paragraph className={classes.venueDescription}>
                {itineraryItem.venue.description}
              </Typography>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    );
  }
}

export const ItineraryLocationCard = withStyles(styles)(PureItineraryLocationCard);
