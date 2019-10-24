import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Fab, Typography } from '@material-ui/core';

import { styles } from "./styles";

export class PureLocations extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <Typography variant="h5" className={classes.title}>
              Recommended Locations
          </Typography>
        </div>  
        <Fab
          variant="extended"
          color="secondary"
          className={classes.plan_button}
        >
          <Typography
            variant="body2"
            className={classes.button_text}
            /* onClick={this.handleSubmit} */
          >
            View Plan
          </Typography>
        </Fab>
      </div>
    );
  }
}

export const Locations = withStyles(styles)(PureLocations);

