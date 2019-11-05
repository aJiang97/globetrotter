import * as React from "react";
import clsx from "clsx";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  Grid,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { StarRating } from "../../components/StarRating";

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
          <Typography component="h2" variant="h5" className="title">
            {this.props.title}
          </Typography>
          <Grid item container spacing={2} >
            <Grid item md={6}>
              <StarRating value={4.5} />
            </Grid>
            <Grid item md={6}>
              <Typography className={classes.venueType} variant="subtitle1" color="textSecondary" component="p" noWrap>
                {this.props.type}
              </Typography>
            </Grid>
          </Grid>
          <Typography variant="subtitle1" paragraph>
            {this.props.duration}
          </Typography>
        </CardContent>
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>{this.props.description}</Typography>
          </CardContent>
        </Collapse>
        <CardActions disableSpacing className={classes.action}>
          <IconButton
            className={clsx(classes.expand, {
              [classes.expandOpen]: this.state.expanded
            })}
            onClick={this.handleExpandClick}
            aria-expanded={this.state.expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </IconButton>
        </CardActions>
      </Card>
    );
  }
}

export const LocationCard = withStyles(styles)(PureLocationCard);
