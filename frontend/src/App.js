import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import history from "./history";
import { Home, Trip, Locations, Preferences } from "./pages";
import { NavBar } from "./components";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#276DF0"
    },
    secondary: {
      main: "#5C5C5C"
    },
    tertiary: {
      main: "#466282"
    },
    white: {
      main: "#FFF8F0"
    },
    black: {
      main: "#1E1E24"
    }
  },
  typography: {
    fontFamily: "Raleway"
  }
});

class App extends React.Component {
  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <NavBar />
        <Router history={history}>
          <Switch>
            {/* <Redirect from="/" to="/home" /> */}
            <Route path="/home" component={Home} />
            <Route path="/trip" component={Trip} />
            <Route path="/preferences" component={Preferences} />
            <Route path="/locations" component={Locations} />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
