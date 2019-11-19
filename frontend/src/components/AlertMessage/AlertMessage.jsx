import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Snackbar, SnackbarContent } from "@material-ui/core";
import { CheckCircle, Close } from "@material-ui/icons";

import { styles } from "./styles";

export class PureAlertMessage extends React.Component {
  handleClose = (event, reason) => {
    if (reason === "clickaway") return;
    this.props.onClose();
  };

  render() {
    const { classes, open, onClose } = this.props;
    return (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={open}
        autoHideDuration={6000}
        onClose={onClose}
      >
        <SnackbarContent
          className={classes.success}
          message={
            <span id="client-snackbar" className={classes.message}>
              <CheckCircle className={classes.iconVariant} />
              {this.props.message}
            </span>
          }
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              onClick={onClose}
            >
              <Close className={classes.icon} />
            </IconButton>
          ]}
        />
      </Snackbar>
    );
  }
}

export const AlertMessage = withStyles(styles)(PureAlertMessage);
