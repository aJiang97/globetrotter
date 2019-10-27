import * as React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";
import history from "../../history";

import logo from "../../assets/logo-no-text-white.png";

class PureNavBar extends React.Component {
  render() {
    const { classes } = this.props;
    return (
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          <img src={logo} alt="logo" className={classes.logo} />
          <Button onClick={() => history.push("/home")}>
            <Typography className={classes.title} variant="button">
              GlobeTrotter
            </Typography>
          </Button>
        </Toolbar>
      </AppBar>
    );
  }
}

export const NavBar = withStyles(styles)(PureNavBar);
