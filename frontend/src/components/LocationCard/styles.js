import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  action: {
    padding: '0'
  },
  card: {
    width: "80%",
    margin: 20,
    // display: "block"
  },
  expand: {
    transform: "rotate(0deg)",
    margin: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  media: {
    height: "50",
    paddingTop: "33%",
    width:"100%",
    // display: "inline"
  },
  root: {
    flexGrow: 1,
  }
}));
