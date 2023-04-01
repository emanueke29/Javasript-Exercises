//Everything

//Using some method

function every(array,fun){
    return !array.some(element=> !fun(element)); //Based on the Morgan laws ("!" means the opposite as compared at the return of fun)

}

console.log(every([1, 3, 5], n => n < 10));
// → true
console.log(every([2, 4, 16], n => n < 10));
// → false
console.log(every([], n => n < 10));
// → true

//Without using some method but using a loop

function everyI(array,fun){
    for(let i = 0; i < array.length; i++){
        if(!fun(array[i])){
            return false;
        }
    }
    return true;
}

console.log(everyI([1, 3, 5], n => n < 10));
// → true
console.log(everyI([2, 4, 16], n => n < 10));
// → false
console.log(everyI([], n => n < 10));
// → true

