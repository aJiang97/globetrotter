import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Fab, Typography } from "@material-ui/core";

import history from "../../history";
import { styles } from "./styles";
import bg from "../../assets/home-bg.jpg";

export class PureHome extends React.Component {
  handleSubmit = () => {
    history.push("/trip");
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.bg_layer} />
        <img src={bg} alt="background" className={classes.bg} />
        <div className={classes.center_container}>
          <Typography variant="h2" className={classes.description}>
            Search. Schedule. Share.
          </Typography>
          <Typography variant="h5" className={classes.description}>
            Because scheduling is a pain.
          </Typography>
          <Fab
            variant="extended"
            color="secondary"
            className={classes.start_button}
          >
            <Typography
              variant="body2"
              className={classes.start_text}
              onClick={this.handleSubmit}
            >
              Start Planning
            </Typography>
          </Fab>
        </div>
      </div>
    );
  }
}

export const Home = withStyles(styles)(PureHome);
