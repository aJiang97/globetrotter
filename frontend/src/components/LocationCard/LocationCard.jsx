import * as React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { CheckBox } from "@material-ui/icons";

import { StarRating } from "../";
import { styles } from "./styles";

class PureLocationCard extends React.Component {
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
    const { classes, location, clickHandler } = this.props;
    return (
      <Card className={classes.card}>
        <CardActionArea onClick={clickHandler}>
          <CardMedia
            className={classes.media}
            image={location.foursquare.pictures[0]}
          />
          <CardContent>
            <Typography component="h2" variant="h5" className="title">
              {location.foursquare.venue_name}
            </Typography>
            {location.google.rating && (
              <StarRating value={location.google.rating.toFixed(2)} />
            )}
            <div className={classes.typesContainer}>
              {location.foursquare.location_types &&
                this.getTypes(location.foursquare.location_types).map(type => (
                  <div className={classes.typeContainer}>
                    <CheckBox fontSize="small" />
                    <Typography
                      variant="subtitle1"
                      color="textSecondary"
                      component="p"
                    >
                      {type}
                    </Typography>
                  </div>
                ))}
            </div>
          </CardContent>
        </CardActionArea>
      </Card>
    );
  }
}

export const LocationCard = withStyles(styles)(PureLocationCard);
