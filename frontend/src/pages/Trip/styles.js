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
    opacity: 0.6
  },
  modal_container: {
    zIndex: 1111,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "24px 40px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white"
  },
  title: {
    paddingBottom: 20,
    fontWeight: "bold"
  },
  inputLabel: {
    color: "white",
    shrink: true
  },
  textfield: {
    width: "90%",
    padding: 10,
    marginBottom: 15
  },
  dates: {
    display: "flex",
    flexDirection: "row",
    marginBottom: 30
  },
  input: {
    color: "white"
  },
  dateTextField: {
    width: "50%",
    paddingRight: 25,
    paddingLeft: 25
  },
  nextButton: {
    marginTop: "auto"
  }
}));
