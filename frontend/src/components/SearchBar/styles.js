import { fade, createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  search: {
    backgroundColor: fade(theme.palette.common.white, 0.15),
    "&:hover": {
      backgroundColor: fade(theme.palette.common.white, 0.25)
    },
    width: "90%",
    [theme.breakpoints.up("sm")]: {
      marginLeft: "5%",
      width: "90%"
    },
    marginLeft: "5%",
    alignItems: "center",
    marginTop: 20,
    display: "flex",
    flexDirection: "row",
    border: "2px solid black"
  },
  searchIcon: {
    color: "inherit",
    width: theme.spacing(7),
    height: "100%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  inputRoot: {
    width: "100%",
    borderRight: "2px solid black"
  },
  inputInput: {
    transition: theme.transitions.create("width"),
    [theme.breakpoints.up("md")]: {
      width: "95%",
      marginLeft: "5%"
    }
  }
}));
