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
      this.socket.send('User has connected!');
      this.socket.send({ locations: ["Sydney"] });
    });

    this.socket.on("message", (message) => {
      const newContent = [...this.state.content];
      newContent.push(message);
      this.setState({
        content: newContent
      });
      console.log("Received Message: " + message);
    })
  }

  handleSend = () => {
    this.socket.send(this.state.inputMsg);
    this.setState({
      inputMsg: ""
    });
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
      </div>
    );
  }
}

export const Test = withStyles(styles)(PureTest);
