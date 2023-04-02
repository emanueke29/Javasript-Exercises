
function range(start, end,step){
    let array = [];
    let z = 0;
    if(step>0){
        for(let i = start; i<end; i=i+step){
            array[z] = i;
            z++;
        }
    }
    else{
        for(let i = start; i>=end; i=i+step){
            array[z] = i;
            z++;
        } 
    }

    return array;
}

function sum(array){
    let sum = 0;
    for(let i = 0; i<array.length; i++){
        sum+=array[i];
    }
    return sum;
}

console.log(range(5,2,-1));

