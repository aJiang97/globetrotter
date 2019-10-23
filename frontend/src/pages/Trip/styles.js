import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  bg: {
    maxWidth: "100%",
    height: "auto",
    minHeight: "100%",
    bottom: 0,
    position: "absolute"
  },
  bg_layer: {
    zIndex: 1110,
    position: "fixed",
    top: 64,
    left: 0,
    right: 0,
    bottom: 0,
    background: "black",
    opacity: 0.5
  },
  modal_container: {
    zIndex: 1111,
    width: 350,
    height: 230,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "24px 40px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    opacity: 0.7
  },
  title: {
    paddingBottom: 15
  },
  textfield: {
    width: 300,
    padding: 10
  },
  dates: {
    display: "flex",
    flexDirection: "row"
  },
  dateTextField: {
    width: 150,
    padding: 5
  },
  nextButton: {
    marginTop: "auto"
  }
}));
