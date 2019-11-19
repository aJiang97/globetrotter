import React from "react";
import { withStyles } from "@material-ui/core/styles";
import _ from "lodash";
import { Responsive, WidthProvider } from "react-grid-layout";

import { ItineraryLocationCard } from "../";
import { styles } from "./styles";

const ResponsiveReactGridLayout = WidthProvider(Responsive);

class PureCalendarGrid extends React.Component {
  static defaultProps = {
    rowHeight: 150,
    onLayoutChange: function() {},
    cols: { lg: 1, md: 1, sm: 1, xs: 1, xxs: 1 }
  };

  constructor(props) {
    super(props);

    this.state = {
      currentBreakpoint: "lg",
      layouts: null,
      showCalendar: false
    };
  }

  generateDOM() {
    return _.map(_.range(this.props.itinerary.length), function(i) {
      return (
        <ItineraryLocationCard
          title={this.props.title}
          type={this.props.type}
          media={this.props.media}
          suggestedTime={this.props.suggestedTime}
          rating={this.props.rating}
        />
      );
    });
  }

  generateLayout() {
    var sum = 0;
    const { itinerary, travelTimes, placeToIndex } = this.props;
    const cards = itinerary.map((item, i, arr) => {
      if (i !== 0) {
        const indexA = placeToIndex[arr[i - 1].google.place_id];
        const indexB = placeToIndex[item.google.place_id];
        sum +=
          arr[i - 1].suggestedTime +
          travelTimes[indexA][indexB] +
          travelTimes[indexB][indexA];
      }
      return {
        x: 0,
        y: sum,
        w: 1,
        h: (15 * item.suggestedTime) / 60,
        i: i.toString()
      };
    });
    return cards;
  }

  getTypes = types => {
    var result = [];
    for (let value of Object.keys(types)) {
      if (types[value]) {
        result.push(value);
      }
    }
    return result;
  };

  onLayoutChange(layout, layouts) {
    this.props.onLayoutChange(layout, layouts);
  }

  onBreakpointChange = breakpoint => {
    this.setState({
      currentBreakpoint: breakpoint
    });
  };

  onDrop = elemParams => {
    alert(`Element parameters: ${JSON.stringify(elemParams)}`);
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.itinerary !== nextProps.itinerary) {
      return true;
    }
    if (this.state.showCalendar !== nextState.showCalendar) {
      return true;
    }
    return false;
  };

  componentDidUpdate = () => {
    if (this.props.itinerary) {
      this.setState({
        layouts: { lg: this.generateLayout() },
        showCalendar: true
      });
    }
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        {this.state.showCalendar && (
          <ResponsiveReactGridLayout
            className={classes.container}
            layout={this.state.layout}
            onLayoutChange={this.onLayoutChange}
            onDrop={this.onDrop}
            onBreakpointChange={this.onBreakpointChange}
            compactType="vertical"
            isDroppable={true}
            measureBeforeMount={true}
            preventCollision={true}
            {...this.props}
          >
            {this.props.itinerary.map((item, key) => (
              <div key={key} classes={classes.item}>
                <ItineraryLocationCard
                  title={item.foursquare.venue_name}
                  type={this.getTypes(item.foursquare.location_types)}
                  media={item.foursquare.pictures[0]}
                  suggestedTime={item.suggestedTime}
                  rating={item.google.rating}
                />
              </div>
            ))}
          </ResponsiveReactGridLayout>
        )}
      </div>
    );
  }
}

export const CalendarGrid = withStyles(styles)(PureCalendarGrid);
