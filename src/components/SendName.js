import {useState} from 'react';
import sock from '../services/socket';

const SendName = (props) => {
  const [name,setName] = useState('');

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
      'type' : 'name',
      'client_id' : props.userId,
      'name' : name
    }
    console.log(payload);
    await sock.send(JSON.stringify(payload));
  }

  return (
    <div className="inline-input">
      <label>Enter name:
        <input id="name" type="text" value={name} onChange={handleChange} />
        <button id="sendname" onClick={handleSend}>Send</button>
      </label>
    </div>
  );
}

export default SendName;
