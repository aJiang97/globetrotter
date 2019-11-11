import React from "react";
import { Route, Router, Switch } from "react-router-dom";
import { createMuiTheme, MuiThemeProvider } from "@material-ui/core/styles";

import history from "./history";
import { Home, Trip, Locations, Preferences, TripView } from "./pages";
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
      main: "#e2e3e4"
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
  constructor(props) {
    super(props);
    this.state = {
      transparent: true,
      places: null,
      placeToIndex: null
    };
  }

  setPlaces = (places, placeToIndex) => {
    this.setState({ places: places, placeToIndex: placeToIndex });
  };

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <Router history={history}>
          <Switch>
            <Route path="/home" component={Home} />
            <Route path="/trip" component={Trip} />
            <Route path="/preferences" component={Preferences} />
            <Route
              path="/locations"
              render={props => (
                <Locations {...props} setPlaces={this.setPlaces} />
              )}
            />
            <Route
              path="/tripview"
              render={props => (
                <TripView
                  {...props}
                  places={this.state.places}
                  placeToIndex={this.state.placeToIndex}
                />
              )}
            />
          </Switch>
        </Router>
      </MuiThemeProvider>
    );
  }
}

export default App;
