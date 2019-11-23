import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  locationContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  card: {
    display: "flex",
    flexDirection: "row",
    margin: 10,
    position: "relative",
    width: "80%"
  },
  media: {
    width: "40%"
  },
  content: {
    width: "50%"
  }
}));
