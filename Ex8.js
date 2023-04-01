function reverseArray(array){
    let newarray = [];
    for(let i = array.length-1; i>=0; i--){
        newarray[i-array.length] = array[i];
    }
    return newarray;
}

function reverseArrayInPlace(array){
    let z = 0;
    for(let i = 0; i< array.length/2; i++){
        let tmp;
        tmp = array[array.length-i-1];
        array[array.length-i-1] = array[z];
        array[z] = tmp;
        z++;
    }
    return array;
}
let arr = [1,2,3,4,5];

console.log(reverseArrayInPlace(arr));