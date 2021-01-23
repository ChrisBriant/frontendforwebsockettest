import {useEffect, useReducer} from 'react';
import sock from '../services/socket';
import Users from './Users';

const TestConnect = () => {
  // const wsproto = 'wss';
  // const wsuri = wsproto + "://" + window.location.hostname + ":8080/ws";
  // let sock = new WebSocket(wsuri);

  const initialState = {
                          response:'',
                          showNameDialog:false,
                          users: [],
                          myId:null
  };

  function reducer(state, action) {
    switch (action.type) {
      case 'setResponse':
        return {...state, response : action.payload};
      case 'showNameDialog':
        return {...state, showNameDialog : true};
      case 'clientList':
        console.log('here is the client list',action.payload)
        return {...state, users : action.payload};
      case 'register':
        console.log(action.payload);
        return {...state, myId : action.payload};
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
                console.log(data.yourid);
                dispatch({type:'register', payload:data.yourid});
                break;
              case 'client_list':
                console.log(data.clients);
                dispatch({type:'clientList', payload:data.clients});
                break;
              default:
                console.log("Got: " + e.data);
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
      { state.myId ? <p>{state.myId}</p> : <p>Loading...</p>}
      <Users users={state.users}/>
      <p>Hello World!</p>
      <button onClick={sendMessage}>Send Message</button>
      <p>{state.response}</p>
    </div>
  )
}


export default TestConnect;
