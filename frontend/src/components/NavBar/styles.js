import { createStyles } from "@material-ui/core/styles";

const appBar = {
  zIndex: 5000,
  boxShadow: "0px 0px"
};

export const styles = createStyles(theme => ({
  appBarHome: {
    ...appBar,
    backgroundColor: "transparent"
  },
  appBarLocations: {
    ...appBar,
    backgroundColor: theme.palette.primary.main
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
  },
  grow: {
    flexGrow: 1
  },
  button: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block"
    },
    color: "white"
  }
}));
