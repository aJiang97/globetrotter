import * as React from "react";
import {
  AppBar,
  Avatar,
  Menu,
  MenuItem,
  Toolbar,
  Typography,
  Button
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";
import history from "../../history";
import { UserContext } from "../../UserContext";
import { LoginModal, RegisterModal } from "../forms";
import APIClient from "../../api/apiClient";

import logo from "../../assets/logo-no-text-white.png";

class PureNavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      anchorEl: null,
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

  setAnchorEl = el => {
    this.setState({ anchorEl: el });
  };

  handleProfileMenuOpen = event => {
    this.setAnchorEl(event.currentTarget);
  };

  handleMenuClose = () => {
    this.setAnchorEl(null);
  };

  handleUserLogOut = () => {
    this.handleMenuClose();
    this.apiClient = new APIClient();
    this.apiClient
      .logoutUser(this.context.user.email, this.context.user.token)
      .then(data => {
        this.context.logOut();
        history.push("/home");
      });
  };

  getInitial = name => {
    const nameArray = name.split(" ");
    var initial = "";
    nameArray.map(word => (initial = initial + word[0].toUpperCase()));
    return initial;
  };

  render() {
    const { classes } = this.props;
    const isMenuOpen = Boolean(this.state.anchorEl);
    const renderMenu = (
      <Menu
        anchorEl={this.state.anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
        className={classes.menu}
      >
        <MenuItem onClick={this.handleUserLogOut} style={{ zIndex: 10000 }}>
          Log out
        </MenuItem>
      </Menu>
    );
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
            {this.context.user ? (
              <div className={classes.account}>
                <Avatar className={classes.avatar}>
                  {this.getInitial(this.context.user.name)}
                </Avatar>
                <Button
                  edge="end"
                  aria-haspopup="true"
                  onClick={this.handleProfileMenuOpen}
                >
                  <Typography variant="button" className={classes.name}>
                    {this.context.user.name}
                  </Typography>
                </Button>
              </div>
            ) : (
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
        {renderMenu}
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
