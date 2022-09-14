import { Server } from "socket.io";
const io = new Server();
import dotenv from "dotenv";
import routeMap from "./server-modules/routeClass";
import { emitToOthers, getClientByID } from "./server-modules/emit.js";
dotenv.config();
io.listen(process.env.PORT || 3500);

const allClients = [];

io.on("connection", (client) => {
  console.log('connection');
  allClients.push(client);
  client.on("ping", (message) => inboundSwitchboard(message));
  // this could be run through a diagnostics function first that handles any health checks like waiting times, then passes to switchboard when finished
});

//////////////////////////////////////
// an example message might look like:

// const message =
// {
//   route: 'addition',
//   id: socket.id,
//   intendedReciever: 'sender',
//   payload:
//   {
//     stuff: 'pog',
//   }
// }
//////////////////////////////////////

inboundSwitchboard = (message) => {
  // the route should be set by client and specify what on the server needs to handle that specific function's output, rather than having individual connections for each call
  const route = routeMap.get(message.route);
  if (route) {
    route.invoke(message);
  } else {
    console.log(`Your message's route was not found:`, message.route);
    // this could throw an error instead
  }
}

outboundSwitchboard = (message) => {
  const key = message.intendedReciever;
  switch (key) {
    case 'sender':
      getClientByID(message.id)?.emit(message);
      break;
    case 'others':
      emitToOthers(message.id, message);
      break;
    case 'all':
      io.emit(message);
    default:
      break;
  }
}