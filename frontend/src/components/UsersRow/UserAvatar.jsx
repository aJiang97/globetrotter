import React from "react";
import { Avatar, Tooltip, Badge } from "@material-ui/core";
import { Close } from "@material-ui/icons";

export class UserAvatar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hover: true
        }
    }

    toggleHover = () => {
        this.setState({ hover: !this.state.hover });
    }

    getInitials(name) {
		let names = name.split(" ");
		let firstInitial = names[0].charAt(0);
		let lastInitial = names[names.length - 1].charAt(0);
		return firstInitial + lastInitial;
	}

    render() {
        const { user, color, handleRemove } = this.props;

        return (
            <Tooltip title={user.name}>
                <div onMouseEnter={this.toggleHover}
                     onMouseLeave={this.toggleHover}>
                    <Badge badgeContent={<Close style={{fontSize: "10px"}}/>} color="secondary" 
                        onClick={() => handleRemove(user)}
                        invisible={this.state.hover}>
                        <Avatar style={{backgroundColor: color}}>
                            {this.getInitials(user.name)}
                        </Avatar>
                    </Badge>
                </div>
            </Tooltip>
        );
    }
}