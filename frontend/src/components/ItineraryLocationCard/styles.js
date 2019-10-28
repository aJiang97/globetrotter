import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  card: {
    marginTop: 100,
    marginLeft: 50,
    display: "flex",
    width: "65%"
  },
  timeDetails: {
    display: "flex",
    flexDirection: "column"
  },
  media: {
      width: "300px",
      height: "180px"
  },
  venueName: {
      fontSize: "36px",
      fontWeight: "bold"
  }
}));