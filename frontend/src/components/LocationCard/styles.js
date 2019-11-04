import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  card: {
    width: "70%",
    margin: 20
  },
  media: {
    height: 30,
    paddingTop: "20%"
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
  }
}));
