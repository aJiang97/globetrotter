import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Fab, Typography } from "@material-ui/core";
import { LocationCard } from "../../components";
import { styles } from "./styles";
import bondi from "../../assets/bondi.jpg";
import manly from "../../assets/manly.jpg";

const locations = [
  {
    title: "Bondi Beach",
    type: "Beaches, Family",
    duration: "Recommended duration: 2 hours",
    media: bondi,
    description:
      "The sweeping white-sand crescent of Bondi is one of Australia’s most iconic beaches. Reliable waves draw surfers while, nearby, hardy locals swim in the Icebergs ocean pool year-round. Trendy, health-conscious Sydneysiders head to laid-back cafes around Hall Street, while hip backpackers frequent the area's casual pubs. Walkers and joggers use the clifftop Bondi to Coogee Coastal Walk, with its dramatic scenery."
  },
  {
    title: "Manly Beach",
    type: "Beaches, Family",
    duration: "Recommended duration: 2 hours",
    media: manly,
    description:
      "Manly Beach is a beach situated among the Northern Beaches of Sydney, Australia in Manly, New South Wales. From north to south, the three main sections are Queenscliff, North Steyne, and South Steyne."
  }
];

export class PureLocations extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: null
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({
      expanded: !state.expanded
    }));
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <div className={classes.container}>
          <Typography variant="h5" className={classes.title}>
            Recommended Locations
          </Typography>
          {locations.map(loc => (
            <LocationCard
              className={classes.card}
              title={loc.title}
              type={loc.type}
              duration={loc.duration}
              media={loc.media}
              description={loc.description}
            />
          ))}
        </div>
        <Fab
          variant="extended"
          color="secondary"
          className={classes.plan_button}
        >
          <Typography
            variant="body2"
            className={classes.button_text}
            /* onClick={this.handleSubmit} */
          >
            View Plan
          </Typography>
        </Fab>
      </div>
    );
  }
}

export const Locations = withStyles(styles)(PureLocations);
