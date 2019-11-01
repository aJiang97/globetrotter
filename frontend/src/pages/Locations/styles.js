import { createStyles } from "@material-ui/core/styles";

const arrowButton = {
  position: "fixed",
  top: "50%",
  height: 100,
  padding: 0,
  minWidth: 35,
  transition: "right 0.5s"
};

const viewButton = {
  position: "fixed",
  width: 400,
  bottom: 0,
  zIndex: 5000,
  transition: "right 0.5s"
};

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
    flexGrow: 1,
    overflow: "auto",
    maxHeight: "100%",
    paddingLeft: "30px",
    marginTop: "75px"
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
    transform: "scale(-1.5)",
    right: 0,
    zIndex: 2
  },
  arrowButtonOut: {
    ...arrowButton,
    transform: "scale(1.5)",
    right: 400,
    zIndex: 2
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
