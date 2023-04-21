//Level

let simpleLevelPlan = `
......................
..#................#..
..#..............=.#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#++++++++++++#..
......##############..
......................`;


class Level{
    constructor(plan){
        let rows = plan.trim().split("\n").map(l=>[...l]); //Array of arrays of characters
        this.height = rows.length;
        this.width = rows[0].length;
        this.startActors = [];
        this.rows = rows.map((row,y)=>{ //2 parameter of mapping function is the index
            return row.map((ch,x)=>{ //y->index of row, x-> index of char
                let type = levelChars[ch];
                //Possible values of type -> player
                //                        -> coin
                //                        -> lava
                if(typeof type == "string") return type;
                this.startActors.push(type.create(new Vec(x,y),ch));
                return "empty"; //Background square empty
            })
        })
    }
}

//State of running game

class State{
    constructor(level,actors,status){
        this.level = level;
        this.actors = actors;
        this.status = status;
        //Status can switch to ->   won
        //                     ->   lost
        //when the game has ended
    }

    static start(level){
        return new State(level,level.startActors,"playing");
    }

    get player(){
        return this.actors.find(a => a.type == "player");
    }
}

//Actors

class Vec{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    plus(other){
        return new Vec(this.x + other.x , this.y + other.y);
    }
    //Scaling a vector
    times(factor){
        return new Vec(this.x * factor.x, this.y * factor.y);
    }
}

//Player

class Player{
    constructor(pos,speed){
        this.pos = pos; 
        this.speed = speed;
    }

    get type(){
        return "player";
    }

    static create(pos){
        return new Player(pos.plus(new Vec(0,-0.5)),new Vec(0,0));
    }
}
//Steady player size
Player.prototype.size = new Vec(0.8,1.5);

//Lava

class Lava{
    constructor(pos,speed,reset){
        this.pos = pos;
        this.speed = speed;
        this.reset = reset;
    }

    get type(){
        return "lava";
    }

    static create(pos,ch){
        //Horizontal lava
        if(ch == "="){
            return new Lava(pos,new Vec(2,0));
        }
        //Vertical lava
        else if(ch == "|"){
            return new Lava(pos,new Vec(0,2));
        }
        //Dripping lava
        else if(ch=="v"){
            return new Lava(pos,new Vec(0,3),pos);
        }
    }
}
//Steady lava size
Lava.prototype.size = new Vec(1,1);

//Coin

class Coin{
    constructor(pos,basePos,wobble) {
        //Currently position
        this.pos = pos;
        //Base position
        this.basePos = basePos;
        //Motion
        this.wobble = wobble;
    }

    get type(){
        return "coin";
    }

    static create(pos){
        let basePos = pos.plus(new Vec(0.2,0.1));
        return new Coin(basePos,basePos,Math.random() * Math.PI * 2);
        //                                   ^^^^^^-> every coin has a different starting
        //                                            position for motion
    }
}

//Steady coin size
Coin.prototype.size = new Vec(0.6,0.6);

//Level chars

const levelChars = {
    ".":"empty",
    "#":"wall",
    "+":"lava",
    "o":Coin,
    "@":Player,
    "=":Lava,
    "|":Lava,
    "v":Lava
};

//Drawing

//Help dom function

function elt(name,attrs,...children){
    let dom = document.createElement(name);
    for(let attr of Object.keys(attrs)){
        dom.setAttribute(attr,attrs[attr]);
    }
    for(let child of children){
        dom.appendChild(child);
    }
    return dom;
}

//Display class

class DOMDisplay{
    constructor(parent,level){
        this.dom = elt("div",{class:"game"},drawGrid(level));
        this.actorLayer = null; //Track elements that hold the actors 
        parent.appendChild(this.dom); //Adding dom
    }

    clear(){ this.dom.remove();}

}

//Scale of the game

const scale = 20;

//Grid of game

//Background -> <table> of elements

function drawGrid(level){
    return elt("table",{
        class:"background",
        style:`width: ${level.width * scale}px`
    },...level.rows.map(row=>
        elt("tr",{ style:`height: ${scale}px`},
            ...row.map(type => elt("td",{class: type})))
    ));
}

//Testing
let simpleLevel = new Level(simpleLevelPlan);
console.log(`${simpleLevel.width} by ${simpleLevel.height}`);

