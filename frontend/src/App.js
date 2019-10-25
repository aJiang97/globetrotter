import React from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import history from "./history";
import { Home, Trip, Locations, Preferences } from "./pages";
import { NavBar } from "./components";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00072D"
    },
    secondary: {
      main: "#0052CC"
    },
    tertiary: {
      main: "#92140C"
    },
    white: {
      main: "#FFF8F0"
    },
    black: {
      main: "#1E1E24"
    }
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
