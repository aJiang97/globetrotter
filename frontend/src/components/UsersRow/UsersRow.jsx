import React from "react";
import { withStyles } from "@material-ui/core/styles";
import { Tooltip, Fab } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { UserAvatar } from "./UserAvatar";
import { styles } from "./styles";

export class PureUsersRow extends React.Component {
  // Returns background colour of the user based on their permissions
  getBackgroundColor(index) {
    const colors = ["#FF5154", "#50C9CE", "#8093F1", "292F36", "CB48B7"];
    return colors[index];
  }

  render() {
    const { classes, currentUser, users, handleAdd, handleRemove } = this.props;

    return (
      <div className={classes.rowContainer}>
        <ul className={classes.avatarList}>
          {users.map((user, i) => {
            return (
              <li className={classes.listElem} key={i}>
                <UserAvatar
                  currentUser={currentUser}
                  user={user}
                  color={this.getBackgroundColor(user.permission)}
                  handleRemove={handleRemove}
                />
              </li>
            );
          })}
		  {currentUser && 
		   (currentUser.permission === 0 || currentUser.permission === 1) && (
            <li className={classes.listElem}>
              <Tooltip title="Add User to Trip">
                <Fab
                  className={classes.addButton}
                  size="small"
                  aria-label="add"
                  onClick={handleAdd}
                >
                  <Add />
                </Fab>
              </Tooltip>
            </li>
          )}
        </ul>
      </div>
    );
  }
}

export const UsersRow = withStyles(styles)(PureUsersRow);
