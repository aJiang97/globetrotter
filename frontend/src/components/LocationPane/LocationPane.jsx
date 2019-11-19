import React from "react";
import Slider from "react-slick";
import { Typography, Grid, CardMedia, Link } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { StarRating, ReviewCard } from "../../components";
import { styles } from "./styles";

class PureLocationPane extends React.Component {
  getTypes = types => {
    var result = [];
    for (let value of Object.keys(types)) {
      if (types[value]) {
        result.push(value);
      }
    }
    return result;
  };

  render() {
    const { classes, location } = this.props;
    const sliderSettings = {
      className: "slider variable-width",
      slidesToShow: 1,
      slidesToScroll: 1,
      variableWidth: true,
      infinite: false,
      arrows: false
    };
    return (
      <div className={classes.pane}>
        <CardMedia
          className={classes.media}
          image={location.foursquare.pictures[0]}
        />
        <div className={classes.contentSection}>
          <Typography variant="h3" className={classes.title}>
            {location.foursquare.venue_name}
          </Typography>

          {/* Reviews and Type of Location */}
          <Grid item container spacing={2} className={classes.grid}>
            {location.google.rating && (
              <Grid item md={4}>
                <StarRating value={location.google.rating.toFixed(2)} />
              </Grid>
            )}
            <Grid item md={8}>
              <Typography
                className={classes.venueType}
                variant="subtitle1"
                color="textSecondary"
                component="p"
                noWrap
              >
                {location.foursquare.location_types &&
                  this.getTypes(location.foursquare.location_types).join(", ")}
              </Typography>
            </Grid>
          </Grid>
          {location.foursquare.url && (
            <Link href={location.foursquare.url}>
              {location.foursquare.url}
            </Link>
          )}

          {location.foursquare.description && (
            <div className={classes.section}>
              <Typography variant="h5" className={classes.subheading}>
                Description
              </Typography>
              <Typography variant="body1">
                {location.foursquare.description}
              </Typography>
            </div>
          )}

          <div className={classes.section}>
            <Typography variant="h5" className={classes.subheading}>
              Reviews
            </Typography>
            <Slider {...sliderSettings}>
              {location.google.reviews.map((review, key) => (
                <ReviewCard review={review} key={key} />
              ))}
            </Slider>
          </div>
        </div>
      </div>
    );
  }
}

export const LocationPane = withStyles(styles)(PureLocationPane);
