const { find } = require("sneaks-api/models/Sneaker");

const roads = [
    "Alice's House-Bob's House",   "Alice's House-Cabin",
    "Alice's House-Post Office",   "Bob's House-Town Hall",
    "Daria's House-Ernie's House", "Daria's House-Town Hall",
    "Ernie's House-Grete's House", "Grete's House-Farm",
    "Grete's House-Shop",          "Marketplace-Farm",
    "Marketplace-Post Office",     "Marketplace-Shop",
    "Marketplace-Town Hall",       "Shop-Town Hall"];

function buildGraph(edges){
    let graph = Object.create(null); //In this way i have no inherited properties (0 properties)
    function addEdge(from,to){
        if(graph[from]==null){ //If the "from" properties doesn't exist i create a new one
            graph[from] = [to]; //and i insert a new array with the "to" element inside
        }
        else{
            graph[from].push(to); //Otherwise i push the element in the right array
        }
    }
    for(let [from,to] of edges.map(r=>r.split("-"))){
        addEdge(from,to);
        addEdge(to,from); //Because is an undirected graph
    }
    return graph;
}

//Status of each place in the village
class VillageState{
    constructor(place,parcels){
        this.place = place;
        this.parcels = parcels;
    }

    move(destination){
        //If i can't go from this place to the indicated destination
        //i return "this" because the movement is not valid
        if(!roadGraph[this.place].includes(destination)){ 
            return this;
        }
        else{
            //Moving parcels
            let parcels = this.parcels.map(
                p=>{
                    if(p.place != this.place){
                        //Old parcels
                        return p; 
                    }
                    else{ //New parcels
                        return {place:destination, address:p.address};
                    }
                }
            ).filter(p => p.place != p.address); //Delivering parcels
            return new VillageState(destination,parcels);
        }
    }
}

function runRobot(state,robot,memory){
    for(let turn=0;;turn++){
        if(state.parcels.length == 0){ //No parcels
            console.log(`Done in ${turn} turns`);
            break;
        } 
        else{
            let action = robot(state,memory);
            state = state.move(action.direction);
            memory = action.memory;
            console.log(`Moved to ${action.direction}`);
        }
    }
}

//RANDOM ROBOT

function randomPick(array){
    let choice = Math.floor(Math.random() * array.length);
    return array[choice];
}
//This is the first version of robot's function called in "runRobot" that omits the memory
//parameter beacuse it'a random movement

function randomRobot(state){
    return {direction:randomPick(roadGraph[state.place])};
}
//ROUTE ROBOT
//Route followed by the robot like mail truck's route
const mailRoute = [
    "Alice's House", "Cabin", "Alice's House", "Bob's House",
    "Town Hall", "Daria's House", "Ernie's House",
    "Grete's House", "Shop", "Grete's House", "Farm",
    "Marketplace", "Post Office"
];

function routeRobot(state,memory){
    if(memory.length == 0){
        memory = mailRoute;
    }
    return {direction:memory[0], memory: memory.slice(1)};

}

//GOAL ORIENTED ROBOT
//Path finding
//BFS to find the shortest route between 2 places 
function findRoute(graph,from,to){
    let work = [{at:from,route:[]}]; // Work = queue
    for(let i=0; i<work.length;i++){
        let {at,route} = work[i]; //dequeue
        for(let place of graph[at]){
            if(place==to){
                return route.concat(place);
            }
            if(!work.some(w=>w.at == place)){ //Place not visited yet (not in queue)
                work.push({at:place,route:route.concat(place)}); //Adding to queue
            }
        }
    }
    //Concat -> new array with both old values and new values
    //Push -> old array with new values
}

function goalOrientedRobot({place,parcels},route){
    if(route.length == 0){ //If the robot has a route to follow he follows the route
        let parcel = parcels[0];
        if(parcel.place != place){
            route = findRoute(roadGraph,place,parcel.place); //Robot has to get the parcel's place -> start the delivery
        }
        else{
            route = findRoute(roadGraph,place,parcel.address); //Robot has to get the parcel's address -> end the delivery
        }
    }
    return {direction:route[0],memory:route.slice(1)};
}

//LAZY ROBOT

function lazyRobot({place, parcels}, route) {
    if (route.length == 0) {
      // Describe a route for every parcel
      let routes = parcels.map(parcel => {
        if (parcel.place != place) {
          return {route: findRoute(roadGraph, place, parcel.place),
                  pickUp: true};
        } else {
          return {route: findRoute(roadGraph, place, parcel.address),
                  pickUp: false};
        }
       
      });
      //If the robot has to pick up parcels during its route is more efficient
      //because it avoids to came back to pickUp a parcel
      // This determines the precedence a route gets when choosing.
      // Route length counts negatively, routes that pick up a package
      // get a small bonus.
      function score({route, pickUp}) {
        return (pickUp ? 0.5 : 0) - route.length;
      }
      route = routes.reduce((a, b) => score(a) > score(b) ? a : b).route;
    }
  
    return {direction: route[0], memory: route.slice(1)};
  }
  


//Static method for VillageState constructor to generate a random parcels for Post Office

VillageState.random = function(parcelCount = 5){
    let parcels = [];
    for(let i = 0; i < parcelCount; i++){
        let address = randomPick(Object.keys(roadGraph));
        let place;
        do{
            place = randomPick(Object.keys(roadGraph));
        }
        while(place==address);
        parcels.push({place,address});
    }
    return new VillageState("Post Office",parcels);
}

//Exercises

function countSteps(state, robot, memory) {
    for (let steps = 0;; steps++) {
      if (state.parcels.length == 0) return steps;
      let action = robot(state, memory);
      state = state.move(action.direction);
      memory = action.memory;
    }
  }
  
  function compareRobots(robot1, memory1, robot2, memory2) {
    let total1 = 0, total2 = 0;
    for (let i = 0; i < 100; i++) {
      let state = VillageState.random();
      total1 += countSteps(state, robot1, memory1);
      total2 += countSteps(state, robot2, memory2);
    }
    console.log(`Robot 1 needed ${total1 / 100} steps per task`)
    console.log(`Robot 2 needed ${total2 / 100} steps per task`)
  }

//Testing
const roadGraph = buildGraph(roads);
// let first = new VillageState("Post Office",[{place: "Post Office", address: "Alice's House"}]);
// let next = first.move("Alice's House");
// console.log(next.place); // → Alice's House 
// console.log(next.parcels); // → [] 
// console.log(first.place); // → Post Office
console.log("Testing random robot");
let villagestate = VillageState.random();
runRobot(villagestate,randomRobot);
console.log("Testing route robot");
runRobot(villagestate,routeRobot,[]); //More efficient
console.log("Testing goal oriented robot");
runRobot(villagestate,goalOrientedRobot,[]); //More efficient then the previous solution
console.log("Testing lazy  robot");
runRobot(villagestate,lazyRobot,[]); //Best solution
compareRobots(routeRobot, [], goalOrientedRobot, []); //Exercise 19
compareRobots(goalOrientedRobot, [], lazyRobot, []); //Exercise 20






