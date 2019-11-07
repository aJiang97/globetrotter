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
    top: 0,
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
    padding: "24px 24px 24px 24px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: "white"
  },
  title: {
    paddingBottom: 20,
    fontWeight: "bold"
  },
  label: {
    color: "white !important"
  },
  textfield: {
    width: "100%",
    paddingBottom: 10,
    marginBottom: 15
  },
  underline: {
    "&:before": {
      borderBottom: "1px solid white !important"
    },
    "&:after": {
      borderBottom: `2px solid white !important`
    },
    "&:hover:not($disabled):not($focused):not($error):before": {
      borderBottom: `2px solid white !important`
    }
  },
  dates: {
    display: "grid",
    gridTemplateColumns: "1fr 0.15fr 1fr",
    marginBottom: 30,
    width: "99%"
  },
  input: {
    color: "white"
  },
  nextButton: {
    marginTop: "auto",
    color: "white"
  }
}));
