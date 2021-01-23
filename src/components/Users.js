import sock from '../services/socket';

const Users = (props) => {

  const sendUser = async (e) => {
    console.log(e.target.id);
    let payload = {
      'type' : 'client',
      'client_id' : e.target.id
    }
    await sock.send(JSON.stringify(payload));
  }

  return (
    <div>
      <p>I am the users list</p>
      {
        props.users.map((user,i) => (
          <button id={user} key={i} onClick={(e) => sendUser(e)}>{user}</button>
        ))
      }
    </div>
  );
}

export default Users;
