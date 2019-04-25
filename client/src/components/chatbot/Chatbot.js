import React, { Component } from "react";
import axios from "axios/index";
import { v4 as uuid } from "uuid";
import Cookies from "universal-cookie";
import Message from "./Message";

import getWeatherInfo from "../../weather";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  textInput;
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    };

    if (cookies.get("userId") === undefined) {
      cookies.set("userId", uuid(), { path: "/" });
    }
  }
  async df_text_query(text) {
    let says = {
      speak: "me",
      msg: {
        text: {
          text: text
        }
      }
    };

    this.setState({ messages: [...this.state.messages, says] });
    const res = await axios.post("/api/df_text_query", {
      text: text,
      userId: cookies.get("userId")
    });

    if (res.data.intent) {
      if (res.data.intent.displayName === "detect-city") {
        const city = res.data.parameters.fields["geo-city"].stringValue;
        if (city) {
          getWeatherInfo(city).then(temp => {
            says = {
              speak: "bot",
              msg: {
                text: {
                  text: `The weather of ${city} is ${temp}°C`
                }
              }
            };
            this.setState({ messages: [...this.state.messages, says] });
          });
        } else {
          says = {
            speak: "bot",
            msg: {
              text: {
                text: "Oops !! Sorry, weather report not found "
              }
            }
          };
          this.setState({ messages: [...this.state.messages, says] });
        }
      } else {
        for (let msg of res.data.fulfillmentMessages) {
          says = {
            speak: "bot",
            msg: msg
          };
          this.setState({ messages: [...this.state.messages, says] });
        }
      }
    }
  }

  async df_event_query(event) {
    const res = await axios.post("/api/df_event_query", {
      event: event,
      userId: cookies.get("userId")
    });
    for (let msg of res.data.fulfillmentMessages) {
      let says = {
        speak: "bot",
        msg: msg
      };
      this.setState({ messages: [...this.state.messages, says] });
    }
  }

  componentDidMount() {
    this.df_event_query("Welcome");
  }

  componentDidUpdate() {
    this.messagesEnd.scrollIntoView({ behaviour: "smooth" });
    this.textInput.focus();
  }

  renderMessages(stateMessages) {
    if (stateMessages) {
      return stateMessages.map((message, i) => {
        if (message.msg && message.msg.text && message.msg.text.text) {
          return (
            <Message
              key={i}
              speak={message.speak}
              text={message.msg.text.text}
            />
          );
        } else {
          return <Message key={i} speak={"bot"} text={"Oops...Sorry"} />;
        }
      });
    } else {
      return "hello";
    }
  }

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  };

  render() {
    return (
      <div
        style={{
          height: 500,
          width: 400,
          position: "absolute",
          bottom: 0,
          right: 10,
          border: "1px solid lightgrey"
        }}
      >
        <nav>
          <div className="nav-wrapper">
            <div className="brand-logo">Chatbot</div>
          </div>
        </nav>
        <div
          id="chatbot"
          style={{ height: 388, width: "100%", overflow: "auto" }}
        >
          {this.renderMessages(this.state.messages)}
          <div
            ref={el => (this.messagesEnd = el)}
            style={{ float: "left", clear: "both" }}
          />
        </div>
        <div className="col s12">
          <input
            style={{
              margin: 0,
              borderTop: "1px solid lightgrey",
              paddingLeft: "1%",
              paddingRight: "1%",
              width: "98%"
            }}
            ref={input => (this.textInput = input)}
            type="text"
            placeholder="Enter your text"
            onKeyPress={this.handleKeyPress}
          />
        </div>
      </div>
    );
  }
}

export default Chatbot;
