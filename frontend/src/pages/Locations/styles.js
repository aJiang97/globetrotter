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
};

export const styles = createStyles(theme => ({
  body1: {
    marginTop: 20,
    marginLeft: 65
  },
  section: {
    flexGrow: 1,
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    boxSizing: "border-box",
    height: "100vh",
    width: "100%"
  },
  flexScroll: {
    ...flexScroll,
    display: "flex",
    flexDirection: "column"
  },
  leftContainer: {
    display: "flex",
    flexDirection: "column",
    marginLeft: "2.5%",
    width: "95%"
  },
  locationPane: {
    ...flexScroll,
    boxShadow: "-10px 0px 5px 0px rgba(0,0,0,0.4)"
  },
  locationCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    width: "100%"
  },
  title: {
    fontWeight: "bold",
    marginTop: 10,
    fontSize: 30,
    width: "100%",
    marginLeft: 65
  },
  loadingContainer: {
    margin: "auto",
    marginTop: "-100px"
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
