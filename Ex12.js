//Your Own Loop

function loop(value,test,updatef,bodyf){
    while(test(value)){
        bodyf(value);
        value = updatef(value);
    }
}

loop(3, n => n > 0, n => n - 1, console.log);

//Eloquent javascript version

function loop1(value,test,updatef,bodyf){
    for(let start = value; test(start)!=false; start = updatef(start)){
        bodyf(start);
    }
}

loop1(3, n => n > 0, n => n - 1, console.log);