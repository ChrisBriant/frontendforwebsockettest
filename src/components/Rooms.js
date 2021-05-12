import {useState} from 'react';
import sock from '../services/socket';

const Rooms = (props) => {
  console.log('Here are the props',props);

  const [roomName,setName] = useState('');
  const [password,setPassword] = useState('');
  const [secure,setSecure] = useState(false);
  //For entering room
  const [passwordForRoom,setPasswordForRoom] = useState('');
  const [passwordRequired,setPasswordRequired] = useState(false);
  const [selectedRoom,setSelectedRoom] = useState('');

  const handleChange = (e) => {
    let compareChar = /^[A-Za-z0-9/ ]*$/i;
    if(e.target.value.match(compareChar)) {
      setName(e.target.value);
    } else {
      console.log('Special Characters Not Allowed');
    }
  }

  const handleSend = async () => {
    if(password !== '') {
      setSecure(true);
    } else {
      setSecure(false);
    }
    let payload = {
      'type' : 'create_room',
      'client_id' : props.userId,
      'name' : roomName,
      'secure': secure,
      'password' : password
    }
    console.log(payload);
    await sock.send(JSON.stringify(payload));
  }

  const enterRoom = async (e,secure) => {
    console.log('Trying to enter the room', e.target.id,secure );
    setSelectedRoom(e.target.id);
    if(!secure) {
      let payload = {
        'type' : 'enter_room',
        'client_id' : props.userId,
        'name' : e.target.id,
        'secure' : secure,
        'password' : ''
      }
      await sock.send(JSON.stringify(payload));
    } else {
      setPasswordRequired(true);
    }
  }


  const enterSecureRoom = async (e) => {
    console.log('Trying to enter the room', e.target.id);
    props.setRoomPassword(passwordForRoom);
    let payload = {
      'type' : 'enter_room',
      'client_id' : props.userId,
      'name' : e.target.id,
      'secure' : secure,
      'password' : passwordForRoom
    }
    await sock.send(JSON.stringify(payload));
  }

  return (
    <>
      { !passwordRequired
        ?
            <div className="inline-input">
              <div className="inline-input">
                <label>Room Name:
                  <input id="room-name" type="text" value={roomName} onChange={handleChange} />
                  <button id="sendroom" onClick={() => setSecure(true)}>Add Password</button>
                  { secure
                    ? <input id="password" type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
                    : null
                  }
                  <button id="sendroom" onClick={handleSend}>Create</button>
                </label>
              </div>
              <div className="inline-input">
                { props.rooms ?
                  props.rooms.map((room,i) => (
                    <button id={room.name} key={i} onClick={(e) => enterRoom(e,room.secure)}>{room.name}</button>
                  )) :
                  null
                }
              </div>
            </div>
        : <div>
            <input id="passwordForRoom" type="text" value={passwordForRoom} onChange={(e) => setPasswordForRoom(e.target.value)} />
            <button id={selectedRoom} onClick={(e) => enterSecureRoom(e)}>Enter</button>
          </div>
        }
    </>
  )

}

export default Rooms;
