import React, { Component } from "react";
import axios from "axios/index";
import { v4 as uuid } from "uuid";
import Cookies from "universal-cookie";
import Message from "./Message";

import getWeatherInfo from "../../Weather";

const cookies = new Cookies();

class Chatbot extends Component {
  messagesEnd;
  textInput;
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      showBot: true
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

    if (res.data.intent.displayName === "detect-city-temperature") {
      const city = res.data.parameters.fields["geo-city"].stringValue;
      
      if (city) {
        getWeatherInfo(city).then(data => {
          const temp = Math.round(data.main.temp-273.15)
          says = {
            speak: "bot",
            msg: {
              text: {
                text: `The temperature of ${city} is ${temp}°C`
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
              text:
                `Oops !! Sorry, temperature of ${city} not found. try another location`
            }
          }
        };
        this.setState({ messages: [...this.state.messages, says] });
      }
    } else if (res.data.intent.displayName === "detect-city-weather") {
      const city = res.data.parameters.fields["geo-city"].stringValue;
      if (city) {
        getWeatherInfo(city).then(data => {

          const desc = data.weather[0].description
          const humidity = data.main.humidity
          const windspeed = data.wind.speed
          says = {
            speak: "bot",
            msg: {
              text: {
                text: `Weather - ${desc}, Humidity - ${humidity}, Wind speed - ${windspeed}`
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
              text:
                `Oops !! Sorry, weather report of ${city} not found. try another location`
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
    if (this.textInput) {
      this.textInput.focus();
    }
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

  show = () => {
    this.setState({
      showBot: true
    });
  };

  hide = () => {
    this.setState({
      showBot: false
    });
  };

  handleKeyPress = e => {
    if (e.key === "Enter") {
      this.df_text_query(e.target.value);
      e.target.value = "";
    }
  };

  render() {
    if (this.state.showBot) {
      return (
        <div
          style={{
            height: 500,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 20,
            border: "1px solid lightgrey"
          }}
        >
          <nav>
            <div className="nav-wrapper">
              <div className="brand-logo">Chatbot</div>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  {
                    //eslint-disable-next-line
                    <a onClick={this.hide}>Close</a>
                  }
                </li>
              </ul>
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
    } else {
      return (
        <div
          style={{
            height: 40,
            width: 400,
            position: "absolute",
            bottom: 0,
            right: 20,
            border: "1px solid lightgrey"
          }}
        >
          <nav>
            <div className="nav-wrapper">
              <div className="brand-logo">Chatbot</div>
              <ul id="nav-mobile" className="right hide-on-med-and-down">
                <li>
                  {
                    //eslint-disable-next-line
                    <a onClick={this.show}>Show</a>
                  }
                </li>
              </ul>
            </div>
          </nav>
          <div
            ref={el => (this.messagesEnd = el)}
            style={{ float: "left", clear: "both" }}
          />
        </div>
      );
    }
  }
}

export default Chatbot;
