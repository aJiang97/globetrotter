import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  rowContainer: {
    // backgroundColor: "red"
  },
  avatarList: {
    "list-style-type": "none",
    paddingLeft: 0,
    margin: 0
  },
  listElem: {
    display: "inline-block",
    marginRight: "5px"
  },
  addButton: {
    marginLeft: "20px",
    backgroundColor: theme.palette.secondary.main,
    color: "#fff"
  }
}));
