const pog = new Map();

class Route {
  name = "error";
  constructor() {
    pog.set(this.name, this);
  }

  invoke(message) {
    return; //subtypes implement this
  }
}

class AdditionRoute extends Route {
  name = "addition";
  invoke(message) {
    // some functions will emit back to the client who should have their own recieving switch case, similar to the server's
    message.payload = 2 + 2;
    outboundSwitchboard(message);
  }
}

class doStuff extends Route {
  name = "clientHistory";
  invoke(message) {
    doMath() + doMath();
    console.log('pog');
    onClientHistory();
  }
}

///////////////////////////////////////////////
// For auto exporting all Routes in the switchboard
// function getAllSubclasses(baseClass) {
//   var globalObject = Function('return this')(); 
//   var allVars = Object.keys(globalObject);
//   var classes = allVars.filter(function (key) {
//   try {
//     var obj = globalObject[key];
//         return obj.prototype instanceof baseClass;
//     } catch (e) {
//         return false;
//     }
//   });
//   return classes;
// }

// getAllSubclasses(Route).forEach(route => new route());
// attribute and use manual new's

export const routeMap = pog;