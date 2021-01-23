import {useEffect, useReducer} from 'react';
import sock from '../services/socket';
import SendName from './SendName';
import Rooms from './Rooms';
import Users from './Users';

const TestConnect = () => {
  // const wsproto = 'wss';
  // const wsuri = wsproto + "://" + window.location.hostname + ":8080/ws";
  // let sock = new WebSocket(wsuri);

  const initialState = {
                          response:'',
                          showNameDialog:false,
                          users: [],
                          myId:null,
                          myName:null,
                          rooms:null
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'setResponse':
        return {...state, response : action.payload};
      case 'showNameDialog':
        return {...state, showNameDialog : true};
      case 'clientList':
        return {...state, users : action.payload};
      case 'setName':
        console.log(action.payload);
        return {...state, myName : action.payload};
      case 'register':
        return {...state, myId : action.payload};
      case 'roomList':
        return {...state, rooms : action.payload};
      default:
        return state;
    }
  }

  //const [response,setResponse] = useState('');
  const [state,dispatch] = useReducer(reducer,initialState);

  useEffect( () => {
    console.log('Using Effect');
    if (sock) {
       sock.onopen = function() {
          console.log("Connected");
       }

       sock.onclose = (e) =>  {
          console.log("Connection closed (wasClean = " + e.wasClean + ", code = " + e.code + ", reason = '" + e.reason + "')");
          //this = null;
          console.log(e,sock);
       }

       sock.onmessage = function(e) {
          let data = JSON.parse(e.data)
          //let data = e;
          console.log(data);
          switch(data.type) {
              case 'register':
                dispatch({type:'register', payload:data.yourid});
                break;
              case 'client_list':
                dispatch({type:'clientList', payload:data.clients});
                break;
              case 'set_name':
                dispatch({type:'setName', payload:data.message});
                break;
              case 'room_list':
                dispatch({type:'roomList', payload:JSON.parse(data.rooms)});
                break;
              default:
                dispatch({type:'setResponse', payload:data.message});
          }
       }
     }
  }, [] );

  const sendMessage = async () => {
    console.log('Message sent');
    if (sock) {
       //await sock.send('@:Hello World!');
       let payload = {
         type : 'broadcast',
         message : 'Hello World'
       }
       await sock.send(JSON.stringify(payload));
       console.log("Sent ");
    } else {
       console.log("Not connected.");
    }
  }

  console.log('Something is rotten in the state of react', state);

  return (
    <div>
      { state.myName ?
        <>
          <p>{state.myName}</p>
          <Rooms userId={state.myId} rooms={state.rooms}/>
        </> :
        <>
          <p>Loading...</p>
          <SendName userId={state.myId} />
        </>
      }
      <button onClick={sendMessage}>Send Message</button>
      <p>{state.response}</p>
    </div>
  )
}


export default TestConnect;
