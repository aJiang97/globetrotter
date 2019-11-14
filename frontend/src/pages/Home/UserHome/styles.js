import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  bg: {
    maxWidth: "100%",
    height: "auto",
    minHeight: "100%",
    bottom: 0,
    left: 0,
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
    opacity: 0.5
  },
  container: {
    margin: "100px 10%",
    width: "70%",
    marginLeft: "15%"
  },
  contentContainer: {
    zIndex: 1111,
    left: 0,
    position: "absolute",
    width: "100%",
    display: "flex",
    flexDirection: "column"
  },
  title: {
    textAlign: "center",
    color: "white"
  },
  subheading: {
    color: "white",
    padding: 10
  },
  verticalLine: {
    borderLeft: "3px solid white",
    top: "27%",
    height: 300,
    position: "absolute",
    left: "50%",
    marginLeft: -3
  },
  card: {
    flexDirection: "row",
    display: "flex",
    margin: 10,
    opacity: 0.8
  },
  media: {
    height: 122,
    width: 160
  }
}));
