import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { NavBar } from "../../components";
import history from "../../history";
import { styles } from "./styles";
import { UserContext } from "../../UserContext";
import { UserHome } from "./UserHome";
import { DefaultHome } from "./DefaultHome";

export class PureHome extends React.Component {
  handleSubmit = () => {
    history.push("/trip");
  };

  render() {
    return (
      <div>
        <NavBar />
        {this.context.user ? <UserHome /> : <DefaultHome />}
      </div>
    );
  }
}

PureHome.contextType = UserContext;

export const Home = withStyles(styles)(PureHome);
