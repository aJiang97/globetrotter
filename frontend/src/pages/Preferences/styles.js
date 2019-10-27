import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  bg: {
    maxWidth: "100%",
    height: "auto",
    minHeight: "100%",
    bottom: 0,
    position: "absolute"
  },
  bg_layer: {
    zIndex: 1110,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "black",
    opacity: 0.6
  },
  title: {
    textAlign: "center",
    marginBottom: "25px",
    fontFamily: "Raleway",
    fontWeight: "bold",
    color: "white"
  },
  container: {
    zIndex: 1111,
    position: "fixed",
    top: "53%",
    left: "50%",
    transform: "translate(-50%, -50%)"
  },
  buttonRow: {
    textAlign: "center"
  },
  navButton: {
    color: "white",
    marginLeft: 100,
    marginRight: 100
  }
}));
