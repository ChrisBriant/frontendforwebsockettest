import {useState} from 'react';
import sock from '../services/socket';

const Rooms = (props) => {
  console.log('Here are the props',props);

  const [roomName,setName] = useState('');

  const handleChange = (e) => {
    setName(e.target.value);
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

  return (
    <>
      <div className="inline-input">
        <label>Room Name:
          <input id="room-name" type="text" value={roomName} onChange={handleChange} />
          <button onClick={handleSend}>Create</button>
        </label>
      </div>
      <div>
        { props.rooms ?
          props.rooms.map((room,i) => (
            <button id={room.name} key={i} onClick={console.log('click')}>{room.name}</button>
          )) :
          null
        }
      </div>
    </>
  )

}

export default Rooms;
