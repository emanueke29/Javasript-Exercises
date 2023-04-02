
//My version 
function deepEqual(val1,val2){

    if(val1===val2){
        return true;
    }
    else{
        if(typeof(val1)==="object" && typeof(val2)=="object" && val1 != null && val2 != null){
            let o1 = Object.keys(val1);
            let o2 = Object.keys(val2);
            for(let i = 0; i < o1.length; i++){
                if(o1[i]===o2[i]){
                    deepEqual(val1[o1[i]],val2[o2[i]]);
                }
                else{
                    return false;
                }
            }
        }
        else{
            return false;
        }
    }
    return true;
}

//Eloquent JS version

function deepEqual1(a, b) {
    if (a === b) return true;

    if (a == null || typeof a != "object" ||
        b == null || typeof b != "object") return false;

    let keysA = Object.keys(a), keysB = Object.keys(b);

    if (keysA.length != keysB.length) return false;

    for (let key of keysA) {
        if (!keysB.includes(key) || !deepEqual1(a[key], b[key])) return false;
    }

    return true;
}

//Tries
val1 = {
    animal: "dog",
    legs: 4
}

val2 = {
    animal: "dog",
    legs: 4
}

console.log(deepEqual1(val1,val2));