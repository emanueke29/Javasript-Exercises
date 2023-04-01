

class Group{

    constructor(){
        this.members = [];
    }

    has(value){
        if(this.members.includes(value)){
            return true;
        }
        else{
            return false;
        }
    }


    add(value){
        if(!this.has(value)){
            this.members.push(value);
        }

    }

    delete(value){
        this.members = this.members.filter(val=>val!==value);
    }

    static from(object){
        let group = new Group();
        for(let value of object){
            group.add(value);
        }
        return group;
    }


}


let group = Group.from([10, 20]);
console.log(group.has(10));
// → true
console.log(group.has(30));
// → false
group.add(10);
group.delete(10);
console.log(group.has(10));
