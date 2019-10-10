import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

import { styles } from "./styles";
import history from "../../history";

export class PureHome extends React.Component {
  handleClick = address => {
    history.push(`/${address}`);
  };

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.home}>
        <Typography variant="h1" className={classes.title}>
          Home Page
        </Typography>
      </div>
    );
  }
}

export const Home = withStyles(styles)(PureHome);
