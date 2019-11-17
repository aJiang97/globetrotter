import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  TextField,
  Button,
  Typography,
  IconButton,
  Paper
} from "@material-ui/core";
import { Close } from "@material-ui/icons";

import { styles } from "./styles";
import APIClient from "../../../api/apiClient.js";
import { encrypt } from "../../../utils/encrypt-decrypt";
import history from "../../../history";

class PureLoginModal extends React.Component {
  constructor(props) {
    super(props);
    const emptyData = { data: "" };
    this.state = {
      formData: {
        email: emptyData,
        password: emptyData
      },
      success: true
    };
    this.formConfig = {
      email: { label: "Email", type: "email", autoComplete: "email" },
      password: {
        label: "Password",
        type: "password",
        onBlur: this.handlePasswordBlur,
        ref: this.passwordRef
      }
    };
  }

  handleInputChange = e => {
    const { formData } = this.state;
    this.setState({
      formData: {
        ...formData,
        [e.target.name]: {
          ...formData[e.target.name],
          data: e.target.value
        }
      },
      success: true
    });
  };

  handleSubmit = (e, formData, onSubmit, onClose) => {
    e.preventDefault();
    const encryptedPassword = encrypt(this.state.formData.password.data);
    this.apiClient = new APIClient();
    this.apiClient
      .loginUser(formData.email.data, encryptedPassword)
      .then(resp => {
        if (resp === 403) {
          this.setState({ success: false });
        } else {
          onSubmit({
            name: resp.displayname,
            token: resp.token,
            email: formData.email.data,
            password: encryptedPassword,
            trips: resp.trips
          });
          onClose();
          if (window.location.pathname === "/home") {
            history.push("/home");
          }
        }
      });
  };

  render() {
    const { classes, onClose, onSubmit } = this.props;
    const { formData } = this.state;
    const { formConfig } = this;
    return (
      <React.Fragment>
        <div className={classes.darkBackdrop} onClick={onClose} />
        <form onSubmit={e => this.handleSubmit(e, formData, onSubmit, onClose)}>
          <Paper className={classes.modal}>
            <Typography variant="h4" className={classes.title}>
              Sign In
            </Typography>
            <IconButton className={classes.closeButton} onClick={onClose}>
              <Close />
            </IconButton>
            {Object.keys(formConfig).map((fieldName, i) => (
              <TextField
                required
                key={i}
                className={classes.textField}
                onChange={this.handleInputChange}
                name={fieldName}
                error={formData[fieldName].error !== undefined}
                helperText={formData[fieldName].error}
                inputRef={formConfig[fieldName].ref}
                onBlur={formConfig[fieldName].onBlur}
                label={formConfig[fieldName].label}
                type={formConfig[fieldName].type}
                autoComplete={formConfig[fieldName].autoComplete}
              />
            ))}
            {!this.state.success && (
              <div>
                <Typography variant="caption" color="error">
                  Invalid email/password combination.
                </Typography>
              </div>
            )}
            <Button
              type="submit"
              className={classes.loginButton}
              color="primary"
              variant="contained"
            >
              <Typography className={classes.loginText} variant="button">
                Login
              </Typography>
            </Button>
            <Button className={classes.forgotButton}>
              <Typography className={classes.forgotButton} variant="button">
                Forgot password?
              </Typography>
            </Button>
          </Paper>
        </form>
      </React.Fragment>
    );
  }
}

export const LoginModal = withStyles(styles)(PureLoginModal);
