import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  card: {
    width: "90%",
    margin: 20
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
    width: "100%"
  },
  title: {
    fontWeight: "bold",
    fontSize: "30px",
    marginBottom: "10px"
  },
  venueType: {
    fontStyle: "italic",
    fontSize: "15px",
    paddingLeft: "65px"
  },
  root: {
    flexGrow: 1
  },
  typesContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start"
  },
  typeContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center"
  }
}));
