import * as React from "react";
import { AppBar, Toolbar, Typography, Button } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";
import history from "../../history";
import { UserContext } from "../../UserContext";
import { LoginModal, RegisterModal } from "../forms";

import logo from "../../assets/logo-no-text-white.png";

class PureNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoginOpen: false,
      isRegisterOpen: false
    };
  }
  openLoginModal = () => {
    this.setState({ isLoginOpen: true });
  };

  closeLoginModal = () => {
    this.setState({ isLoginOpen: false });
  };

  openRegisterModal = () => {
    this.setState({ isRegisterOpen: true });
  };

  closeRegisterModal = () => {
    this.setState({ isRegisterOpen: false });
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <AppBar
          position="fixed"
          className={
            window.location.pathname === "/locations" ||
            window.location.pathname === "/tripview"
              ? classes.appBarLocations
              : classes.appBarHome
          }
        >
          <Toolbar>
            <img src={logo} alt="logo" className={classes.logo} />
            <Button onClick={() => history.push("/home")}>
              <Typography className={classes.title} variant="button">
                GlobeTrotter
              </Typography>
            </Button>
            <div className={classes.grow} />
            {!this.context.user && (
              <div>
                <Button onClick={this.openRegisterModal}>
                  <Typography
                    className={classes.button}
                    variant="button"
                    noWrap
                  >
                    Register
                  </Typography>
                </Button>
                <Button onClick={this.openLoginModal}>
                  <Typography
                    className={classes.button}
                    variant="button"
                    noWrap
                  >
                    Login
                  </Typography>
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {this.state.isLoginOpen && (
          <LoginModal
            onClose={this.closeLoginModal}
            onSubmit={this.context.logIn}
          />
        )}
        {this.state.isRegisterOpen && (
          <RegisterModal
            onClose={this.closeRegisterModal}
            onSubmit={this.context.logIn}
          />
        )}
      </div>
    );
  }
}

PureNavBar.contextType = UserContext;

export const NavBar = withStyles(styles)(PureNavBar);
