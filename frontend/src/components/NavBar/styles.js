import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
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
