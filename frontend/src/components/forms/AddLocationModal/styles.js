import { createStyles } from "@material-ui/core/styles";

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
    width: 500,
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    padding: "24px 40px 24px 40px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    maxHeight: 500
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
  searchBar: {
    width: "90%"
  },
  locationsContainer: {
    flexGrow: 1,
    overflow: "auto",
    maxHeight: "60%",
    marginTop: 20,
    width: "90%"
  },
  buttonsContainer: {
    display: "flex",
    flexDirection: "row",
    paddingTop: 20
  },
  expansionPanel: {
    width: "100%"
  }
}));
