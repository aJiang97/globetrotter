import { createStyles } from "@material-ui/core/styles";

const drawerBase = {
  zIndex: 5000,
  top: 64,
  bottom: 0,
  width: 400,
  paddingBottom: 50,
  position: "fixed",
  transition: "right 0.5s",
  overflowY: "auto"
};

export const styles = createStyles(theme => ({
  drawerOn: {
    ...drawerBase,
    background: theme.palette.tertiary.main,
    right: 0
  },
  drawerOff: {
    ...drawerBase,
    background: theme.palette.tertiary.main,
    right: -400
  },
  title: {
    padding: "24px 40px 24px 40px"
  },
  card: {
    display: "flex",
    flexDirection: "row",
    margin: "10px 40px 10px 40px",
    position: "relative"
  },
  media: {
    width: "40%"
  },
  content: {
    width: "50%"
  },
  closeButton: {
    position: "absolute",
    top: 2,
    right: 2,
    padding: 0,
    borderRadius: 4
  },
  errorMessage: {
    position: "absolute",
    bottom: 40,
    right: 110
  }
}));
