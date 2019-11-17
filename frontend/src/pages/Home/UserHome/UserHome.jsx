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

  getDateDDMMYYYY = datetime => {
    if (datetime.length > 10) {
      const date = datetime.slice(0, 10).split("-");
      return `${date[2]}-${date[1]}-${date[0]}`;
    } else {
      const date = datetime.split("-");
      return `${date[2]}-${date[1]}-${date[0]}`;
    }
  };

  getDateYYYYMMDD = datetime => {
    if (datetime.length > 0) {
      const date = datetime.slice(0, 10);
      return date;
    } else {
      return datetime;
    }
  };

  componentDidMount = () => {
    this.setState({
      trips: this.context.user.trips.map(trip => {
        const iso2 = this.getISO2(trip.city);
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
            Welcome, {this.context.user.name}
          </Typography>
          <div className={classes.centerContainer}>
            <div className={classes.leftContainer}>
              <Typography variant="h4" className={classes.subheading}>
                Your Trips
              </Typography>
              {this.state.trips &&
                this.state.trips.map((trip, key) => (
                  <Card key={key} className={classes.card}>
                    <CardMedia className={classes.media} image={trip.url} />
                    <CardContent style={classes.cardContent}>
                      <Typography variant="h5">
                        <Link
                          component="button"
                          onClick={() => {
                            history.push(
                              `/tripview?start_date=${this.getDateYYYYMMDD(
                                trip.tripstart
                              )}&end_date=${this.getDateYYYYMMDD(
                                trip.tripend
                              )}&uuid=${trip.uuid}`
                            );
                          }}
                          variant="h5"
                          color="inherit"
                        >
                          {trip.description}
                        </Link>
                      </Typography>
                      <Typography variant="h5">{trip.city}</Typography>
                      <Typography variant="body2">
                        from {this.getDateDDMMYYYY(trip.tripstart)} to{" "}
                        {this.getDateDDMMYYYY(trip.tripend)}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
            </div>
            <div className={classes.verticalLine} />
            <div className={classes.rightContainer}>
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
