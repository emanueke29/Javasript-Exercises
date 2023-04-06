
//v1

async function locateScalpel(nest){
    let current = nest.name;
    for(;;){
        next = await anyStorage(nest,current,"scalpel");
        if(next==current) return current;
        current = next;
    }
}

//v2

function locateScalpel2(nest){
    function loop(current){
        anyStorage(nest,current,"scalpel").then(n=>{
            if(n==current) return current;
            else loop(n);
        })
    }
    return loop(nest.name);
}