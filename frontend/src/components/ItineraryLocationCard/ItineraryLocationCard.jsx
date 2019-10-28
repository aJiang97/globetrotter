import * as React from "react";
import clsx from "clsx";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Collapse,
  IconButton,
  Typography
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import operaHouse from "../../assets/opera-house.jpg";

import { styles } from "./styles";

class PureItineraryLocationCard extends React.Component {
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
      <Card className={classes.card}>
        <div className={classes.timeDetails}>
            <CardContent>
                <div>
                    <Typography>
                        10.00am
                    </Typography>
                    <Typography>
                        12.00pm
                    </Typography>
                </div>
                <div>
                    <Typography>
                        Suggested:
                    </Typography>
                    <Typography>
                        45 min
                    </Typography>
                </div>    
            </CardContent>
        </div>
        <CardMedia
            className={classes.media}
            image={operaHouse} 
        />
        <CardContent>
          <Typography variant="h3" className={classes.venueName}>
            Sydney Opera House
          </Typography>
          <Typography variant="subtitle1" color="textSecondary" component="p">
            Testing123
          </Typography>
          <Typography variant="subtitle1" paragraph>
          The Sydney Opera House is a multi-venue performing arts centre at Sydney Harbour in Sydney, 
          New South Wales, Australia. It is one of the 20th century's most famous and distinctive buildings.
          </Typography>
        </CardContent>
      </Card>
    );
  }
}

export const ItineraryLocationCard = withStyles(styles)(PureItineraryLocationCard);
