import React from "react";
import { Redirect, Route, Router } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import history from "./history";
import { Home, Trip } from "./pages";
import { NavBar } from "./components";
import "./App.css";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00072D"
    },
    secondary: {
      main: "#dc8f03"
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
          <Redirect from="/" to="/home" />
          <Route path="/home" component={Home} />
          <Route path="/trip" component={Trip} />
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
