import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  container: {
    position: "absolute",
    width: "100%",
    top: "20%",
    marginLeft: 30,
    display: "flex",
    flexDirection: "column",
    alignItems: "left"
  },
  title: {
    color: "black",
    top: "20%",
    padding: 10,
  },
  plan_button: {
    marginTop: 100,
    marginRight: 60,
    float: "right"
  },
  button_text: {
    color: "white",
    fontStyle: "inherit"
  }
}));
