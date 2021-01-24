import {useState} from 'react';
//import { animateScroll } from "react-scroll";
import sock from '../services/socket';

const Room = (props) => {
  console.log(props);

  const exitRoom = async () => {
    let payload = {
      'type' : 'exit_room',
      'client_id' : props.userId,
      'name' : props.roomName
    }
    await sock.send(JSON.stringify(payload));
  }

  return (
    <>
      <p>You are in {props.roomName}</p>
      <div>
        <p>Also in the room:</p>
        {
          props.otherMembers.map((member,i) => (
            <button id={member.id} key={i}>{member.name}</button>
          ))
        }
      </div>
      <div id="messages" className="message-div">
        <ul>
          {
            props.roomMessages.map((msg,i) => (
              <li key={i} className={msg.class}>{msg.msg}</li>
            ))
          }
        </ul>
      </div>
      <div className="editable-div" contentEditable="true"></div>
      <button id="send-message">Send</button>
      <div>
        <button id="exit" onClick={exitRoom}>Exit</button>
      </div>
    </>
  );
}

export default Room;
