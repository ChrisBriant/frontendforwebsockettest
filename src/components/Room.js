import {useState, useRef} from 'react';
import ContentEditable from 'react-contenteditable'
//import { animateScroll } from "react-scroll";
import sock from '../services/socket';

const Room = (props) => {
  console.log(props);
  const contentEditable = useRef('');
  const [message,setMessage] = useState('');

  const exitRoom = async () => {
    let payload = {
      'type' : 'exit_room',
      'client_id' : props.userId,
      'name' : props.roomName
    }
    await sock.send(JSON.stringify(payload));
  }

  const handleEditMessage = async (e) => {
    console.log('text ', e.target.value);
    setMessage(e.target.value);
  }

  const sendMessage = async (e) => {
    let payload = {
      'type' : 'message_room',
      'client_id' : props.userId,
      'name' : props.roomName,
      'message' : message
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
      <textarea
        id="chatmessage"
        onChange={handleEditMessage}
      />
      <button id="send-message" onClick={sendMessage}>Send</button>
      <div>
        <button id="exit" onClick={exitRoom}>Exit</button>
      </div>
    </>
  );
}

export default Room;

//REMOVE for now
//<div className="editable-div" contentEditable="true" onChange={handleEditMessage}></div>
