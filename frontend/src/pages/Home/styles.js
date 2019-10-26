import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  title: {
    textAlign: "center",
    color: "white",
    paddingTop: 20,
    paddingBottom: 30,
    fontSize: 60,
    fontWeight: "bold"
  },
  description: {
    fontSize: 30,
    color: "white",
    padding: 5
  },
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
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    background: "black",
    opacity: 0.5
  },
  center_container: {
    zIndex: 1111,
    position: "absolute",
    width: "100%",
    top: "35%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  start_button: {
    marginTop: 40
  },
  start_text: {
    color: "white",
    fontFamily: theme.typography.fontFamily
  }
}));
