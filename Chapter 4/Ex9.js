//ArrayToList recursive
function rec1(array,i){
    let list = {};
    if(i>array.length-1){
        return null;
    }
    list.value = array[i];
    list.rest = rec1(array,i+1);
    return list;
}

function arrayToList(array){
    return rec1(array,0);
}
//ArrayToList iterative

function arrayToListI(array){
    list = null;
    for(let i = array.length-1;i>=0;i--){
        list = {value:array[i],rest:list};
    }
    return list;
}
//ListToArray Recursive
function rec2(list,i,array){
    if(list.rest == null){
        array[i] = list.value;
        return;
    }
    array[i] = list.value;
    return rec2(list.rest,i+1,array);
}

function listToArray(list){
    let array = [];
    rec2(list,0,array);
    return array;
}

//ListToArray iterative

function listToArrayI(list){
    let array = [];
    let i = 0;
    for(let node = list; node!= null;node = node.rest){
        array[i] = node.value;
        i++;
    }
    return array;
}

//Prepend function

function prepend(element,list){
    let newList = {};
    newList.value = element;
    newList.rest = list;
    return newList;

}

//nth recursive v1
function rec3(list,number,i){
    if(i==number){
        return list.value;
    }
    if(list==null){
        return undefined;
    }
    return rec3(list.rest,number,i+1);
}

function nth(list,number){
    return rec3(list,number,0);
}

//nth recursive v2
function nth1(list, number){
    if(number==0){
        return list.value;
    }
    else if(list==null){
        return undefined;
    }
    else return nth1(list.rest,number-1);
}


let list = arrayToList([5,4,2]);
console.log(nth1(list,2));
//console.log(prepend(6,list));
//console.log(list);
//array = listToArray(list);
//console.log(array);