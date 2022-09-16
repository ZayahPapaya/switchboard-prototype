import { Server } from "socket.io";
const io = new Server();
import dotenv from "dotenv";
import { routeMap } from "./server-modules/routeClass.js";
import { outboundSwitchboard } from './server-modules/outboundSwitchboard.js';
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

function inboundSwitchboard(message) {
  const route = routeMap.get(message.route);
  if (route) {
    outboundSwitchboard(route.invoke(message));
  } else {
    console.log(`Your message's route was not found:`, message.route);
    // this could throw an error instead
  }
}

routeMap.get('example').invoke('pog');