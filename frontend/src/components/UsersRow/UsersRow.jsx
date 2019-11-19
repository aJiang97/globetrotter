import React from "react";
import { withStyles } from "@material-ui/core/styles";
import {
  Avatar,
	Tooltip,
	Fab,
	Badge,
	Typography
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import { UserAvatar } from "./UserAvatar";
import { styles } from "./styles";

export class PureUsersRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
	}

	

	getRandomColour(index) {
		const possibleColours = ["#FF5154", "#8093F1", "#50C9CE", "292F36", "CB48B7"];
		return possibleColours[index % possibleColours.length];
	}

  render() {
		const { classes, users, handleAdd, handleRemove } = this.props;
		
    return (
      <div className={classes.rowContainer}>
				<ul className={classes.avatarList}>
					{users.map((user, i) => {
						return (
							<li className={classes.listElem} key={i}>
								<UserAvatar 
									user={user} 
									color={this.getRandomColour(i)}
									handleRemove={handleRemove}
								/>
							</li>
						);
					})}
					<li className={classes.listElem}>
						<Tooltip title="Add User to Trip">
							<Fab className={classes.addButton} size="small" 
									 aria-label="add" onClick={handleAdd}>
								<Add />
							</Fab>
						</Tooltip>
					</li>
				</ul>
				
      </div>
    );
  }
}

export const UsersRow = withStyles(styles)(PureUsersRow);
