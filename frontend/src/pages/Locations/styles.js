import { createStyles } from "@material-ui/core/styles";

const arrowButton = {
  position: "fixed",
  top: "50%",
  height: 100,
  padding: 0,
  minWidth: 35,
  transition: "right 0.5s"
};

export const styles = createStyles(theme => ({
  container: {
    width: "100vw",
    marginTop: 150,
    marginLeft: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
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
  arrow: {
    color: "white"
  }
}));
