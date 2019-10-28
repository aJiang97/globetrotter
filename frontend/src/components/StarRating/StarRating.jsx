import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar as faSolidStar } from "@fortawesome/free-solid-svg-icons";
import { faStar as faEmptyStar } from "@fortawesome/free-regular-svg-icons";

import Rating from "react-rating";
import { Typography } from "@material-ui/core";

export class PureRating extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <Typography className={ classes.ratingValue }>{this.props.value}</Typography>
        <Rating 
            className={classes.rating}
            initialRating={this.props.value}
            emptySymbol={<FontAwesomeIcon icon={faEmptyStar}/>}
            fullSymbol={<FontAwesomeIcon icon={faSolidStar} />} 
            readonly 
        />
      </div>
    );
  }
}

export const StarRating = withStyles(styles)(PureRating);
