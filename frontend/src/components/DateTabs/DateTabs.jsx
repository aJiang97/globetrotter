import * as React from "react";
import { Tabs, Tab } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { styles } from "./styles";

class PureDateTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transparent: true
    };
  }

  handleChange = (e, newValue) => {
    this.props.setDateIndex(newValue);
  };

  scrollListener = e => {
    if (window.scrollY > 100) {
      this.setState(state => {
        return {
          transparent: false
        };
      });
    } else {
      this.setState(state => {
        return {
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
          value={this.props.activeDate}
          onChange={this.handleChange}
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
