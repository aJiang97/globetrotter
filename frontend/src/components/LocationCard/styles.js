import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  action: {
    padding: '0'
  },
  card: {
    width: "70%",
    margin: 20,
    display: "block"
  },
  content: {
    marginTop: '100px'
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
    height: "84%",
    paddingTop: "20%",
    width:"100%",
    display: "inline"
  },
  root: {
    flexGrow: 1,
  }
}));
