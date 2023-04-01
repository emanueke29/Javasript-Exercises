

class Vec{
    constructor(x,y){
        this.x = x;
        this.y = y;
    }

    plus(vector){
        let newx = this.x + vector.x;
        let newy = this.y + vector.y;
        return new Vec(newx,newy); 
    }

    minus(vector){
        let newx = this.x - vector.x;
        let newy = this.y - vector.y;
        return new Vec(newx,newy); 
    }

    get length(){
        return Math.round((Math.sqrt(this.x*this.x + this.y*this.y)));
    }
}

console.log(new Vec(1, 2).plus(new Vec(2, 3)));
// → Vec{x: 3, y: 5}
console.log(new Vec(1, 2).minus(new Vec(2, 3)));
// → Vec{x: -1, y: -1}
console.log(new Vec(3, 4).length);
// → 5