import React from "react";
import { withStyles } from "@material-ui/core/styles";

import { styles } from "./styles";
import { Typography } from "@material-ui/core";
import io from "socket.io-client";

export class PureTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: ["testMsg1"],
      inputMsg: ""
    };

    this.socket = io.connect("http://127.0.0.1:5000/");
  }

  componentDidMount() {
    this.socket.on("connect", () => {
      this.socket.on("editTitle", data => {
        console.log(data);
      });

      this.socket.on("message", message => {
        const newContent = [...this.state.content];
        newContent.push(message);
        console.log("Message Received: " + message);
        this.setState({
          content: newContent
        });
      });
    });
  }

  handleSend = () => {
    this.socket.send(this.state.inputMsg);
    this.setState({
      inputMsg: ""
    });
  };

  emitMessage = () => {
    this.socket.emit("edit_title", { newTitle: "Business Trip" }, data => {
      console.log(data);
    });
  };

  sendToRoom = () => {
    this.socket.emit("send_to_room", this.state.inputMsg, "testRoom");
  };

  joinRoom = () => {
    this.socket.emit(
      "join",
      {
        room: "testRoom"
      },
      () => {
        console.log("Successfully Joined Room");
      }
    );
  };

  leaveRoom = () => {
    this.socket.emit(
      "leave",
      {
        room: "testRoom"
      },
      () => {
        console.log("Successfully left room");
      }
    );
  };

  onInputChange = e => {
    this.setState({
      inputMsg: e.target.value
    });
  };

  render() {
    return (
      <div>
        <Typography variant="h1">Your Trip to Sydney</Typography>
        {this.state.content.map((val, i) => {
          return (
            <Typography variant="body1" key={i}>
              {val}
            </Typography>
          );
        })}
        <input
          type="text"
          value={this.state.inputMsg}
          onChange={this.onInputChange}
        />
        <button onClick={this.handleSend}>Send</button>
        <button onClick={this.emitMessage}>Emit Title</button>
        <button onClick={this.joinRoom}>Join Room</button>
        <button onClick={this.leaveRoom}>Leave Room</button>
        <button onClick={this.sendToRoom}>Send to Room</button>
      </div>
    );
  }
}

export const Test = withStyles(styles)(PureTest);
