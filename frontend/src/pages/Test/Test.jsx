import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { NavBar, UsersRow } from "../../components";
import { styles } from "./styles";
import { Typography } from "@material-ui/core";

export class PureTest extends React.Component {

  handleRemove = (user) => {
		console.log(`Removing ${user.name} from trip`);
	}
 
  render() {
    const users = [
        {
            name: "Sebastian Chua",
            email: "seb@test.com"
        },
        {
            name: "Alina Young",
            email: "al@test.com"
        },
        {
            name: "Natasha Jenny",
            email: "nj@test.com"
        }
    ];

    return (
      <div>
        <Typography variant="h1">Your Trip to Sydney</Typography>
        <UsersRow users={users} 
                  handleAdd={()=>console.log("Add clicked")}
                  handleRemove = {this.handleRemove}
        />
      </div>
    );
  }
}

export const Test = withStyles(styles)(PureTest);
