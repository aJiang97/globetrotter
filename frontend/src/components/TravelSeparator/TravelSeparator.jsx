import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography, Grid, ButtonBase } from "@material-ui/core";
import { styles } from "./styles";

import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import DriveEtaIcon from '@material-ui/icons/DriveEta';
import DirectionsBusIcon from '@material-ui/icons/DirectionsBus';

/**
 * Separator providing information regarding Travel Time
 * @prop {string} walkTime Time taken if user walks
 * @prop {string} driveTime Time taken if user drives
 * @prop {string} publicTime Time taken if user takes public transport
 */
export class PureTravelSeparator extends React.Component {
  render() {
    const { walkTime, driveTime, publicTime, classes } = this.props;
    return (
        <div className={classes.container}>
            <Grid container>
                <Grid item xs={3} />

                <Grid item xs={9} className={classes.contentColumn}>
                    <div className={classes.etaRow}>
                        <div className={classes.etaRowContents}>
                            <a className={classes.etaRowLink} href="https://www.google.com" target="_blank" rel="noopener noreferrer">
                                <Grid container spacing={3}>
                                    <Grid item>
                                        <Typography>
                                            <DirectionsWalkIcon className={classes.etaIcon} />
                                            <span className={classes.etaText}>{walkTime}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item> 
                                        <Typography>
                                            <DriveEtaIcon className={classes.etaIcon} />
                                            <span className={classes.etaText}>{driveTime}</span>
                                        </Typography>
                                    </Grid>
                                    <Grid item>
                                        <Typography>
                                            <DirectionsBusIcon className={classes.etaIcon} />
                                            <span className={classes.etaText}>{publicTime}</span>
                                        </Typography>
                                    </Grid>
                                </Grid>
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
