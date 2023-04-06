class Group {
    constructor() {
      this.members = [];
    }
  
    add(value) {
      if (!this.has(value)) {
        this.members.push(value);
      }
    }
  
    delete(value) {
      this.members = this.members.filter(v => v !== value);
    }
  
    has(value) {
      return this.members.includes(value);
    }
  
    static from(collection) {
      let group = new Group;
      for (let value of collection) {
        group.add(value);
      }
      return group;
    }
    //Solution 1
    [Symbol.iterator]() {
      return new GroupIterator(this);
    }
}
  //Solution 1 
  class GroupIterator {
    constructor(group) {
      this.group = group;
      this.position = 0;
    }
  
    next() {
      if (this.position >= this.group.members.length) {
        return {done: true};
      } else {
        let result = {value: this.group.members[this.position],
                      done: false};
        this.position++;
        return result;
      }
    }
  }

//Solution 2 //Using generators

// Group.prototype[Symbol.iterator] = function*() {
//   for (let i = 0; i < this.members.length; i++) {
//     yield this.members[i];
//   }
// };
  
  for (let value of Group.from(["a", "b", "c"])) {
    console.log(value);
  }