import {useState} from 'react';
import sock from '../services/socket';

const Rooms = (props) => {
  console.log('Here are the props',props);

  const [roomName,setName] = useState('');

  const handleChange = (e) => {
    let compareChar = /^[A-Za-z0-9/ ]*$/i;
    if(e.target.value.match(compareChar)) {
      setName(e.target.value);
    } else {
      console.log('Special Characters Not Allowed');
    }
  }

  const handleSend = async () => {
    let payload = {
      'type' : 'create_room',
      'client_id' : props.userId,
      'name' : roomName
    }
    console.log(payload);
    await sock.send(JSON.stringify(payload));
  }

  const enterRoom = async (e) => {
    console.log('Trying to enter the room', e.target.id);
    let payload = {
      'type' : 'enter_room',
      'client_id' : props.userId,
      'name' : e.target.id
    }
    await sock.send(JSON.stringify(payload));
  }

  return (
    <>
      <div className="inline-input">
        <label>Room Name:
          <input id="room-name" type="text" value={roomName} onChange={handleChange} />
          <button id="sendroom" onClick={handleSend}>Create</button>
        </label>
      </div>
      <div>
        { props.rooms ?
          props.rooms.map((room,i) => (
            <button id={room.name} key={i} onClick={enterRoom}>{room.name}</button>
          )) :
          null
        }
      </div>
    </>
  )

}

export default Rooms;
