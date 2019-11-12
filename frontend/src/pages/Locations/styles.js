import { createStyles } from "@material-ui/core/styles";

const arrowButton = {
  position: "fixed",
  top: "50%",
  height: 100,
  padding: "0 50 0 50",
  minWidth: 35,
  transition: "right 0.5s",
  zIndex: 2
};

const viewButton = {
  position: "fixed",
  width: 400,
  bottom: 0,
  zIndex: 5000,
  transition: "right 0.5s"
};

const flexScroll = {
  flexGrow: 1,
  overflow: "auto",
  maxHeight: "100%",
  marginTop: "64px"
}

export const styles = createStyles(theme => ({
  section: {
    flexGrow: 1,
    display: 'flex',
    flexDirection: 'column',
    flexWrap: 'wrap',
    boxSizing: 'border-box',
    height: '100vh',
    width: '100%'
  },
  flexScroll: {
    ...flexScroll,
    paddingLeft: "40px"
  },
  locationPane: {
    ...flexScroll
  },
  locationCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  title: {
    color: "black",
    top: "20%",
    padding: 10
  },
  arrowButtonIn: {
    ...arrowButton,
    right: 0
  },
  arrowButtonOut: {
    ...arrowButton,
    right: 400
  },
  viewButtonIn: {
    ...viewButton,
    right: -400
  },
  viewButtonOut: {
    ...viewButton,
    right: 0
  }
}));
