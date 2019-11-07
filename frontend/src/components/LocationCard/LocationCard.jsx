import * as React from "react";
import clsx from "clsx";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { ExpandMore, CheckBox } from "@material-ui/icons";

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

  render() {
    const { classes } = this.props;
    return (
      <Card className={classes.card}>
        <CardMedia className={classes.media} image={this.props.media} />
        <CardContent>
          <Typography component="h2" variant="h5">
            {this.props.title}
          </Typography>
          <StarRating value={this.props.rating.toFixed(2)} />
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
        {this.props.description && (
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
        )}
      </Card>
    );
  }
}

export const LocationCard = withStyles(styles)(PureLocationCard);
