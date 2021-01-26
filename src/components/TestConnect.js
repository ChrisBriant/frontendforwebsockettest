import {useEffect, useReducer} from 'react';
import { animateScroll } from "react-scroll";
import sock from '../services/socket';
import SendName from './SendName';
import Rooms from './Rooms';
import Room from './Room';
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
                          rooms:null,
                          inRoom: false,
                          roomName: '',
                          roomMessages: [],
                          otherMembers: []
  };


  const scrollDown = () => {
    console.log('Using room effect');
    animateScroll.scrollToBottom({
      containerId: "messages"
    });
  };

  function reducer(state, action) {
    let msg;
    let otherMembers;
    let inRoom;
    let roomMessages;
    let roomName;

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
      case 'enterRoom':
        console.log('Tying to enter the room', action.payload);
        if (action.payload.client.name === state.myName) {
          msg = `Welcome, you have entered ${action.payload.name}.`;
        } else {
          msg = `${action.payload.client.name} has entered the room.`;
        }
        otherMembers = action.payload.members.filter((item) => (item.id !== state.myId));
        return {  ...state,
                  inRoom : true,
                  roomName: action.payload.name,
                  roomMessages : [...state.roomMessages,{ class:'entrance', msg }],
                  otherMembers
        };
      case 'exitRoom':
        msg = `${action.payload.client.name} has left the room.`;
        //Declare variables for state as dependant on user being leaver
        roomMessages= [...state.roomMessages,{ class:'entrance', msg }];
        console.log('I AM LEAVING THE ROOM',action.payload.client.id,state.myId);
        if(action.payload.client.id === state.myId) {
          inRoom = false;
          roomName = '';
          otherMembers = [];
          roomMessages = [];
        } else {
          inRoom = true;
          roomName = action.payload.name;
          otherMembers = action.payload.members.filter((item) => (item.id !== state.myId))
            .filter((item) => (item.name !== action.payload.client.name));
          console.log('Other members here', otherMembers);
        }
        return {  ...state,
                  inRoom,
                  roomName,
                  roomMessages,
                  otherMembers
        };
      case 'roomMessage':
        scrollDown();
        msg = `${action.payload.client.name}: ${action.payload.message} `;
        return {  ...state,
                  roomMessages : [...state.roomMessages,{ class:'message', msg }],
        };
      case 'roomPm':
        console.log('Pay me now',action.payload);
        scrollDown();
        msg = `${action.payload.sender}: ${action.payload.message} `;
        return {  ...state,
                  roomMessages : [...state.roomMessages,{ class:'pm', msg }],
        };
      case 'destroyRoom':
        //Forces an exit of room
        return {  ...state,
                  inRoom : false,
                  roomName :'',
                  roomMessages:[],
                  otherMembers:[]
        };
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
              case 'room_entrance':
                dispatch({type:'enterRoom', payload:data});
                break;
              case 'room_exit':
                dispatch({type:'exitRoom', payload:data});
                break;
              case 'destroy_room':
                dispatch({type:'destroyRoom', payload:data});
                break;
              case 'room_message':
                dispatch({type:'roomMessage', payload:data});
                break;
              case 'in_room_pm':
                dispatch({type:'roomPm', payload:data});
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
          <p>Welcome {state.myName}</p>
          {
            state.inRoom ?
              <Room userId={state.myId}
                    name={state.myName}
                    roomName={state.roomName}
                    roomMessages={state.roomMessages}
                    otherMembers={state.otherMembers}
                    /> :
              <Rooms userId={state.myId} rooms={state.rooms}/>
          }
        </> :
        <>
          <p>Welcome</p>
          <SendName userId={state.myId} />
        </>
      }

    </div>
  )
}

//REMOVED FOR TIME BEING
// <button onClick={sendMessage}>Send Message</button>
// <p>{state.response}</p>

export default TestConnect;
