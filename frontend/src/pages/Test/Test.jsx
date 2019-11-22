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
    }

    this.socket = io.connect('http://127.0.0.1:5000/');
  }
  
  componentDidMount() {
    this.socket.on("connect", () => {
      this.socket.on('editTitle', (data) => {
        console.log(data);
      });

      // this.socket.on('editTitle', (data) => {
      //   console.log(data);
      // });

      // this.socket.on('editTitle', (data) => {
      //   console.log(data);
      // });

      // this.socket.on('editTitle', (data) => {
      //   console.log(data);
      // });
    });
  }

  handleSend = () => {
    this.socket.send(this.state.inputMsg);
    this.setState({
      inputMsg: ""
    });
  }

  emitMessage = () => {
    this.socket.emit("edit_title", { newTitle: "Business Trip" }, (data) => {
      console.log(data);
    });
    
    // this.socket.emit("edit_dates", { newStart: "16/06/99" }, (data) => {
    //   console.log(data);
    // });

    // this.socket.emit("edit_locations", { locations: ["opera", "museum", "food"] }, (data) => {
    //   console.log(data);
    // });
  }

  joinRoom = () => {
    this.socket.join('testRoom');
  }

  leaveRoom = () => {
    this.socket.leave('testRoom');
  }

  onInputChange = e => {
    this.setState({
      inputMsg: e.target.value
    })
  }
 
  render() {

    return (
      <div>
        <Typography variant="h1">Your Trip to Sydney</Typography>
        {this.state.content.map((val, i) => {
          return (<Typography variant="body1" key={i}>{val}</Typography>);
        })}
        <input type="text" value={this.state.inputMsg} onChange={this.onInputChange} />
        <button onClick={this.handleSend}>Send</button>
        <button onClick={this.emitMessage}>Emit Title</button>
        <button onClick={this.joinRoom}>Join Room</button>
        <button onClick={this.leaveRoom}>Leave Room</button>
      </div>
    );
  }
}

export const Test = withStyles(styles)(PureTest);
