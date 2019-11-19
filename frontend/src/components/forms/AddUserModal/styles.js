import { createStyles } from "@material-ui/core/styles";

const baseButton = {
  width: 140
};

export const styles = createStyles(theme => ({
  darkBackdrop: {
    zIndex: 10000,
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "black",
    opacity: 0.7
  },
  modal: {
    zIndex: 10001,
    width: "250px",
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "24px 40px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  closeButton: {
    position: "absolute",
    top: 4,
    right: 4,
    padding: 8,
    borderRadius: 4
  },
  title: {
    fontWeight: "bold"
  },
  textField: {
    width: "85%",
    marginBottom: 16
  },
  loginButton: {
    ...baseButton,
    marginTop: 16,
    marginBottom: 8
  },
  loginText: {
    fontSize: 16
  },
  forgotButton: {
    ...baseButton,
    fontSize: 10
  }
}));
