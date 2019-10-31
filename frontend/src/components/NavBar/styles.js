import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  appBar: {
    zIndex: 5000,
    // backgroundColor: "transparent",
    backgroundColor: theme.palette.primary.main,
    boxShadow: "0px 0px"
  },
  logo: {
    width: 50
  },
  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    color: "white",
    textTransform: "none",
    fontWeight: "bold",
    fontSize: "1.5rem"
  }
}));
