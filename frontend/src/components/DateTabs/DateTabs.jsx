import * as React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

class PureDateTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeDate: 0,
      transparent: true
    };
  }

  handleChange = (e, newValue) => {
    this.props.setDateIndex(newValue);
    this.setState({
      activeDate: newValue
    });
  };

  scrollListener = e => {
    if (window.scrollY > 100) {
      this.setState(state => {
        return {
          activeDate: state.activeDate,
          transparent: false
        };
      });
    } else {
      this.setState(state => {
        return {
          activeDate: state.activeDate,
          transparent: true
        };
      });
    }
  };

  componentDidMount() {
    window.addEventListener("scroll", this.scrollListener);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.scrollListener);
  }

  render() {
    const { tabLabels, classes } = this.props;

    return (
      <div
        className={
          this.state.transparent
            ? classes.transparentTabs
            : classes.colouredTabs
        }
      >
        <Tabs
          value={this.state.activeDate}
          onChange={this.handleChange}
          indicatorColor="tertiary"
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {tabLabels.map((value, index) => {
            return <Tab key={index} label={value} />;
          })}
        </Tabs>
      </div>
    );
  }
}

export const DateTabs = withStyles(styles)(PureDateTabs);
