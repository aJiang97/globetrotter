import { createStyles } from "@material-ui/core/styles";

export const styles = createStyles(theme => ({
  success: {
    backgroundColor: "green"
  },
  icon: {
    fontSize: 20
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: "theme.spacing(1)"
  },
  message: {
    display: "flex",
    alignItems: "center"
  }
}));
