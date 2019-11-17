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
    return Object.keys(types).filter(type => type === true);
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
            <StarRating value={location.google.rating.toFixed(2)} />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                justifyContent: "flex-start"
              }}
            >
              {this.props.types &&
                this.props.types.map(type => (
                  <div>
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
        {/* {this.props.description && (
          <div>
            <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
              <CardContent>
                <Typography paragraph>{this.props.description}</Typography>
              </CardContent>
            </Collapse>
            <CardActions disableSpacing>
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: this.state.expanded
                })}
                onClick={this.handleExpandClick}
                aria-expanded={this.state.expanded}
                aria-label="show more"
              >
                <ExpandMore />
              </IconButton>
            </CardActions>
          </div>
        )} */}
      </Card>
    );
  }
}

export const LocationCard = withStyles(styles)(PureLocationCard);
