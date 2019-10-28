import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  card: {
    marginTop: 100,
    marginLeft: 50,
    display: "flex",
    width: "70%",
    height: "200px"
  },
  timeDetails: {
    display: "flex",
    flexDirection: "column"
  },
  media: {
      // width: "200px"
      height: "100%"
  },
  venueName: {
      fontSize: "30px",
      fontWeight: "bold"
  },
  rating: {
    color: "#FFA534"
  }
}));