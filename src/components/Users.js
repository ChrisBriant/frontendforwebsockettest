import sock from '../services/socket';

const Users = (props) => {
  console.log(props);

  const sendUser = async (user) => {
    console.log(user);
    let payload = {
      'type' : 'client',
      'client_id' : user
    }
    await sock.send(JSON.stringify(payload));
  }

  return (
    <div>
      <p>I am the users list</p>
      {
        props.users.map((user,i) => (
          <button key={i} onClick={sendUser({user})}>{user}</button>
        ))
      }
    </div>
  );
}

export default Users;
