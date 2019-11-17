import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Card,
  CardContent,
  CardMedia,
  Link,
  Typography
} from "@material-ui/core";

import { styles } from "./styles";
import { UserContext } from "../../../UserContext";
import { cityToISO2 } from "../../../utils/city-to-ISO2.js";
import bg from "../../../assets/user-bg.jpg";
import history from "../../../history";

const trips = [
  {
    id: "1",
    name: "Big family trip",
    location: "Sydney",
    "start date": "11-12-2019",
    "end date": "18-12-2019"
  },
  {
    id: "2",
    name: "Business trip",
    location: "Tokyo",
    "start date": "5-1-2020",
    "end date": "12-1-2020"
  }
];

export class PureUserHome extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      trips: null
    };
  }
  getISO2 = location => {
    const pair = cityToISO2.filter(city => city.city_ascii === location);
    return pair[0].iso2.toLowerCase();
  };
  componentDidMount = () => {
    this.setState({
      trips: trips.map(trip => {
        const iso2 = this.getISO2(trip.location);
        return {
          ...trip,
          iso2: iso2,
          url: `https://lipis.github.io/flag-icon-css/flags/4x3/${iso2}.svg`,
          alt: `${iso2}.svg`
        };
      })
    });
  };
  render() {
    const { classes } = this.props;
    return (
      <div className={classes.container}>
        <div className={classes.bg_layer} />
        <img src={bg} alt="background" className={classes.bg} />
        <div className={classes.contentContainer}>
          <Typography variant="h2" className={classes.title}>
            Welcome, Alina
          </Typography>
          <div className={classes.uiContainer}>
            <div style={{ flex: "50%" }}>
              <div style={{ flexDirection: "column" }}>
                <Typography variant="h4" className={classes.subheading}>
                  Your Trips
                </Typography>
                {this.state.trips &&
                  this.state.trips.map((trip, key) => (
                    <Card key={key} className={classes.card}>
                      <CardMedia className={classes.media} image={trip.url} />
                      <CardContent style={{ flexDirection: "column" }}>
                        <Typography variant="h5">{trip.name}</Typography>
                        <Typography variant="h5">{trip.location}</Typography>
                        <Typography variant="body2">
                          from {trip["start date"]} to {trip["end date"]}
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </div>
            <div className={classes.verticalLine} />
            <div
              style={{
                alignSelf: "center",
                marginLeft: "23%",
                display: "flex",
                // flexDirection: "row",
                // backgroundColor: "red",
                flex: "50%"
              }}
            >
              <Typography variant="h4" className={classes.subheading}>
                or
              </Typography>
              <Typography variant="h4" className={classes.subheading}>
                <Link
                  component="button"
                  onClick={() => {
                    history.push("/trip");
                  }}
                  variant="h4"
                  color="inherit"
                >
                  Add a new trip
                </Link>
              </Typography>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

PureUserHome.contextType = UserContext;

export const UserHome = withStyles(styles)(PureUserHome);
