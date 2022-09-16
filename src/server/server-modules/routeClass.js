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

class ExampleRoute extends Route { // This is an example of how classes should be written
  name = "example"; // A name that the package 'targets'
  invoke(message) { // invoke always takes in the client packet
    console.log(message); // run your code, preferably as a function imported from another file. Your function should return its output. The output should be a mutated version of the packet.
    outboundSwitchboard(message); // submit your function's return into outbound switchboard. The client packet should have an outbound arg.
  }
}

///////////////////////////////////////////////
//For auto exporting all Routes in the switchboard
function getAllSubclasses(baseClass) { // v this scares me
  let globalObject = Function('return this')(); // Function constructor ignores 'use strict' while evaluating the string as code. This refers to the global object.
  return Object.keys(globalObject).filter(key => { // Grabs all 'variable names' in your code and filters
    try {// Filters only instances of the base class you handed it
      return globalObject[key].prototype instanceof baseClass;
    } catch (e) {
      return false;
    }
  });// returns array of references to subclasses
}
// https://stackoverflow.com/questions/31618212/find-all-classes-in-a-javascript-application-that-extend-a-base-class
// Thank you stack overflow for the original version of this code, even if it's terrifying.

getAllSubclasses(Route).forEach(route => new route());
// attribute and use manual new's

export const routeMap = pog;