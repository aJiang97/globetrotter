import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid } from "@material-ui/core";
import { styles } from "./styles";

import DriveEtaIcon from "@material-ui/icons/DriveEta";

/**
 * Separator providing information regarding Travel Time
 * @prop {string} walkTime Time taken if user walks
 * @prop {string} driveTime Time taken if user drives
 * @prop {string} publicTime Time taken if user takes public transport
 */
export class PureTravelSeparator extends React.Component {
  render() {
    const { time, classes } = this.props;
    return (
      <div className={classes.container}>
        <Grid container>
          <Grid item xs={3} />

          <Grid item xs={9} className={classes.contentColumn}>
            <div className={classes.etaRow}>
              <div className={classes.etaRowContents}>
                <a
                  className={classes.etaRowLink}
                  href="https://www.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Typography>
                    <DriveEtaIcon className={classes.etaIcon} />
                    <span className={classes.etaText}>{time}</span>
                  </Typography>
                </a>
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    );
  }
}

export const TravelSeparator = withStyles(styles)(PureTravelSeparator);
