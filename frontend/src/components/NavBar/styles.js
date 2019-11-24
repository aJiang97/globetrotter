import { createStyles } from "@material-ui/core/styles";
import { deepOrange } from "@material-ui/core/colors";

const appBar = {
  zIndex: 1200,
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
  },
  account: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  },
  avatar: {
    backgroundColor: deepOrange[500]
  },
  name: {
    paddingLeft: 10,
    color: "white"
  },
  menu: {
    zIndex: 5001
  }
}));
