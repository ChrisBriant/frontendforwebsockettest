const wsproto = 'wss';
const wsuri = wsproto + "://" + window.location.hostname + ":8080/ws";
const sock = new WebSocket(wsuri);

export default sock;
