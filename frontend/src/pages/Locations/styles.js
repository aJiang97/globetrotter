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
  container: {
    width: "95%",
    marginTop: 100,
    marginLeft: 30,
    display: "flex",
    flexDirection: "column"
  },
  locationCardContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  title: {
    color: "black",
    top: "20%",
    padding: 10
  },
  arrowButtonIn: {
    ...arrowButton,
    transform: "scale(-1.5)",
    right: 0
  },
  arrowButtonOut: {
    ...arrowButton,
    transform: "scale(1.5)",
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
